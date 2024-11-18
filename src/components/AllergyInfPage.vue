<template>
  <div class="allergy-log">
    <div class="date-picker">
      <div>
        <input type="date" v-model="startDate" />
      </div>
      <div>
        <span>~</span>
      </div>
      <div>
        <input type="date" v-model="endDate" />
      </div>
    </div>

    <div class="search-button">
      <button @click="fetchLogs">조회하기</button>
    </div>

    <div v-if="logs.length === 0" class="no-data">
      알레르기가 나타난 기간을 설정해 주세요
    </div>

    <div v-else class="logs-list">
      <div v-for="(log, index) in logs" :key="index" class="log-item">
        <div class="log-content">
          <h3>발생 일시</h3>
          <p>{{ log.date }} {{ log.startTime }} ~ {{ log.endTime }}</p>
          <h4>증상</h4>
          <div class="symptoms">
            <span v-for="(symptom, i) in log.symptoms" :key="i" class="tag">{{ symptom }}</span>
          </div>
        </div>
        <div class="log-image">
          <img :src="log.img" alt="알레르기 증상 사진" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startDate: '',
      endDate: '',
      logs: []
    };
  },
  methods: {
  fetchLogs() {
    if (!this.startDate || !this.endDate) {
      alert('시작일과 종료일을 입력하세요.');
      return;
    }
    fetch('/assets/testAllergyList.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('데이터를 불러오는 중 오류가 발생했습니다.');
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          const start = new Date(this.startDate);
          const end = new Date(this.endDate);
          this.logs = data.filter(item => {
            const logDate = new Date(item.date);
            return logDate >= start && logDate <= end;
          }).map(item => ({
            date: item.date,
            startTime: item.startTime,
            endTime: item.endTime,
            symptoms: item.symptoms,
            img: item.img
          }));
        } else {
          console.warn('데이터 형식이 올바르지 않습니다.');
        }
      })
      .catch(error => {
        console.error('데이터 불러오기 중 오류:', error);
        alert('데이터를 불러오는 중 문제가 발생했습니다.');
      });
  }
}

};
</script>

<style scoped>
.allergy-log {
  padding: 20px;
  padding-bottom: 150px; /* 네비게이션 바 여유 공간 추가 */
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.date-picker {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
}

.search-button {
  margin-bottom: 30px;
}

.date-picker input[type="date"] {
  padding: 10px;
  font-size: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 200px;
  height: 50px;
}

.search-button button {
  background-color: #ff7f50;
  color: white;
  padding: 20px 200px;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  cursor: pointer;
}

.search-button button:hover {
  background-color: #ff5733;
}

.no-data {
  text-align: center;
  color: #888;
  font-size: 20px;
  margin-top: 300px;
}

.logs-list {
  margin-top: 20px;
  width: 100%;
  max-width: 500px;
}

.log-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 500px;
  margin: 20px 0;
  transition: transform 0.2s;
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
  .allergy-log {
    padding: 5px;
    padding-bottom: 70px; 
  }

  .date-picker {
    gap: 5px;
  }

  .date-picker input[type="date"] {
    font-size: 18px; 
    width: 150px; 
    height: 50px; 
  }

  .search-button button {
    font-size: 18px; 
    padding: 15px 150px; 
  }

  .no-data {
    font-size: 15px; 
    margin-top: 150px; 
  }

  .logs-list {
    max-width: 95%; 
  }

  .log-item {
    width: 95%; 
    padding: 10px; 
  }

  .log-content h3, .log-content h4 {
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
