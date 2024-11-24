<template>
  <div class="container">
    <div class="search-bar">
      <!-- 검색창 -->
      <input
        v-model="searchQuery"
        placeholder="찾고 있는 약 및 영양제가 있나요?"
        @keypress.enter="fetchMedicines"
      />
      <!-- 검색 버튼 -->
      <button class="search-button" @click="fetchMedicines">검색</button>
    </div>

    <div class="medicine-list">
      <!-- 검색 결과 -->
      <div v-if="filteredMedicines.length > 0" class="medicine-grid">
        <div
          v-for="medicine in filteredMedicines"
          :key="medicine.id"
          class="medicine-card"
          @click="goToMedInfo(medicine.id, medicine.itemName || medicine.product)"
        >
          <img
            src="@/assets/navBtnImg/nutriSuppBtn.png"
            :alt="medicine.id"
            class="medicine-image"
          />
          <div class="medicine-info">
            <h3>{{ medicine.itemName || medicine.product }}</h3>
            <p>{{ medicine.entpName || medicine.enterprise }}</p>
          </div>
        </div>
      </div>
      <!-- 검색 결과 없을 때 -->
      <div v-else class="no-results">
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
      searchQuery: "", // 검색어
      filteredMedicines: [], // 검색 결과
      type: this.$route.query.type || "pill", // 기본값은 'pill'로 설정
    };
  },
  methods: {
    // 약 정보 페이지로 이동
    goToMedInfo(medicineId, medicineName) {
      this.$router.push({
        path: "/medInfo",
        query: {
          id: medicineId,
          name: medicineName,
          type: this.type, // 'pill' 또는 'supplement' 전달
        },
      });
    },

    // 검색 실행
    async fetchMedicines() {
      if (!this.searchQuery.trim()) {
        alert("검색어를 입력해주세요.");
        return;
      }

      try {
        let response;
        if (this.type === "pill") {
          // 약 검색
          response = await UserService.searchMedicines(this.searchQuery);
          this.filteredMedicines = response.data.map((item) => ({
            id: item.id,
            itemName: item.itemName, // 약의 제품명
            entpName: item.entpName, // 제조사
            itemSeq: item.itemSeq, // 추가 필드(필요 시)
          }));
        } else if (this.type === "supplement") {
          // 영양제 검색
          response = await UserService.searchHealthFoods(this.searchQuery);
          this.filteredMedicines = response.data.map((item) => ({
            id: item.id,
            product: item.product, // 영양제 제품명
            enterprise: item.enterprise, // 제조사
            statementNo: item.statementNo, // 식품 번호
          }));
        }
      } catch (error) {
        console.error("검색 중 오류 발생:", error);
        alert("검색하는 중 문제가 발생했습니다.");
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
  max-width: 600px;
  display: flex;
  justify-content: center;
  padding-bottom: 2.5vh;
  padding-top: 2.5vh;
  height: 7vh;
  position: fixed;
  z-index: 1;
  background: white;
  border-bottom: 2px solid #ccc;
}

.search-bar input {
  width: 70%;
  max-width: 600px;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
}

.search-bar input:focus {
  border-color: #ffba94;
}

.search-button {
  padding: 12px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 8px;
  background-color: #ffba94;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color: #ff8947;
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
  max-width: 550px;
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
  font-size: 2vh;
  margin: 0;
  color: #333;
  flex: 1;
}

.medicine-info p {
  font-size: 1.5vh;
  display: flex;
  justify-content: flex-end; /* 수평 방향으로 오른쪽 정렬 */
  align-items: flex-end; /* 수직 방향으로 아래쪽 정렬 */
  margin: 0;
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