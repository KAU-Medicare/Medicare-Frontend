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
      <button @click="subscribeToPushNotifications" class="push-button">
        알림 허용
      </button>
    </section>

    <button class="logout-btn" @click="logout">로그아웃</button>
  </div>
</template>

<script>
import UserService from "@/services/UserService";
import { urlBase64ToUint8Array } from "@/utils/conversion";

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
        const response = await UserService.getUserById(
          localStorage.getItem("userId")
        );
        this.searchedUser = response.data;
      } catch (error) {
        console.error("회원 정보 조회 에러:", error);
      }
    },
    async subscribeToPushNotifications() {
      try {
        // 브라우저 알림 권한 요청
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          throw new Error("알림 권한이 거부되었습니다.");
        }

        // VAPID 키 가져오기
        const response = await fetch("/api/push/vapidPublicKey");
        const vapidPublicKey = await response.text();

        // Service Worker 등록
        const registration = await navigator.serviceWorker.register(
          "/service-worker.js"
        );
        if (!registration) {
          throw new Error("서비스 워커 등록 실패");
        }

        // 기존 구독 제거
        const existingSubscription =
          await registration.pushManager.getSubscription();
        if (existingSubscription) {
          await existingSubscription.unsubscribe();
        }

        // 새 구독 생성
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });

        console.log("Push Subscription:", subscription);

        // 서버로 구독 정보 전송
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription),
        });

        alert("Push 알림이 성공적으로 설정되었습니다!");
      } catch (error) {
        console.error("Push 알림 구독 실패:", error);
        alert("Push 알림 설정에 실패했습니다.");
      }
    },
  },

  mounted() {
    this.userId = Number(localStorage.getItem("userId"));
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

/* Push Button */
.push-button {
  width: 100%;
  max-width: 600px;
  padding: 15px 20px;
  background-color: #4caf50;
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.push-button:hover {
  background-color: #45a049;
  transform: scale(1.05);
}

.push-button:active {
  background-color: #3e8e41;
}

/* Logout Button */
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
