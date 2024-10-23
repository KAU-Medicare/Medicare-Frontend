<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "@/services/api";

export default {
  name: "KakaoJoin",
  setup() {
    const route = useRoute();
    const code = ref("");
    const form = ref({
      email: "",
      pwd: "",
      nickname: "",
      kakaotoken: "",
    });
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
          console.log("Kakao login response:", res);
          form.value = {
            email: res.data.email,
            pwd: res.data.id,
            nickname: res.data.nickname,
            kakaotoken: res.data.accessToken,
          };
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
      getToken,
    };
  },
};
</script>
