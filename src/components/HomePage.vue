<template>
  <div class="container">
    <div class="search-bar">
      <input
        v-model="searchQuery"
        placeholder="찾고 있는 약 및 영양제가 있나요?"
        @input="filterMedicines"
      />
      <button class="search-button" @click="filterMedicines">검색</button>
    </div>

    <div class="medicine-list">
      <div v-if="searchQuery && filteredMedicines.length > 0" class="medicine-grid">
        <div v-for="medicine in filteredMedicines" :key="medicine.id" class="medicine-card">
          <img :src="medicine.img" alt="의약품 이미지" class="medicine-image" />
          <div class="medicine-info">
            <h3>{{ medicine.name }}</h3>
            <p>{{ medicine.from }}</p>
          </div>
        </div>
      </div>
      <div v-else-if="searchQuery" class="no-results">
        <p>검색 결과가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      medicines: [],
      filteredMedicines: []
    };
  },
  mounted() {
    fetch('/assets/test.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        this.medicines = data;
        this.filteredMedicines = data; 
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  },
  methods: {
    filterMedicines() {
      const query = this.searchQuery.toLowerCase(); 
      this.filteredMedicines = this.medicines.filter((medicine) =>
        medicine.name.toLowerCase().includes(query) 
      );
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: flex-start;
  height: calc(100vh - 60px); /* 실제 내비게이션 바 높이에 맞춰 조정 */
  width: 100vw; 
  padding: 20px; 
  padding-bottom: 100px; /* 내비게이션 바의 높이에 맞춰 패딩 추가 */
  overflow-y: auto; /* 스크롤 가능하도록 설정 */
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #f0f8ff 30%, #e6e6fa 100%); 
}

.search-bar {
  width: 100%;
  display: flex; 
  justify-content: center;
  margin-bottom: 20px; 
}

.search-bar input {
  width: 70%; 
  max-width: 400px; 
  padding: 12px; 
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
}

.search-bar input:focus {
  border-color: #007bff; 
}

.search-button {
  padding: 12px 20px; 
  margin-left: 10px; 
  border: none;
  border-radius: 8px;
  background-color: #007bff; 
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #0056b3; 
}

.medicine-list {
  width: 100%;
  display: flex; 
  justify-content: center; 
}

.medicine-grid {
  display: flex; 
  flex-direction: column; 
  align-items: center;
  gap: 10px; 
  width: 100%; 
}

.medicine-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px; 
  background-color: #fff; 
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 90%; 
  max-width: 300px; 
  margin: 5px 0; 
}

.medicine-card:hover {
  transform: translateY(-5px); 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); 
}

.medicine-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-bottom: 10px;
  border-radius: 50%; 
}

.medicine-info {
  display: flex;
  flex-direction: column; 
  align-items: center; 
  text-align: center; 
}

.medicine-info h3 {
  font-size: 18px;
  margin-bottom: 5px;
  color: #333; 
}

.medicine-info p {
  font-size: 14px;
  color: #666; 
}

.no-results {
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
  color: #999; 
}
</style>
