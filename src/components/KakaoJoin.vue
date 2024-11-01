<template>
  <div>
    <h1 v-if="!userLoggedIn" class="center-container">로그인 중...</h1>
    <ProfPage v-if="userLoggedIn" :userInfo="form" />
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api";
import ProfPage from "@/components/ProfPage.vue"; // UserComponent 불러오기

export default {
  name: "KakaoJoin",
  components: {
    ProfPage,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const code = ref("");
    const form = ref({
      email: "x",
      pwd: "x",
      nickname: "x",
      kakaotoken: "x",
    });
    const error = ref(null);
    const userLoggedIn = ref(false); // 로그인 여부 확인 변수

    const getToken = async () => {
      if (!code.value) {
        console.error("No authorization code available");
        error.value = "인증 코드가 없습니다.";
        return;
      }

      await api
        .get(`/kakaologin/${code.value}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: false,
        })
        .then((res) => {
          console.log("Kakao login response:", res);
          form.value = {
            email: res.data.email,
            pwd: res.data.id,
            nickname: res.data.nickname,
            kakaotoken: res.data.accessToken,
          };
          userLoggedIn.value = true; // 로그인 성공 시 설정
          router.push({
            path: "/home",
            query: { userName: form.value.nickname },
          });
          console.log("Nickname sent:", form.value.nickname);
        })
        .catch((err) => {
          console.error("Error fetching token:", err);
          error.value = "로그인 처리 중 오류가 발생했습니다.";
        });
    };

    onMounted(() => {
      code.value = route.query.code;
      if (code.value) {
        console.log("Authorization code:", code.value);
        getToken();
      } else {
        console.error("No authorization code in URL");
        error.value = "URL에 인증 코드가 없습니다.";
      }
    });

    return {
      code,
      form,
      error,
      userLoggedIn,
      getToken,
    };
  },
};
</script>

<style>
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
