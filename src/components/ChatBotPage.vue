<template>
  <div class="chat-container" ref="chatContainer">
    <div v-for="(item, index) in conversation" :key="index">
      <img
        v-if="
          item.type === 'question' ||
          item.type === 'response' ||
          item.type === 'loading'
        "
        src="@/assets/navBtnImg/chatBotBtnActive.png"
        alt="Supp"
        class="icon-image"
      />
      <div class="chat-bubble bot" v-if="item.type === 'question'">
        <p>{{ item.message }}</p>
      </div>

      <div class="user-options" v-if="item.type === 'options'">
        <button
          v-for="option in item.options"
          :key="option"
          class="option-button"
          :class="{ active: item.response === option }"
          @click="handleResponse(option, index)"
          :disabled="item.response !== ''"
        >
          {{ option }}
        </button>
      </div>

      <div class="chat-bubble bot" v-if="item.type === 'response'">
        <p v-html="item.htmlMessage"></p>
      </div>

      <div class="chat-bubble bot" v-if="item.type === 'loading'">
        <p>답변을 준비중입니다. 잠시만 기다려주세요!</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import UserService from "@/services/UserService"; // UserService 가져오기
import { marked } from "marked";

export default {
  data() {
    return {
      conversation: [], // 챗봇 대화 저장
      userId: null, // 사용자 ID
    };
  },
  mounted() {
    this.userId = localStorage.getItem("userId"); // 사용자 ID 가져오기
    this.askMainQuestion();
  },
  updated() {
    this.scrollToBottom();
  },
  methods: {
    askMainQuestion() {
      this.conversation.push(
        {
          type: "question",
          message: "안녕하세요! 어떤 주제에 대해 궁금하신가요?",
        },
        {
          type: "options",
          options: [
            "내가 먹는 약의 주의사항",
            "내가 먹는 영양제의 주의사항",
            "내가 먹는 약과 영양제의 위험 조합",
          ],
          response: "",
        }
      );
    },
    async handleResponse(response, index) {
      this.conversation[index].response = response;

      if (response === "내가 먹는 약의 주의사항") {
        await this.askUserItems("MEDICINE", "약");
      } else if (response === "내가 먹는 영양제의 주의사항") {
        await this.askUserItems("HEALTH_FOOD", "영양제");
      } else if (response === "내가 먹는 약과 영양제의 위험 조합") {
        await this.checkDangerousCombinations();
      } else {
        // 사용자가 선택한 약/영양제를 찾아 실제 이름(itemName)을 가져옴
        const parentConversation = this.conversation[index];
        const selectedItem = parentConversation.rawOptions.find(
          (item) => item.displayName === response
        );

        if (selectedItem) {
          this.showLoadingMessage();
          await this.fetchDetails(selectedItem.name); // 실제 이름(itemName)을 API에 전달
        }
      }
    },
    async askUserItems(type, itemType) {
      try {
        const response = await UserService.getUserInventory(this.userId);
        const items = response.data.filter((item) => item.type === type);

        // 별명이 아닌 진짜 이름(itemName)을 선택지로 표시
        const itemOptions = items.map((item) => ({
          name: item.itemName, // 실제 이름
          displayName: item.nickname || item.itemName, // 사용자에게 보여줄 이름
        }));

        this.conversation.push(
          {
            type: "question",
            message: `어떤 ${itemType}의 주의사항이 궁금하신가요?`,
          },
          {
            type: "options",
            options: itemOptions.map((item) => item.displayName),
            response: "",
            rawOptions: itemOptions, // 원래 데이터를 저장 (itemName 포함)
          }
        );
      } catch (error) {
        console.error(`${itemType} 데이터를 가져오는 중 오류 발생:`, error);
        this.conversation.push({
          type: "response",
          message: `${itemType} 데이터를 가져오는 중 오류가 발생했습니다.`,
        });
      }
    },
    async fetchDetails(selectedItemName) {
      try {
        const result = await axios.post("api/chat", {
          message: `${selectedItemName} 복용시 주의사항을 알려줘. 이 때 권장 복용량이나 과다복용을 언급 시에는 구체적인 수치를 적어줘.`,
        });
        const markdownResponse = result.data.response
          .replace(/^{"response":"/, "")
          .replace(/"}$/, "");
        const htmlResponse = marked(markdownResponse);

        // 대기 메시지를 제거하고 응답 추가
        this.conversation.pop();
        this.conversation.push({
          type: "response",
          message: markdownResponse,
          htmlMessage: htmlResponse,
        });
      } catch (error) {
        console.error("Error:", error);

        // 대기 메시지를 제거하고 오류 메시지 추가
        this.conversation.pop();
        this.conversation.push({
          type: "response",
          message: "죄송합니다. 오류가 발생했습니다." + error.message,
        });
      }

      setTimeout(() => {
        this.askMainQuestion();
      }, 1000);
    },

    async checkDangerousCombinations() {
      try {
        const response = await UserService.getUserInventory(this.userId);
        const medicines = response.data.filter(
          (item) => item.type === "MEDICINE"
        );
        const healthFoods = response.data.filter(
          (item) => item.type === "HEALTH_FOOD"
        );

        // 약과 영양제의 진짜 이름(itemName)을 가져옴
        const itemNames = [
          ...medicines.map((item) => item.itemName),
          ...healthFoods.map((item) => item.itemName),
        ];

        // 챗봇 API에 보낼 메시지 구성
        const message = `"${itemNames.join(
          '", "'
        )}" 중 같이 복용했을 때 문제가 생길 가능성이 가장 큰 4개 이하의 조합을 모두 알려주고, 어떤 증상이 발생할 수 있는지도 같이 알려줘"`;

        this.showLoadingMessage();

        const result = await axios.post("api/chat", { message });
        const markdownResponse = result.data.response
          .replace(/^{"response":"/, "")
          .replace(/"}$/, "");
        const htmlResponse = marked(markdownResponse);

        // 대기 메시지를 제거하고 응답 추가
        this.conversation.pop();
        this.conversation.push({
          type: "response",
          message: markdownResponse,
          htmlMessage: htmlResponse,
        });
      } catch (error) {
        console.error("위험 조합을 확인하는 중 오류 발생:", error);

        // 대기 메시지를 제거하고 오류 메시지 추가
        this.conversation.pop();
        this.conversation.push({
          type: "response",
          message: "죄송합니다. 위험 조합을 확인하는 중 문제가 발생했습니다.",
        });
      }

      setTimeout(() => {
        this.askMainQuestion();
      }, 1000);
    },
    showLoadingMessage() {
      // 대기 메시지 추가
      this.conversation.push({ type: "loading" });
    },
    scrollToBottom() {
      const container = this.$refs.chatContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
  },
};
</script>


<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  width: 80vw;
  font-size: 1.75vh;
  max-width: 600px;
  height: 80vh; /* 일정 높이 설정 */
  margin: 25px auto;
  padding: 20px;
  overflow-y: auto; /* 스크롤 가능하도록 설정 */
  border: 1px solid #ddd;
  border-radius: 10px;
}

.icon-image {
  width: 5vh;
  height: auto;
}

.chat-bubble {
  position: relative;
  padding: 10px 15px;
  border-radius: 15px;
  margin: 5px 0;
  width: fit-content;
  max-width: 85%;
  background-color: #f0f0f0; /* 말풍선 배경 색상 */
  color: black;
}

.chat-bubble p {
  margin: 0;
}

.chat-bubble h3 {
  margin: 8px 0 4px;
  font-size: 2vh;
  font-weight: bold;
}

.chat-bubble ul,
.chat-bubble ol {
  padding-left: 20px;
  margin: 8px 0;
}

.chat-bubble li {
  margin-bottom: 4px;
}

.chat-bubble strong,
.chat-bubble b {
  font-weight: bold;
}

.user-options {
  display: flex;
  flex-direction: column; /* 세로로 정렬 */
  width: auto; /* 버튼의 너비를 콘텐츠에 맞게 */
  justify-content: flex-end; /* 컨테이너 내부에서 아래로 정렬 */
  gap: 10px; /* 버튼 간 간격 */
  margin: 10px 0;
  align-items: flex-end; /* 오른쪽으로 정렬 */
}

.option-button {
  padding: 10px 15px;
  border: none;
  border-radius: 15px;
  background-color: #b2a4ff;
  color: white;
  font-size: 1.75vh;
  cursor: pointer;
  transition: background-color 0.3s;
}

.option-button.active {
  background-color: #9673ff; /* 선택한 버튼 색상 진하게 */
  font-weight: bold;
}

.option-button:disabled:not(.active) {
  opacity: 0.5; /* 비활성화된 버튼 투명하게 */
  cursor: not-allowed;
}
</style>
