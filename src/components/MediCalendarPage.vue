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
        @dayclick="onDayClick"
      />
    </div>
    <h2 class="left-aligned">복약 정보</h2>
    <section class="section" v-if="filteredMediList.length">
      <MedicineCard
        v-for="(item, index) in filteredMediList"
        :key="index"
        :item="item"
        @check="handleCheck"
      />
    </section>
    <span class="bar"></span>
    <section class="section" v-if="filteredSuppList.length">
      <MedicineCard
        v-for="(item, index) in filteredSuppList"
        :key="index"
        :item="item"
        @check="handleCheck"
      />
    </section>
    <span class="bar" style="border-bottom: 1px solid #333"></span>
    <h2 class="left-aligned">알레르기 정보</h2>
    <NoneAllergyCard class="section" @click="moveToAllergyRecordPage()" />
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import "v-calendar/dist/style.css";
import MedicineCard from "@/components/cards/MedicineCard.vue";
import NoneAllergyCard from "@/components/cards/NoneAllergyCard.vue";

export default {
  name: "MediCalendar",

  data() {
    return {
      mediList: [], // 약 json이 담길 변수
      suppList: [], // 영양제 json이 담길 변수
    };
  },

  components: {
    MedicineCard,
    NoneAllergyCard,
  },

  setup() {
    const selectedDate = ref(new Date());
    const attributes = ref([{ key: "today", dates: new Date() }]);
    const router = useRouter();

    const onDayClick = (day) => {
      selectedDate.value = day.date;
      console.log(`선택된 날짜: ${day.date}`);
    };

    const moveToAllergyRecordPage = () => {
      router.push({ path: "/allergyRecord" });
    };

    return {
      selectedDate,
      attributes,
      onDayClick,
      moveToAllergyRecordPage, // 반환하여 template에서 사용할 수 있게 합니다
    };
  },

  methods: {},

  computed: {
    filteredMediList() {
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      const selectedDay = days[this.selectedDate.getDay()];

      // 선택된 날짜의 요일에 맞는 항목만 필터링
      return this.mediList.filter((item) => item.date.includes(selectedDay));
    },
    filteredSuppList() {
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      const selectedDay = days[this.selectedDate.getDay()];

      // 선택된 날짜의 요일에 맞는 항목만 필터링
      return this.suppList.filter((item) => item.date.includes(selectedDay));
    },
  },

  mounted() {
    fetch("/assets/mediList.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("약 리스트를 가져올 수 없습니다");
        }
        return response.json();
      })
      .then((mediListData) => {
        this.mediList = mediListData;
        return fetch("/assets/suppList.json");
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
</style>
