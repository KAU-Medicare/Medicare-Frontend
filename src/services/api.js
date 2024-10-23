import axios from 'axios';

const api = axios.create({
  baseURL: 'https://kau-medicare.shop/api',
  withCredentials: true
});

export default api;