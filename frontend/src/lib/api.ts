import axios from 'axios';

const baseURL =
  import.meta.env.DEV
    ? 'http://localhost:8080'
    : import.meta.env.VITE_API_BASE_URL

export const api = axios.create({ baseURL });