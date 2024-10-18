import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from '../components/LoginPage.vue';
import HomePage from '../components/HomePage.vue';
import MedManagePage from '../components/MedManagePage.vue';
import NutriSuppPage from '../components/NutriSuppPage.vue';
import AllergyInfPage from '../components/AllergyInfPage.vue';
import ProfPage from '../components/ProfPage.vue';
import MedInfoPage from '../components/MedInfoPage.vue';
import AllergyRecordPage from '../components/allergyRecordPage.vue';

const routes = [
  { path: '/', component: LoginPage, meta: { page: 0, state: "" } },
  { path: '/home', component: HomePage, meta: { page: 1, state: 'BotNav'  } },
  { path: '/medManage', component: MedManagePage, meta: { page: 2, state: 'BotNav' } },
  { path: '/nutriSupp', component: NutriSuppPage, meta: { page: 3, state: "BotNav" } },
  { path: '/allergyInf', component: AllergyInfPage, meta: { page: 4, state: "BotNav" } },
  { path: '/prof', component: ProfPage, meta: { page: 5, state: "BotNav" } },
  { path: '/medInfo', component: MedInfoPage, meta: { page: -1, state: "" } },
  { path: '/allergyRecord', component: AllergyRecordPage, meta: { page: -1, state: "" } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;