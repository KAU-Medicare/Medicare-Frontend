<template>
  <div>
    <h1 class="center-container">로그인 중...</h1>
  </div>
</template>


<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/services/api";

export default {
  name: "KakaoJoin",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const code = ref("");
    const error = ref(null);

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
          withCredentials: false, // 쿠키를 포함하지 않도록 설정
        })
        .then((res) => {
          console.log("Kakao login response:", res); // 로그인 확인
          localStorage.setItem("userId", res.data.id); // 로컬 스토리지에 id 저장
          router.push({ path: "/home" }); // 홈으로 이동
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
      error,
      getToken,
    };
  },
};
</script>

<style>
.center-container {
  display: flex;
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  height: 100vh; /* 화면 전체 높이 */
}
</style>