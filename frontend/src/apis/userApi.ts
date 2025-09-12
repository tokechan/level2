import { apiRequest } from './config';
import type { 
  paths, 
  components 
} from '../types/api';

// 型定義のエイリアス
type User = components['schemas']['User'];
type CreateUserRequest = components['schemas']['CreateUserRequest'];
type UpdateUserRequest = components['schemas']['UpdateUserRequest'];
type UserResponse = components['schemas']['UserResponse'];
type UsersResponse = components['schemas']['UsersResponse'];
type ErrorResponse = components['schemas']['ErrorResponse'];

// クエリパラメータの型
type GetUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

// API エラークラス
export class ApiError extends Error {
  public status: number;
  public code: string;
  public details?: Record<string, unknown>;

  constructor(message: string, status: number, code: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// エラーハンドリング関数
const handleApiError = (error: any): never => {
  if (error.response?.data) {
    const errorData = error.response.data as ErrorResponse;
    throw new ApiError(
      errorData.error.message,
      error.response.status,
      errorData.error.code,
      errorData.error.details
    );
  }
  
  // ネットワークエラーなどの場合
  throw new ApiError(
    error.message || 'An unexpected error occurred',
    error.response?.status || 0,
    'UNKNOWN_ERROR'
  );
};

// ユーザーAPI client
export const userApi = {
  // 全ユーザー取得
  async getUsers(params?: GetUsersParams): Promise<UsersResponse> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.search) queryParams.append('search', params.search);

      const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      return await apiRequest<UsersResponse>({
        method: 'GET',
        url,
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  // ユーザーIDで取得
  async getUserById(id: number): Promise<UserResponse> {
    try {
      return await apiRequest<UserResponse>({
        method: 'GET',
        url: `/users/${id}`,
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  // ユーザー作成
  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    try {
      return await apiRequest<UserResponse>({
        method: 'POST',
        url: '/users',
        data: userData,
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  // ユーザー更新
  async updateUser(id: number, userData: UpdateUserRequest): Promise<UserResponse> {
    try {
      return await apiRequest<UserResponse>({
        method: 'PUT',
        url: `/users/${id}`,
        data: userData,
      });
    } catch (error) {
      handleApiError(error);
    }
  },

  // ユーザー削除
  async deleteUser(id: number): Promise<void> {
    try {
      await apiRequest<void>({
        method: 'DELETE',
        url: `/users/${id}`,
      });
    } catch (error) {
      handleApiError(error);
    }
  },
};

// ヘルスチェックAPI
export const healthApi = {
  async checkHealth(): Promise<components['schemas']['HealthResponse']> {
    try {
      return await apiRequest<components['schemas']['HealthResponse']>({
        method: 'GET',
        url: '/health',
      });
    } catch (error) {
      handleApiError(error);
    }
  },
};
