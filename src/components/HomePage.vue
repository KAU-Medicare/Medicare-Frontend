<template>
  <div class="home">
    <h1>Home Page</h1>
    <p>Welcome to Home page!</p>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  mounted() {
    console.log("컴포넌트가 마운트되었습니다.");
  }
};
</script>

<style>
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: red;
}
</style>
