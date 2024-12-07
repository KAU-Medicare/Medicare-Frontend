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
    <!-- 알림 허용 버튼 -->
    <section class="section">
      <h2>Push 알림 설정</h2>
      <button @click="subscribeToPush" class="action-button">알림 허용</button>
    </section>

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
    async subscribeToPush() {
      try {
        // VAPID 키를 서버에서 가져오기
        const response = await UserService.getVapidPublicKey();
        const vapidPublicKey = response.data; // 서버에서 받은 VAPID 키

        // Service Worker 등록
        const registration = await navigator.serviceWorker.register(
          "/service-worker.js"
        );
        console.log("Service Worker 등록 성공:", registration);

        // Push 구독
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey),
        });

        console.log("Push Subscription:", subscription);

        // 서버로 전송할 데이터 형식
        const pushSubscriptionData = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
          },
        };

        console.log("서버로 전송할 데이터:", pushSubscriptionData);

        // 서버에 구독 정보 전송
        await UserService.subscribeToPush(this.userId, pushSubscriptionData);
        alert("Push 알림이 성공적으로 설정되었습니다!");
      } catch (error) {
        console.error("Push 알림 설정 중 오류 발생:", error);
        alert("Push 알림 설정에 실패했습니다.");
      }
    },

    // VAPID 키 변환 함수
    urlBase64ToUint8Array(base64String) {
      const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const rawData = window.atob(base64);
      return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
    },
    logout() {
      localStorage.removeItem("userId");
      this.$router.push({ name: "LoginPage" });
    },
    async getUserInfo() {
      try {
        const response = await UserService.getUserById(
          localStorage.getItem("userId")
        );
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

.logout-btn {
  background-color: #ff8947;
  color: black;
  border: none;
  padding: 0 5vw;
  border-radius: 10px;
  padding: 15px 10px;
  font-size: 1.8rem;
  width: 90%;
  max-width: 600px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-align: center;
  position: absolute;
  bottom: 180px;
}

.logout-btn:hover {
  background-color: #ff6b2f;
}
</style>