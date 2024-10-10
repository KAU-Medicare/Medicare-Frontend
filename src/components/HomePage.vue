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
  height: 100vh;
  width: 100vw;
  overflow-y: auto; 
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: white;
}

.container::-webkit-scrollbar {
  display: none; /* 크롬, 사파리, 엣지 등 Webkit 기반 브라우저에서 스크롤바 숨기기 */
}


.search-bar {
  width: 100%;
  display: flex; 
  justify-content: center;
  padding-bottom: 2.5vh;
  padding-top: 2.5vh;
  height: 7vh;
  position: fixed;
  z-index: 1;
  background: white;
  border-bottom: 2px solid #ccc;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
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
  border-color: #FFBA94; 
}

.search-button {
  padding: 12px 20px; 
  margin-left: 10px; 
  border: none;
  border-radius: 8px;
  background-color: #FFBA94; 
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #FF8947; 
}

.medicine-list {
  width: 100%;
  display: flex; 
  justify-content: center;
  padding-top: 14.5vh; /* 서치바 크기 */
  padding-bottom: 13vh;
  

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
  flex-direction: row;
  align-items: center;
  max-width: 400px; 
  padding: 15px; 
  background-color: #fff; 
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%; 
  margin: 5px;
  border: 1px solid #ccc;
}

.medicine-card:hover {
  transform: translateY(-5px); 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); 
}

.medicine-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 10%;
  flex: 1;
}

.medicine-info {
  display: flex;
  flex-direction: column; 
  align-items: left;
  text-align: left; 
  border-left: 1px solid #ccc;
  margin-left: 10px;
  padding-left: 10px;
  flex: 3;
}

.medicine-info h3 {
  font-size: 18px;
  margin-bottom: 5px;
  color: #333; 
}

.medicine-info p {
  font-size: 14px;
  align-items: right;
  text-align: right; 
  color: #666; 
}

.no-results {
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
  color: #999; 
}
</style>
