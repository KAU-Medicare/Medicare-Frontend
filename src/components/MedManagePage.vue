<template>
  <div class="medManage">
    <h1>medManage Page</h1>
    <p>medManage .테스트 화면입니다</p>
    <router-link to="/medInfo">
      <p>약정보 페이지 이동</p>
    </router-link>
    <router-link to="/allergyRecord">
      <p>알러지 등록 페이지 이동</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'MedManagePage'
};
</script>

<style>
.medManage {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: yellow;
}
</style>