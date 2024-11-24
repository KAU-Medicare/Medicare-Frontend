<template>
  <div class="card" :class="{ checked: isChecked }" @click="toggleCheck">
    <div class="info">
      <div class="name-dose">
        <span class="name">{{ item.nickname || item.itemName }}</span>
        <span class="dose">{{ item.capsuleCount }}개</span>
      </div>
      <div class="time-days">
        <span class="time">{{ formattedTime }}</span>
      </div>
    </div>
    <div class="actions">
      <button class="check-btn" @click.stop="toggleCheck">
        {{ isChecked ? "❌" : "✔️" }}
      </button>
    </div>
  </div>
</template>

<script>
import UserService from "@/services/UserService";

export default {
  name: "MedicineCard",
  props: {
    item: {
      type: Object,
      required: true,
    },
    kakaoId: {
      type: String,
      required: true,
    },
    date: {
      type: String, // Date -> String으로 변경
      required: true, // 부모 컴포넌트로부터 yyyy-MM-dd 형식의 날짜 전달
    },
  },
  data() {
    return {
      isChecked: this.item.taken, // 초기 상태를 서버 데이터의 taken 상태로 설정
    };
  },
  watch: {
  // item의 taken 값이 변경되었을 때 isChecked 업데이트
  "item.taken"(newValue) {
    this.isChecked = newValue;
  },
},
  computed: {
    formattedTime() {
      if (!this.item.takingTime) return "시간 미정";

      // "HH:mm:ss" 형식에서 시간과 분 추출
      const [hour, minute] = this.item.takingTime
        .split(":")
        .map((v) => parseInt(v, 10));
      const ampm = hour >= 12 ? "PM" : "AM";
      const adjustedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${ampm} ${adjustedHour}:${minute < 10 ? "0" : ""}${minute}`;
    },
    formattedDays() {
      // 영어 요일을 한글 요일로 변환
      const daysMap = {
        SUNDAY: "일",
        MONDAY: "월",
        TUESDAY: "화",
        WEDNESDAY: "수",
        THURSDAY: "목",
        FRIDAY: "금",
        SATURDAY: "토",
      };
      return this.item.takingDays
        .map((day) => daysMap[day] || day) // 영어를 한글로 변환, 매핑 안된 값은 그대로 반환
        .join(", ");
    },
  },
  methods: {
    async toggleCheck() {
      const originalState = this.isChecked; // 기존 상태 저장
      this.isChecked = !this.isChecked;

      try {
        // 서버에 업데이트 요청
        await UserService.checkTaken(
          this.kakaoId,
          this.item.id,
          this.date, // yyyy-MM-dd 형식의 날짜
          this.isChecked
        );
        console.log(`서버에 체크 상태 업데이트 완료: ${this.item.itemName}`);
      } catch (error) {
        console.error("체크 상태 업데이트 실패:", error);
        alert("체크 상태를 업데이트하는 중 문제가 발생했습니다.");

        // 실패 시 원래 상태로 복원
        this.isChecked = originalState;
      }

      // 부모 컴포넌트에 상태 변경 알림
      this.$emit("check", { ...this.item, taken: this.isChecked });
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
}

.name {
  font-weight: bold;
  font-size: 2.5vh;
  padding-right: 10px;
}

.dose {
  font-size: 2vh;
  color: #666;
}

.time-days {
  display: flex;
  flex-direction: column;
}

.time,
.days {
  font-size: 2vh;
  color: #333;
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
