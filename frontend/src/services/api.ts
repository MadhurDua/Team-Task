import axios from 'axios';
import { toast } from 'sonner';
import type { ApiResponse } from '../lib/types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5050/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ttm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Network request failed';
    toast.error(message);
    if (error.response?.status === 401) {
      localStorage.removeItem('ttm_token');
      localStorage.removeItem('ttm_user');
    }
    return Promise.reject(error);
  }
);

export async function getData<T>(url: string) {
  const { data } = await api.get<ApiResponse<T>>(url);
  return data.data;
}
