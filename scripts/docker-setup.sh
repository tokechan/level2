#!/bin/bash

# Docker統合セットアップスクリプト
# 型生成の自動化とDocker環境の初期化

set -e

echo "🚀 Simple CRUD Docker統合セットアップを開始します..."

# 環境変数の設定
export NODE_ENV=${NODE_ENV:-development}
export DATABASE_URL="mysql://simple_crud:password@mysql:3306/simple_crud_db"

# 関数定義
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# 型生成関数
generate_types() {
    log "📝 型生成を開始します..."
    
    # バックエンドの型生成
    log "バックエンドの型生成中..."
    cd /app/backend
    npm run generate:all
    
    # 型生成のテスト
    log "型生成のテスト中..."
    npm run test:types
    
    log "✅ 型生成が完了しました"
}

# データベース初期化関数
init_database() {
    log "🗄️ データベースの初期化を開始します..."
    
    # Prismaクライアントの生成
    log "Prismaクライアントを生成中..."
    cd /app/backend
    npx prisma generate
    
    # データベースのマイグレーション
    log "データベースマイグレーションを実行中..."
    npx prisma db push
    
    log "✅ データベースの初期化が完了しました"
}

# 開発環境セットアップ
setup_dev() {
    log "🔧 開発環境のセットアップを開始します..."
    
    # 依存関係のインストール
    log "依存関係をインストール中..."
    cd /app/backend && npm install
    cd /app/frontend && npm install
    
    # 型生成
    generate_types
    
    # データベース初期化
    init_database
    
    log "✅ 開発環境のセットアップが完了しました"
}

# 本番環境セットアップ
setup_prod() {
    log "🏭 本番環境のセットアップを開始します..."
    
    # 型生成
    generate_types
    
    # データベース初期化
    init_database
    
    log "✅ 本番環境のセットアップが完了しました"
}

# メイン処理
main() {
    case "${NODE_ENV}" in
        "development")
            setup_dev
            ;;
        "production")
            setup_prod
            ;;
        *)
            log "❌ 不明な環境: ${NODE_ENV}"
            exit 1
            ;;
    esac
    
    log "🎉 セットアップが完了しました！"
}

# スクリプト実行
main "$@"
