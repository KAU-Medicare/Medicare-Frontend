<template>
  <div class="back">
    <div class="login">
      <img class="logo" src="@/assets/medicareLogo.png" alt="로고 이미지" />
      <h1>메디케어에 오신걸 환영합니다!</h1>
      <button class="kakao-login" @click="kakaoLogin" :disabled="isLoading">
        <img src="@/assets/kakaoLogin.png" alt="카카오 로그인 버튼" />
      </button>
    </div>
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
      const redirect_uri = `${location.origin}/kakaojoin`;
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
  position: relative; /* 추가 */
  overflow: hidden; /* 추가 */
}

.login::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  width: 600px;
  background: linear-gradient(to bottom, #ff8947, #feb47b);
  z-index: -1; /* 요소를 뒤로 배치 */
}

.login::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(to bottom, rgba(255, 137, 71, 0.3), rgba(254, 180, 123, 0.3));
  z-index: -2; /* 더 뒤에 배치 */
}

.login .logo {
  height: 30vh;
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
