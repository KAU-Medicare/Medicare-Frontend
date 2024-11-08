<template>
  <div>
    <video ref="video" autoplay></video>
    <div v-if="barcodeId">인식된 ID: {{ barcodeId }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      barcodeId: null,
      videoStream: null
    };
  },
  methods: {
    async startCamera() {
      try {
        // 카메라 피드 가져오기
        this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        this.$refs.video.srcObject = this.videoStream;

        // 바코드 인식기 지원 여부 확인
        if ('BarcodeDetector' in window) {
          const barcodeDetector = new BarcodeDetector({ formats: ['ean_13', 'code_128'] });
          this.detectBarcode(barcodeDetector);
        } else {
          console.error("이 브라우저는 BarcodeDetector API를 지원하지 않습니다.");
        }
      } catch (error) {
        console.error("카메라를 시작할 수 없습니다:", error);
      }
    },
    async detectBarcode(barcodeDetector) {
      const video = this.$refs.video;

      const detect = async () => {
        try {
          const barcodes = await barcodeDetector.detect(video);
          if (barcodes.length > 0) {
            this.barcodeId = barcodes[0].rawValue;
          }
        } catch (error) {
          console.error("바코드 감지 오류:", error);
        }
        requestAnimationFrame(detect); // 반복하여 감지
      };

      detect();
    }
  },
  mounted() {
    this.startCamera();
  },
  beforeUnmount() {  // 변경된 라이프사이클 훅 사용
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop()); // 카메라 종료
    }
  }
};
</script>

<style scoped>
video {
  width: 100%;
  max-height: 400px;
}
</style>
