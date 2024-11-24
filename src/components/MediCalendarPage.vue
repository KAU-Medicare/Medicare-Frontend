<template>
  <div class="container">
    <h1>복약 일지</h1>
    <div class="calendar-container">
      <VDatePicker
        class="my-calendar"
        v-model="selectedDate"
        :attributes="attributes"
        expanded
        locale="ko"
        mode="date"
        :max-date="maxDate"
        @dayclick="onDayClick"
      />
    </div>
    <h2 class="left-aligned">복약 정보</h2>

    <!-- 약 섹션 -->
    <template v-if="!isLoading && mediList.length">
      <h3 class="left-aligned">약</h3>
      <section class="section">
        <MedicineCard
          v-for="(item, index) in mediList"
          :key="index"
          :item="item"
          :kakaoId="kakaoId"
          :date="formattedSelectedDate"
        />
      </section>
    </template>

    <!-- 영양제 섹션 -->
    <template v-if="!isLoading && suppList.length">
      <h3 class="left-aligned">영양제</h3>
      <section class="section">
        <MedicineCard
          v-for="(item, index) in suppList"
          :key="index"
          :item="item"
          :kakaoId="kakaoId"
          :date="formattedSelectedDate"
        />
      </section>
    </template>

    <!-- 로딩 중 -->
    <section class="section" v-if="isLoading">
      <p>데이터를 불러오는 중...</p>
    </section>

    <span class="bar" style="border-bottom: 1px solid #333"></span>
    <h2 class="left-aligned">알레르기 정보</h2>
    <NoneAllergyCard class="section" @click="moveToAllergyRecordPage()" />
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import "v-calendar/dist/style.css";
import MedicineCard from "@/components/cards/MedicineCard.vue";
import NoneAllergyCard from "@/components/cards/NoneAllergyCard.vue";
import UserService from "@/services/UserService";

export default {
  name: "MediCalendar",

  data() {
    return {
      mediList: [], // 약 데이터
      suppList: [], // 영양제 데이터
      kakaoId: localStorage.getItem("userId"), // 사용자 kakaoId
      isLoading: false, // 로딩 상태
    };
  },

  components: {
    MedicineCard,
    NoneAllergyCard,
  },

  setup() {
    const selectedDate = ref(new Date());
    const today = new Date();
    const maxDate = new Date(today); // 오늘 날짜 복사
    maxDate.setDate(today.getDate()); // 오늘까지만 허용 (내일 이후 불가)

    const attributes = ref([
      { key: "today", dates: today }, // 오늘 날짜 강조
    ]);

    const formattedSelectedDate = computed(() => {
      const year = selectedDate.value.getFullYear();
      const month = String(selectedDate.value.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.value.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    });

    const router = useRouter();

    const onDayClick = (day) => {
      const clickedDate = new Date(day.date); // 클릭된 날짜
      if (clickedDate > maxDate) {
        console.log("내일 이후의 날짜는 선택할 수 없습니다."); // 디버그용 메시지
        return; // 내일 이후 날짜 클릭 무시
      }
      selectedDate.value = clickedDate; // 유효한 날짜만 설정
      console.log(`선택된 날짜: ${day.date}`);
    };

    const moveToAllergyRecordPage = () => {
      router.push({ path: "/allergyRecord" });
    };

    return {
      selectedDate,
      formattedSelectedDate,
      attributes,
      maxDate, // 내일 이후 선택 방지
      onDayClick,
      moveToAllergyRecordPage,
    };
  },

  watch: {
    selectedDate: "fetchInventoryByDate",
  },

  methods: {
    async fetchInventoryByDate() {
      if (!this.kakaoId) {
        console.error("사용자 ID를 찾을 수 없습니다.");
        return;
      }

      const date = this.formatDate(this.selectedDate);

      // 데이터를 비우고 로딩 시작
      this.isLoading = true;
      this.mediList = [];
      this.suppList = [];

      try {
        const response = await UserService.getInventoryByDate(
          this.kakaoId,
          date
        );
        const data = response.data;
        this.mediList = data.filter((item) => item.type === "MEDICINE");
        this.suppList = data.filter((item) => item.type === "HEALTH_FOOD");
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
        alert("복약 데이터를 가져오는 데 문제가 발생했습니다.");
      } finally {
        this.isLoading = false; // 로딩 종료
      }
    },

    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  },

  async mounted() {
    await this.fetchInventoryByDate();
  },
};
</script>

<style scoped>
.section {
  width: 100%;
  margin-bottom: 20px;
}

.left-aligned {
  align-self: flex-start; /* 부모의 중앙 정렬에서 벗어나 왼쪽 정렬 */
  text-align: left; /* 특정 요소에 왼쪽 정렬 적용 */
  margin-left: 0; /* 필요시 왼쪽 여백 초기화 */
}

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

.back-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 40px;
  left: 20px;
}

.calendar-container {
  max-width: 600px;
  margin: auto;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.my-calendar .vc-weekday-1 {
  color: red;
}

.my-calendar .vc-weekday-7 {
  color: #6366f1;
}

.bar {
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
  width: 100%;
}

.container h1 {
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3); /* 텍스트 섀도우 추가 */
}

.container h3 {
  text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3); /* 텍스트 섀도우 추가 */
  padding: 0;
  margin: 0 0 10px 0;
}
</style>
