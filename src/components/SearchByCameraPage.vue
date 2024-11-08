<template>
  <div>
    <button @click="startScanner" v-if="!isScanning">바코드 스캔 시작</button>
    <button @click="stopScanner" v-if="isScanning">스캔 중지</button>
    <div id="qr-reader" style="width: 300px; height: 300px;"></div>
    <div v-if="barcodeResult">
      <p>인식된 바코드: {{ barcodeResult }}</p>
    </div>
  </div>
</template>

<script>
import { Html5Qrcode } from "html5-qrcode";

export default {
  data() {
    return {
      barcodeResult: null,
      html5QrCode: null,
      isScanning: false,
    };
  },
  methods: {
    async startScanner() {
      this.html5QrCode = new Html5Qrcode("qr-reader");
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      const cameraConfig = { facingMode: "environment" }; // 후면 카메라 사용

      try {
        await this.html5QrCode.start(
          cameraConfig,
          config,
          (decodedText) => {
            this.barcodeResult = decodedText;
            console.log("인식된 바코드:", decodedText);
            this.stopScanner(); // 바코드 인식 후 스캔 중지
          },
          (errorMessage) => {
            console.warn("인식 실패:", errorMessage);
          }
        );
        this.isScanning = true;
      } catch (error) {
        console.error("스캐너를 시작할 수 없습니다:", error);
      }
    },
    stopScanner() {
      if (this.html5QrCode) {
        this.html5QrCode.stop().then(() => {
          this.isScanning = false;
          this.html5QrCode.clear();
        }).catch((err) => {
          console.error("스캐너를 중지하는 중 오류가 발생했습니다:", err);
        });
      }
    }
  },
  beforeUnmount() {
    this.stopScanner(); // 컴포넌트가 사라질 때 스캐너 중지
  }
};
</script>

<style scoped>
#qr-reader {
  margin-top: 10px;
  border: 1px solid #ddd;
}
</style>
