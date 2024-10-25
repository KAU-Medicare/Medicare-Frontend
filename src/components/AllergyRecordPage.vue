<template>
  <div class="container">
    <div class="header">
      <button @click="goBack" class="back-button">←</button>
      <span class="title">알레르기 정보 등록</span>
    </div>
    
    <div class="upload-section">
      <div class="upload-box" @click="selectPhoto">
        <span class="plus-sign">+</span>
        <span class="upload-text">사진 등록</span>
      </div>
    </div>

    <div class="time-section">
      <label>발생 시간</label>
      <div class="time-range" @click="editTime">
        <span>{{ timeRange }}</span>
      </div>
      <div v-if="isEditing">
        <input type="text" v-model="startTimeInput" @focus="isEditing = true" placeholder="시작 시간 (예: 12:00)" />
        ~
        <input type="text" v-model="endTimeInput" @focus="isEditing = true" @blur="saveEndTime" placeholder="종료 시간 (예: 13:00)" />
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
      <div class="selected-symptoms">
        <span v-for="(symptom, index) in selectedSymptoms" :key="index" class="selected-symptom">
          {{ symptom }}
          <button @click="removeSymptom(symptom)">x</button>
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
      startTimeInput: '00:00',
      endTimeInput: '00:00',
      isEditing: false,
      symptoms: ["고열", "두통", "출혈", "근육통", "우울 및 불안", "허리 통증", "메스꺼움", "탈진", "어지러움", "호흡 곤란", "설사", "구토", "불규칙한 심장박동"],
      selectedSymptoms: []
    };
  },
  computed: {
    timeRange() {
      return `${this.startTimeInput} ~ ${this.endTimeInput}`;
    }
  },
  methods: {
    goBack() {
      this.$router.push('/home'); // 홈 화면으로 이동
    },
    selectPhoto() {
      console.log("사진 등록 버튼 클릭됨.");
      // 사진 등록 기능 (갤러리로 이동은 미구현)
    },
    toggleSymptom(symptom) {
      if (this.selectedSymptoms.includes(symptom)) {
        this.selectedSymptoms = this.selectedSymptoms.filter(s => s !== symptom);
      } else {
        this.selectedSymptoms.push(symptom);
      }
    },
    removeSymptom(symptom) {
      this.selectedSymptoms = this.selectedSymptoms.filter(s => s !== symptom);
    },
    editTime() {
      this.isEditing = true; // 편집 모드 활성화
    },
    saveStartTime() {
      // 시작 시간 저장 로직 (필요 시 추가)
    },
    saveEndTime() {
      // 종료 시간 저장 로직 (필요 시 추가)
      this.isEditing = false; // 종료 시간 입력 후 편집 모드 비활성화
    },
    register() {
      // 더미 데이터 생성
      const dummyData = {
        occurrenceTime: this.timeRange,
        symptoms: this.selectedSymptoms,
      };
      
      // 더미 데이터 출력
      console.log("더미 데이터:", dummyData);
      
      // 홈 화면으로 이동
      this.$router.push('/home');
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
  display: flex;
  flex-direction: column; /* 세로 방향 정렬 */
  align-items: center;    /* 수평 가운데 정렬 */
}

.header {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center; /* 가운데 정렬 추가 */
  margin-bottom: 20px; /* 제목과 사진 등록 박스 간 간격 */
}

.back-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  position: absolute; /* 절대 위치 조정 */
  left: 20px; /* 왼쪽 여백 추가 */
}

.title {
  font-size: 20px;
  margin-left: -8px; /* 왼쪽으로 여백 추가 */
}

.upload-section {
  width: 100%;
  max-width: 600px; /* 최대 너비 설정 */
  display: flex;
  justify-content: center; /* 수평 가운데 정렬 */
  margin-bottom: 20px; /* 사진 등록 박스와 다음 요소 간 간격 */
}

.upload-box {
  background-color: #d3d3d3; /* 연한 회색으로 변경 */
  width: 200px; /* 너비를 200px로 수정 */
  height: 200px; /* 높이를 200px로 수정 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: black;
  cursor: pointer; /* 클릭 가능하도록 변경 */
}

.time-section {
  margin-top: 20px;
  width: 100%;
  max-width: 600px; /* 최대 너비 설정 */
}

.time-range {
  cursor: pointer; /* 클릭 가능하도록 변경 */
}

.symptoms-section {
  margin-top: 20px;
  width: 100%;
  max-width: 600px; /* 최대 너비 설정 */
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
  cursor: pointer; /* 클릭 가능하도록 변경 */
}

.selected {
  background-color: orange; /* 선택된 증상 강조 */
}

.selected-symptoms {
  margin-top: 10px;
}

.selected-symptom {
  background-color: lightgreen;
  border-radius: 20px;
  padding: 5px 10px;
  margin: 5px;
}

.register-button {
  background-color: orange;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
  max-width: 600px; /* 최대 너비 설정 */
}

/* 반응형 디자인 */
@media (max-width: 600px) {
  .container {
    padding: 10px; /* 패딩 조정 */
  }

  .header {
    display: flex;
    flex-direction: row; /* 수평 방향 정렬 유지 */
    justify-content: center; /* 가운데 정렬 */
    align-items: center; /* 수직 가운데 정렬 */
    width: 100%;
    margin-bottom: 20px; /* 제목과 사진 등록 박스 간 간격 */
  }

  .title {
    font-size: 18px; /* 폰트 크기 조정 */
    margin-left: -5px; /* 여백 추가 */
  }

  .upload-box {
    width: 75%; /* 폭을 100%로 설정 */
    height: 240px; /* 높이를 정사각형으로 유지 */
  }

  .symptom {
    font-size: 14px; /* 증상 텍스트 크기 조정 */
  }

  .register-button {
    padding: 8px 16px; /* 버튼 패딩 조정 */
  }
}

</style>

