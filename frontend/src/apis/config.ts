import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API設定
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Axiosインスタンスの作成
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター
apiClient.interceptors.request.use(
  (config) => {
    // リクエストログ（開発環境のみ）
    if (import.meta.env.DEV) {
      console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // レスポンスログ（開発環境のみ）
    if (import.meta.env.DEV) {
      console.log('API Response:', response.status, response.data);
    }
    return response;
  },
  (error) => {
    // エラーログ
    console.error('Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// 型安全なAPI呼び出しのためのヘルパー関数
export const apiRequest = async <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};
