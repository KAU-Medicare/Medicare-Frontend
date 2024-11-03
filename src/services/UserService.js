// src/services/UserService.js
import axios from "axios";

const API_URL_USERS = "/api/v1/users";
const API_URL_MED = "/api/medicines";
const API_URL_SUP = "/api/healthfoods";
const API_URL_DUR = "/api/dur";

export default {
  // 카카오 로그인
  kakaoLogin(code) {
    return axios.post(`${API_URL_USERS}/kakao/${code}`);
  },

  // 약 정보 접근
  getMedInfo(medId) {
    return axios.get(`${API_URL_MED}/${medId}`);
  },

  searchMedicines(query) {
    return axios.get(`${API_URL_MED}/${query}`, { params: { query } });
  },

  // 영양제 정보 접근
  getSupInfo(supId) {
    return axios.get(`${API_URL_SUP}/${supId}`);
  },

  // DUR 정보 접근
  getDurInfo(durId) {
    return axios.get(`${API_URL_DUR}/${durId}`);
  },

  // 닉네임 변경
  updateNickname(kakaoId, newNickname) {
    return axios.put(`${API_URL_USERS}/${kakaoId}/nickname`, { newNickname });
  },

  // 로그아웃
  logout(kakaoId) {
    return axios.post(`${API_URL_USERS}/logout/${kakaoId}`);
  },

  // 회원 존재 여부 확인
  checkExistingUser(kakaoId) {
    return axios.get(`${API_URL_USERS}/check/${kakaoId}`);
  },

  // 회원 정보 조회
  getUserById(kakaoId) {
    return axios.get(`${API_URL_USERS}/${kakaoId}`);
  },

  // 전체 회원 조회
  getAllUsers() {
    return axios.get(API_URL_USERS);
  },
};
