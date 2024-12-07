import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // router 가져오기
import './registerServiceWorker'
import VCalendar from 'v-calendar';

createApp(App)
  .use(router) // router 사용
  .use(VCalendar, {}) // 옵션을 필요에 맞게 설정할 수 있습니다.
  .mount('#app');

