<template>
    <div class="modal" @click.self="emitClose">
      <div class="modal-content">
        <button class="modal-button delete" @click="emitDelete">삭제하기</button>
        <button class="modal-button close" @click="emitClose">닫기</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ModalPage",
    props: {
      isVisible: Boolean,
      recordId: Number,
      kakaoId: String,
    },
    methods: {
      emitClose() {
        this.$emit("close");
      },
      emitDelete() {
        this.$emit("delete", this.kakaoId, this.recordId);
      },
    },
  };
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
    width: 300px; /* 너비를 조정하여 균형 잡힌 디자인 */
  }
  
  .modal-button {
    display: block;
    width: 100%;
    padding: 15px 0;
    margin: 10px 0;
    font-size: 18px;
    font-weight: bold;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }
  
  .modal-button.delete {
    background-color: #f44336;
    color: white;
  }
  
  .modal-button.delete:hover {
    background-color: #d32f2f;
    transform: scale(1.05);
  }
  
  .modal-button.close {
    background-color: #e0e0e0;
    color: #333;
  }
  
  .modal-button.close:hover {
    background-color: #d6d6d6;
    transform: scale(1.05);
  }
  </style>
  