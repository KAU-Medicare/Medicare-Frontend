<template> 
  <button class="back-button" @click="backClick()">←</button>
  <div class="container">
    <h1 style="margin: 0">바코드로 검색</h1>
    <div class="image-container" @click="triggerFileInput">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref="fileInput"
        @change="onFileSelected"
        style="display: none;"
      />
      <img v-if="selectedImage" :src="selectedImage" alt="Selected Image" class="preview-image" />
      <div v-else class="placeholder">
        <span>+</span>
      </div>
    </div>

    <p v-if="barcodeResult" class="barcode-text">번호: {{ barcodeResult }}</p>
    <p v-else class="barcode-text">바코드를 화면 중앙에 위치한 후 찍어주세요</p>

    <a href="#" @click.prevent="showManualInput = !showManualInput" class="manual-input-link">바코드 번호 직접 입력하기</a>

    <div v-if="showManualInput" class="manual-input-container">
      <input type="text" v-model="manualBarcode" placeholder="바코드 번호 입력" />
    </div>
  </div>
  <button class="search-button" @click="searchMedicine">검색하기</button>
</template>

<script>
import UserService from "@/services/UserService";
import { BrowserMultiFormatReader } from "@zxing/library";

export default {
  data() {
    return {
      barcodeResult: null,
      selectedImage: null,
      showManualInput: false,
      manualBarcode: "",
      reader: new BrowserMultiFormatReader(),
    };
  },
  methods: {
    backClick() {
      this.$router.push("/mediCalendar");
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    async onFileSelected(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedImage = URL.createObjectURL(file);
        try {
          this.barcodeResult = await this.scanBarcode(file, "Selected Image");
        } catch (error) {
          console.warn("바코드를 인식할 수 없습니다.", error);
          this.barcodeResult = "바코드를 인식할 수 없습니다.";
        }
      }
    },
    scanBarcode(file, description) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          this.reader
            .decodeFromImageElement(img)
            .then((result) => resolve(result.text))
            .catch(() => reject(`${description} 인식 실패`));
        };
      });
    },
    async searchMedicine() {
      const barcode = this.manualBarcode || this.barcodeResult;

      if (!barcode) {
        alert("바코드를 입력하거나 이미지를 스캔하세요.");
        return;
      }

      try {
        // 표준 코드로 약 정보 조회
        const response = await UserService.getMedicineByStandardCode(barcode);
        const medicine = response.data;

        // 약 정보 페이지로 이동
        this.$router.push({
          path: "/medInfo",
          query: {
            id: medicine.id,
            name: medicine.itemName,
            type: "pill", // 필요한 경우 변경
          },
        });
      } catch (error) {
        console.error("약 정보 조회 실패:", error.response?.data || error.message);
        alert("약 정보를 조회할 수 없습니다. 올바른 바코드를 입력하세요.");
      }
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}

.back-button {
  position: fixed;
  font-size: 24px;
  background: none;
  border: none;
  top: 3vh;
  left: 2vw;
  cursor: pointer;
}

.image-container {
  width: 30vh;
  height: 30vh;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: 17vh 0 0 0;
  border-radius: 8px;
  overflow: hidden;
  font-family: Arial, sans-serif;
}

.placeholder {
  font-size: 8vh;
  color: #9e9e9e;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.barcode-text {
  margin: 8px 0;
  color: #333;
}

.manual-input-link {
  color: #ff5722;
  text-decoration: underline;
  cursor: pointer;
  margin-bottom: 1vh;
}

.manual-input-container {
  margin: 8px 0;
}

.manual-input-container input {
  width: 100%;
  padding: 8px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-button {
  background-color: #ff8947;
  width: 90%;
  height: 7vh;
  color: white;
  padding: 1vh 0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  max-width: 600px;
  position: fixed;
  bottom: 3vh;
  left: 50%;
  transform: translateX(-50%);
}
</style>
