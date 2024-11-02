<template>
  <div class="container">
    <div class="header">
      <button @click="goBack" class="back-button">←</button>
      <span class="title">알레르기 정보 등록</span>
    </div>
    
    <div class="upload-section">
      <div class="upload-box" @click="selectPhoto">
        <img v-if="selectedPhoto" :src="selectedPhoto" class="uploaded-image" />
        <span v-else class="plus-sign">+</span>
        <span v-if="!selectedPhoto" class="upload-text">사진 등록</span>
      </div>
    </div>

    <div class="time-section">
      <label>발생 시간</label>
      <div class="time-range" @click="editTime">
        <span>{{ timeRange }}</span>
      </div>
      <div v-show="isEditing"> <!-- v-if에서 v-show로 변경 -->
        <input type="number" v-model="startHour" min="0" max="23" placeholder="시" @focus="isEditing = true" />
        :
        <input type="number" v-model="startMinute" min="0" max="59" placeholder="분" @focus="isEditing = true" />
        ~
        <input type="number" v-model="endHour" min="0" max="23" placeholder="시" @focus="isEditing = true" />
        :
        <input type="number" v-model="endMinute" min="0" max="59" placeholder="분" @blur="saveEndTime" />
      </div>
    </div>
    
    <div class="symptoms-section">
      <label>증상</label>
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
      this.$router.push('/home'); // 홈 화면으로 이동
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
      this.$router.push('/home');
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
  font-size: 20px;
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
  background-color: #d3d3d3;
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: black;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.time-section {
  margin-top: 20px;
  width: 100%;
  max-width: 600px;
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
  background-color: orange;
  color: white;
  padding: 18px 20px; /* 기본 세로 길이 증가 */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: auto;
  width: 100%;
  max-width: 600px;
  position: fixed;
  bottom: 15px; /* 버튼을 화면 하단에서 살짝 위로 올림 */
  left: 50%;
  transform: translateX(-50%);
}

/* 반응형 디자인 */
@media (max-width: 600px) {
  .container {
    padding: 10px;
  }

  .title {
    font-size: 18px;
    margin-left: -5px;
  }

  .upload-box {
    width: 75%;
    height: 240px;
  }

  .symptom {
    font-size: 14px;
  }

  .register-button {
    padding: 20px 22px; /* 모바일에서 추가 세로 길이 증가 */
  }
}

</style>


