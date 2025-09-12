import { Request, Response, NextFunction } from 'express';

// 開発環境では全てのオリジンを許可
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

export const corsOptions = {
  origin: isDevelopment ? true : (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    console.log('CORS: Received origin:', origin);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    // Add your production domains here
    const allowedOrigins = [
      'http://localhost:5174', // フロントエンドの明示的な許可
      'https://your-frontend-domain.com',
      'https://your-staging-domain.com'
    ];
    
    if (allowedOrigins.includes(origin)) {
      console.log('CORS: Allowing whitelisted origin:', origin);
      callback(null, true);
    } else {
      console.log('CORS: Rejecting origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
