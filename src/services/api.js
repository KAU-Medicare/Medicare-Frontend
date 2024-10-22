import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://kau-medicare.shop/api'
  : '/api';

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

export default api;