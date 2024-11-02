<template>
  <div class="calendar-container">
    <v-calendar
      v-model="selectedDate"
      :attributes="attributes"
      is-expanded
      locale="ko"
      @dayclick="onDayClick"
    />
  </div>
</template>

<script>
import { ref } from 'vue';
import 'v-calendar/dist/style.css';

export default {
  name: 'MediCalendar',
  setup() {
    // 선택된 날짜 상태
    const selectedDate = ref(new Date());

    // 스타일링을 위한 속성
    const attributes = ref([
      {
        key: 'today',
        dates: new Date(),
        customData: { isToday: true },
      },
      {
        key: 'weekend',
        dates: { weekdays: [0, 6] }, // 주말: 일요일(0), 토요일(6)
        customData: { isWeekend: true },
      },
    ]);

    const onDayClick = (day) => {
      console.log(`선택된 날짜: ${day.date}`);
      // 필요한 기능 추가 가능
    };

    return {
      selectedDate,
      attributes,
      onDayClick,
    };
  },
};
</script>

<style scoped>
.calendar-container {
  max-width: 400px;
  margin: auto;
  border-radius: 10px;
  border: 1px solid #ddd;
  padding: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.vc-title {
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
}

.vc-weeks .vc-weekday {
  color: #999 !important; /* 요일 텍스트 색상 */
}

/* 오늘 날짜 스타일 */
.vc-day-content[data-date="today"] {
  background-color: #ff8947 !important; /* 오늘 날짜 배경색 */
  color: white !important;
  border-radius: 50%;
}

/* 주말 스타일 */
.vc-day-content[data-date="weekend"] {
  color: #ff0000 !important; /* 주말 텍스트 색상 */
}

.vc-day-content {
  font-weight: 500;
  color: #333;
}
</style>
