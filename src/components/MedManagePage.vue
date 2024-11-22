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
import UserService from "@/services/UserService"; // UserService 불러오기

export default {
  name: "MedicineManagement",
  data() {
    return {
      userId: 0, // 유저 식별 아이디
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

  async mounted() {
    this.userId = localStorage.getItem("userId"); // 유저 id 받아오기
    if (!this.userId) {
      console.error("로그인되지 않은 상태입니다.");
      return;
    }

    try {
      const response = await UserService.getUserInventory(this.userId);
      const inventoryData = response.data;

      // 약과 영양제를 구분하여 리스트에 저장
      this.mediList = inventoryData.filter((item) => item.type === "MEDICINE");
      this.suppList = inventoryData.filter((item) => item.type === "HEALTH_FOOD");
    } catch (error) {
      console.error("약/영양제 데이터를 불러오는 중 오류가 발생했습니다:", error);
    }
  },

  methods: {
    calenderClick() {
      this.$router.push("/mediCalendar"); // 캘린더 경로로 이동
    },
    toggleButtons() {
      this.isExpanded = !this.isExpanded;
    },
    handlePillClick() {
      this.$router.push("/searchByName"); // 약 검색 경로로 이동
    },
    handleSupplementClick() {
      this.$router.push("/searchByName"); // 영양제 검색 경로로 이동
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
      alert("정보 수정 기능");
      this.isModalOpen = false;
    },
    deleteItem() {
      alert("삭제 기능");
      this.isModalOpen = false;
    },
  },
};
</script>

<style scoped>
/* 기존 CSS 코드 유지 */
</style>
