# 開発ガイド

このドキュメントは、Simple CRUD アプリケーションの開発に参加する開発者向けの詳細ガイドです。

## 📋 目次

- [開発環境のセットアップ](#-開発環境のセットアップ)
- [プロジェクト構造の理解](#-プロジェクト構造の理解)
- [API 開発ガイド](#-api開発ガイド)
- [フロントエンド開発ガイド](#-フロントエンド開発ガイド)
- [データベース開発ガイド](#-データベース開発ガイド)
- [テスト戦略](#-テスト戦略)
- [デバッグ方法](#-デバッグ方法)
- [パフォーマンス最適化](#-パフォーマンス最適化)

## 🛠️ 開発環境のセットアップ

### 初回セットアップ

```bash
# 1. リポジトリのクローン
git clone <repository-url>
cd simple-crud

# 2. 環境変数の設定
cp env.example .env

# 3. Docker環境の起動
make dev

# 4. 動作確認
curl http://localhost:3000/health
curl http://localhost:5173
```

### ローカル開発（Docker 不使用）

```bash
# 前提条件: MySQLがローカルで動作している必要があります

# バックエンド
cd backend
npm install
npm run db:generate
npm run db:push
npm run dev

# フロントエンド（別ターミナル）
cd frontend
npm install
npm run dev
```

### 開発ツールの推奨設定

#### VS Code 拡張機能

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "prisma.prisma",
    "ms-vscode.vscode-json"
  ]
}
```

#### VS Code 設定

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.prisma": "prisma"
  }
}
```

## 🏗️ プロジェクト構造の理解

### アーキテクチャパターン

このプロジェクトは以下のアーキテクチャパターンを採用しています：

- **Clean Architecture**: レイヤー分離による保守性の向上
- **Atomic Design**: コンポーネントの再利用性向上
- **Repository Pattern**: データアクセス層の抽象化
- **Dependency Injection**: テスタビリティの向上

### ディレクトリ構造の詳細

```
backend/src/
├── controllers/     # リクエスト処理のエントリーポイント
├── services/        # ビジネスロジック（将来実装予定）
├── repositories/    # データアクセス層（将来実装予定）
├── middleware/      # 共通処理（認証、バリデーション等）
├── routes/          # ルーティング定義
├── schemas/         # バリデーションスキーマ
├── types/           # 型定義
├── utils/           # ユーティリティ関数
└── lib/             # 外部ライブラリの設定

frontend/src/
├── components/      # Reactコンポーネント
│   ├── atoms/       # 最小単位のコンポーネント
│   ├── molecules/   # 複数のatomsを組み合わせたコンポーネント
│   ├── organisms/   # 複雑なUIセクション
│   └── templates/   # ページレイアウト
├── apis/            # APIクライアント
├── hooks/           # カスタムフック
├── types/           # 型定義
├── constants/       # 定数
└── stories/         # Storybook
```

## 🔌 API 開発ガイド

### 新しいエンドポイントの追加

#### 1. OpenAPI 仕様の更新

```yaml
# backend/openapi.yaml
paths:
  /api/users/{id}/posts:
    get:
      summary: Get user posts
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: User posts retrieved successfully
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Post'
```

#### 2. バリデーションスキーマの作成

```typescript
// backend/src/schemas/postSchemas.ts
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(1000),
  userId: z.number().int().positive(),
});

export const updatePostSchema = createPostSchema.partial();
```

#### 3. コントローラーの実装

```typescript
// backend/src/controllers/postController.ts
import { Request, Response } from 'express';
import { createPostSchema } from '../schemas/postSchemas.js';

export const createPost = async (req: Request, res: Response) => {
  try {
    const validatedData = createPostSchema.parse(req.body);
    // ビジネスロジックの実装
    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid input data' });
  }
};
```

#### 4. ルートの定義

```typescript
// backend/src/routes/postRoutes.ts
import { Router } from 'express';
import { createPost } from '../controllers/postController.js';

const router = Router();

router.post('/', createPost);

export default router;
```

#### 5. 型生成の実行

```bash
cd backend
npm run generate:all
```

### API 設計のベストプラクティス

#### RESTful API 設計

```typescript
// 良い例
GET / api / users; // ユーザー一覧取得
GET / api / users / { id }; // 特定ユーザー取得
POST / api / users; // ユーザー作成
PUT / api / users / { id }; // ユーザー更新
DELETE / api / users / { id }; // ユーザー削除

// 避けるべき例
GET / api / getUsers;
POST / api / createUser;
POST / api / updateUser;
POST / api / deleteUser;
```

#### エラーハンドリング

```typescript
// 統一されたエラーレスポンス形式
interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

// エラーミドルウェアでの処理
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: error.name || 'Error',
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  });
};
```

## 🎨 フロントエンド開発ガイド

### コンポーネント開発

#### Atomic Design の実装

```typescript
// atoms/Button/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  children,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

#### カスタムフックの作成

```typescript
// hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { User } from '../types/api';
import { userApi } from '../apis/userApi';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userApi.getUsers();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};
```

### フォーム管理

#### React Hook Form + Zod

```typescript
// components/UserForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
});

type UserFormData = z.infer<typeof userSchema>;

export const UserForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data: UserFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Name" />
      {errors.name && <span>{errors.name.message}</span>}

      <input {...register('email')} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <button type="submit">Submit</button>
    </form>
  );
};
```

### Storybook の活用

```typescript
// stories/Button.stories.ts
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/atoms/Button/Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Button',
  },
};
```

## 🗄️ データベース開発ガイド

### Prisma スキーマの設計

#### モデル定義

```prisma
// backend/prisma/schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(100)
  email     String   @unique @db.VarChar(255)
  posts     Post[]   // リレーション
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String   @db.VarChar(200)
  content   String   @db.Text
  userId    Int      @map("user_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("posts")
}
```

#### マイグレーション

```bash
# 新しいマイグレーションの作成
cd backend
npx prisma migrate dev --name add-posts-table

