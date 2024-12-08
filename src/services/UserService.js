// src/services/UserService.js
import axios from "axios";

const API_URL_USERS = "/api/v1/users";
const API_URL_SEARCH = "/api/search";
const API_URL_INVENTORY = "/api/inventory";
const API_URL_SYMPTOMS = "/api/symptoms";
const API_URL_MEDICINES = "/api/medicines";
const API_URL_ALLERGY = "/api/allergy";


export default {
  async registerAllergy(encodedImage, occurrenceTime, symptoms) {
    const url = "/api/allergy/register"; // API 엔드포인트
  
    // JSON 데이터 생성
    const requestData = {
      image: encodedImage, // Base64 이미지
      data: {
        occurrenceTime: occurrenceTime, // 발생 시간
        symptoms: symptoms, // 증상 배열
      },
    };
    console.log("requestData:", requestData);
    try {
      const response = await axios.post(url, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      console.log("Response:", response.data);
      return response.data; // 서버 응답 데이터 반환
    } catch (error) {
      console.error("Error:", error.response || error.message);
      throw error;
    }
  },
  
  // 카카오 로그인
  kakaoLogin(code) {
    return axios.post(`${API_URL_USERS}/kakao/${code}`);
  },

  // 약 표준 코드로 약 정보 조회
  getMedicineByStandardCode(standardCode) {
    return axios.get(`${API_URL_MEDICINES}/standard-code/${standardCode}`);
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

  // 특정 날짜 알레르기 결과 조회
  getAllergyResult(kakaoId, occurredDate) {
    return axios.get(`${API_URL_ALLERGY}/result`, {
      params: {
        kakaoId,
        occurredDate,
      },
    });
  },

  // 알레르기 분석 API 요청
  analyzeAllergy(kakaoId, occurredDate, jsonData) {
    return axios.post(
      `${API_URL_ALLERGY}/analyze`,
      jsonData,
      {
        params: { kakaoId, occurredDate }
      }
    );
    
  },

  // 알레르기 분석 정보 삭제
  deleteAllergyAnalysis(kakaoId, analysisId) {
    return axios.delete(`${API_URL_ALLERGY}/${analysisId}`, {
      params: {
        kakaoId,
      },
    });
  },

  // 약/영양제 정보 수정
  updateInventory(kakaoId, itemId, data) {
    return axios.put(`/api/inventory/${kakaoId}/${itemId}`, data);
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

  async subscribeToPush(userId, subscription) {
    try {
      const response = await axios.post(`/api/push/subscribe/${userId}`, subscription);
      console.log('Push 구독 성공:', response.data);
    } catch (error) {
      console.error('Push 구독 실패:', error);
      throw error;
    }
  },

  getVapidPublicKey() {
    return axios.get(`/api/push/vapidPublicKey`);
  },
  

  // 기간별 알레르기 정보 조회
  getSymptomRecordsByPeriod(kakaoId, startDate, endDate) {
    return axios.get(`${API_URL_SYMPTOMS}/records/${kakaoId}/period`, {
      params: { startDate, endDate },
    });
  },

  // 알레르기 정보 수정
  updateSymptomRecord(recordId, data) {
    return axios.put(`${API_URL_SYMPTOMS}/records/${recordId}`, data);
  },


  // 알레르기 정보 삭제
  deleteSymptomRecordById(kakaoId, recordId) {
    return axios.delete(`${API_URL_SYMPTOMS}/records/${kakaoId}/${recordId}`);
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
