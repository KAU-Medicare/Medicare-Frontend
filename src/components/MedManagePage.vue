<template>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>복약 관리</h1>
      <button class="calendar-btn">
        <i class="calendar-icon"></i>
      </button>
    </div>

    <!-- Medication Section -->
    <section class="section">
      <h2>복용 중인 약</h2>
      <div
        v-for="(item, index) in mediList"
        :key="index"
        class="medicine-item"
      >
        <div class="medicine-info">
          <span class="medicine-name">{{ item.name }}</span>
          <span class="time">{{ item.time }}</span>
          <span class="days">일 월 화 수 목 금 토</span>
        </div>
        <div class="medicine-status">
          <span>알람 {{ item.alarm ? "켜짐" : "꺼짐" }}</span>
          <span>{{ item.remaining }} 남음</span>
        </div>
      </div>
    </section>

    <!-- Supplement Section -->
    <section class="section">
      <h2>복용 중인 영양제</h2>
      <div
        v-for="(item, index) in suppList"
        :key="index"
        class="medicine-item"
      >
        <div class="medicine-info">
          <span class="medicine-name">{{ item.name }}</span>
          <span class="time">{{ item.time }}</span>
          <span class="days">일 월 화 수 목 금 토</span>
        </div>
        <div class="medicine-status">
          <span>알람 {{ item.alarm ? "켜짐" : "꺼짐" }}</span>
          <span>{{ item.remaining }} 남음</span>
        </div>
      </div>
    </section>

    <!-- Add Button -->
    <button class="add-btn">+</button>
  </div>
</template>

<script>
export default {
  name: "MedicineManagement",
  data() {
    return {
      mediList: [
        {
          name: "타이레놀",
          time: "10:00",
          alarm: true,
          remaining: 4,
        },
      ],
      suppList: [
        {
          name: "오메가-3",
          time: "13:00",
          alarm: true,
          remaining: 24,
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Layout */
.container {
  padding: 3vh 5vw;
  max-width: 600px;
  margin: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 24px;
  font-weight: bold;
}

.calendar-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.section {
  margin-bottom: 20px;
}

.medicine-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 10px;
}

.medicine-info {
  display: flex;
  flex-direction: column;
}

.medicine-name {
  font-weight: bold;
  font-size: 16px;
}

.time {
  font-size: 14px;
  color: #666;
}

.days {
  font-size: 12px;
  color: #999;
}

.medicine-status {
  text-align: right;
}

.add-btn {
  position: fixed;
  bottom: 15vh;
  right: 5vw;
  background-color: #ff8947;
  color: white;
  font-size: 24px;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
</style>
