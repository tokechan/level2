import { Request } from 'express';

/**
 * リクエストパラメータを安全に変換
 * ExpressのParamsDictionaryから期待される型に変換
 */
export const parseUserId = (req: Request): number => {
  const id = req.params.id;
  if (!id || isNaN(Number(id))) {
    throw new Error('Invalid user ID');
  }
  return Number(id);
};

/**
 * クエリパラメータを安全に変換
 */
export const parseQueryParams = (req: Request) => {
  const { page, limit, search } = req.query;
  
  return {
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    search: search ? String(search) : undefined,
  };
};
