// src/services/UserService.js
import axios from "axios";

const API_URL = "/api/v1/users";

export default {
  // 카카오 로그인
  kakaoLogin(code) {
    return axios.post(`${API_URL}/kakao/${code}`);
  },

  // 닉네임 변경
  updateNickname(kakaoId, newNickname) {
    return axios.put(`${API_URL}/${kakaoId}/nickname`, { newNickname });
  },

  // 로그아웃
  logout(kakaoId) {
    return axios.post(`${API_URL}/logout/${kakaoId}`);
  },

  // 회원 존재 여부 확인
  checkExistingUser(kakaoId) {
    return axios.get(`${API_URL}/check/${kakaoId}`);
  },

  // 회원 정보 조회
  getUserById(kakaoId) {
    return axios.get(`${API_URL}/${kakaoId}`);
  },

  // 전체 회원 조회
  getAllUsers() {
    return axios.get(API_URL);
  },
};
