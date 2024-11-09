<template>
  <div class="chat-container" ref="chatContainer">
    <div v-for="(item, index) in conversation" :key="index">
      <img
        v-if="item.type === 'question' || item.type === 'response' || item.type === 'loading'"
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
import { marked } from "marked";

export default {
  data() {
    return {
      mainQuestions: ["의약품", "영양제", "건강 관리"],
      subQuestions: {
        "의약품": ["부작용", "복용 방법", "상호작용"],
        "영양제": ["효과", "섭취 시기", "상호작용"],
        "건강 관리": ["운동", "식단", "수면"],
      },
      conversation: [],
      currentQuestionIndex: 0,
    };
  },
  mounted() {
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
          message: "어떤 주제에 대해 궁금하신가요?",
        },
        {
          type: "options",
          options: this.mainQuestions,
          response: "",
        }
      );
    },
    askSubQuestion(mainQuestion) {
      this.conversation.push(
        {
          type: "question",
          message: `${mainQuestion}에 대해 어떤 점이 궁금하신가요?`,
        },
        {
          type: "options",
          options: this.subQuestions[mainQuestion],
          response: "",
        }
      );
    },
    async handleResponse(response, index) {
      this.conversation[index].response = response;

      if (this.mainQuestions.includes(response)) {
        this.askSubQuestion(response);
      } else {
        // 답변 대기 메시지 추가
        const loadingMessage = { type: "loading" };
        this.conversation.push(loadingMessage);

        try {
          const result = await axios.post("api/chat", { message: response });
          const markdownResponse = result.data.response.replace(/^{"response":"/, "").replace(/"}$/, "");
          const htmlResponse = marked(markdownResponse); // Markdown을 HTML로 변환
          
          // 대기 메시지를 실제 답변으로 교체
          this.conversation.pop(); // 대기 메시지 제거
          this.conversation.push({
            type: "response",
            message: markdownResponse,
            htmlMessage: htmlResponse,
          });
        } catch (error) {
          console.error("Error:", error);
          
          // 대기 메시지를 오류 메시지로 교체
          this.conversation.pop(); // 대기 메시지 제거
          this.conversation.push({
            type: "response",
            message: "죄송합니다. 오류가 발생했습니다." + error.message,
          });
        }

        setTimeout(() => {
          this.askMainQuestion();
        }, 1000);
      }
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

.chat-bubble ul, .chat-bubble ol {
  padding-left: 20px;
  margin: 8px 0;
}

.chat-bubble li {
  margin-bottom: 4px;
}

.chat-bubble strong, .chat-bubble b {
  font-weight: bold;
}

.user-options {
  display: flex;
  width: 100%;
  justify-content: flex-end; /* 버튼을 오른쪽으로 정렬 */
  gap: 10px;
  margin: 10px 0;
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
