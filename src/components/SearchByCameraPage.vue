<template>
  <div>
    <video ref="video" autoplay></video>
    <div v-if="barcodeId">인식된 바코드 ID: {{ barcodeId }}</div>
  </div>
</template>

<script>
import { BrowserMultiFormatReader } from '@zxing/library';

export default {
  data() {
    return {
      barcodeId: null,
      codeReader: null,
      isScanning: false, // 스캔 중인지 여부를 추적하는 변수
    };
  },
  methods: {
    async startScanner() {
      this.codeReader = new BrowserMultiFormatReader();

      try {
        const videoInputDevices = await this.codeReader.listVideoInputDevices();

        // 후면 카메라를 선택
        const selectedDeviceId = videoInputDevices.find(device =>
          device.label.toLowerCase().includes('back')
        )?.deviceId || videoInputDevices[0].deviceId;

        // 초점 설정 추가 (사용 가능한 경우)
        const constraints = {
          video: {
            deviceId: selectedDeviceId,
            focusMode: "continuous", // 'continuous' 또는 'auto' 초점 설정
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.$refs.video.srcObject = stream;

        // 0.5초마다 바코드 인식 시도
        this.isScanning = true;
        this.scanBarcode();
      } catch (error) {
        console.error("카메라를 시작할 수 없습니다:", error);
      }
    },
    async scanBarcode() {
      if (!this.isScanning) return;

      try {
        const result = await this.codeReader.decodeOnceFromVideoDevice(this.$refs.video.srcObject);
        if (result) {
          this.barcodeId = result.text;
          console.log("인식된 바코드:", this.barcodeId);
          this.isScanning = false; // 바코드가 인식되면 스캔 중지
        }
      } catch (err) {
        console.error("바코드 인식 오류:", err.message);
      }

      // 0.5초 후 다시 스캔 시도
      if (this.isScanning) {
        setTimeout(() => {
          this.scanBarcode();
        }, 500);
      }
    },
    stopScanner() {
      if (this.codeReader) {
        this.codeReader.reset();
      }
      this.isScanning = false;

      const stream = this.$refs.video.srcObject;
      if (stream) {
        stream.getTracks().forEach(track => track.stop()); // 카메라 스트림 중지
      }
    }
  },
  mounted() {
    this.startScanner();
  },
  beforeUnmount() {
    this.stopScanner();
  }
};
</script>

<style scoped>
video {
  width: 100%;
  max-height: 400px;
  border: 1px solid #ddd;
}
</style>
