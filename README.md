# Simple CRUD Application

React + TypeScript + Node.js + MySQL を使用したフルスタックCRUDアプリケーションです。

## 🏗️ アーキテクチャ

- **フロントエンド**: React + TypeScript + Vite
- **バックエンド**: Node.js + Express + TypeScript
- **データベース**: MySQL 8.0
- **ORM**: Prisma
- **コンテナ**: Docker + Docker Compose
- **API仕様**: OpenAPI 3.0

## 🚀 クイックスタート

### 前提条件

- Docker & Docker Compose
- Node.js 20+ (ローカル開発用)

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd simple-crud
```

### 2. 環境変数の設定

```bash
cp env.example .env
# .envファイルを編集して適切な値を設定
```

### 3. Docker環境の起動

#### 開発環境
```bash
# 開発環境を起動
make dev

# または直接docker-composeを使用
docker-compose -f docker-compose.dev.yml up
```

#### 本番環境
```bash
# 本番環境を起動
make prod

# または直接docker-composeを使用
docker-compose -f docker-compose.prod.yml up -d
```

## 📋 利用可能なコマンド

### Makefileコマンド

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

### Docker Composeコマンド

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

## 🌐 アクセスURL

### 開発環境
- **フロントエンド**: http://localhost:5173
- **バックエンドAPI**: http://localhost:3000
- **API仕様書**: http://localhost:3000/api-docs
- **phpMyAdmin**: http://localhost:8080

### 本番環境
- **フロントエンド**: http://localhost:80
- **バックエンドAPI**: http://localhost:3000
- **API仕様書**: http://localhost:3000/api-docs

## 🗄️ データベース

### 接続情報
- **ホスト**: localhost
- **ポート**: 3307 (開発) / 3306 (本番)
- **データベース**: simple_crud_db
- **ユーザー**: simple_crud
- **パスワード**: password (開発) / 設定した値 (本番)

### マイグレーション

```bash
# バックエンドコンテナ内で実行
docker-compose -f docker-compose.dev.yml exec backend npx prisma db push
docker-compose -f docker-compose.dev.yml exec backend npx prisma generate
```

## 🔧 開発

### ローカル開発

```bash
# バックエンド
cd backend
npm install
npm run dev

# フロントエンド
cd frontend
npm install
npm run dev
```

### 型生成

```bash
# バックエンドコンテナ内で実行
docker-compose -f docker-compose.dev.yml exec backend npm run generate:all
```

## 📁 プロジェクト構造

```
simple-crud/
├── backend/                 # バックエンドAPI
│   ├── src/
│   │   ├── controllers/     # コントローラー
│   │   ├── middleware/      # ミドルウェア
│   │   ├── routes/          # ルート定義
│   │   ├── schemas/         # バリデーションスキーマ
│   │   ├── types/           # 型定義
│   │   └── utils/           # ユーティリティ
│   ├── prisma/              # データベーススキーマ
│   └── Dockerfile
├── frontend/                # フロントエンド
│   ├── src/
│   │   ├── components/      # Reactコンポーネント
│   │   ├── apis/            # APIクライアント
│   │   └── types/           # 型定義
│   └── Dockerfile
├── mysql/                   # MySQL設定
├── scripts/                 # スクリプト
├── docker-compose.dev.yml   # 開発環境設定
├── docker-compose.prod.yml  # 本番環境設定
└── Makefile                 # 便利コマンド
```

## 🐳 Docker統合の利点

1. **開発環境の統一**: チーム全員が同じ環境で開発
2. **依存関係の管理**: Node.js、MySQL等を自動管理
3. **デプロイの簡素化**: コンテナベースのデプロイメント
4. **開発効率の向上**: 一つのコマンドで全サービス起動
5. **型生成の自動化**: OpenAPIからTypeScript型を自動生成

## 🔒 セキュリティ

- 本番環境では適切なパスワードを設定してください
- 環境変数ファイル（.env）はGitにコミットしないでください
- HTTPSの設定を推奨します

## 📝 ライセンス

MIT License
