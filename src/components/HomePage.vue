<template>
  <div class="container">
    <!-- Welcome Message -->
    <div class="welcome-msg">
      <span class="name">{{ searchedUser.nickname }}</span>
      <span>님, 환영합니다!</span>
    </div>

    <!-- Medication Section -->
    <section class="section">
      <h2>오늘 먹을 약</h2>
      <template v-if="serverError">
        <p>서버에 이상이 있습니다. 다시 시도해주세요</p>
      </template>
      <template v-else-if="!todayMediList.length && !isLoading">
        <p>오늘 먹을 약이 없습니다</p>
      </template>
      <template v-else>
        <MedicineCard
          v-for="(item, index) in todayMediList"
          :key="index"
          :item="item"
          :kakaoId="userId"
          :date="todayDate"
        />
      </template>
    </section>

    <!-- Supplement Section -->
    <section class="section">
      <h2>오늘 먹을 영양제</h2>
      <template v-if="serverError">
        <p>서버에 이상이 있습니다. 다시 시도해주세요</p>
      </template>
      <template v-else-if="!todaySuppList.length && !isLoading">
        <p>오늘 먹을 영양제가 없습니다</p>
      </template>
      <template v-else>
        <MedicineCard
          v-for="(item, index) in todaySuppList"
          :key="index"
          :item="item"
          :kakaoId="userId"
          :date="todayDate"
        />
      </template>
    </section>
  </div>
</template>

<script>
import MedicineCard from "@/components/cards/MedicineCard.vue";
import UserService from "@/services/UserService";

export default {
  name: "HomePage",
  data() {
    return {
      userId: 0, // 사용자의 아이디
      todayMediList: [], // 오늘 먹을 약 리스트
      todaySuppList: [], // 오늘 먹을 영양제 리스트
      searchedUser: {}, // id로 검색된 유저 객체
      todayDate: "", // 오늘 날짜 (yyyy-MM-dd 형식)
      isLoading: true, // 로딩 상태
      serverError: false, // 서버 에러 여부
    };
  },

  components: {
    MedicineCard,
  },

  methods: {
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },

    async getUserInfo() {
      try {
        const response = await UserService.getUserById(this.userId);
        this.searchedUser = response.data;
      } catch (error) {
        console.error("회원 정보 조회 에러:", error);
        this.serverError = true;
      }
    },

    async getTodayInventory() {
      try {
        const response = await UserService.getInventoryByDate(this.userId, this.todayDate);
        const todayInventory = response.data;

        // 약과 영양제를 구분하여 각각 리스트에 저장
        this.todayMediList = todayInventory.filter(
          (item) => item.type === "MEDICINE"
        );
        this.todaySuppList = todayInventory.filter(
          (item) => item.type === "HEALTH_FOOD"
        );
      } catch (error) {
        console.error("오늘 복용할 약/영양제 조회 에러:", error);
        this.serverError = true;
      } finally {
        this.isLoading = false; // 로딩 종료
      }
    },

    getFormattedDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  },

  async mounted() {
    localStorage.setItem("userId", 3763697930); // 테스트용. 실사용 시 제거
    this.userId = localStorage.getItem("userId"); // 로컬스토리지에서 ID 가져오기
    this.todayDate = this.getFormattedDate(); // 오늘 날짜를 yyyy-MM-dd로 설정
    await this.getUserInfo(); // 사용자 정보 가져오기
    await this.getTodayInventory(); // 오늘 먹을 약/영양제 정보 가져오기
  },
};
</script>

<style scoped>
/* Layout */
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3vh 5vw 11vh 5vw;
  max-width: 600px;
  width: 90vw;
  margin: auto;
  overflow-y: auto;
  max-height: 80%;
}

/* Welcome Message */
.welcome-msg {
  height: 8vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #ffc4a3;
  border-radius: 10px;
  width: 100%;
  text-align: center;
  font-size: 3vh;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.welcome-msg .name {
  font-weight: bold;
  color: #ff8947;
}

/* Medication & Supplement Section */
.section {
  width: 100%;
  margin-bottom: 20px;
}
</style>
