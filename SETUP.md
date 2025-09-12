# セットアップガイド

新規開発者向けの詳細なセットアップ手順を説明します。

## 📋 目次

- [前提条件](#-前提条件)
- [クイックスタート](#-クイックスタート)
- [詳細セットアップ](#-詳細セットアップ)
- [トラブルシューティング](#-トラブルシューティング)
- [開発環境の確認](#-開発環境の確認)

## 📋 前提条件

### 必須ソフトウェア

#### Docker & Docker Compose

```bash
# Dockerのインストール確認
docker --version
# Docker version 20.10.0 or higher

# Docker Composeのインストール確認
docker-compose --version
# Docker Compose version 2.0.0 or higher
```

**インストール方法:**

- **macOS**: [Docker Desktop for Mac](https://docs.docker.com/desktop/mac/install/)
- **Windows**: [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/install/)
- **Linux**: [Docker Engine](https://docs.docker.com/engine/install/)

#### Node.js

```bash
# Node.jsのバージョン確認
node --version
# v20.0.0 or higher

# npmのバージョン確認
npm --version
# 9.0.0 or higher
```

**インストール方法:**

- **公式サイト**: [nodejs.org](https://nodejs.org/)
- **nvm 使用**: `nvm install 20 && nvm use 20`

#### Git

```bash
# Gitのバージョン確認
git --version
# git version 2.30.0 or higher
```

### 推奨ツール

#### VS Code

- **ダウンロード**: [code.visualstudio.com](https://code.visualstudio.com/)
- **推奨拡張機能**:
  - TypeScript and JavaScript Language Features
  - ESLint
  - Prettier
  - Prisma
  - Docker

#### データベース管理ツール

- **TablePlus**: [tableplus.com](https://tableplus.com/)
- **MySQL Workbench**: [dev.mysql.com](https://dev.mysql.com/downloads/workbench/)

### システム要件

- **メモリ**: 最低 4GB、推奨 8GB 以上
- **ストレージ**: 最低 2GB の空き容量
- **OS**: macOS 10.15+, Windows 10+, Ubuntu 18.04+

## 🚀 クイックスタート

### 1. リポジトリのクローン

```bash
# リポジトリをクローン
git clone <repository-url>
cd simple-crud

# 現在のブランチを確認
git branch
```

### 2. 環境変数の設定

```bash
# 環境変数ファイルをコピー
cp env.example .env

# ファイルの内容を確認（必要に応じて編集）
cat .env
```

**デフォルト設定で開発環境は動作しますが、必要に応じて以下を編集してください:**

```bash
# .envファイルの例
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_PASSWORD=your_secure_password
DATABASE_URL=mysql://simple_crud:your_secure_password@mysql:3306/simple_crud_db
NODE_ENV=development
PORT=3000
VITE_API_URL=http://localhost:3000
```

### 3. Docker 環境の起動

```bash
# 開発環境を起動（推奨）
make dev

# または直接docker-composeを使用
docker-compose -f docker-compose.dev.yml up
```

**初回起動時は以下の処理が実行されます:**

- Docker イメージのビルド
- 依存関係のインストール
- データベースの初期化
- 型生成の実行

### 4. 動作確認

以下の URL にアクセスして動作を確認してください：

```bash
# ヘルスチェック
curl http://localhost:3000/health

# フロントエンドの確認
open http://localhost:5173

# API仕様書の確認
open http://localhost:3000/api-docs

# データベース管理
open http://localhost:8080
```

## 🔧 詳細セットアップ

### 初回セットアップ（完全版）

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

# 5. 動作確認
make test-setup
```

### ローカル開発環境（Docker 不使用）

**注意**: この方法では、MySQL がローカルで動作している必要があります。

#### 1. MySQL のセットアップ

```bash
# macOS (Homebrew)
brew install mysql
brew services start mysql

# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql

# Windows
# MySQL Installerを使用してインストール
```

#### 2. データベースの作成

```bash
# MySQLに接続
mysql -u root -p

# データベースとユーザーを作成
CREATE DATABASE simple_crud_db;
CREATE USER 'simple_crud'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON simple_crud_db.* TO 'simple_crud'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 3. バックエンドのセットアップ

```bash
cd backend

# 依存関係のインストール
npm install

# 環境変数の設定
echo "DATABASE_URL=mysql://simple_crud:password@localhost:3306/simple_crud_db" > .env

# Prismaクライアントの生成
npm run db:generate

# データベーススキーマの適用
npm run db:push

# 開発サーバーの起動
npm run dev
```

#### 4. フロントエンドのセットアップ

```bash
# 新しいターミナルで実行
cd frontend

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### 本番環境のセットアップ

```bash
# 1. 環境変数の設定
cp env.example .env

# 2. 本番用の値を設定
vim .env
# MYSQL_ROOT_PASSWORD=your_secure_production_password
# MYSQL_PASSWORD=your_secure_production_password
# NODE_ENV=production

# 3. 本番環境の起動
make prod

# 4. 動作確認
curl http://localhost:3000/health
```

## 🔍 トラブルシューティング

### よくある問題と解決方法

#### 1. Docker が起動しない

**エラー**: `Docker is not running`

**解決方法**:

```bash
# Docker Desktopを起動
# macOS/Windows: Docker Desktopアプリを起動
# Linux: Dockerサービスを起動
sudo systemctl start docker
```

#### 2. ポートが既に使用されている

**エラー**: `Port 3000 is already in use`

**解決方法**:

```bash
# 使用中のプロセスを確認
lsof -i :3000

# プロセスを終了
kill -9 <PID>

# または、別のポートを使用
# .envファイルでPORT=3001に変更
```

#### 3. データベース接続エラー

**エラー**: `Database connection failed`

**解決方法**:

```bash
# MySQLコンテナの状態確認
docker-compose -f docker-compose.dev.yml ps mysql

# MySQLコンテナのログ確認
docker-compose -f docker-compose.dev.yml logs mysql

# MySQLコンテナを再起動
docker-compose -f docker-compose.dev.yml restart mysql
```

#### 4. Prisma クライアントエラー

**エラー**: `Prisma Client could not locate Query Engine`

**解決方法**:

```bash
cd backend

# Prismaクライアントを再生成
npx prisma generate

# データベーススキーマを再適用
npx prisma db push
```

#### 5. 型生成エラー

**エラー**: `Type generation failed`

**解決方法**:

```bash
cd backend

# 型ファイルを削除
rm -rf src/types/api.ts
rm -rf ../frontend/src/types/api.ts

# 型を再生成
npm run generate:all
```

#### 6. フロントエンドが表示されない

**エラー**: `Frontend not accessible`

**解決方法**:

```bash
# フロントエンドコンテナの状態確認
docker-compose -f docker-compose.dev.yml ps frontend

# フロントエンドコンテナのログ確認
docker-compose -f docker-compose.dev.yml logs frontend

# フロントエンドコンテナを再起動
docker-compose -f docker-compose.dev.yml restart frontend
```

#### 7. メモリ不足エラー

**エラー**: `Out of memory`

**解決方法**:

```bash
# Docker Desktopのメモリ設定を増やす
# Docker Desktop > Settings > Resources > Memory > 4GB以上に設定

# または、不要なコンテナを削除
docker system prune -a
```

### ログの確認方法

```bash
# 全サービスのログ
make logs

# 特定のサービスのログ
docker-compose -f docker-compose.dev.yml logs backend
docker-compose -f docker-compose.dev.yml logs frontend
docker-compose -f docker-compose.dev.yml logs mysql

# リアルタイムログ
docker-compose -f docker-compose.dev.yml logs -f backend
```

### デバッグモードでの起動

```bash
# デバッグ情報付きで起動
docker-compose -f docker-compose.dev.yml up --build

# 特定のサービスのみ起動
docker-compose -f docker-compose.dev.yml up backend mysql
```

## ✅ 開発環境の確認

### セットアップ完了チェックリスト

- [ ] Docker & Docker Compose がインストールされている
- [ ] Node.js 20+がインストールされている
- [ ] Git がインストールされている
- [ ] リポジトリがクローンされている
- [ ] 環境変数ファイルが設定されている
- [ ] Docker 環境が起動している
- [ ] 全サービスが正常に動作している

### 動作確認コマンド

```bash
# 1. ヘルスチェック
curl http://localhost:3000/health

# 2. フロントエンド確認
curl http://localhost:5173

# 3. API仕様書確認
curl http://localhost:3000/api-docs

# 4. データベース接続確認
docker-compose -f docker-compose.dev.yml exec mysql mysql -u root -ppassword -e "SHOW DATABASES;"

# 5. 型生成確認
cd backend && npm run test:types
```

### 自動テストスクリプト

```bash
# セットアップテストの実行
make test-setup

# または手動でテスト
./scripts/test-setup.sh
```

### 開発環境の状態確認

```bash
# コンテナの状態確認
docker-compose -f docker-compose.dev.yml ps

# リソース使用量確認
docker stats

# ボリューム確認
docker volume ls

# ネットワーク確認
docker network ls
```

---

このセットアップガイドに従って、開発環境を構築してください。問題が発生した場合は、トラブルシューティングセクションを参照するか、Issues で質問してください。
