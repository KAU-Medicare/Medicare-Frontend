<template>
  <div class="container">
    <h1 class="title">내 정보</h1>
    <div class="logo">
      <img src="@/assets/medicareLogo.png" alt="medicare logo" class="logo" />
    </div>

    <div class="welcome-msg" v-if="searchedUser.nickname">
      <span class="name">{{ searchedUser.nickname }}</span>
      <span>님, 환영합니다!</span>
    </div>

    <button class="logout-btn" @click="logout">로그아웃</button>
  </div>
</template>

<script>
import UserService from "@/services/UserService";

export default {
  name: "UserInfoPage",
  data() {
    return {
      userId: 0, // 사용자의 아이디가 담길 변수
      searchedUser: {}, // id로 검색된 유저 객체
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("userId");
      this.$router.push({ name: "LoginPage" });
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
    this.userId = Number(localStorage.getItem("userId")); // 로컬스토리지에 저장된 Id 받아오기
    this.getUserInfo();
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  height: 100vh;
  background-color: #fefefe;
  position: relative; 
}

.title {
  font-size: 1.8rem; 
  font-weight: bold;
  color: #333;
  position: absolute; 
  top: 0px; 
}

.logo {
  text-align: center;
  margin-top: 50px;
  margin-bottom: 25px; 
  width: 200px;
}

.welcome-msg {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffc4a3;
  border-radius: 10px;
  padding: 10px 10px; 
  width: 25%; 
  text-align: center;
  font-size: 1.8rem;  
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); 
}

.welcome-msg .name {
  font-weight: bold;
  color: #ff8947;
}

.logout-btn {
  background-color: #ff8947;
  color: black;
  border: none;
  border-radius: 10px;
  padding: 15px 10px;
  font-size: 1.8rem; 
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 450px;
  text-align: center;
  position: absolute; 
  bottom: 180px; 
}

.logout-btn:hover {
  background-color: #ff6b2f;
}

@media (max-width: 768px) {
  .title {
    font-size: 1.2rem;
  }

  .logo {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 15px; 
    width: 200px;
  }

  .welcome-msg {
    font-size: 1.2rem;
    padding: 10px 10px;
    width: 90%; 
  }

  .logout-btn {
    font-size: 1.2rem;
    width: 90%;
    bottom: 240px;
  }

  .logo img {
    width: 150px; 
  }

}

</style>

<!--
<template>
  <div class="nutriSupp">
    <h1>화면 이동 포털</h1>
    <p>테스트 화면 이동 페이지 입니다.</p>
    <router-link to="/medInfo">
      <p>약정보 페이지 이동</p>
    </router-link>
    <router-link to="/allergyRecord">
      <p>알러지 등록 페이지 이동</p>
    </router-link>
    <router-link to="/searchByName">
      <p>약 이름 검색 페이지 이동</p>
    </router-link>
    <router-link to="/searchByCamera">
      <p>약 카메라 검색 페이지 이동</p>
    </router-link>
    <router-link to="/allergyInfResult">
      <p>알레르기 추론 결과 페이지 이동</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'ProfPage'
};
</script>

<style scoped>
.nutriSupp {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: yellow;
}
</style>
-->
