import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Interceptor to add Authorization header from sessionStorage (tab-isolated)
API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('civic_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
