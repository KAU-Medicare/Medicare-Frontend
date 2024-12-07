<template>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>복약 관리</h1>
      <button class="calendar-btn">
        <img
          src="@/assets/calendar.png"
          @click="calenderClick"
          alt="calendar"
        />
      </button>
    </div>

    <!-- Medication Section -->
    <section class="section">
      <h2>복용 중인 약</h2>
      <MedManageCard
        v-for="(item, index) in mediList"
        :key="index"
        :item="item"
        @click="toggleModal($event, item)"
      />
    </section>

    <!-- Supplement Section -->
    <section class="section">
      <h2>복용 중인 영양제</h2>
      <MedManageCard
        v-for="(item, index) in suppList"
        :key="index"
        :item="item"
        @click="toggleModal($event, item)"
      />
    </section>

    <!-- Add Button and Sub Buttons -->
    <div class="button-container">
      <button
        v-if="isExpanded"
        class="sub-btn supplement-btn"
        @click="openSupplementOptionsModal"
      >
        <img src="@/assets/heart.png" alt="Supp" class="icon-image" />
      </button>

      <button
        v-if="isExpanded"
        class="sub-btn pill-btn"
        @click="openPillOptionsModal"
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
          :style="{
            top: modalPosition.top + 'px',
            left: modalPosition.left + 'px',
          }"
        >
          <p @click="editInfo">정보 수정</p>
          <p @click="deleteItem">삭제</p>
        </div>
      </div>

      <!-- Supplement Options Modal -->
      <div
        v-if="isSupplementOptionsModalOpen"
        class="modal-overlay"
        @click="closeSupplementOptionsModal"
      >
        <div
          class="modal-content"
          @click.stop
          :style="{
            top: modalPosition.top + 'px',
            left: modalPosition.left + 'px',
          }"
        >
          <p @click="addSupplementByName">이름으로<br>추가하기</p>
        </div>
      </div>

      <!-- Pill Options Modal -->
      <div
        v-if="isPillOptionsModalOpen"
        class="modal-overlay"
        @click="closePillOptionsModal"
      >
        <div
          class="modal-content"
          @click.stop
          :style="{
            top: modalPosition.top + 'px',
            left: modalPosition.left + 'px',
          }"
        >
          <p @click="addPillByBarcode">바코드로<br>추가하기</p>
          <p @click="addPillByName">이름으로<br>추가하기</p>
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
      isSupplementOptionsModalOpen: false, // 영양제 추가 옵션 모달 상태
      isPillOptionsModalOpen: false, // 약 추가 옵션 모달 상태
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
      this.suppList = inventoryData.filter(
        (item) => item.type === "HEALTH_FOOD"
      );
    } catch (error) {
      console.error(
        "약/영양제 데이터를 불러오는 중 오류가 발생했습니다:",
        error
      );
    }
  },

  methods: {
    calenderClick() {
      this.$router.push("/mediCalendar"); // 캘린더 경로로 이동
    },
    toggleButtons() {
      this.isExpanded = !this.isExpanded;
    },
    openPillOptionsModal(event) {
      this.isPillOptionsModalOpen = true;
      this.modalPosition = {
        top: event.clientY + window.scrollY,
        left: event.clientX + window.scrollX,
      };
    },
    closePillOptionsModal() {
      this.isPillOptionsModalOpen = false;
    },
    openSupplementOptionsModal(event) {
      this.isSupplementOptionsModalOpen = true;
      this.modalPosition = {
        top: event.clientY + window.scrollY,
        left: event.clientX + window.scrollX,
      };
    },
    closeSupplementOptionsModal() {
      this.isSupplementOptionsModalOpen = false;
    },
    addPillByBarcode() {
      this.$router.push({ path: "/searchByCamera", query: { type: "pill" } });
    },
    addPillByName() {
      this.$router.push({ path: "/searchByName", query: { type: "pill" } });
    },
    addSupplementByBarcode() {
      this.$router.push({
        path: "/searchByCamera",
        query: { type: "supplement" },
      });
    },
    addSupplementByName() {
      this.$router.push({
        path: "/searchByName",
        query: { type: "supplement" },
      });
    },
    toggleModal(event, item) {
      const offsetY = 0; // 모달을 클릭 위치 위로 띄울 거리 (조정 가능)
      this.modalPosition = {
        top: event.clientY + window.scrollY - offsetY,
        left: event.clientX + window.scrollX,
      };
      this.selectedItem = item; // 모달이 열린 항목을 저장
      this.isModalOpen = !this.isModalOpen; // 모달 열고 닫기
    },
    async deleteItem() {
      if (!this.selectedItem) {
        alert("삭제할 항목이 선택되지 않았습니다.");
        return;
      }

      try {
        // UserService를 통해 API 호출
        await UserService.deleteInventory(this.userId, this.selectedItem.id);

        // 약 또는 영양제 리스트에서 해당 항목 제거
        if (this.selectedItem.type === "MEDICINE") {
          this.mediList = this.mediList.filter(
            (item) => item.id !== this.selectedItem.id
          );
        } else if (this.selectedItem.type === "HEALTH_FOOD") {
          this.suppList = this.suppList.filter(
            (item) => item.id !== this.selectedItem.id
          );
        }

        alert("삭제되었습니다.");
      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
        alert("삭제하는 데 문제가 발생했습니다.");
      } finally {
        this.isModalOpen = false; // 모달 닫기
      }
    },
    editInfo() {
  this.$router.push({
    path: "/medInfo",
    query: {
      id: this.selectedItem.id, // 선택된 약 또는 영양제의 ID
      name: this.selectedItem.nickname || this.selectedItem.itemName || this.selectedItem.product, // 이름 정보
      type: this.selectedItem.type === "MEDICINE" ? "pill" : "supplement", // 타입 정보
      edit: true, // 수정 플래그
    },
  });
  this.isModalOpen = false; // 모달 닫기
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
  transform: translate(-100%, -100%); /* X와 Y 방향으로 모두 이동 */
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
