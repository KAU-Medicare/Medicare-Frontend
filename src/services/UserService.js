// src/services/UserService.js
import axios from "axios";

const API_URL_USERS = "/api/v1/users";
const API_URL_SEARCH = "/api/search";
const API_URL_INVENTORY = "/api/inventory";
const API_URL_SYMPTOMS = "/api/symptoms";

export default {
  // 카카오 로그인
  kakaoLogin(code) {
    return axios.post(`${API_URL_USERS}/kakao/${code}`);
  },

  // 약 검색
  searchMedicines(keyword) {
    return axios.get(`${API_URL_SEARCH}/medicines`, { params: { keyword } });
  },

  // 영양제 검색
  searchHealthFoods(keyword) {
    return axios.get(`${API_URL_SEARCH}/health-foods`, { params: { keyword } });
  },

  // 약/영양제 등록
  addInventory(data) {
    return axios.post(`${API_URL_INVENTORY}`, data);
  },

  // 사용자의 모든 약/영양제 조회
  getUserInventory(kakaoId) {
    return axios.get(`${API_URL_INVENTORY}/user/${kakaoId}`);
  },

  // 오늘 복용할 약/영양제 조회
  getTodayInventory(kakaoId) {
    return axios.get(`${API_URL_INVENTORY}/today/${kakaoId}`);
  },

  // 닉네임 변경
  updateNickname(itemId, newNickname) {
    return axios.put(`${API_URL_INVENTORY}/${itemId}/nickname`, { nickname: newNickname });
  },

  // 약/영양제 삭제
  deleteInventory(kakaoId, itemId) {
    return axios.delete(`${API_URL_INVENTORY}/${kakaoId}/${itemId}`);
  },

  // 약/영양제 정보 수정
  updateInventory(itemId, data) {
    return axios.put(`${API_URL_INVENTORY}/${itemId}`, data);
  },

  // 복용 체크 함수
  checkTaken(kakaoId, itemId, date, taken) {
    return axios.put(`${API_URL_INVENTORY}/${kakaoId}/${itemId}/taken`, null, {
      params: { date, taken },
    });
  },


  // 특정 날짜 복용 목록 조회
  getInventoryByDate(kakaoId, date) {
    return axios.get(`${API_URL_INVENTORY}/date/${kakaoId}`, { params: { date } });
  },

  // 증상 목록 조회
  getSymptoms() {
    return axios.get(`${API_URL_SYMPTOMS}`);
  },

  // 알레르기 정보 등록
  addSymptomRecord(data) {
    return axios.post(`${API_URL_SYMPTOMS}/records`, data);
  },

  // 특정 날짜 알레르기 정보 조회
  getSymptomRecordsByDate(kakaoId, date) {
    return axios.get(`${API_URL_SYMPTOMS}/records/${kakaoId}`, { params: { date } });
  },

  // 알레르기 정보 수정
  updateSymptomRecord(recordId, data) {
    return axios.put(`${API_URL_SYMPTOMS}/records/${recordId}`, data);
  },

  // 알레르기 정보 삭제
  deleteSymptomRecord(recordId) {
    return axios.delete(`${API_URL_SYMPTOMS}/records/${recordId}`);
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
