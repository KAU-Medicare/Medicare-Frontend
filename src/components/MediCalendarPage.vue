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
    <section class="section">
      <MedicineCard
        v-for="(item, index) in mediList"
        :key="index"
        :item="item"
        @check="handleCheck"
      />
    </section>
    <span class="bar"></span>
    <section class="section">
      <MedicineCard
        v-for="(item, index) in suppList"
        :key="index"
        :item="item"
        @check="handleCheck"
      />
    </section>
    <span class="bar" style="border-bottom: 1px solid #333"></span>
    <h2 class="left-aligned">알레르기 정보</h2>
    <NoneAllergyCard class="section"/>
  </div>
</template>

<script>
import { ref } from "vue";
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

    const attributes = ref([
      {
        key: "today",
        dates: new Date(),
      },
    ]);

    const onDayClick = (day) => {
      console.log(`선택된 날짜: ${day.date}`);
    };

    return {
      selectedDate,
      attributes,
      onDayClick,
    };
  },

  mounted() {
    fetch("/assets/mediList.json") // 약 리스트 가져오기
      .then((response) => {
        // 가져온 결과 보고
        if (!response.ok) {
          // 못 가져왔으면
          throw new Error("약 리스트를 가져올 수 없습니다"); // 에러 메세지 출력 후 중단
        }
        return response.json(); // 정상이면 응답을 json 형식으로 변환
      })
      .then((mediListData) => {
        // 가져온 데이터 이름을 mediListData로 설정
        this.mediList = mediListData; // mediList 변수에 넣어줌

        return fetch("/assets/suppList.json"); // 이제 영양제 리스트 가져옴
      })
      .then((response) => {
        // 가져온 결과 보고
        if (!response.ok) {
          // 못 가져왔으면
          throw new Error("영양제 리스트를 가져올 수 없습니다"); // 에러 메세지 출력 후 중단
        }
        return response.json(); // 정상이면 응답을 json 형식으로 변환
      })
      .then((suppListData) => {
        // 가져온 데이터 이름을 suppListData로 설정
        this.suppList = suppListData; // suppList 변수에 넣어줌
      })
      .catch((error) => {
        // 오류 발생 시 위에서 throw한 에러메세지 출력
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
