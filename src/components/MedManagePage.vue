<template>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>복약 관리</h1>
      <button class="calendar-btn">
        <img src="@/assets/calendar.png" @click="calenderClick" alt="calendar" />
      </button>
    </div>

    <!-- Medication Section -->
    <section class="section">
      <h2>복용 중인 약</h2>
      <MedManageCard
        v-for="(item, index) in mediList"
        :key="index"
        :item="item"
        @click="toggleModal"
      />
    </section>

    <!-- Supplement Section -->
    <section class="section">
      <h2>복용 중인 영양제</h2>
      <MedManageCard
        v-for="(item, index) in suppList"
        :key="index"
        :item="item"
        @click="toggleModal"
      />
    </section>

    <!-- Add Button and Sub Buttons -->
    <div class="button-container">
      <button
        v-if="isExpanded"
        class="sub-btn supplement-btn"
        @click="handleSupplementClick"
      >
        <img src="@/assets/heart.png" alt="Supp" class="icon-image" />
      </button>

      <button
        v-if="isExpanded"
        class="sub-btn pill-btn"
        @click="handlePillClick"
      >
        <img src="@/assets/pill.png" alt="pill" class="icon-image" />
      </button>

      <button @click="toggleButtons" class="add-btn">
        <span v-if="!isExpanded">+</span>
        <span v-else>-</span>
      </button>

      <!-- Edit/Delete Modal -->
      <div v-if="isModalOpen" class="modal-overlay" @click="toggleModal">
        <div
          class="modal-content"
          @click.stop
          :style="{ top: modalPosition.top + 'px', left: modalPosition.left + 'px' }"
        >
          <p @click="editInfo">정보 수정</p>
          <p @click="deleteItem">삭제</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MedManageCard from "@/components/cards/MedManageCard.vue";

export default {
  name: "MedicineManagement",
  data() {
    return {
      mediList: [], // 약 json이 담길 변수
      suppList: [], // 영양제 json이 담길 변수
      isExpanded: false, // 버튼 확장 상태
      isModalOpen: false, // 모달 상태
      modalPosition: { top: 0, left: 0 }, // 모달 위치 초기화
    };
  },

  components: {
    MedManageCard,
  },

  mounted() {
    this.userName = localStorage.getItem("userName"); // 카카오조인에서 닉네임 받아오기

    fetch("/assets/mediList.json") // 약 리스트 가져오기
      .then((response) => {
        if (!response.ok) {
          throw new Error("약 리스트를 가져올 수 없습니다");
        }
        return response.json();
      })
      .then((mediListData) => {
        this.mediList = mediListData;

        return fetch("/assets/suppList.json"); // 영양제 리스트 가져오기
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error("영양제 리스트를 가져올 수 없습니다");
        }
        return response.json();
      })
      .then((suppListData) => {
        this.suppList = suppListData;
      })
      .catch((error) => {
        console.error("오류 발생 : ", error);
      });
  },

  methods: {
    calenderClick() { // 캘린더 버튼 클릭
      this.$router.push("/mediCalendar"); // /mediCalendar 경로로 이동
    },
    toggleButtons() {
      this.isExpanded = !this.isExpanded;
    },
    handlePillClick() {
      this.$router.push("/searchByName"); // /mediCalendar 경로로 이동
    },
    handleSupplementClick() {
      this.$router.push("/searchByName"); // 영양제 버튼 클릭 시 동작
    },
    toggleModal(event) {
      const offsetY = 0; // 모달을 클릭 위치 위로 띄울 거리 (조정 가능)
      this.modalPosition = {
        top: event.clientY + window.scrollY - offsetY,
        left: event.clientX + window.scrollX,
      };
      this.isModalOpen = !this.isModalOpen; // 모달 열고 닫기
    },
    editInfo() {
      // 정보 수정 동작
      alert("정보 수정 기능");
      this.isModalOpen = false;
    },
    deleteItem() {
      // 삭제 동작
      alert("삭제 기능");
      this.isModalOpen = false;
    },
  },
};
</script>

<style scoped>
/* Layout */
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1vh 5vw 11vh 5vw;
  max-width: 600px;
  width: 90vw;
  margin: auto;
  overflow-y: auto;
  max-height: 80%;
}

.header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 4vh;
  font-weight: bold;
}

.calendar-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  width: 7vh; /* 이미지 크기를 원하는 크기로 조정 */
  height: auto;
}

.section {
  width: 100%;
  margin-bottom: 20px;
}

.button-container {
  position: fixed;
  bottom: 18vh;
  right: 10vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.add-btn {
  background-color: #ff8947;
  color: white;
  font-size: 4vh;
  border: none;
  border-radius: 50%;
  width: 8vh;
  height: 8vh;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  opacity: 0.9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sub-btn {
  background-color: #ffb47a;
  color: black;
  font-size: 24px;
  border: none;
  border-radius: 50%;
  width: 8vh;
  height: 8vh;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease;
}

.pill-btn {
  transform: translateY(0);
}

.supplement-btn {
  transform: translateY(0);
}

.icon-image {
  width: 4vh; /* 이미지 크기를 원하는 크기로 조정 */
  height: 4vh;
  margin: 0;
  padding-top: 0.8vh;
}

button:focus {
  outline: none;
}

.calendar-btn img {
  width: 100%; /* 버튼 크기에 맞춰 이미지 크기 조정 */
  height: auto;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: absolute;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  padding: 10px;
  width: 100px;
  z-index: 1001; /* 모달이 다른 요소들 위에 표시되도록 설정 */
  transform: translateY(-100%); /* 모달을 클릭한 위치 바로 위로 올림 */
}

.modal-content p {
  margin: 0;
  padding: 10px;
  cursor: pointer;
  text-align: center;
}

.modal-content p:hover {
  background-color: #f0f0f0;
}
</style>