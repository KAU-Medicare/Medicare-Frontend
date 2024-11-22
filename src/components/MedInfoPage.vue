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
          <span class="med-name-display">{{ medName || "텍스트 이름" }}</span>
          <button @click="toggleEditName" class="name-change-btn">이름 설정 변경 ></button>
        </div>
      </div>

      <div v-if="editingName" class="input-group name-edit-group">
        <label for="med-name">약 이름 수정</label>
        <input type="text" v-model="medName" />
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

      <!-- 1회 복용 개수 -->
      <div class="input-group dose-group">
        <label>1회 복용 개수</label>
        <input
          type="number"
          v-model="doseAmount"
          min="1"
          class="dose-input"
        />
        <span class="type">캡슐</span>
      </div>
    </div>

    <div class="register-btn-container">
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
      doseAmount: 1, // 1회 복용 개수
      pageTitle: '약 정보 추가',
    };
  },
  methods: {
    toggleDay(day) {
      if (this.selectedDays.includes(day)) {
        this.selectedDays = this.selectedDays.filter(d => d !== day);
      } else {
        this.selectedDays.push(day);
      }
    },
    toggleEditName() {
      this.editingName = !this.editingName;
    },
    goBack() {
      this.$router.push('/searchByName');
    },
    async register() {
      const data = {
        name: this.medName,
        days: this.selectedDays,
        alertEnabled: this.alertEnabled,
        time: `${this.hour}:${this.minute} ${this.ampm}`,
        doseAmount: this.doseAmount, // 등록 데이터에 복용 개수 포함
      };

      try {
        const response = await fetch('/api/medicine', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('데이터 저장에 실패했습니다.');
        }

        const result = await response.json();
        alert(result.message || '데이터가 저장되었습니다.');
        this.$router.push('/home');
      } catch (error) {
        console.error('데이터 저장 중 오류:', error);
        alert('데이터 저장에 문제가 발생했습니다.');
      }
    },
  },
  async mounted() {
    this.medName = this.$route.query.name;
  },
};
</script>

<style scoped>
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
  max-width: 900px;
  width: 100%;
  padding: 20px;
  background-color: white;
  overflow-y: auto;
  padding-bottom: 70px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 1.4rem;
}

.dose-group {
  display: flex;
  align-items: center;
}

.dose-input {
  width: 60px;
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 1.2rem;
  margin-right: 10px;
}

.type {
  font-size: 1.2rem;
  margin-left: 10px;
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
  max-width: 900px;
  width: 100%;
  padding: 12px;
  background-color: #ffa500;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.3rem;
  cursor: pointer;
  text-align: center;
}

.register-btn:hover {
  background-color: #ff8c00;
}
</style>