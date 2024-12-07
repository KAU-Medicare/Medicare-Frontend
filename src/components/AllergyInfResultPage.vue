<template>
  <div class="container">
    <!-- 카드 박스 -->
    <div class="card-section">
      <h2>알레르기 정보</h2>
      <section class="section">
        <AllergyCard
          v-for="record in allergyRecords"
          :key="record.id"
          :log="record"
          class="allergy-card"
        />
      </section>
    </div>

    <!-- 이미지 박스 -->
    <div class="image-container">
      <!-- 분석 결과 박스 -->
      <div class="analysis-container">
        <h3 class="analysis-title">알레르기원으로 다음이 가장 유력해요:</h3>
        <p class="highlight-text">
          <span v-html="allergyCauseText"></span>
        </p>
      </div>
      <h4 class="reason-title">다음과 같은 이유가 있어요:</h4>
      <ul class="reason-list">
        <li v-for="(reason, index) in allergyData[0].cause" :key="index">
          {{ reason }}
        </li>
      </ul>
    </div>

    <!-- 버튼 -->
    <button class="action-button" @click="goToHome">다른 증상 알아보기</button>
  </div>
</template>

<script>
import AllergyCard from "@/components/cards/AllergyCard.vue";
import UserService from "@/services/UserService";

export default {
  components: {
    AllergyCard,
  },
  data() {
    return {
      occurredDate: this.$route.query.occurredDate || "",
      allergyRecords: [], // 알레르기 데이터 배열
      allergyData: [
        {
          medSuppList: [],
          cause: [],
        },
      ],
    };
  },
  computed: {
    allergyCauseText() {
      const medSuppList = this.allergyData[0].medSuppList;
      let result = "";

      if (medSuppList.length === 0) {
        result = "원인을 조사하는 중이에요!";
      } else if (medSuppList.length === 1) {
        result = `<span">${medSuppList[0]}</span>`;
      } else {
        result =
          medSuppList
            .map((item) => `<span">${item}</span>`)
      }

      return result;
    },
  },
  methods: {
    async fetchAllergyRecords() {
      try {
        const allergyResponse = await UserService.getSymptomRecordsByDate(
          localStorage.getItem("userId"),
          this.occurredDate
        );

        this.allergyRecords = allergyResponse.data.map((record) => ({
          id: record.id,
          date: record.occurredDate.join("-"), // YYYY-MM-DD 형식으로 변환
          startTime: record.startTime.join(":") + ":00", // HH:mm:ss 형식으로 변환
          endTime: record.endTime.join(":") + ":00", // HH:mm:ss 형식으로 변환
          symptoms: record.symptomNames,
          img: record.base64Image, // Base64 이미지 데이터
        }));
      } catch (error) {
        console.error("알레르기 데이터를 가져오는 중 오류 발생:", error);
        alert("알레르기 데이터를 가져오는 중 문제가 발생했습니다.");
      }
    },
    async analyzeAllergy() {
      try {
        // 날짜 형식을 YYYY-MM-DD로 변환하는 유틸리티 함수
        const formatDate = (date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        };

        // 발생 날짜와 알레르기 증상 정보를 가져오기
        const occurredDate = this.occurredDate; // URL 쿼리에서 받은 발생 날짜
        const allergyInfo = this.allergyRecords
          .map((record) => record.symptoms.join(", ")) // 각 record의 symptoms를 ','로 합침
          .join(", "); // 여러 records의 symptoms를 ','로 합침

        // 최근 5일간 날짜 계산
        const startDate = new Date(
          new Date(occurredDate).getTime() - 4 * 24 * 60 * 60 * 1000
        );
        const endDate = new Date(occurredDate);

        const medicationHistoryPromises = [];

        // 날짜 범위 동안 약물 복용 기록과 알레르기 데이터 요청
        for (
          let date = new Date(startDate);
          date <= endDate;
          date.setDate(date.getDate() + 1)
        ) {
          const formattedDate = formatDate(date);

          const promise = (async () => {
            const inventoryResponse = await UserService.getInventoryByDate(
              localStorage.getItem("userId"),
              formattedDate
            );

            // 복용 기록 필터링
            const inventoryData = inventoryResponse.data.filter(
              (item) => item.taken
            );

            if (inventoryData.length > 0) {
              const medications = inventoryData.map((item) => item.itemName);

              // 해당 날짜에 알레르기 발생 여부 확인
              const allergyResponse = await UserService.getSymptomRecordsByDate(
                localStorage.getItem("userId"),
                formattedDate
              );

              const allergyOccurred = allergyResponse.data.length > 0;

              return {
                date: formattedDate.split("-").join("."), // 날짜 형식 변환
                medications,
                allergy: allergyOccurred,
              };
            }

            return null; // 복용 기록이 없는 날은 제외
          })();

          medicationHistoryPromises.push(promise);
        }

        // 병렬로 모든 요청 처리
        const medicationHistoryResults = await Promise.all(
          medicationHistoryPromises
        );

        // null 값을 제거하여 최종 기록 생성
        const medicationHistory = medicationHistoryResults.filter(
          (item) => item !== null
        );

        // 생성된 JSON 데이터
        const jsonData = {
          allergy_info: allergyInfo, // 알레르기 카드에서 가져온 실제 증상 데이터
          medication_history: medicationHistory, // 약물 복용 기록
        };

        console.log("생성된 JSON 데이터:", jsonData);

        // 알레르기 분석 요청
        const analysisResponse = await UserService.analyzeAllergy(
          localStorage.getItem("userId"),
          occurredDate,
          jsonData
        );

        // 데이터에 결과 반영
        this.allergyData[0].medSuppList = analysisResponse.data.result;
        this.allergyData[0].cause = [
          analysisResponse.data.cause.reason1[0],
          analysisResponse.data.cause.reason2[0],
          analysisResponse.data.cause.reason3[0],
        ];
      } catch (error) {
        console.error("알레르기 분석 요청 중 오류 발생:", error);
        alert("알레르기 분석 요청 중 오류가 발생했습니다.");
      }
    },

    goToHome() {
      this.$router.push("/");
    },
  },
  async mounted() {
    if (this.occurredDate) {
      await this.fetchAllergyRecords();
      await this.analyzeAllergy();
    } else {
      alert("올바른 알레르기 날짜를 전달받지 못했습니다.");
    }
  },
};
</script>

