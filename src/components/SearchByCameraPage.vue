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
      codeReader: null
    };
  },
  methods: {
    async startScanner() {
      this.codeReader = new BrowserMultiFormatReader();
      
      try {
        const videoInputDevices = await this.codeReader.listVideoInputDevices();

        // 후면 카메라를 찾기 위한 장치 선택
        const selectedDeviceId = videoInputDevices.find(device =>
          device.label.toLowerCase().includes('back')
        )?.deviceId || videoInputDevices[0].deviceId; // 후면 카메라가 없으면 첫 번째 카메라 선택

        this.codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          this.$refs.video,
          (result, err) => {
            if (result) {
              this.barcodeId = result.text;
              console.log("인식된 바코드:", this.barcodeId);
              this.stopScanner(); // 바코드 인식 후 스캔 중지
            }
            if (err) {
              console.error(err); // 오류 메시지 출력
            }
          }
        );
      } catch (error) {
        console.error("카메라를 시작할 수 없습니다:", error);
      }
    },
    stopScanner() {
      if (this.codeReader) {
        this.codeReader.reset();
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