# 本番環境でのマイグレーション
npx prisma migrate deploy
```

### データベース操作

#### 基本的な CRUD 操作

```typescript
// backend/src/services/userService.ts
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export class UserService {
  async getUsers() {
    return await prisma.user.findMany({
      include: {
        posts: true,
      },
    });
  }

  async getUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        posts: true,
      },
    });
  }

  async createUser(data: { name: string; email: string }) {
    return await prisma.user.create({
      data,
    });
  }

  async updateUser(id: number, data: { name?: string; email?: string }) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}
```

#### トランザクション処理

```typescript
// 複数の操作をトランザクションで実行
export const createUserWithPost = async (
  userData: { name: string; email: string },
  postData: { title: string; content: string }
) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: userData,
    });

    const post = await tx.post.create({
      data: {
        ...postData,
        userId: user.id,
      },
    });

    return { user, post };
  });
};
```

## 🧪 テスト戦略

### バックエンドテスト

#### 単体テスト

```typescript
// backend/src/__tests__/userController.test.ts
import { Request, Response } from 'express';
import { createUser } from '../controllers/userController';

describe('UserController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockReq = {};
    mockRes = {
      status: mockStatus,
      json: mockJson,
    };
  });

  it('should create a user successfully', async () => {
    mockReq.body = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    await createUser(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalledWith({
      message: 'User created successfully',
    });
  });
});
```

#### 統合テスト

```typescript
// backend/src/__tests__/integration/user.test.ts
import request from 'supertest';
import { app } from '../server';

describe('User API Integration Tests', () => {
  it('should create and retrieve a user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    // ユーザー作成
    const createResponse = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);

    const userId = createResponse.body.id;

    // ユーザー取得
    const getResponse = await request(app)
      .get(`/api/users/${userId}`)
      .expect(200);

    expect(getResponse.body.name).toBe(userData.name);
    expect(getResponse.body.email).toBe(userData.email);
  });
});
```

### フロントエンドテスト

#### コンポーネントテスト

```typescript
// frontend/src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../atoms/Button/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(
      <Button variant="primary" size="medium">
        Click me
      </Button>
    );
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(
      <Button variant="primary" size="medium" onClick={handleClick}>
        Click me
      </Button>
    );

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### カスタムフックテスト

```typescript
// frontend/src/hooks/__tests__/useUsers.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from '../useUsers';
import { userApi } from '../../apis/userApi';

jest.mock('../../apis/userApi');

describe('useUsers', () => {
  it('should fetch users successfully', async () => {
    const mockUsers = [{ id: 1, name: 'John Doe', email: 'john@example.com' }];

    (userApi.getUsers as jest.Mock).mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.error).toBeNull();
  });
});
```

## 🐛 デバッグ方法

### バックエンドデバッグ

#### ログの活用

```typescript
// backend/src/utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

export default logger;
```

#### デバッガーの使用

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/backend/src/server.ts",
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### フロントエンドデバッグ

#### React Developer Tools

```typescript
// デバッグ用のログ出力
const UserComponent: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    console.log('Users updated:', users);
  }, [users]);

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};
```

#### エラーバウンダリ

```typescript
// frontend/src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details>{this.state.error && this.state.error.toString()}</details>
        </div>
      );
    }

    return this.props.children;
  }
}
```

## ⚡ パフォーマンス最適化

### バックエンド最適化

#### データベースクエリの最適化

```typescript
// N+1問題の解決
const users = await prisma.user.findMany({
  include: {
    posts: true, // 一度のクエリで関連データを取得
  },
});

// ページネーション
const users = await prisma.user.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: {
    createdAt: 'desc',
  },
});
```

#### キャッシュの実装

```typescript
// Redis キャッシュの実装例
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const getCachedUser = async (id: number) => {
  const cached = await redis.get(`user:${id}`);
  if (cached) {
    return JSON.parse(cached);
  }

  const user = await prisma.user.findUnique({ where: { id } });
  if (user) {
    await redis.setex(`user:${id}`, 3600, JSON.stringify(user));
  }

  return user;
};
```

### フロントエンド最適化

#### React.memo の活用

```typescript
// 不要な再レンダリングを防ぐ
const UserItem = React.memo<{ user: User }>(({ user }) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});
```

#### 仮想化の実装

```typescript
// 大量のデータを効率的に表示
import { FixedSizeList as List } from 'react-window';

const UserList: React.FC<{ users: User[] }> = ({ users }) => {
  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => (
    <div style={style}>
      <UserItem user={users[index]} />
    </div>
  );

  return (
    <List height={600} itemCount={users.length} itemSize={80}>
      {Row}
    </List>
  );
};
```

---

この開発ガイドを参考に、効率的で保守性の高いコードを書いてください。質問や改善提案があれば、お気軽にお声がけください！