<style scoped>
.image-container {
  width: 100%;
  max-width: 600px; /* 가로 최대 너비 */
  aspect-ratio: 3 / 4; /* 가로:세로 비율 설정 (3:4) */
  background-image: url("@/assets/medDoctorBackground.png"); /* 배경 이미지 */
  background-size: cover; /* 컨테이너를 채우도록 설정 */
  background-repeat: no-repeat; /* 이미지 반복 방지 */
  background-position: center bottom; /* 이미지 하단 정렬 */
  border-radius: 15px; /* 모서리 둥글게 */
  display: flex; /* 내부 콘텐츠 정렬을 위한 Flexbox */
  flex-direction: column; /* 세로로 정렬 */
  justify-content: flex-start; /* 상단 정렬 */
  align-items: flex-start; /* 왼쪽 정렬 */
  padding: 20px; /* 내부 패딩 추가 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 박스 그림자 */
  margin-top: 20px; /* 상단 여백 */
  margin-bottom: 20px; /* 하단 여백 */
}



.container {
  display: flex;
  flex-direction: column;
  align-items: center; /* 가로 중앙 정렬 */
  justify-content: flex-start; /* 세로 상단 정렬 */
  padding: 2vh 5vw 11vh 5vw;
  box-sizing: border-box;
}

/* 카드 섹션 스타일 */
.card-section {
  width: 100%;
  max-width: 600px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 15px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

h2 {
  margin: 0 0 15px;
  font-size: min(8vw, 40px);
  color: #333;
  text-align: center;
}

/* 분석 결과 섹션 */
.analysis-container {
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 100%;
  max-width: 600px;
  background-color: #ffefdb;
  border-radius: 10px;
  padding: 20px 0;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.analysis-title {
  font-size: min(4vw, 20px);
  font-weight: bold;
  color: #d35400;
  margin-bottom: 10px;
}

.highlight-text {
  font-size: min(4vw, 20px);
  font-weight: bold;
  color: #e65100;
  margin: 10px 0;
}

.reason-title {
  font-size: min(3.5vw, 20px);
  font-weight: bold;
  color: #555;
  margin-top: 15px;
}

.reason-list {
  list-style-type: decimal;
  padding-left: 20px;
  margin-top: 10px;
}

.reason-list li {
  font-size: min(3vw, 16px);
  color: #666;
  margin-bottom: 5px;
}

/* 이미지 박스 */
.image-container {
  width: 100%;
  max-width: 600px;
  position: relative;
}

.background-image {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  object-fit: cover;
}

/* 버튼 스타일 */
.action-button {
  width: 100%;
  max-width: 600px;
  padding: 15px;
  background-color: #ffa726;
  color: white;
  font-size: min(3vw, 15px);
  font-weight: bold;
  text-align: center;
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-button:hover {
  background-color: #fb8c00;
}
</style>