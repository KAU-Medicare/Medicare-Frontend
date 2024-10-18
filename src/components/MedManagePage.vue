<template>
  <div>
    <button @click="startCamera">카메라 사용</button>
    <video ref="video" width="640" height="480" autoplay></video>
  </div>
</template>

<script>
export default {
  methods: {
    async startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.$refs.video.srcObject = stream;
      } catch (error) {
        console.error('카메라에 접근할 수 없습니다:', error);
      }
    },
  },
};

</script>

<style scoped>
video {
  border: 1px solid black;
}
</style>
