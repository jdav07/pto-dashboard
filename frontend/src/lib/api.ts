// src/lib/api.ts

import axios from 'axios';
import { rootStore } from '@/stores/RootStore';

const baseURL = import.meta.env.DEV
  ? 'http://localhost:8080'
  : import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({ baseURL });

// Add an interceptor to handle 401 (token expired)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      rootStore.authStore.logout();
    }
    return Promise.reject(error);
  }
);
