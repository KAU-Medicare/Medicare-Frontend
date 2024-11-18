<template>
  <div class="container">
    <!-- 카드 박스 -->
    <div class="card"></div>

    <!-- 이미지 박스 -->
    <div class="image-container">
      <!-- 주황색 박스 -->
      <div class="overlay-box">
        <p class="overlay-text">알레르기원으로 다음이 가장 유력해요:</p>
        <p class="overlay-text">
          <!-- 동적으로 처리된 알레르기 원인 텍스트 출력 -->
          <span v-html="allergyCauseText"></span>
        </p>
      </div>
      
      <!-- 이미지 위 텍스트 영역 -->
      <div class="image-text">
        <p class="image-text-content">이미지 위의 텍스트를 작성하세요</p>
      </div>
      
      <img src="@/assets/medDoctorBackground.png" alt="Doctor Background" class="image" />
    </div>

    <!-- 버튼 -->
    <button class="action-button" @click="goToHome">다른 증상 보러가기</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 더미 데이터 (알레르기 관련)
      allergyData: [
        {
          medSuppList: ["타이레놀", "오메가3"],
          cause: [
            "타이레놀과 오메가3를 같이 먹었을 때 증상이 발현되었어요",
            "타이레놀과 오메가3를 같이 먹었을 때 발생할 수 있는 발진, 호흡곤란이 발현했어요"
          ]
        }
      ]
    };
  },
  computed: {
    // 알레르기 원인 텍스트 처리
    allergyCauseText() {
      const medSuppList = this.allergyData[0].medSuppList;
      let result = "";

      if (medSuppList.length === 0) {
        result = "타 식품과의 상호작용";
      } else if (medSuppList.length === 1) {
        result = `<span style="color: white;">${medSuppList[0]}</span>`;
      } else {
        // 병용 텍스트 처리: 모든 약물에 대해 흰색으로 스타일링
        result = medSuppList
          .map(item => `<span style="color: white;">${item}</span>`)
          .join('<span style="color: white;">, </span>') + " <span style='color: white;'>병용</span>";
      }

      return result;
    }
  },
  methods: {
    // 버튼 클릭 시 루트 경로로 이동
    goToHome() {
      this.$router.push('/');  // Vue Router를 사용하여 '/' 경로로 이동
    }
  }
};
</script>

<style scoped>
/* 전체 페이지 크기 설정, 스크롤 가능하도록 overflow 설정 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden; /* 가로 스크롤 방지 */
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 상단에 배치 */
  width: 100%;
  min-height: 100vh; /* 화면 높이를 최소한으로 사용 */
  padding: 20px; /* 여백 추가 */
  box-sizing: border-box; /* 패딩이 포함되도록 */
  flex-grow: 1; /* 남은 공간을 채우도록 설정 */
}

.card {
  width: 100%;
  max-width: 600px; /* 최대 가로 길이 설정 */
  height: 150px; /* 카드의 높이 조정 */
  background-color: lightgray;
  margin-bottom: 20px;
}

.image-container {
  width: 100%;
  max-width: 600px; /* 카드와 동일한 최대 가로 길이 */
  position: relative;
  aspect-ratio: 3 / 4; /* 3:4 비율 */
  overflow: hidden;
}

.overlay-box {
  position: absolute;
  top: 2%; /* 박스를 위에서 2% 아래로 내려줍니다 (더 위로 올림) */
  left: 50%; /* 가로 가운데로 배치 */
  transform: translateX(-50%); /* 정확히 가운데로 정렬 */
  width: 95%; /* 이미지의 95%로 가로 길이 설정 (더 넓게) */
  height: 30%; /* 세로 길이 줄이기 */
  background-color: #e65100; /* 진한 주황색 */
  display: flex;
  flex-direction: column; /* 텍스트가 여러 줄로 나올 수 있도록 설정 */
  align-items: flex-start; /* 왼쪽 정렬 */
  justify-content: flex-start;
  color: black;
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 15px; /* 모서리 둥글게 */
  z-index: 1; /* 이미지 위에 표시 */
}

.overlay-text {
  text-align: left; /* 텍스트를 왼쪽으로 정렬 */
  margin-left: 10px; /* 왼쪽 여백 추가 */
  color: black;
  margin-bottom: 5px; /* 줄 간격 추가 */
}

.image-text {
  position: absolute;
  top: 42%; /* 이미지 텍스트 배치 */
  left: 5%; /* PC 화면에서는 5% */
  transform: translate(0%, -50%); /* 수평으로 0% 이동, 수직으로 중앙 정렬 */
  color: black;
  font-size: 24px;
  font-weight: bold;
  text-align: left; /* 텍스트를 왼쪽으로 정렬 */
  z-index: 2; /* 주황색 박스보다 위에 표시 */
}

/* 모바일 화면에서 텍스트 크기 줄이기 */
@media (max-width: 600px) {
  .image-text {
    font-size: 16px; /* 텍스트 크기 줄이기 */
    left: 5%; /* 모바일에서 5%로 이동 */
  }
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: bottom; /* 아랫부분을 보존 */
}

.action-button {
  margin-top: 40px; /* 버튼과 이미지 사이 간격 늘리기 */
  width: 100%;
  max-width: 600px; /* 카드와 동일한 최대 가로 길이 */
  padding: 15px;
  background-color: orange;
  border: none;
  color: white;
  font-size: 18px; /* 버튼 글씨 크기 키우기 */
  cursor: pointer;
  margin-bottom: 80px; /* 버튼 하단 여백 */
  border-radius: 10px; /* 버튼 모서리 둥글게 */
}
</style>