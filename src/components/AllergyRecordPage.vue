<template>
  <div class="container">
    <div class="header">
      <button @click="goBack" class="back-button">←</button>
      <h1 class="title">알레르기 정보 등록</h1>
    </div>
    
    <div class="upload-section">
      <div class="upload-box" @click="selectPhoto">
        <img v-if="selectedPhoto" :src="selectedPhoto" class="uploaded-image" />
        <span v-if="!selectedPhoto" class="upload-text">+</span>
      </div>
    </div>
   

    <div class="time-section">
  <label class="time-label">발생 시간</label>
  <div class="time-input-container">
    <span class="colon"> </span>
    <div class="time-input-group">
      <input
        type="number"
        v-model="startHour"
        min="0"
        max="23"
        class="time-input"
        placeholder="시"
      />
      <span class="colon">:</span>
      <input
        type="number"
        v-model="startMinute"
        min="0"
        max="59"
        class="time-input"
        placeholder="분"
      />
    </div>
    <span class="time-divider">~</span>
    <div class="time-input-group">
      <input
        type="number"
        v-model="endHour"
        min="0"
        max="23"
        class="time-input"
        placeholder="시"
      />
      <span class="colon">:</span>
      <input
        type="number"
        v-model="endMinute"
        min="0"
        max="59"
        class="time-input"
        placeholder="분"
      />
    </div>
    <span class="colon"> </span>
  </div>
</div>
    
    <div class="symptoms-section">
      <label class="time-label">증상</label>
      <div class="symptoms">
        <span 
          v-for="(symptom, index) in symptoms" 
          :key="index" 
          class="symptom"
          @click="toggleSymptom(symptom)"
          :class="{ selected: selectedSymptoms.includes(symptom) }"
        >
          {{ symptom }}
        </span>
      </div>
    </div>

    <button @click="register" class="register-button">등록하기</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startHour: 0,
      startMinute: 0,
      endHour: 0,
      endMinute: 0,
      isEditing: false,
      symptoms: ["고열", "두통", "출혈", "근육통", "우울 및 불안", "허리 통증", "메스꺼움", "탈진", "어지러움", "호흡 곤란", "설사", "구토", "불규칙한 심장박동"],
      selectedSymptoms: [],
      selectedPhoto: null
    };
  },
  computed: {
    timeRange() {
      const startTime = `${this.startHour.toString().padStart(2, '0')}:${this.startMinute.toString().padStart(2, '0')}`;
      const endTime = `${this.endHour.toString().padStart(2, '0')}:${this.endMinute.toString().padStart(2, '0')}`;
      return `${startTime} ~ ${endTime}`;
    }
  },
  methods: {
    goBack() {
      this.$router.push('/mediCalendar'); // 홈 화면으로 이동
    },
    selectPhoto() {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          this.selectedPhoto = URL.createObjectURL(file);
        }
      };
      fileInput.click();
    },
    toggleSymptom(symptom) {
      if (this.selectedSymptoms.includes(symptom)) {
        this.selectedSymptoms = this.selectedSymptoms.filter(s => s !== symptom);
      } else {
        this.selectedSymptoms.push(symptom);
      }
    },
    editTime() {
      this.isEditing = true; // 편집 모드 활성화
    },
    saveEndTime() {
      this.isEditing = false; // 종료 시간 입력 후 편집 모드 비활성화
    },
    register() {
      if (this.startHour > this.endHour || (this.startHour === this.endHour && this.startMinute >= this.endMinute)) {
        alert("종료 시간이 시작 시간보다 늦어야 합니다.");
        return;
      }

      if (this.selectedSymptoms.length === 0) {
        alert("증상을 하나 이상 선택해야 합니다.");
        return;
      }

      const dummyData = {
        occurrenceTime: this.timeRange,
        symptoms: this.selectedSymptoms,
      };
      
      console.log("더미 데이터:", dummyData);
      
      alert("알레르기 정보가 등록되었습니다.");
      this.$router.push('/mediCalendar');
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  box-sizing: border-box;
}

.header {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  margin-bottom: 20px;
}

.back-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  left: 20px;
}

.title {
  font-size: 3vh;
  margin-left: -8px;
}

.upload-section {
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.upload-box {
  flex-direction: column;
  color: #9e9e9e;
  position: relative;
  width: 30vh;
  height: 30vh;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  font-size: 8vh;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.time-range {
  cursor: pointer;
}

.symptoms-section {
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
}

.symptoms {
  display: flex;
  flex-wrap: wrap;
}

.symptom {
  background-color: lightgray;
  border-radius: 20px;
  padding: 5px 10px;
  margin: 5px;
  cursor: pointer;
}

.selected {
  background-color: orange;
  color: white;
}

.register-button {
  background-color: #ff8947;
  width: 90%;
  height: 7vh;
  color: white;
  padding: 1vh 0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  max-width: 600px;
  position: fixed;
  bottom: 3vh;
  left: 50%;
  transform: translateX(-50%);
}

.time-section {
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
  text-align: left;
}

.time-label {
  display: block;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.time-input-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.time-input-group {
  display: flex;
  align-items: center;
  gap: 5px; /* 간격 조절 */
}

.time-input {
  width: 60px;
  height: 40px;
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.time-input:focus {
  border-color: #ff9a76;
  box-shadow: 0 0 5px rgba(255, 154, 118, 0.5);
  outline: none;
}

.colon {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.time-divider {
  font-size: 18px;
  font-weight: bold;
  margin: 0 10px;
  color: #666;
}


/* 반응형 디자인 */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }


  .symptom {
    font-size: 14px;
  }

  .register-button {
    padding: 20px 22px; /* 모바일에서 추가 세로 길이 증가 */
  }
}

</style>