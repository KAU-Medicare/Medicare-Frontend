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
          <img src="" :alt="medicine.id" class="medicine-image" />
          <div class="medicine-info">
            <h3>{{ medicine.itemName }}</h3>
            <p>{{ medicine.entpName }}</p>
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
import UserService from "@/services/UserService";

export default {
  data() {
    return {
      searchQuery: '',
      medicines: [],
      filteredMedicines: []
    };
  },
  async mounted() {
     try {
      // ID 1부터 20까지의 ID 배열 생성
      const ids = Array.from({ length: 20 }, (_, i) => i + 1);
      
      // 모든 요청을 병렬로 실행
      const requests = ids.map(id => UserService.getMedInfo(id));

      // 요청 결과를 모두 가져와서 mediList에 저장
      const responses = await Promise.all(requests);
      this.medicines = responses.map(response => response.data);
      this.filteredMedicines = this.medicines;

      console.log("데이터 로드 완료:", this.medicines);
    } catch (error) {
      console.error("데이터를 가져오는 중 오류 발생:", error);
    }
  },
  methods: {
    filterMedicines() {
      const query = this.searchQuery; 
      this.filteredMedicines = this.medicines.filter((medicine) =>
        medicine.itemName.includes(query)
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
  /* max-width: 400px;  */
  padding: 15px; 
  background-color: #fff; 
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 80%; 
  height: 10vh;
  margin: 5px;
  border: 1px solid #ccc;
}

.medicine-card:hover {
  transform: translateY(-5px); 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); 
}

.medicine-image {
  height: inherit;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 10%;
}

.medicine-info {
  display: flex;
  flex-direction: column; 
  height: 100%;
  align-items: left;
  text-align: left; 
  border-left: 1px solid #ccc;
  margin-left: 10px;
  padding-left: 10px;
  flex: 1;
}

.medicine-info h3 {
  font-size: 18px;
  margin-top: 0;
  color: #333; 
  flex: 1;
}

.medicine-info p {
  font-size: 14px;
  display: flex;
  justify-content: flex-end; /* 수평 방향으로 오른쪽 정렬 */
  align-items: flex-end; /* 수직 방향으로 아래쪽 정렬 */
  margin-bottom: 0;
  color: #666; 
  flex: 1;
}

.no-results {
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
  color: #999; 
}
</style>
