<!-- components/MedicineCard.vue -->
<template>
  <div class="card">
    <div class="infos">
        <span class="names">이 날의 알레르기 정보가 아직 없어요!</span>
        <span class="times">알레르기 정보 등록하기 ></span>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoneAllergyCard",

};
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  background-image: url('@/assets/allergyButtonBackground.png');
  background-size: cover; /* 이미지가 카드 크기에 맞춰지도록 설정 */
  background-position: center; /* 이미지의 중앙을 기준으로 정렬 */
  padding: 15px 0;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  outline: 1px solid #ddd;
  transition: background-color 0.3s ease;
  cursor: pointer;
}


.active {
  color: black;
  font-weight: bold;
}

.inactive {
  color: gainsboro;
  font-weight: normal;
}

.names {
  font-weight: bold;
  font-size: 2.5vh;
  padding-right: 10px;
}

.times {
  font-size: 2vh;
}

h2 {
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}

.infos {
  display: flex;
  flex-direction: column;
  padding: 0 15px;
}

.actions {
  display: flex;
}

.name-dates {
  display: flex;
  justify-content: space-between; /* 요소 간 최대 공간 할당 */
  align-items: center; /* 수직 중앙 정렬 */
}
</style>
