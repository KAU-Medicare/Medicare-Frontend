<template>
  <div>
    <div id="interactive" class="viewport"></div>
    <div v-if="barcodeId">인식된 ID: {{ barcodeId }}</div>
  </div>
</template>

<script>
import Quagga from 'quagga';

export default {
  data() {
    return {
      barcodeId: null,
    };
  },
  methods: {
    startScanner() {
      Quagga.init(
        {
          inputStream: {
            type: 'LiveStream',
            target: document.querySelector('#interactive'), // 카메라 피드가 표시될 요소
            constraints: {
              width: 640,
              height: 480,
              facingMode: 'environment' // 후면 카메라 사용
            },
          },
          decoder: {
            readers: ['ean_reader', 'code_128_reader'] // 사용할 바코드 형식
          }
        },
        (err) => {
          if (err) {
            console.error(err);
            return;
          }
          Quagga.start();
        }
      );

      // 바코드가 감지될 때 호출되는 이벤트 리스너
      Quagga.onDetected((data) => {
        this.barcodeId = data.codeResult.code; // 바코드 값을 설정
        Quagga.stop(); // 바코드가 감지되면 스캔 중지
      });
    }
  },
  mounted() {
    this.startScanner();
  },
  beforeUnmount() {
    Quagga.stop(); // 컴포넌트가 제거될 때 스캔 중지
  }
};
</script>

<style scoped>
.viewport {
  width: 100%;
  max-width: 640px;
  height: auto;
  border: 1px solid #ddd;
}
</style>
