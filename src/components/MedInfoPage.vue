<template>
  <div class="outer-container">
    <div class="inner-container">
      <!-- 좌측 상단에 뒤로 가기 버튼 -->
      <button @click="goBack" class="back-button">
        ←
      </button>

      <h2>약 정보 추가</h2>

      <!-- 약 이름 입력 및 이름 설정 변경 버튼 -->
      <div class="input-group">
        <label for="med-name">테스트 이름</label>
        <div class="name-wrapper">
          <input type="text" v-model="medName" :readonly="!editingName" />
          <button @click="toggleEditName" class="name-change-btn">
            이름 설정 변경 >
          </button>
        </div>
      </div>

      <!-- 복용 날짜 선택 -->
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

      <!-- 복용 알림 스위치 -->
      <div class="input-group alert-group">
        <label>복용 알림</label>
        <label class="switch">
          <input type="checkbox" v-model="alertEnabled" />
          <span class="slider round"></span>
        </label>
      </div>

      <!-- 복용 시간 설정 -->
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
              <option v-for="m in 60" :key="m">{{ m < 10 ? '0' + m : m }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 잔여량 표시 스위치 -->
      <div class="input-group quantity-switch-group">
        <label>잔여량 표시</label>
        <label class="switch">
          <input type="checkbox" v-model="quantityEnabled" />
          <span class="slider round"></span>
        </label>
      </div>

      <!-- 잔여량 개수 및 타입 -->
      <div v-if="quantityEnabled" class="input-group quantity-amount-group">
        <input type="number" v-model="quantity" min="0" class="quantity-input" /> 
        <span class="type">캡슐</span>
      </div>

      <!-- 등록 버튼 -->
      <button @click="register" class="register-btn">등록하기</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      medName: '', // 약 이름
      editingName: false, // 이름 수정 모드 활성화 여부
      days: ['일', '월', '화', '수', '목', '금', '토'], // 요일 리스트
      selectedDays: [], // 선택된 날짜
      alertEnabled: false, // 복용 알림 설정
      hour: 12, // 시간
      minute: '00', // 분
      ampm: 'AM', // 오전/오후 선택
      quantityEnabled: false, // 잔여량 표시 여부
      quantity: 0, // 잔여량
      type: '캡슐', // 약 타입 (캡슐 등)
    };
  },
  methods: {
    toggleDay(day) {
      // 복용 날짜 선택/해제 로직
      if (this.selectedDays.includes(day)) {
        this.selectedDays = this.selectedDays.filter((d) => d !== day);
      } else {
        this.selectedDays.push(day);
      }
    },
    toggleEditName() {
      // 이름 수정 모드 전환
      this.editingName = !this.editingName;
    },
    goBack() {
      // 뒤로 가기 버튼 클릭 시 path로 HomePage로 이동
      this.$router.push('/home'); // name이 아닌 path로 이동
    },
    register() {
      // 등록 버튼 클릭 시 데이터 저장 (추후 필요시 구현) 후 HomePage로 이동
      this.$router.push('/home'); // name이 아닌 path로 이동
    },
  },
  mounted() {
    // JSON 파일 불러오기
    fetch("/assets/test2.json")
      .then((response) => response.json())
      .then((data) => {
        // JSON 데이터로 상태 업데이트
        this.medName = data.Name;
        this.selectedDays = data.Date;
        this.alertEnabled = data.isAlert;
        this.hour = parseInt(data.Time.split(":")[0]);
        this.minute = data.Time.split(":")[1].split(" ")[0];
        this.ampm = data.Time.includes('PM') ? 'PM' : 'AM';
        this.quantityEnabled = data.isRemain;
        this.quantity = data.RemainAmount;
        this.type = data.Type;
      });
  },
};
</script>

<style scoped>
.outer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 80px);
  width: 100vw;
  background-color: white;
  box-sizing: border-box;
}

.inner-container {
  max-width: 900px;
  width: 100%;
  padding: 40px;
  background-color: white;
  border-radius: 0px;
  box-shadow: none;
  font-family: Arial, sans-serif;
  position: relative;
}

/* 뒤로가기 버튼 스타일 */
.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #000000;;
  cursor: pointer;
}

h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 30px;
}

.input-group label {
  display: block;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

input[type="text"],
input[type="number"] {
  padding: 10px;
  font-size: 1.2rem;
  margin-top: 5px;
  box-sizing: border-box;
}

.quantity-input {
  width: 80px;
  text-align: right;
  margin-right: 10px;
}

.type {
  font-size: 1.2rem;
}

/* 이름 설정 변경 버튼과 이름 입력 배치 */
.name-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.name-change-btn {
  padding: 10px;
  background-color: white;
  border: none;
  color: #ffa500;
  cursor: pointer;
}

.name-change-btn:hover {
  text-decoration: underline;
}

/* 요일 선택 버튼 스타일 */
.days {
  display: flex;
  justify-content: space-between;
}

.days button {
  flex: 1;
  margin: 5px;
  padding: 15px;
  font-size: 1.5rem;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 5px;
  color: black;
  transition: background-color 0.3s ease;
}

.days button.selected {
  background-color: #ffa500;
  color: white;
}

/* 복용 알림 스타일 */
.alert-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 복용 시간 스타일 */
.time-wrapper {
  display: flex;
  align-items: center;
}

.ampm-select {
  padding: 15px;
  margin-right: 20px;
  font-size: 1.3rem;
  width: 100px;
}

.time-select {
  display: flex;
  align-items: center;
}

.time-select select {
  padding: 15px;
  font-size: 1.3rem;
  margin-right: 5px;
  width: 80px;
}

.time-select span {
  margin: 0 5px;
  font-size: 1.5rem;
}

/* 잔여량 표시 스위치 */
.quantity-switch-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 잔여량 표시 및 약 타입 */
.quantity-amount-group {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* 스위치 스타일 */
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
  content: '';
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #ffa500;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.register-btn {
  width: 100%;
  padding: 15px;
  background-color: #ffa500;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.5rem;
  cursor: pointer;
}

.register-btn:hover {
  background-color: #ff8c00;
}
</style>
