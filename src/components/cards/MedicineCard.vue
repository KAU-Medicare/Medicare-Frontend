<!-- components/MedicineCard.vue -->
<template>
  <div 
    class="card" 
    :class="{ checked: isChecked }"
    @click="toggleCheck"
  >
    <div class="info">
      <div class="name-dose">
        <span class="name">{{ item.name }}</span>
        <span class="dose">{{ item.singleDose }}{{ item.type }}</span>
      </div>
      <span class="time">{{ item.time }}</span>
    </div>
    <div class="actions">
      <button class="check-btn" @click.stop="toggleCheck">
        {{ isChecked ? '❌' : '✔️' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MedicineCard",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isChecked: false, // 체크 상태 관리
    };
  },
  methods: {
    toggleCheck() {
      this.isChecked = !this.isChecked; // 상태 반전
      this.$emit("check", this.item); // 부모 컴포넌트에 알림 전송
    },
  },
};
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  outline: 1px solid #ddd;
  transition: background-color 0.3s ease; /* 부드러운 배경 전환 */
  cursor: pointer;
}

.name {
  font-weight: bold;
  font-size: 2.5vh;
  padding-right: 10px;
}

.dose,
.time {
  font-size: 2vh;
}

h2 {
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}

.info {
  border-right: 1px solid #ddd;
  margin-right: 15px;
  flex: auto;
}

.actions {
  display: flex;
}
.card.checked {
  background-color: #29d45b; /* 체크된 상태의 배경색 */
}

.name-dose {
  display: flex;
}


.check-btn {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  transition: background-color 0.3s ease; /* 버튼 전환 효과 */
}
</style>
