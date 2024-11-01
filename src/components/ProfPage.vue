<template>
  <div class="user-component">
    <!-- 닉네임 변경 -->
    <div v-if="user">
      <input v-model="newNickname" placeholder="새 닉네임 입력" />
      <button @click="changeNickname">닉네임 변경</button>
    </div>

    <!-- 로그아웃 -->
    <button v-if="user" @click="logout">로그아웃</button>

    <!-- 회원 존재 여부 확인 -->
    <input v-model="checkId" placeholder="회원 ID 확인" />
    <button @click="checkUser">회원 존재 여부 확인</button>
    <p v-if="userExists !== null">
      회원 {{ userExists ? "존재" : "존재하지 않음" }}
    </p>

    <!-- 회원 정보 조회 -->
    <input v-model="searchId" placeholder="조회할 회원 ID 입력" />
    <button @click="getUserInfo">회원 정보 조회</button>
    <p v-if="searchedUser">조회된 회원: {{ searchedUser.nickname }}</p>

    <!-- 전체 회원 조회 -->
    <button @click="getAllUsers">전체 회원 조회</button>
    <ul v-if="allUsers.length">
      <li v-for="(user, index) in allUsers" :key="index">
        {{ user.nickname }}
      </li>
    </ul>
  </div>
</template>

<script>
import UserService from "@/services/UserService";

export default {
  data() {
    return {
      code: "", // 카카오 로그인 코드
      user: null, // 현재 로그인한 사용자 정보
      newNickname: "", // 새 닉네임 입력값
      checkId: "", // 존재 여부 확인을 위한 ID
      userExists: null, // 회원 존재 여부
      searchId: "", // 검색할 사용자 ID
      searchedUser: null, // 검색된 사용자 정보
      allUsers: [], // 모든 사용자 목록
    };
  },
  methods: {
    // 로그인
    async login() {
      try {
        // code는 실제로 카카오 인증 후 얻어야 함
        const response = await UserService.kakaoLogin(this.code);
        this.user = response.data;
        alert(`${this.user.nickname}님 로그인 성공!`);
      } catch (error) {
        console.error("카카오 로그인 에러:", error);
      }
    },

    // 닉네임 변경
    async changeNickname() {
      try {
        const response = await UserService.updateNickname(
          this.user.kakaoId,
          this.newNickname
        );
        this.user = response.data;
        alert("닉네임이 성공적으로 변경되었습니다!");
      } catch (error) {
        console.error("닉네임 변경 에러:", error);
      }
    },

    // 로그아웃
    async logout() {
      try {
        await UserService.logout(this.user.kakaoId);
        this.user = null;
        alert("로그아웃 성공!");
      } catch (error) {
        console.error("로그아웃 에러:", error);
      }
    },

    // 회원 존재 여부 확인
    async checkUser() {
      try {
        const response = await UserService.checkExistingUser(this.checkId);
        this.userExists = response.data;
      } catch (error) {
        console.error("회원 존재 여부 확인 에러:", error);
      }
    },

    // 회원 정보 조회
    async getUserInfo() {
      try {
        const response = await UserService.getUserById(this.searchId);
        this.searchedUser = response.data;
      } catch (error) {
        console.error("회원 정보 조회 에러:", error);
      }
    },

    // 전체 회원 조회
    async getAllUsers() {
      try {
        const response = await UserService.getAllUsers();
        this.allUsers = response.data;
      } catch (error) {
        console.error("전체 회원 조회 에러:", error);
      }
    },
  },
};
</script>

<style scoped>
.user-component {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
  margin: auto;
}

button {
  padding: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
