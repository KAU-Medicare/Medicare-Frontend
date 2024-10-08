<template>
  <div class="bottom-nav">
    <router-link to="/" class="nav-item">
      <img class="nav-img" :src="currentHomeImg" alt="homeBtn" />
      <p class>홈</p>
    </router-link>
    <router-link to="/medManage" class="nav-item">
      <img class="nav-img" :src="currentMedManageImg" alt="medManageBtn" />
      <p>복약관리</p>
    </router-link>
    <router-link to="/nutriSupp" class="nav-item">
      <img class="nav-img" :src="currentNutriSuppImg" alt="nutriSuppBtn" />
      <p>추천 영양제</p>
    </router-link>
    <router-link to="/allergyInf" class="nav-item">
      <img class="nav-img" :src="currentAllergyInfImg" alt="allergyInfBtn" />
      <p>알레르기 추론</p>
    </router-link>
    <router-link to="/prof" class="nav-item">
      <img class="nav-img" :src="currentProfImg" alt="profBtn" />
      <p>내정보</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "BottomNav",
  data() {
    return {
      homeBtnImg: require("@/assets/navBtnImg/homeBtn.png"),
      homeBtnActiveImg: require("@/assets/navBtnImg/homeBtnActive.png"),
      nutriSuppBtnImg: require("@/assets/navBtnImg/nutriSuppBtn.png"),
      nutriSuppBtnActiveImg: require("@/assets/navBtnImg/nutriSuppBtnActive.png"),
      medManageBtnImg: require("@/assets/navBtnImg/medManageBtn.png"),
      medManageBtnActiveImg: require("@/assets/navBtnImg/medManageBtnActive.png"),
      allergyInfBtnImg: require("@/assets/navBtnImg/allergyInfBtn.png"),
      allergyInfBtnActiveImg: require("@/assets/navBtnImg/allergyInfBtnActive.png"),
      profBtnImg: require("@/assets/navBtnImg/profBtn.png"),
      profBtnActiveImg: require("@/assets/navBtnImg/profBtnActive.png"),
    };
  },
  computed: {
    // 현재 라우트에 따라 이미지를 동적으로 변경하는 로직
    currentHomeImg() {
      return this.$route.path === "/"
        ? this.homeBtnActiveImg
        : this.homeBtnImg;
    },
    currentMedManageImg() {
      return this.$route.path === "/medManage"
        ? this.medManageBtnActiveImg
        : this.medManageBtnImg;
    },
    currentNutriSuppImg() {
      return this.$route.path === "/nutriSupp"
        ? this.nutriSuppBtnActiveImg
        : this.nutriSuppBtnImg;
    },
    currentAllergyInfImg() {
      return this.$route.path === "/allergyInf"
        ? this.allergyInfBtnActiveImg
        : this.allergyInfBtnImg;
    },
    currentProfImg() {
      return this.$route.path === "/prof"
        ? this.profBtnActiveImg
        : this.profBtnImg;
    },
  },
};
</script>

<style>
.bottom-nav {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background-color: #f8f8f8;
  padding-top: 10px;
  padding-bottom: 10px;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 8vh; /* 하단 바 높이 비율 조절*/
  box-shadow: 0 -0.5vh 1vh rgba(0, 0, 0, 0.3);
  z-index: 2;
}
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-decoration: none;
  margin-top: 1vh;
  color: #a0a0a0;
  font-weight: bold;
  font-size: 10px;
  flex: 1; /* 동일한 크기로 아이템들 분할 */
  -webkit-tap-highlight-color: transparent; /* 크롬에서 눌렀을 때 파란색 효과 나오는거 제거 */
}

.nav-img {
  height: 65%; /* 부모의 높이에 맞게 설정 */
  width: auto; /* 비율을 유지하기 위해 width를 auto로 설정 */
  /* object-fit: cover; 부모 영역에 맞게 이미지를 잘라냄 */
}

.nav-item.router-link-exact-active {
  color: #ff8947; /* 선택된 탭의 색상 */
}

p {
  margin-top: 5px;
}

</style>