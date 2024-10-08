<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition :name="transitionName">
        <component :is="Component" />
      </transition>
    </router-view>
        <BottomNav />
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
  watch: {
    $route(to, from) {
      this.transitionName = to.meta.page > from.meta.page ? "next" : "prev";

      console.log(this.transitionName);
    },
  },
};
</script>

<style>
#app {
  display: flex;
  flex-direction: row;
  align-items: center; /* 수직 중앙 정렬 */
  margin: 0;
  padding: 0;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
}
</style>