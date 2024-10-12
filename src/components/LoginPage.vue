<template>
  <div class="login">
    <img class="logo" src="@/assets/medicareLogo.png" alt="로고 이미지" />
    <h1>메디케어에 오신걸 환영합니다!</h1>
    <button class="kakao-login" @click="initiateKakaoLogin">
      <img src="@/assets/kakaoLogin.png" alt="버튼 이미지" />
    </button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "LoginPage",
  methods: {
    async initiateKakaoLogin() {
      try {
        const response = await axios.get("https://kau-medicare.shop/api/login/kakao-url");
        const loginUrl = response.data.loginUrl;
        window.location.href = loginUrl;
      } catch (error) {
        console.error("카카오 로그인 URL을 가져오는 데 실패했습니다:", error);
      }
    },
  },
};
</script>

<style>
.login {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: white;
}

.login .logo {
  height: 40vh;
  aspect-ratio: 1; /* 가로세로 크기 일정 */
}

h1 {
  color: #ff8947;
}

.kakao-login {
  border: none;
  margin: 0;
  padding: 0;
}
</style>
