<template>
  <div class="login">
    <img class="logo" src="@/assets/medicareLogo.png" alt="로고 이미지" />
    <h1>메디케어에 오신걸 환영합니다!</h1>
    <button class="kakao-login" @click="kakaoLogin" :disabled="isLoading">
      <img src="@/assets/kakaoLogin.png" alt="카카오 로그인 버튼" />
    </button>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    //카카오톡 로그인 하기
    kakaoLogin() {
      const redirect_uri = "http://localhost:8080/kakaojoin";
      const clientId = "4f760704cb93b148b3f6956612585605";
      const Auth_url = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}`;
      window.location.href = Auth_url;
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
  background: linear-gradient(to bottom, #ff8947, #feb47b);
}
.login .logo {
  height: 40vh;
  width: auto;
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
  background: none;
}
.kakao-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>