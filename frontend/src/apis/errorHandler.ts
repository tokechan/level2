import { ApiError } from './userApi';

// エラーメッセージのマッピング
const ERROR_MESSAGES: Record<string, string> = {
  USER_NOT_FOUND: 'ユーザーが見つかりません',
  USER_ALREADY_EXISTS: 'このメールアドレスは既に使用されています',
  INVALID_EMAIL: '有効なメールアドレスを入力してください',
  INVALID_NAME: '名前は1文字以上100文字以下で入力してください',
  VALIDATION_ERROR: '入力内容に誤りがあります',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  SERVER_ERROR: 'サーバーエラーが発生しました',
  UNKNOWN_ERROR: '予期しないエラーが発生しました',
};

// エラーレベルの定義
export enum ErrorLevel {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// エラー情報の型
export interface ErrorInfo {
  message: string;
  level: ErrorLevel;
  code: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

// エラーハンドリングクラス
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: ErrorInfo[] = [];

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // エラーを処理してユーザーフレンドリーなメッセージを返す
  public handleError(error: unknown): ErrorInfo {
    const errorInfo = this.parseError(error);
    this.logError(errorInfo);
    return errorInfo;
  }

  // エラーを解析
  private parseError(error: unknown): ErrorInfo {
    const timestamp = new Date();

    if (error instanceof ApiError) {
      return {
        message: ERROR_MESSAGES[error.code] || error.message,
        level: this.getErrorLevel(error.status),
        code: error.code,
        details: error.details,
        timestamp,
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        level: ErrorLevel.ERROR,
        code: 'UNKNOWN_ERROR',
        timestamp,
      };
    }

    return {
      message: '予期しないエラーが発生しました',
      level: ErrorLevel.ERROR,
      code: 'UNKNOWN_ERROR',
      timestamp,
    };
  }

  // HTTPステータスコードからエラーレベルを決定
  private getErrorLevel(status: number): ErrorLevel {
    if (status >= 500) return ErrorLevel.CRITICAL;
    if (status >= 400) return ErrorLevel.ERROR;
    if (status >= 300) return ErrorLevel.WARNING;
    return ErrorLevel.INFO;
  }

  // エラーをログに記録
  private logError(errorInfo: ErrorInfo): void {
    this.errorLog.push(errorInfo);
    
    // 開発環境ではコンソールに出力
    if (import.meta.env.DEV) {
      console.error('Error logged:', errorInfo);
    }

    // 本番環境では外部ログサービスに送信することを推奨
    // 例: Sentry, LogRocket, etc.
  }

  // エラーログを取得
  public getErrorLog(): ErrorInfo[] {
    return [...this.errorLog];
  }

  // エラーログをクリア
  public clearErrorLog(): void {
    this.errorLog = [];
  }

  // 特定のレベルのエラーのみを取得
  public getErrorsByLevel(level: ErrorLevel): ErrorInfo[] {
    return this.errorLog.filter(error => error.level === level);
  }
}

// シングルトンインスタンスをエクスポート
export const errorHandler = ErrorHandler.getInstance();

// エラーハンドリング用のReact Hook
export const useErrorHandler = () => {
  const handleError = (error: unknown): ErrorInfo => {
    return errorHandler.handleError(error);
  };

  const getErrorLog = () => {
    return errorHandler.getErrorLog();
  };

  const clearErrorLog = () => {
    errorHandler.clearErrorLog();
  };

  return {
    handleError,
    getErrorLog,
    clearErrorLog,
  };
};
