<template>
    <div class="log-item">
      <div class="log-content">
        <h3>발생 일시</h3>
        <p>{{ log.date }} {{ log.startTime }} ~ {{ log.endTime }}</p>
        <h4>증상</h4>
        <div class="symptoms">
          <span v-for="(symptom, i) in log.symptoms" :key="i" class="tag">
            {{ symptom }}
          </span>
        </div>
      </div>
      <div class="log-image">
        <!-- Base64 이미지를 출력 -->
        <img :src="`data:image/jpeg;base64,${log.img}`" alt="알레르기 증상 사진" />
      </div>
    </div>
  </template>
    
  <script>
  export default {
    props: {
      log: {
        type: Object,
        required: true,
      },
    },
  };
  </script>
  
  
<style scoped>
.log-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%; /* 부모 컨테이너의 너비에 맞춤 */
  max-width: 600px; /* 최대 너비 600px로 제한 */
  margin: 20px auto; /* 중앙 정렬 */
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
}

.log-item:hover {
  transform: translateY(-2px);
}

.log-content {
  flex: 1;
  padding-right: 15px;
}

.log-content h3 {
  margin: 0;
  font-size: 25px;
  font-weight: bold;
}

.log-content p {
  margin: 5px 0;
  font-size: 15px;
  color: #555;
}

.log-content h4 {
  margin: 10px 0;
  font-size: 25px;
  font-weight: bold;
}

.symptoms {
  display: flex;
  gap: 5px;
}

.tag {
  background-color: #f3f0dc;
  color: #6e5e2e;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 10px;
}

.log-image img {
  width: 150px;
  height: 150px;
  border-radius: 10px;
  object-fit: cover;
}

@media (max-width: 768px) {
  .log-item {
    width: 100%; /* 부모 컨테이너 너비에 맞춤 */
    max-width: 100%; /* 작은 화면에서 최대 너비 제한 제거 */
    padding: 10px;
  }

  .log-content h3,
  .log-content h4 {
    font-size: 15px;
  }

  .log-content p {
    font-size: 10px;
  }

  .log-image img {
    width: 100px;
    height: 100px;
  }
}

</style>