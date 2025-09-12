# Simple CRUD Application

React + TypeScript + Node.js + MySQL を使用したフルスタック CRUD アプリケーションです。

## 📋 目次

- [プロジェクト概要](#-プロジェクト概要)
- [アーキテクチャ](#️-アーキテクチャ)
- [前提条件](#-前提条件)
- [クイックスタート](#-クイックスタート)
- [詳細セットアップ](#-詳細セットアップ)
- [開発ワークフロー](#-開発ワークフロー)
- [OpenAPI 仕様の更新](#-openapi仕様の更新)
- [型生成手順](#-型生成手順)
- [利用可能なコマンド](#-利用可能なコマンド)
- [アクセス URL](#-アクセスurl)
- [プロジェクト構造](#-プロジェクト構造)
- [トラブルシューティング](#-トラブルシューティング)
- [貢献ガイド](#-貢献ガイド)

## 🎯 プロジェクト概要

このプロジェクトは、ユーザー管理機能を持つ CRUD アプリケーションです。フロントエンドとバックエンドが完全に分離されたアーキテクチャを採用し、型安全性と開発効率を重視した設計になっています。

### 主な機能

- **ユーザー管理**: ユーザーの作成、読み取り、更新、削除
- **型安全な API**: OpenAPI 仕様から自動生成された TypeScript 型
- **リアルタイム開発**: ホットリロード対応の開発環境
- **データベース管理**: Prisma ORM による型安全なデータベース操作
- **コンテナ化**: Docker による環境統一とデプロイ簡素化

### 技術スタック

- **フロントエンド**: React 19, TypeScript, Vite, React Hook Form, Zod
- **バックエンド**: Node.js, Express, TypeScript, Prisma, MySQL
- **開発ツール**: ESLint, Storybook, Vitest
- **インフラ**: Docker, Docker Compose, Nginx

## 🏗️ アーキテクチャ

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Express)     │◄──►│   (MySQL)       │
│   Port: 5173    │    │   Port: 3000    │    │   Port: 3307    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx         │    │   OpenAPI       │    │   Prisma        │
│   (Production)  │    │   Specification │    │   ORM           │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### データフロー

1. **フロントエンド** → API リクエスト → **バックエンド**
2. **バックエンド** → Prisma クエリ → **データベース**
3. **データベース** → レスポンス → **バックエンド**
4. **バックエンド** → JSON レスポンス → **フロントエンド**

## 📋 前提条件

### 必須ソフトウェア

- **Docker** (20.10+) と **Docker Compose** (2.0+)
- **Node.js** (20.0+) - ローカル開発用
- **Git** (2.30+)

### 推奨ツール

- **VS Code** - エディタ
- **Docker Desktop** - Docker 管理
- **TablePlus** または **MySQL Workbench** - データベース管理

### システム要件

- **メモリ**: 最低 4GB、推奨 8GB 以上
- **ストレージ**: 最低 2GB の空き容量
- **OS**: macOS, Linux, Windows (WSL2 推奨)

## 🚀 クイックスタート

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd simple-crud
```

### 2. 環境変数の設定

```bash
# 環境変数ファイルをコピー
cp env.example .env

# 必要に応じて.envファイルを編集
# デフォルト値で開発環境は動作します
```

### 3. Docker 環境の起動

```bash
# 開発環境を起動（推奨）
make dev

# または直接docker-composeを使用
docker-compose -f docker-compose.dev.yml up
```

### 4. 動作確認

以下の URL にアクセスして動作を確認してください：

- **フロントエンド**: http://localhost:5173
- **バックエンド API**: http://localhost:3000
- **API 仕様書**: http://localhost:3000/api-docs
- **phpMyAdmin**: http://localhost:8080

## 🔧 詳細セットアップ

### 初回セットアップ

```bash
# 1. リポジトリのクローン
git clone <repository-url>
cd simple-crud

# 2. 環境変数の設定
cp env.example .env

# 3. 初期セットアップの実行
make setup

# 4. 開発環境の起動
make dev
```

### ローカル開発環境（Docker 不使用）

```bash
# バックエンドのセットアップ
cd backend
npm install
npm run db:generate
npm run db:push
npm run dev

# フロントエンドのセットアップ（別ターミナル）
cd frontend
npm install
npm run dev
```

### 本番環境のセットアップ

```bash
# 環境変数の設定
cp env.example .env
# .envファイルで本番用の値を設定

# 本番環境の起動
make prod
```

## 🔄 開発ワークフロー

### 基本的な開発フロー

1. **機能ブランチの作成**

   ```bash
   git checkout -b feature/new-feature
   ```

2. **開発環境の起動**

   ```bash
   make dev
   ```

3. **コードの実装**

   - フロントエンド: `frontend/src/` で作業
   - バックエンド: `backend/src/` で作業

4. **テストの実行**

   ```bash
   # バックエンドのテスト
   cd backend && npm test

   # フロントエンドのテスト
   cd frontend && npm test
   ```

5. **型生成の実行**（API 変更時）

   ```bash
   make generate-types
   ```

6. **コミットとプッシュ**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

### API 開発のワークフロー

1. **OpenAPI 仕様の更新** (`backend/openapi.yaml`)
2. **型生成の実行**
3. **バックエンド実装**
4. **フロントエンド実装**
5. **テストの実行**

### データベース変更のワークフロー

1. **Prisma スキーマの更新** (`backend/prisma/schema.prisma`)
2. **マイグレーションの生成**
   ```bash
   cd backend
   npx prisma migrate dev --name your-migration-name
   ```
3. **Prisma クライアントの再生成**
   ```bash
   npx prisma generate
   ```

## 📝 OpenAPI 仕様の更新

### 仕様ファイルの場所

- **ファイル**: `backend/openapi.yaml`
- **生成先**: `backend/src/types/api.ts`, `frontend/src/types/api.ts`

### 更新手順

1. **OpenAPI 仕様の編集**

   ```bash
   # 仕様ファイルを編集
   vim backend/openapi.yaml
   ```

2. **型生成の実行**

   ```bash
   # バックエンドとフロントエンド両方の型を生成
   cd backend
   npm run generate:all
   ```

3. **型の確認**
   ```bash
   # 生成された型を確認
   cat backend/src/types/api.ts
   cat frontend/src/types/api.ts
   ```

### 仕様書の確認

- **Swagger UI**: http://localhost:3000/api-docs
- **JSON 形式**: http://localhost:3000/api-docs-json

### よくある更新パターン

#### 新しいエンドポイントの追加

```yaml
paths:
  /api/users/{id}:
    get:
      summary: Get user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
```

#### 新しいスキーマの追加

```yaml
components:
  schemas:
    NewUser:
      type: object
      required:
        - name
        - email
      properties:
        name:
          type: string
          maxLength: 100
        email:
          type: string
          format: email
```

## 🔄 型生成手順

### 自動型生成

```bash
# 全サービスの型を生成
cd backend
npm run generate:all
```

### 個別型生成

```bash
# バックエンドのみ
npm run generate:types

# フロントエンドのみ
npm run generate:frontend-types
```

### 型生成のテスト

```bash
# 型生成の動作確認
npm run test:types
```

### 型生成のタイミング

- **API 仕様変更時**: OpenAPI 仕様を更新した後
- **開発開始時**: 最新の型を取得するため
- **CI/CD**: 自動化された型生成

### 型生成エラーの対処

```bash
# 型生成のクリーンアップ
rm -rf backend/src/types/api.ts
rm -rf frontend/src/types/api.ts

# 再生成
npm run generate:all
```

## 📋 利用可能なコマンド

### Makefile コマンド

```bash
# ヘルプを表示
make help

# 開発環境
make dev          # 開発環境を起動
make dev-build    # 開発環境をビルドして起動
make dev-logs     # 開発環境のログを表示

# 本番環境
make prod         # 本番環境を起動
make prod-build   # 本番環境をビルドして起動
make prod-logs    # 本番環境のログを表示

# ユーティリティ
make clean        # 全コンテナとボリュームを削除
make logs         # 全サービスのログを表示
make shell-backend # バックエンドコンテナに接続
make shell-frontend # フロントエンドコンテナに接続
make shell-mysql  # MySQLコンテナに接続
make setup        # 初期セットアップを実行
```

### Docker Compose コマンド

```bash
# 開発環境
docker-compose -f docker-compose.dev.yml up
docker-compose -f docker-compose.dev.yml up --build
docker-compose -f docker-compose.dev.yml down

# 本番環境
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml up --build -d
docker-compose -f docker-compose.prod.yml down
```

### バックエンドコマンド

```bash
cd backend

# 開発
npm run dev              # 開発サーバー起動
npm run build            # ビルド
npm run start            # 本番サーバー起動

# データベース
npm run db:generate      # Prismaクライアント生成
npm run db:push          # スキーマをDBに反映
npm run db:migrate       # マイグレーション実行
npm run db:studio        # Prisma Studio起動

# 型生成
npm run generate:types   # バックエンド型生成
npm run generate:frontend-types # フロントエンド型生成
npm run generate:all     # 全型生成
npm run test:types       # 型生成テスト
```

### フロントエンドコマンド

```bash
cd frontend

# 開発
npm run dev              # 開発サーバー起動
npm run build            # ビルド
npm run preview          # ビルド結果のプレビュー

# テスト・品質
npm run lint             # ESLint実行
npm run test             # テスト実行

# Storybook
npm run storybook        # Storybook起動
npm run build-storybook  # Storybookビルド
```

## 🌐 アクセス URL

### 開発環境

| サービス         | URL                            | 説明                   |
| ---------------- | ------------------------------ | ---------------------- |
| フロントエンド   | http://localhost:5173          | React アプリケーション |
| バックエンド API | http://localhost:3000          | Express API サーバー   |
| API 仕様書       | http://localhost:3000/api-docs | Swagger UI             |
| phpMyAdmin       | http://localhost:8080          | データベース管理       |

### 本番環境

| サービス         | URL                            | 説明                 |
| ---------------- | ------------------------------ | -------------------- |
| フロントエンド   | http://localhost:80            | Nginx 配信           |
| バックエンド API | http://localhost:3000          | Express API サーバー |
| API 仕様書       | http://localhost:3000/api-docs | Swagger UI           |

### データベース接続情報

| 項目         | 開発環境       | 本番環境       |
| ------------ | -------------- | -------------- |
| ホスト       | localhost      | localhost      |
| ポート       | 3307           | 3306           |
| データベース | simple_crud_db | simple_crud_db |
| ユーザー     | simple_crud    | simple_crud    |
| パスワード   | password       | 設定した値     |

## 📁 プロジェクト構造

```
simple-crud/
├── backend/                    # バックエンドAPI
│   ├── src/
│   │   ├── controllers/        # コントローラー
│   │   │   ├── healthController.ts
│   │   │   └── userController.ts
│   │   ├── middleware/         # ミドルウェア
│   │   │   ├── cors.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── routes/             # ルート定義
│   │   │   ├── healthRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   └── index.ts
│   │   ├── schemas/            # バリデーションスキーマ
│   │   │   └── userSchemas.ts
│   │   ├── types/              # 型定義
│   │   │   └── api.ts
│   │   ├── utils/              # ユーティリティ
│   │   │   ├── dbTest.ts
│   │   │   ├── params.ts
│   │   │   ├── swagger.ts
│   │   │   └── transformers.ts
│   │   ├── lib/                # ライブラリ設定
│   │   │   └── prisma.ts
│   │   └── server.ts           # サーバーエントリーポイント
│   ├── prisma/                 # データベーススキーマ
│   │   └── schema.prisma
│   ├── scripts/                # スクリプト
│   │   └── type-generation-test.js
│   ├── openapi.yaml            # OpenAPI仕様
│   ├── Dockerfile              # Docker設定
│   └── package.json
├── frontend/                   # フロントエンド
│   ├── src/
│   │   ├── components/         # Reactコンポーネント
│   │   │   ├── atoms/          # 原子コンポーネント
│   │   │   ├── molecules/      # 分子コンポーネント
│   │   │   ├── organisms/      # 生物コンポーネント
│   │   │   └── templates/      # テンプレート
│   │   ├── apis/               # APIクライアント
│   │   │   ├── config.ts
│   │   │   ├── errorHandler.ts
│   │   │   ├── index.ts
│   │   │   └── userApi.ts
│   │   ├── types/              # 型定義
│   │   │   └── api.ts
│   │   ├── hooks/              # カスタムフック
│   │   ├── constants/          # 定数
│   │   ├── stories/            # Storybook
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/                 # 静的ファイル
│   ├── nginx.conf              # Nginx設定
│   ├── Dockerfile              # Docker設定
│   └── package.json
├── mysql/                      # MySQL設定
│   ├── Dockerfile
│   └── init/
│       └── 01-init.sql
├── scripts/                    # プロジェクトスクリプト
│   └── docker-setup.sh
├── docker-compose.dev.yml      # 開発環境設定
├── docker-compose.prod.yml     # 本番環境設定
├── Makefile                    # 便利コマンド
├── env.example                 # 環境変数テンプレート
└── README.md                   # このファイル
```

## 🔧 トラブルシューティング

### よくある問題と解決方法

#### 1. ポートが既に使用されている

```bash
# エラー: Port 3000 is already in use
# 解決方法: 既存プロセスを停止
lsof -ti:3000 | xargs kill -9
```

#### 2. Docker コンテナが起動しない

```bash
# エラー: Container failed to start
# 解決方法: ログを確認
docker-compose -f docker-compose.dev.yml logs backend

# コンテナをクリーンアップ
make clean
make dev
```

#### 3. Prisma クライアントエラー

```bash
# エラー: Prisma Client could not locate Query Engine
# 解決方法: Prismaクライアントを再生成
cd backend
npx prisma generate
```

#### 4. 型生成エラー

```bash
# エラー: Type generation failed
# 解決方法: 型ファイルを削除して再生成
rm -rf backend/src/types/api.ts
rm -rf frontend/src/types/api.ts
cd backend
npm run generate:all
```

#### 5. データベース接続エラー

```bash
# エラー: Database connection failed
# 解決方法: MySQLコンテナの状態確認
docker-compose -f docker-compose.dev.yml ps mysql

# MySQLコンテナを再起動
docker-compose -f docker-compose.dev.yml restart mysql
```

#### 6. フロントエンドが表示されない

```bash
# エラー: Frontend not accessible
# 解決方法: フロントエンドコンテナの状態確認
docker-compose -f docker-compose.dev.yml logs frontend

# フロントエンドコンテナを再起動
docker-compose -f docker-compose.dev.yml restart frontend
```

### ログの確認方法

```bash
# 全サービスのログ
make logs

# 特定のサービスのログ
docker-compose -f docker-compose.dev.yml logs backend
docker-compose -f docker-compose.dev.yml logs frontend
docker-compose -f docker-compose.dev.yml logs mysql
```

### デバッグモードでの起動

```bash
# デバッグ情報付きで起動
docker-compose -f docker-compose.dev.yml up --build
```

## 🤝 貢献ガイド

### 開発に参加する

1. **リポジトリをフォーク**
2. **機能ブランチを作成**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **変更をコミット**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **ブランチにプッシュ**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **プルリクエストを作成**

### コーディング規約

- **TypeScript**: 厳密な型チェックを有効
- **ESLint**: コード品質の維持
- **Prettier**: コードフォーマットの統一
- **コミットメッセージ**: Conventional Commits 形式

### テスト

- **バックエンド**: Jest + Supertest
- **フロントエンド**: Vitest + React Testing Library
- **E2E**: Playwright（予定）

### ドキュメント

- **API 仕様**: OpenAPI 3.0 形式
- **コンポーネント**: Storybook
- **README**: 常に最新の状態を維持

## 📄 ライセンス

MIT License

## 📞 サポート

問題が発生した場合：

1. **README**を再度確認
2. **トラブルシューティング**セクションを参照
3. **Issues**で既存の問題を検索
4. 新しい Issue を作成

---

**Happy Coding! 🚀**
