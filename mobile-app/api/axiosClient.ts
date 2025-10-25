// api/axiosClient.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Базовый URL
const API_BASE = 'http://your-api.com/api';

// Создаем экземпляр axios
const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена
axiosClient.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        // Токен устарел - разлогиниваем
        await AsyncStorage.removeItem('token');
        // Можно показать экран логина или dispatch event
        console.log('Token expired, redirect to login');
      } catch (storageError) {
        console.error('Error removing token:', storageError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;