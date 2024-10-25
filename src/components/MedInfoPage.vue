<template>
  <div class="outer-container">
    <div class="inner-container">
      <button @click="goBack" class="back-button">
        ←
      </button>

      <h2>약 정보 추가</h2>

      <div class="input-group">
        <label for="med-name">약 이름</label>
        <div class="name-wrapper">
          <input type="text" v-model="medName" :readonly="!editingName" />
          <button @click="toggleEditName" class="name-change-btn">
            이름 설정 변경 >
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
              <option v-for="m in 60" :key="m">{{ m < 10 ? '0' + m : m }}</option>
            </select>
          </div>
        </div>
      </div>

      <div class="input-group quantity-switch-group">
        <label>잔여량 표시</label>
        <label class="switch">
          <input type="checkbox" v-model="quantityEnabled" />
          <span class="slider round"></span>
        </label>
      </div>

      <div v-if="quantityEnabled" class="input-group quantity-amount-group">
        <input type="number" v-model="quantity" min="0" class="quantity-input" /> 
        <span class="type">캡슐</span>
      </div>

      <button @click="register" class="register-btn">등록하기</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      medName: '', 
      editingName: false, 
      days: ['일', '월', '화', '수', '목', '금', '토'], 
      selectedDays: [], 
      alertEnabled: false, 
      hour: 12, 
      minute: '00', 
      ampm: 'AM', 
      quantityEnabled: false, 
      quantity: 0, 
      type: '캡슐', 
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
      this.$router.push('/home'); 
    },
    register() {
      this.$router.push('/home');
    },
  },
  mounted() {
    fetch("/assets/test2.json")
      .then((response) => response.json())
      .then((data) => {
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
  height: 100vh; 
  width: 100vw;
  background-color: white;
  box-sizing: border-box;
  overflow: hidden; 
  padding: 0; 
  margin: 0;  
}

.inner-container {
  max-width: 900px;
  width: 100%;
  padding: 20px; 
  background-color: white;
  border-radius: 0px;
  box-shadow: none;
  font-family: Arial, sans-serif;
  position: relative;
  height: 100%; 
}

.back-button {
  position: absolute;
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
  text-align: center;
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

input[type="text"],
input[type="number"] {
  padding: 8px;
  font-size: 1.1rem;
  margin-top: 5px;
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
  background-color: #ffa500;
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
  margin-right: 15px;
  font-size: 1.2rem;
  width: 80px;
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
  padding: 12px;
  background-color: #ffa500;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.3rem;
  cursor: pointer;
  margin-top: 20px; 
}

.register-btn:hover {
  background-color: #ff8c00;
}


@media (max-width: 768px) {
  .outer-container {
    padding: 10px;
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

