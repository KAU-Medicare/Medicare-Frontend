<template>
    <div class="chat-container" ref="chatContainer">
      <div v-for="(item, index) in conversation" :key="index">
        <img
          v-if="item.type === 'question' || item.type === 'response'"
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
          <p>{{ item.message }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        mainQuestions: [
          "의약품에 대해 궁금하신가요?",
          "영양제에 대해 궁금하신가요?",
          "건강 관리에 대해 궁금하신가요?"
        ],
        subQuestions: {
          "의약품에 대해 궁금하신가요?": ["부작용", "복용 방법", "상호작용"],
          "영양제에 대해 궁금하신가요?": ["효과", "섭취 시기", "상호작용"],
          "건강 관리에 대해 궁금하신가요?": ["운동", "식단", "수면"]
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
          try {
            console.log(response);
            const result = await axios.post('api/chat', { message: response });
            const cleanedResponse = result.data.response
              .replace(/^{"response":"/, '') // 시작 부분의 {"response": 제거
              .replace(/\\"/g, '"') // \" 를 " 로 변경
              .replace(/\\n/g, '\n') // \n을 실제 줄바꿈으로 변환
              .replace(/\*\*(.*?)\*\*/g, '$1') // **텍스트** 형태의 굵은 텍스트 표기 제거
              .trim(); // 앞뒤 공백 제거
            this.conversation.push({
              type: "response",
              message: cleanedResponse,
            });
          } catch (error) {
            console.error('Error:', error);
            this.conversation.push({
              type: "response",
              message: "죄송합니다. 오류가 발생했습니다."+ error.message,
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