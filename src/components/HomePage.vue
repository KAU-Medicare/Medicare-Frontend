<template>
  <div class="container">
    <!-- Welcome Message -->
    <div class="welcome-msg" v-if="searchedUser.nickname">
      <span class="name">{{ searchedUser.nickname }}</span>
      <span>님, 환영합니다!</span>
    </div>

    <!-- Medication Section -->
    <section class="section" v-if="todayMediList.length">
      <h2>오늘 먹을 약</h2>
      <MedicineCard
        v-for="(item, index) in todayMediList"
        :key="index"
        :item="item"
        @check="handleCheck"
      />
    </section>

    <!-- Supplement Section -->
    <section class="section" v-if="todaySuppList.length">
      <h2>오늘 먹을 영양제</h2>
      <MedicineCard
        v-for="(item, index) in todaySuppList"
        :key="index"
        :item="item"
        @check="handleCheck"
      />
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
      userId: 0, // 사용자의 아이디가 담길 변수
      todayMediList: [], // 오늘 먹을 약 리스트
      todaySuppList: [], // 오늘 먹을 영양제 리스트
      searchedUser: {}, // id로 검색된 유저 객체
    };
  },

  components: {
    MedicineCard,
  },

  methods: {
    handleCheck(item) {
      console.log(`${item.name} checked!`);
    },

    async getUserInfo() {
      try {
        const response = await UserService.getUserById(this.userId);
        this.searchedUser = response.data;
      } catch (error) {
        console.error("회원 정보 조회 에러:", error);
      }
    },

    async getTodayInventory() {
      try {
        // 서버에서 오늘 먹을 약과 영양제 리스트 가져오기
        const response = await UserService.getTodayInventory(this.userId);
        const todayInventory = response.data;

        // 약과 영양제를 구분하여 각각의 리스트에 저장
        this.todayMediList = todayInventory.filter((item) => item.type === "MEDICINE");
        this.todaySuppList = todayInventory.filter((item) => item.type === "SUPPLEMENT");
      } catch (error) {
        console.error("오늘 복용할 약/영양제 조회 에러:", error);
      }
    },
  },

  async mounted() {
    localStorage.setItem("userId", 3763697930); // 테스트용. 실사용시 무조건 지울것!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    this.userId = Number(localStorage.getItem("userId")); // 로컬스토리지에 저장된 Id 받아오기
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
