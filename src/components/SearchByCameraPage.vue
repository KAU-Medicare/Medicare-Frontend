<template>
  <div>
    <input type="file" accept="image/*" capture="environment" @change="onFileSelected">
    <div v-if="imageUrl">
      <img :src="imageUrl" alt="Captured image">
      <p v-if="barcodeResult">인식된 바코드: {{ barcodeResult }}</p>
    </div>
  </div>
</template>

<script>
import { BrowserMultiFormatReader } from '@zxing/library';

export default {
  data() {
    return {
      imageUrl: null,
      barcodeResult: null,
      codeReader: new BrowserMultiFormatReader(), // 인스턴스 생성
    };
  },
  methods: {
    onFileSelected(event) {
      const file = event.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        const img = new Image();
        img.src = imageUrl;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          // 이미지 전처리: 밝기와 대비 조정
          ctx.filter = 'contrast(150%) brightness(120%)';
          ctx.drawImage(img, 0, 0);

          // 전처리된 이미지를 미리보기로 설정
          this.imageUrl = canvas.toDataURL();

          // 바코드 인식 시도
          this.decodeBarcode(canvas);
        };
      }
    },
    async decodeBarcode(canvas) {
      try {
        const result = await this.codeReader.decodeFromImage(canvas); // 전처리된 canvas 전달
        this.barcodeResult = result.text; // 바코드 인식 결과 저장
        console.log("인식된 바코드:", this.barcodeResult);
      } catch (error) {
        console.error("바코드를 인식할 수 없습니다:", error.message);
        this.barcodeResult = "바코드를 인식할 수 없습니다.";
      }
    }
  },
};
</script>

<style scoped>
img {
  width: 100%;
  max-width: 400px;
  margin-top: 10px;
}
</style>
