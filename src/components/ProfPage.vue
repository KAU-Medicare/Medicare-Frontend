<template>
  <div class="container">
    <h1 class="title">내 정보</h1>

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

    <!-- 주의사항 버튼 -->
    <section class="section">
      <button @click="toggleAlert" class="alert-button">주의사항</button>
    </section>

    <button class="logout-btn" @click="logout">로그아웃</button>

    <!-- 주의사항 다이얼로그 -->
    <div v-if="showAlert" class="alert-dialog">
      <div class="alert-content">
        <h2 class="alert-title">주의!</h2>
        <p class="alert-message">
          해당 어플에서 사용되는 챗봇과 알레르기 추론 기능은 AI를 기반으로 하고
          있으며, 출력된 답변은 실제 정보와 다를 수 있습니다. 보조 도구로써
          활용하시길 권장드리며, 알레르기 추론 기능과 같은 경우 의사의 결정에
          따라주시길 바랍니다.
        </p>
        <button @click="toggleAlert" class="close-alert-btn">확인</button>
      </div>
    </div>
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
      showAlert: false, // 주의사항 다이얼로그 표시 여부
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
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          throw new Error("알림 권한이 거부되었습니다.");
        }
        const response = await fetch("/api/push/vapidPublicKey");
        const vapidPublicKey = await response.text();

        const registration = await navigator.serviceWorker.register(
          "/service-worker.js"
        );
        if (!registration) {
          throw new Error("서비스 워커 등록 실패");
        }

        const existingSubscription =
          await registration.pushManager.getSubscription();
        if (existingSubscription) {
          await existingSubscription.unsubscribe();
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        });

        await fetch(`/api/push/subscribe/${this.userId}`, {
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
    toggleAlert() {
      this.showAlert = !this.showAlert;
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
}

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
  position: fixed;
  background-color: #ff8947;
  color: black;
  border: none;
  border-radius: 10px;
  padding: 15px 10px;
  font-size: 1.8rem;
  width: 90%;
  max-width: 600px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-align: center;
  bottom: 12vh;
}

.logout-btn:hover {
  background-color: #ff6b2f;
}

/* Alert Button */
.alert-button {
  background-color: #ffa726;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px 20px;
  font-size: 1.8rem;
  font-weight: bold;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
}

.alert-button:hover {
  background-color: #fb8c00;
  transform: scale(1.05);
}

/* Alert Dialog */
.alert-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.alert-content {
  background: white;
  border-radius: 10px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.alert-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #ff5252;
}

.alert-message {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.6;
}

.close-alert-btn {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-size: 1.4rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.close-alert-btn:hover {
  background-color: #45a049;
}
</style>
