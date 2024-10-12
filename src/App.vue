<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition :name="transitionName">
        <component :is="Component" />
      </transition>
    </router-view>
    <BottomNav v-show="currentState === 'BotNav'"/>
  </div>
</template>

<script>
import BottomNav from "./components/BottomNav.vue";
import "./assets/slideEffect.css"; // CSS 파일 임포트

export default {
  name: "App",
  data() {
    return {
      transitionName: "",
    };
  },
  components: {
    BottomNav,
  },
  computed: {
    // 현재 라우트의 meta 정보를 가져오기 위한 computed 속성
    currentState() {
      console.log('Current Route Meta State:', this.$route.meta.state);
      return this.$route.meta.state; // 현재 라우트의 meta.state 값을 반환
    }
  },
  watch: {
    // $route(to, from) {
    //   this.transitionName = to.meta.page > from.meta.page ? "next" : "prev";

    //   console.log(this.transitionName);
    // },
  },
};
</script>

<style>

@font-face {
  font-family: 'GwangYang'; /* 폰트 이름 */
  src: url('/public/assets/fonts/GWANGYANG-REGULAR.TTF') format('truetype'); /* 폰트 경로 */    /* 폰트 경로 */
  font-weight: normal;
  font-style: normal;
}

#app {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
  font-family: 'GwangYang', sans-serif;
}
</style>