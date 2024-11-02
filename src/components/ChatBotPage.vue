<template>
  <div class="chat-container" ref="chatContainer">
    <!-- 전체 대화 기록을 순서대로 출력 -->
    <div v-for="(item, index) in conversation" :key="index">
      <!-- 챗봇 질문 메시지 -->
      <img
        style="padding-top: 5px"
        src="@/assets/navBtnImg/chatBotBtnActive.png"
        v-if="item.type === 'question' || item.type === 'response'"
        alt="Supp"
        class="icon-image"
      />
      <div class="chat-bubble bot" v-if="item.type === 'question'">
        <p>{{ item.message }}</p>
      </div>

      <!-- 사용자의 응답 버튼 -->
      <div class="user-options" v-if="item.type === 'options'">
        <button
          class="option-button"
          :class="{ active: item.response === '확인' }"
          @click="handleResponse('확인', index)"
          :disabled="item.response !== ''"
        >
          확인
        </button>
        <button
          class="option-button"
          :class="{ active: item.response === '취소' }"
          @click="handleResponse('취소', index)"
          :disabled="item.response !== ''"
        >
          취소
        </button>
      </div>

      <!-- 챗봇 응답 메시지 -->
      <div class="chat-bubble bot" v-if="item.type === 'response'">
        <p>{{ item.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      botMessages: [
        "안녕하세요, 무엇이 궁금하신가요?",
        "두 번째 질문입니다",
        "세 번째 질문입니다",
      ], // 챗봇의 질문 메시지 배열
      currentQuestionIndex: 0, // 현재 질문 인덱스
      conversation: [], // 대화 기록
    };
  },
  mounted() {
    this.askQuestion(); // 초기 질문 호출
  },
  updated() {
    this.scrollToBottom(); // 컴포넌트 업데이트 시 스크롤
  },
  methods: {
    askQuestion() {
      // 현재 질문을 대화 기록에 추가
      this.conversation.push(
        {
          type: "question",
          message: this.botMessages[this.currentQuestionIndex],
        },
        {
          type: "options",
          response: "", // 사용자가 선택한 응답을 기록하기 위해 빈 값으로 초기화
        }
      );
    },
    handleResponse(response, index) {
      // 사용자가 선택한 응답을 기록
      this.conversation[index].response = response;

      // 응답 메시지를 대화 기록에 추가
      let botReply =
        response === "확인"
          ? "확인 테스트 문장입니다"
          : "취소 테스트 문장입니다";
      this.conversation.push({
        type: "response",
        message: botReply,
      });

      // 1초 후 다음 질문으로 이동
      setTimeout(() => {
        this.nextQuestion();
      }, 1000);
    },
    nextQuestion() {
      // 다음 질문으로 이동, 마지막 질문이면 처음으로 돌아감
      this.currentQuestionIndex =
        (this.currentQuestionIndex + 1) % this.botMessages.length;
      this.askQuestion(); // 다음 질문 추가
    },
    scrollToBottom() {
      // 대화 창을 항상 아래로 스크롤
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
  max-width: 600px;
  height: 70vh; /* 일정 높이 설정 */
  margin: 25px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
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
  max-width: 70%;
  background-color: #f0f0f0; /* 말풍선 배경 색상 */
  color: black;
}

.chat-bubble::after {
  content: "";
  position: absolute;
  left: -10px; /* 말풍선 꼬리의 위치 (왼쪽) */
  bottom: 10px; /* 말풍선 꼬리의 높이 위치 */
  width: 0;
  height: 0;
  border-width: 10px;
  border-style: solid;
  border-color: transparent #f0f0f0 transparent transparent; /* 삼각형 꼬리 모양 */
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
  font-size: 16px;
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
