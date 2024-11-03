<template>
  <div class="container">
    <!-- Welcome Message -->
    <div class="welcome-msg">
      <span class="name">{{ searchedUser.nickname }}</span
      ><span>님, 환영합니다!</span>
    </div>

    <!-- Medication Section -->
    <section class="section">
      <h2>오늘 먹을 약</h2>
      <MedicineCard
        v-for="(item, index) in mediList"
        :key="index"
        :item="item"
        @check="handleCheck"
      />
    </section>

    <!-- Supplement Section -->
    <section class="section">
      <h2>오늘 먹을 영양제</h2>
      <MedicineCard
        v-for="(item, index) in suppList"
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
      searchedUser: null, // id로 검색된 유저
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
  },

  mounted() {
    this.userId = localStorage.getItem("userId"); // 로컬스토리지에 저장된 Id 받아오기
    this.getUserInfo(); // Id를 통한 유저 정보 받아오기

    fetch("/assets/mediList.json") // 약 리스트 가져오기
      .then((response) => {
        // 가져온 결과 보고
        if (!response.ok) {
          // 못 가져왔으면
          throw new Error("약 리스트를 가져올 수 없습니다"); // 에러 메세지 출력 후 중단
        }
        return response.json(); // 정상이면 응답을 json 형식으로 변환
      })
      .then((mediListData) => {
        // 가져온 데이터 이름을 mediListData로 설정
        this.mediList = mediListData; // mediList 변수에 넣어줌

        return fetch("/assets/suppList.json"); // 이제 영양제 리스트 가져옴
      })
      .then((response) => {
        // 가져온 결과 보고
        if (!response.ok) {
          // 못 가져왔으면
          throw new Error("영양제 리스트를 가져올 수 없습니다"); // 에러 메세지 출력 후 중단
        }
        return response.json(); // 정상이면 응답을 json 형식으로 변환
      })
      .then((suppListData) => {
        // 가져온 데이터 이름을 suppListData로 설정
        this.suppList = suppListData; // suppList 변수에 넣어줌
      })
      .catch((error) => {
        // 오류 발생 시 위에서 throw한 에러메세지 출력
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
