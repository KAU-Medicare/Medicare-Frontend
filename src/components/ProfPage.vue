<template>
  <div class="nutriSupp">
    <h1>화면 이동 포털</h1>
    <p>테스트 화면 이동 페이지 입니다.</p>
    <router-link to="/medInfo">
      <p>약정보 페이지 이동</p>
    </router-link>
    <router-link to="/allergyRecord">
      <p>알러지 등록 페이지 이동</p>
    </router-link>
    <router-link to="/searchByName">
      <p>약 이름 검색 페이지 이동</p>
    </router-link>
    <router-link to="/searchByCamera">
      <p>약 카메라 검색 페이지 이동</p>
    </router-link>
    <router-link to="/allergyInfResult">
      <p>알레르기 추론 결과 페이지 이동</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'ProfPage'
};
</script>

<style scoped>
.nutriSupp {
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