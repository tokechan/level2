# Simple CRUD Docker統合 Makefile

.PHONY: help dev prod build clean logs shell-backend shell-frontend shell-mysql setup

# デフォルトターゲット
help:
	@echo "Simple CRUD Docker統合コマンド:"
	@echo ""
	@echo "開発環境:"
	@echo "  make dev          - 開発環境を起動"
	@echo "  make dev-build    - 開発環境をビルドして起動"
	@echo "  make dev-logs     - 開発環境のログを表示"
	@echo ""
	@echo "本番環境:"
	@echo "  make prod         - 本番環境を起動"
	@echo "  make prod-build   - 本番環境をビルドして起動"
	@echo "  make prod-logs    - 本番環境のログを表示"
	@echo ""
	@echo "ユーティリティ:"
	@echo "  make clean        - 全コンテナとボリュームを削除"
	@echo "  make logs         - 全サービスのログを表示"
	@echo "  make shell-backend - バックエンドコンテナに接続"
	@echo "  make shell-frontend - フロントエンドコンテナに接続"
	@echo "  make shell-mysql  - MySQLコンテナに接続"
	@echo "  make setup        - 初期セットアップを実行"

# 開発環境
dev:
	@echo "🚀 開発環境を起動中..."
	docker-compose -f docker-compose.dev.yml up

dev-build:
	@echo "🔨 開発環境をビルドして起動中..."
	docker-compose -f docker-compose.dev.yml up --build

dev-logs:
	@echo "📋 開発環境のログを表示中..."
	docker-compose -f docker-compose.dev.yml logs -f

# 本番環境
prod:
	@echo "🏭 本番環境を起動中..."
	docker-compose -f docker-compose.prod.yml up -d

prod-build:
	@echo "🔨 本番環境をビルドして起動中..."
	docker-compose -f docker-compose.prod.yml up --build -d

prod-logs:
	@echo "📋 本番環境のログを表示中..."
	docker-compose -f docker-compose.prod.yml logs -f

# ユーティリティ
clean:
	@echo "🧹 全コンテナとボリュームを削除中..."
	docker-compose -f docker-compose.dev.yml down -v --remove-orphans
	docker-compose -f docker-compose.prod.yml down -v --remove-orphans
	docker system prune -f

logs:
	@echo "📋 全サービスのログを表示中..."
	docker-compose -f docker-compose.dev.yml logs -f

shell-backend:
	@echo "🐚 バックエンドコンテナに接続中..."
	docker-compose -f docker-compose.dev.yml exec backend sh

shell-frontend:
	@echo "🐚 フロントエンドコンテナに接続中..."
	docker-compose -f docker-compose.dev.yml exec frontend sh

shell-mysql:
	@echo "🐚 MySQLコンテナに接続中..."
	docker-compose -f docker-compose.dev.yml exec mysql mysql -u root -ppassword simple_crud_db

setup:
	@echo "⚙️ 初期セットアップを実行中..."
	@if [ ! -f .env ]; then \
		echo "📝 .envファイルを作成中..."; \
		cp env.example .env; \
	fi
	@echo "✅ セットアップが完了しました！"
	@echo "💡 開発環境を起動するには: make dev"
