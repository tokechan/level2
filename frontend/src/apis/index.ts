// API client設定
export { apiClient, apiRequest } from './config';

// ユーザーAPI
export { userApi, healthApi, ApiError } from './userApi';

// エラーハンドリング
export { 
  errorHandler, 
  useErrorHandler, 
  ErrorHandler, 
  ErrorLevel,
  type ErrorInfo 
} from './errorHandler';

// 型定義の再エクスポート
export type {
  components,
} from '../types/api';

import type { components } from '../types/api';

// 便利な型エイリアス
export type User = components['schemas']['User'];
export type CreateUserRequest = components['schemas']['CreateUserRequest'];
export type UpdateUserRequest = components['schemas']['UpdateUserRequest'];
export type UserResponse = components['schemas']['UserResponse'];
export type UsersResponse = components['schemas']['UsersResponse'];
export type ErrorResponse = components['schemas']['ErrorResponse'];
