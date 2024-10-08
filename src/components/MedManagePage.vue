<template>
  <div class="medManage">
    <div class="camera-box" @click="openCamera">
      <span class="plus">+</span>
    </div>
    <video ref="video" class="camera" autoplay></video>
    <p class="instruction">위의 버튼을 눌러 바코드를 찍어주세요</p>
  </div>
</template>

<script>
export default {
  name: 'MedManagePage',
  methods: {
    openCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints = { video: true }; // 비디오 스트림만 요청
        navigator.mediaDevices.getUserMedia(constraints)
          .then((stream) => {
            console.log('Camera opened', stream);
            // 비디오 요소에 스트림 연결
            this.$refs.video.srcObject = stream;
          })
          .catch((error) => {
            console.error('Error accessing the camera', error);
            alert('카메라에 접근할 수 없습니다. 권한을 확인하세요.');
          });
      } else {
        console.error('getUserMedia not supported in this browser.');
        alert('카메라 접근이 지원되지 않는 브라우저입니다. 최신 브라우저를 사용해주세요.');
      }
    }
  }
};
</script>

<style>
.medManage {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: white; /* 배경을 흰색으로 변경 */
}

.camera-box {
  width: 200px; /* 원하는 크기로 조정 */
  height: 200px; /* 원하는 크기로 조정 */
  background-color: lightgray; /* 박스를 회색으로 변경 */
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid black;
  cursor: pointer;
}

.plus {
  font-size: 48px; /* 원하는 크기로 조정 */
  color: black; /* 플러스 버튼을 검정색으로 변경 */
}

.camera {
  display: none; /* 비디오 요소를 기본적으로 숨김 */
  width: 100%; /* 원한다면 비디오 크기 조정 */
  height: auto;
}

.instruction {
  margin-top: 20px; /* 문구와 박스 사이의 간격 */
  font-size: 18px; /* 문구의 글씨 크기 */
}
</style>

입니다!