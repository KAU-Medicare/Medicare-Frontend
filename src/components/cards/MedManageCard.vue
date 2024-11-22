<template>
  <div class="card">
    <div class="infos">
      <!-- 약/영양제 이름 -->
      <div class="name-dates">
        <span class="names">{{ item.itemName }}</span>
        <!-- 복용 요일 표시 -->
        <div class="weekdays">
          <span
            v-for="(day, index) in ['일', '월', '화', '수', '목', '금', '토']"
            :key="index"
            :class="{ active: item.takingDays.includes(day) }"
          >
            {{ day + " " }}
          </span>
        </div>
      </div>
      <!-- 복용 시간 및 알람 상태 -->
      <div class="name-dates">
        <span class="times">
          {{ formatTime(item.takingTime) }}
        </span>
        <span :class="{ active: item.useNotification, inactive: !item.useNotification }">
          알람 {{ item.useNotification ? "켜짐" : "꺼짐" }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MedManageCard",
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    // 시간 포맷 변경: {hour, minute, second} => "HH:MM:SS"
    formatTime(time) {
      if (!time) return "시간 미정";
      const { hour, minute, second } = time;
      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
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

.weekdays span {
  color: gainsboro; /* 기본 회색 */
  font-weight: normal;
}

.weekdays span.active {
  color: black; /* 해당 요일은 검은색 */
  font-weight: bold; /* 해당 요일은 볼드체 */
}

.active {
  color: black;
  font-weight: bold;
}

.inactive {
  color: gainsboro;
  font-weight: normal;
}

.names {
  font-weight: bold;
  font-size: 2.5vh;
  padding-right: 10px;
}

.times {
  font-size: 2vh;
}

h2 {
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}

.infos {
  flex: auto;
}

.actions {
  display: flex;
}

.name-dates {
  display: flex;
  justify-content: space-between; /* 요소 간 최대 공간 할당 */
  align-items: center; /* 수직 중앙 정렬 */
}
</style>
