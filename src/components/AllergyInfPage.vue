<template>
  <div class="allergy-log">
    <div class="date-picker">
      <div>
        <input type="date" v-model="startDate" />
      </div>
      <div>
        <span>~</span>
      </div>
      <div>
        <input type="date" v-model="endDate" />
      </div>
    </div>

    <div class="search-button">
      <button @click="fetchLogs">조회하기</button>
    </div>

    <div v-if="logs.length === 0 && !isLoading" class="no-data">
      알레르기가 나타난 기간을 설정해 주세요
    </div>

    <div v-if="isLoading" class="loading">데이터를 불러오는 중입니다...</div>

    <div v-else class="logs-list">
      <AllergyCard
        v-for="(log, index) in logs"
        :key="index"
        :log="log"
        @click="goToResultPage(log)"
      />
    </div>
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
      startDate: "",
      endDate: "",
      logs: [],
      isLoading: false,
      kakaoId: localStorage.getItem("userId"),
    };
  },
  methods: {
    async fetchLogs() {
      if (!this.startDate || !this.endDate) {
        alert("시작일과 종료일을 입력하세요.");
        return;
      }

      if (!this.kakaoId) {
        alert("사용자 ID를 찾을 수 없습니다. 다시 로그인해주세요.");
        return;
      }

      this.isLoading = true;

      try {
        const response = await UserService.getSymptomRecordsByPeriod(
          this.kakaoId,
          this.startDate,
          this.endDate
        );

        this.logs = response.data.map((record) => ({
          date: this.formatDate(record.occurredDate),
          startTime: record.startTime.join(":") + ":00",
          endTime: record.endTime.join(":") + ":00",
          symptoms: record.symptomNames,
          img: record.base64Image,
        }));
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
        alert("데이터를 불러오는 중 문제가 발생했습니다.");
      } finally {
        this.isLoading = false;
      }
    },
    formatDate(dateArray) {
      const year = dateArray[0];
      const month = String(dateArray[1]).padStart(2, "0"); // 월 패딩 처리
      const day = String(dateArray[2]).padStart(2, "0"); // 일 패딩 처리
      return `${year}-${month}-${day}`;
    },
    goToResultPage(log) {
      this.$router.push({
        path: "/allergyInfResult",
        query: {
          occurredDate: log.date,
        },
      });
    },
  },
};
</script>


<style scoped>
.allergy-log {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3vh 5vw 11vh 5vw;
  max-width: 600px; /* 최대 너비 제한 */
  width: 90vw; /* 부모 컨테이너에 꽉 차도록 설정 */
  margin: auto;
  overflow-y: auto;
  max-height: 80%;
}

.date-picker {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
}

.search-button {
  margin-bottom: 30px;
  width: 100%; /* 부모 컨테이너 너비에 맞춤 */
}

.date-picker input[type="date"] {
  padding: 10px;
  font-size: min(5vw, 20px);
  border: 1px solid #ccc;
  border-radius: 10px;
  width: min(34vw, 260px);
  height: 50px;
}

.search-button button {
  background-color: #ff7f50;
  color: white;
  padding: 15px; /* 상하좌우 적당한 패딩 */
  border: none;
  border-radius: 10px;
  font-size: min(5vw, 20px);
  cursor: pointer;
  width: 100%; /* 부모 컨테이너의 100% */
  max-width: 600px; /* 최대 가로 길이 600px */
  text-align: center; /* 텍스트 중앙 정렬 */
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
}

.search-button button:hover {
  background-color: #ff5733;
}

.no-data {
  text-align: center;
  color: #888;
  font-size: min(5vw, 20px);
  margin-top: 300px;
}

.logs-list {
  margin-top: 20px;
  width: 100%;
}

.loading {
  text-align: center;
  color: #888;
  font-size: 18px;
}
</style>
