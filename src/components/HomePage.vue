<template>
  <div class="container">
    <!-- Welcome Message -->
    <div class="welcome-msg">
      <span class="name">{{ userName }}</span
      ><span>님, 환영합니다!</span>
    </div>

    <!-- Medication Section -->
    <section class="section">
      <h2>오늘 먹을 약</h2>
      <div v-for="medicine in mediList" :key="medicine" class="card">
        <div class="info">
          <div class="name-dose">
            <span class="name">{{ medicine.name }} </span>
            <span class="dose"
              >{{ medicine.singleDose }}{{ medicine.type }}</span
            >
          </div>
          <span class="time">{{ medicine.time }}</span>
        </div>
        <div class="actions">
          <button class="check-btn">✔️</button>
        </div>
      </div>
    </section>

    <!-- Supplement Section -->
    <section class="section">
      <h2>오늘 먹을 영양제</h2>
      <div v-for="supp in suppList" :key="supp" class="card">
        <div class="info">
          <div class="name-dose">
            <span class="name">{{ supp.name }} </span>
            <span class="dose"
              >{{ supp.singleDose }}{{ supp.type }}</span
            >
          </div>
          <span class="time">{{ supp.time }}</span>
        </div>
        <div class="actions">
          <button class="check-btn">✔️</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      userName: "너 누구야", // 사용자의 이름이 담길 변수
      mediList: [], // 약 json이 담길 변수
      suppList: [], // 영양제 json이 담길 변수
    };
  },

  mounted() {
    this.userName = this.$route.query.userName; // 카카오조인에서 닉네임 받아오기

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
/* Layout */
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3vh 5vw 11vh 5vw;
  max-width: 600px;
  width: 90vw;
  margin: auto;
  overflow-y: auto;
  max-height: 80%;
}

/* Welcome Message */
.welcome-msg {
  height: 8vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #ffc4a3;
  border-radius: 10px;
  width: 100%;
  text-align: center;
  font-size: 3vh;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.welcome-msg .name {
  font-weight: bold;
  color: #ff8947;
}

/* Medication & Supplement Section */
.section {
  width: 100%;
  margin-bottom: 20px;
}

.section .name {
  font-weight: bold;
  font-size: 2.5vh;
  padding-right: 10px;
}

.section .dose,
.section .time {
  font-size: 2vh;
}

.section .info {
  border-right: 1px solid #ddd;
  margin-right: 15px;
  flex: auto;
}

h2 {
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
  margin-bottom: 10px;
}

.card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  outline: 1px solid #ddd;
}

.actions {
  display: flex;
}

.check-btn {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
}
</style>
