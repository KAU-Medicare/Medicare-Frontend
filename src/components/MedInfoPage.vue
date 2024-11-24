<template>
  <div class="outer-container">
    <div class="input-group">
      <button @click="goBack" class="back-button">←</button>
      <h2>{{ pageTitle }}</h2>
    </div>
    <div class="inner-container">
      <div class="input-group">
        <label>약 이름</label>
        <div class="name-display-wrapper">
          <input
            type="text"
            class="med-name-display"
            v-model="medName"
            :disabled="!editingName"
          />
          <button @click="toggleEditName" class="name-change-btn">
            {{ editingName ? "수정 완료" : "이름 설정 변경 >" }}
          </button>
        </div>
      </div>

      <div class="input-group">
        <label>복용 날짜</label>
        <div class="days">
          <button
            v-for="(day, index) in days"
            :key="index"
            :class="{ selected: selectedDays.includes(day) }"
            @click="toggleDay(day)"
          >
            {{ day }}
          </button>
        </div>
      </div>

      <div class="input-group alert-group">
        <label>복용 알림</label>
        <label class="switch">
          <input type="checkbox" v-model="alertEnabled" />
          <span class="slider round"></span>
        </label>
      </div>

      <div class="input-group time-group">
        <label>복용 시간</label>
        <div class="time-wrapper">
          <select v-model="ampm" class="ampm-select">
            <option value="AM">오전</option>
            <option value="PM">오후</option>
          </select>
          <div class="time-select">
            <select v-model="hour" class="time-input">
              <option v-for="h in 12" :key="h">{{ h }}</option>
            </select>
            <span>:</span>
            <select v-model="minute" class="time-input">
              <option v-for="m in 60" :key="m">
                {{ m < 10 ? "0" + m : m }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- 1회 복용량 -->
      <div class="input-group time-group">
        <label>1회 복용량</label>
        <input type="number" v-model="doseAmount" min="1" class="dose-input" />
        <span class="type">개</span>
      </div>

      <!-- 날짜 설정 -->
      <div class="input-group date-picker">
        <label>날짜 설정</label>
        <div class="date-inputs">
          <input type="date" v-model="startDate" />
          <span>~</span>
          <input type="date" v-model="endDate" />
        </div>
      </div>
    </div>

    <div class="register-btn-container">
      <button @click="register" class="register-btn">등록하기</button>
    </div>
  </div>
</template>

<script>
import UserService from "@/services/UserService";

export default {
  data() {
    return {
      kakaoIdString: "badId", // 카카오 아이디 스트링
      medName: "",
      editingName: false,
      days: ["일", "월", "화", "수", "목", "금", "토"], // 한글 요일
      selectedDays: [], // 선택된 요일
      alertEnabled: false,
      hour: 12,
      minute: "00",
      ampm: "AM",
      doseAmount: 1, // 1회 복용량 추가
      startDate: "", // 시작 날짜
      endDate: "", // 종료 날짜
      pageTitle: "", // 페이지 제목
      jsonDataType: "", // 데이터 타입 ("MEDICINE" or "HEALTH_FOOD")
    };
  },
  methods: {
    toggleDay(day) {
      if (this.selectedDays.includes(day)) {
        this.selectedDays = this.selectedDays.filter((d) => d !== day);
      } else {
        this.selectedDays.push(day);
      }
    },
    toggleEditName() {
      this.editingName = !this.editingName;
    },
    goBack() {
      this.$router.push("/searchByName");
    },
    formatHour(hour, ampm) {
      const numericHour = parseInt(hour);
      if (ampm === "PM" && numericHour !== 12) {
        return numericHour + 12;
      } else if (ampm === "AM" && numericHour === 12) {
        return "00";
      }
      return numericHour < 10 ? `0${numericHour}` : numericHour; // 두 자리 숫자 유지
    },
    formatMinute(minute) {
      const numericMinute = parseInt(minute);
      return numericMinute < 10 ? `0${numericMinute}` : numericMinute;
    },
    convertDaysToEnglish(days) {
      const dayMap = {
        일: "SUNDAY",
        월: "MONDAY",
        화: "TUESDAY",
        수: "WEDNESDAY",
        목: "THURSDAY",
        금: "FRIDAY",
        토: "SATURDAY",
      };
      return days.map((day) => dayMap[day]);
    },
    async register() {
      if (!this.startDate || !this.endDate) {
        alert("시작 및 종료 날짜를 설정해주세요.");
        return;
      }
      if (!this.$route.query.id) {
        alert("유효하지 않은 항목입니다. 다시 시도해주세요.");
        this.$router.push("/searchByName");
        return;
      }
      if (!this.medName.trim()) {
        alert("약 또는 영양제 이름을 입력해주세요.");
        return;
      }
      if (this.selectedDays.length === 0) {
        alert("복용 날짜를 선택해주세요.");
        return;
      }

      try {
        const jsonData = {
          kakaoId: this.kakaoIdString,
          itemId: parseInt(this.$route.query.id),
          type: this.jsonDataType, // 쿼리에서 설정된 데이터 타입
          nickname: this.medName,
          capsuleCount: this.doseAmount,
          useNotification: this.alertEnabled,
          takingTime: `${this.formatHour(
            this.hour,
            this.ampm
          )}:${this.formatMinute(this.minute)}:00`,
          takingDays: this.convertDaysToEnglish(this.selectedDays),
          startDate: this.startDate,
          endDate: this.endDate,
        };
        console.log(jsonData);
        const response = await UserService.addInventory(jsonData);
        console.log("등록 성공:", response.data);
        alert(`${this.pageTitle}가 성공적으로 등록되었습니다!`);
        this.$router.push("/medManage");
      } catch (error) {
        console.error("등록 실패:", error);

        // 409 에러 처리 - 서버 메시지를 알림창으로 띄우기
        if (error.response && error.response.status === 409) {
          alert(error.response.data.message || "등록 중 충돌이 발생했습니다.");
        } else {
          alert("정보를 등록하는 데 문제가 발생했습니다.");
        }
      }
    },
  },
  async mounted() {
    this.kakaoIdString = String(localStorage.getItem("userId"));
    this.medName = this.$route.query.name;
    if (this.$route.query.type === "pill") {
      this.pageTitle = "약 정보 추가";
      this.jsonDataType = "MEDICINE";
    } else if (this.$route.query.type === "supplement") {
      this.pageTitle = "영양제 정보 추가";
      this.jsonDataType = "HEALTH_FOOD";
    }
  },
};
</script>


<style scoped>
.date-picker {
  margin-top: 20px;
}

.date-picker label {
  font-size: 1.4rem;
  display: block;
  margin-bottom: 10px;
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-inputs input[type="date"] {
  padding: 8px;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 200px;
}
.outer-container {
  display: flex;
  flex-direction: column;
  justify-content: top;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: white;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.inner-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 600px;
  width: 100%;
  padding: 20px;
  background-color: white;
  overflow-y: auto;
  padding-bottom: 70px;
}

.back-button {
  position: fixed;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #000000;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

h2 {
  /*text-align: center;*/
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 1.4rem;
}

.name-display-wrapper {
  position: relative;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
  height: 50px;
  display: flex;
  align-items: center;
}

.med-name-display {
  font-size: 1.2rem;
  color: #333;
  flex: 1;
}

.name-change-btn {
  position: absolute;
  right: 10px;
  bottom: 5px;
  background: none;
  border: none;
  color: #808080;
  font-size: 0.9rem;
  cursor: pointer;
}

.name-change-btn:hover {
  text-decoration: underline;
}

.name-edit-group {
  margin-top: 10px;
}

input[type="text"],
input[type="number"] {
  padding: 8px;
  font-size: 1.1rem;
  margin: 0;
  box-sizing: border-box;
}

.quantity-input {
  width: 60px;
  text-align: center;
  margin-right: 10px;
  height: 40px;
  line-height: 40px;
}

.type {
  font-size: 1.2rem;
  margin-left: 10px;
}

.days {
  display: flex;
  justify-content: space-between;
}

.days button {
  flex: 1;
  margin: 5px;
  padding: 12px;
  font-size: 1.2rem;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 5px;
  color: black;
  transition: background-color 0.3s ease;
}

.days button.selected {
  background-color: #ff8947;
  color: white;
}

.alert-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-wrapper {
  display: flex;
  align-items: center;
}

.ampm-select {
  padding: 10px;
  margin-right: 10px;
  font-size: 1.2rem;
  width: 85px;
}

.time-select {
  display: flex;
  align-items: center;
}

.time-select select {
  padding: 10px;
  font-size: 1.2rem;
  margin-right: 5px;
  width: 70px;
}

.time-select span {
  margin: 0 5px;
  font-size: 1.5rem;
}

.quantity-switch-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quantity-amount-group {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.divider {
  border: none;
  border-top: 1px solid #ddd;
  margin: 15px 0;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #ff8947;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.register-btn-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: white;
  padding: 10px 0;
}

.register-btn {
  max-width: 600px;
  width: 100%;
  padding: 12px;
  background-color: #ff8947;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.3rem;
  cursor: pointer;
  text-align: center;
}

.register-btn:hover {
  background-color: #ff8947;
}

.outer-container {
  display: flex;
  flex-direction: column;
  justify-content: top;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: white;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.inner-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 600px;
  width: 100%;
  padding: 20px;
  background-color: white;
  overflow-y: auto;
  padding-bottom: 70px;
}

.dose-group {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.dose-input {
  width: 60px;
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 1.1rem;
  margin-right: 10px;
}

.quantity-switch-group,
.quantity-amount-group {
  display: none; /* 잔여량 관련 스타일 삭제 */
}

.register-btn-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: white;
  padding: 10px 0;
}

.register-btn {
  max-width: 600px;
  width: 100%;
  padding: 12px;
  background-color: #ff8947;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.3rem;
  cursor: pointer;
  text-align: center;
}

.register-btn:hover {
  background-color: #ff8947;
}

@media (max-width: 768px) {
  .outer-container {
    padding: 15px;
  }

  .inner-container {
    padding: 15px;
  }

  .input-group {
    margin-bottom: 10px;
  }

  .input-group label {
    font-size: 1.2rem;
  }

  input[type="text"],
  input[type="number"] {
    font-size: 1rem;
  }

  .days button {
    padding: 8px;
    font-size: 1rem;
  }

  .time-select select {
    padding: 8px;
    font-size: 1rem;
  }

  .register-btn {
    padding: 10px;
    font-size: 1.2rem;
  }
}
</style>

