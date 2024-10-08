import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '../components/HomePage.vue';
import MedManagePage from '../components/MedManagePage.vue';
import NutriSuppPage from '../components/NutriSuppPage.vue';
import AllergyInfPage from '../components/AllergyInfPage.vue';
import ProfPage from '../components/ProfPage.vue';

const routes = [
  { path: '/', component: HomePage, meta: { page: 1 } },
  { path: '/medManage', component: MedManagePage, meta: { page: 2 } },
  { path: '/nutriSupp', component: NutriSuppPage, meta: { page: 3 } },
  { path: '/allergyInf', component: AllergyInfPage, meta: { page: 4 } },
  { path: '/prof', component: ProfPage, meta: { page: 5 } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;