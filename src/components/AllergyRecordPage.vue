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
import UserService from "@/services/UserService"; // UserService에서 함수 불러오기

export default {
  data() {
    return {
      startHour: 0,
      startMinute: 0,
      endHour: 0,
      endMinute: 0,
      isEditing: false,
      symptoms: [
        "고열",
        "두통",
        "출혈",
        "근육통",
        "우울 및 불안",
        "허리 통증",
        "메스꺼움",
        "탈진",
        "어지러움",
        "호흡 곤란",
        "설사",
        "구토",
        "불규칙한 심장박동",
      ],
      selectedSymptoms: [],
      selectedPhoto: null,
      encodedImage: "", // Base64로 인코딩된 이미지
      occurredDate: "", // 발생 날짜
    };
  },
  computed: {
    timeRange() {
      const startTime = `${this.startHour
        .toString()
        .padStart(2, "0")}:${this.startMinute.toString().padStart(2, "0")}:00`; // 초(:00) 추가
      const endTime = `${this.endHour
        .toString()
        .padStart(2, "0")}:${this.endMinute.toString().padStart(2, "0")}:00`; // 초(:00) 추가
      return { startTime, endTime };
    },
  },
  methods: {
    goBack() {
      this.$router.push("/mediCalendar"); // 홈 화면으로 이동
    },
    // 이미지 압축 및 Base64 변환
    async resizeImage(file, maxWidth = 800, maxHeight = 800) {
      return new Promise((resolve) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
          img.src = e.target.result;
        };

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            } else {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);

          // JPEG 형식으로 압축 (품질 0.8)
          resolve(canvas.toDataURL("image/jpeg", 0.8));
        };

        reader.readAsDataURL(file);
      });
    },
    async selectPhoto() {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          this.selectedPhoto = URL.createObjectURL(file);

          // 이미지 리사이즈 및 Base64 인코딩
          const resizedBase64 = await this.resizeImage(file);
          this.encodedImage = resizedBase64.split(",")[1]; // Base64 부분만 추출
        }
      };
      fileInput.click();
    },
    toggleSymptom(symptom) {
      if (this.selectedSymptoms.includes(symptom)) {
        this.selectedSymptoms = this.selectedSymptoms.filter(
          (s) => s !== symptom
        );
      } else {
        this.selectedSymptoms.push(symptom);
      }
    },
    async register() {
      // 사용자 ID 가져오기
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("사용자 ID를 찾을 수 없습니다. 다시 로그인해주세요.");
        return;
      }

      // 입력값 검증
      if (
        this.startHour > this.endHour ||
        (this.startHour === this.endHour && this.startMinute >= this.endMinute)
      ) {
        alert("종료 시간이 시작 시간보다 늦어야 합니다.");
        return;
      }

      if (this.selectedSymptoms.length === 0) {
        alert("증상을 하나 이상 선택해야 합니다.");
        return;
      }

      if (!this.encodedImage) {
        alert("사진을 업로드해야 합니다.");
        return;
      }

      // URL 쿼리에서 날짜 정보 가져오기
      const queryDate = this.$route.query.date;
      if (queryDate) {
        this.occurredDate = queryDate; // 발생 날짜 설정
      } else {
        // 날짜가 없을 경우 기본값 설정 (오늘 날짜)
        const today = new Date();
        this.occurredDate = `${today.getFullYear()}-${String(
          today.getMonth() + 1
        ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      }
      try {
        // 서버로 전송할 데이터 생성
        const data = {
          kakaoId: userId, // localStorage에서 가져온 사용자 ID
          symptomIds: this.selectedSymptoms.map(
            (symptom) => this.symptoms.indexOf(symptom) + 1
          ), // 선택된 증상의 ID 배열
          occurredDate: this.occurredDate,
          startTime: this.timeRange.startTime, // HH:mm:ss 형식
          endTime: this.timeRange.endTime, // HH:mm:ss 형식
          base64Image: this.encodedImage,
        };

        // 서버에 데이터 전송
        console.log("전송 데이터:", data);

        await UserService.addSymptomRecord(data);

        alert("알레르기 정보가 성공적으로 등록되었습니다.");
        this.$router.push("/mediCalendar");
      } catch (error) {
        console.error("알레르기 정보 등록 중 오류 발생:", error);
        alert("알레르기 정보를 등록하는 중 오류가 발생했습니다.");
      }
    },
  },
};
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