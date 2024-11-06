import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from '../components/LoginPage.vue';
import HomePage from '../components/HomePage.vue';
import MedManagePage from '../components/MedManagePage.vue';
import NutriSuppPage from '../components/NutriSuppPage.vue';
import AllergyInfPage from '../components/AllergyInfPage.vue';
import ProfPage from '../components/ProfPage.vue';
import MedInfoPage from '../components/MedInfoPage.vue';
import AllergyRecordPage from '../components/AllergyRecordPage.vue';
import KakaoJoin from '../components/KakaoJoin.vue'
import SearchByNamePage from '../components/SearchByNamePage.vue'
import SearchByCameraPage from '../components/SearchByCameraPage.vue'
import MediCalendarPage from '../components/MediCalendarPage.vue'
import ChatBotPage from '../components/ChatBotPage.vue'
import AllergyInfResurtPage from '../components/AllergyInfResurtPage.vue'

const routes = [
  { path: '/login', name: 'LoginPage', component: LoginPage, meta: { page: 0, state: "", requiresAuth: false } },
  { path: '/kakaojoin', name: 'kakaoJoin', component: KakaoJoin, meta: { page: -1, state: "", requiresAuth: false } },
  
  { path: '/', name: 'HomePage', component: HomePage, meta: { page: 1, state: 'BotNav', requiresAuth: true  } },
  { path: '/medManage', name: 'MedManagePage', component: MedManagePage, meta: { page: 2, state: 'BotNav', requiresAuth: true } },
  { path: '/chatBot', name: 'ChatBotPage', component: ChatBotPage, meta: { page: 3, state: "BotNav", requiresAuth: true } },
  { path: '/allergyInf', name: 'AllergyInfPage', component: AllergyInfPage, meta: { page: 4, state: "BotNav", requiresAuth: true } },
  { path: '/prof', name: 'ProfPage', component: ProfPage, meta: { page: 5, state: "BotNav", requiresAuth: true } },
  { path: '/medInfo', name: 'MedInfoPage', component: MedInfoPage, meta: { page: -1, state: "", requiresAuth: true } },
  { path: '/allergyRecord', name: 'AllergyRecordPage', component: AllergyRecordPage, meta: { page: -1, state: "", requiresAuth: true } },
  { path: '/searchByName', name: 'SearchByNamePage', component: SearchByNamePage, meta: { page: -1, state: "", requiresAuth: true } },
  { path: '/searchByCamera', name: 'SearchByCameraPage', component: SearchByCameraPage, meta: { page: -1, state: "", requiresAuth: true } },
  { path: '/mediCalendar', name: 'MediCalendarPage', component: MediCalendarPage, meta: { page: 2, state: "BotNav", requiresAuth: true } },
  { path: '/nutriSupp', name: 'NutriSuppPage', component: NutriSuppPage, meta: { page: -1, state: "BotNav", requiresAuth: true } },
  { path: '/allergyInfResurt', name: 'AllergyInfResurtPage', component: AllergyInfResurtPage, meta: { page: 4, state: "BotNav", requiresAuth: true } },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("userId"); // 로컬스토리지에서 사용자 ID 확인

  if (to.meta.requiresAuth && !isAuthenticated) {
    // 인증이 필요하고 로그인되어 있지 않다면 로그인 페이지로 리다이렉트
    next({ path: "/login" });
  } else {
    // 그렇지 않으면 해당 경로로 이동
    next();
  }
});

export default router;