import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // router 가져오기

createApp(App)
  .use(router) // router 사용
  .mount('#app');
