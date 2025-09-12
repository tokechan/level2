import type { components } from '../types/api.js';
import type { User as PrismaUser } from '../generated/prisma/index.js';

type User = components['schemas']['User'];

/**
 * PrismaのUser型をOpenAPIのUser型に変換
 * Date型をstring型に変換して型安全性を保証
 */
export const transformUser = (prismaUser: PrismaUser): User => {
  return {
    id: prismaUser.id,
    name: prismaUser.name,
    email: prismaUser.email,
    createdAt: prismaUser.createdAt.toISOString(),
    updatedAt: prismaUser.updatedAt.toISOString(),
  };
};

/**
 * 複数のUserを変換
 */
export const transformUsers = (prismaUsers: PrismaUser[]): User[] => {
  return prismaUsers.map(transformUser);
};
