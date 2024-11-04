<template>
  <div class="container">
    <!-- Welcome Message -->
    <div class="welcome-msg">
      <span class="name">{{ searchedUser.nickname }}</span
      ><span>님, 환영합니다!</span>
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
      mediList: [], // 약 json이 담길 변수
      suppList: [], // 영양제 json이 담길 변수
      todayMediList: [], // 오늘 먹을 약 리스트
      todaySuppList: [], // 오늘 먹을 영양제 리스트
      searchedUser: [], // id로 검색된 유저
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

    getTodayList() {
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      const today = days[new Date().getDay()]; // 오늘의 요일

      // 오늘 날짜에 맞는 약과 영양제 필터링
      this.todayMediList = this.mediList.filter(item => item.date.includes(today));
      this.todaySuppList = this.suppList.filter(item => item.date.includes(today));
    },
  },

  mounted() {
    this.userId = Number(localStorage.getItem("userId")); // 로컬스토리지에 저장된 Id 받아오기

    fetch("/assets/mediList.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("약 리스트를 가져올 수 없습니다");
        }
        return response.json();
      })
      .then((mediListData) => {
        this.mediList = mediListData;
        return fetch("/assets/suppList.json");
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("영양제 리스트를 가져올 수 없습니다");
        }
        return response.json();
      })
      .then((suppListData) => {
        this.suppList = suppListData;

        // 데이터 로드 후 오늘 날짜에 맞는 약과 영양제 필터링
        this.getTodayList();
      })
      .catch((error) => {
        console.error("오류 발생 : ", error);
      });
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
