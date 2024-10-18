<template>
  <div class="login">
    <img class="logo" src="@/assets/medicareLogo.png" alt="로고 이미지" />
    <h1>메디케어에 오신걸 환영합니다!</h1>
    <button class="kakao-login" @click="initiateKakaoLogin" :disabled="isLoading">
      <img src="@/assets/kakaoLogin.png" alt="카카오 로그인 버튼" />
    </button>
  </div>
</template>

<script>
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

export default {
  name: "LoginPage",
  data() {
    return {
      isLoading: false
    };
  },
  methods: {
    async initiateKakaoLogin() {
      this.isLoading = true;
      try {
        const response = await API.get("/api/login/kakao-url");
        const loginUrl = response.data.loginUrl;
        window.location.href = loginUrl;
      } catch (error) {
        console.error("카카오 로그인 URL을 가져오는 데 실패했습니다:", error);
        alert("로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
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
  aspect-ratio: 1;
}

.login h1 {
  color: #ff8947;
}

.kakao-login {
  border: none;
  margin: 0;
  padding: 0;
  cursor: pointer;
  transition: opacity 0.3s;
}

.kakao-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>