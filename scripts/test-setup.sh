#!/bin/bash

# セットアップテストスクリプト
# 新規開発者の環境構築が正常に完了しているかを確認

set -e

# 色付きの出力用
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ログ関数
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# テスト結果のカウンター
TESTS_PASSED=0
TESTS_FAILED=0

# テスト関数
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    log "Testing: $test_name"
    
    if eval "$test_command" > /dev/null 2>&1; then
        success "$test_name - PASSED"
        ((TESTS_PASSED++))
        return 0
    else
        error "$test_name - FAILED"
        if [ -n "$expected_result" ]; then
            warning "Expected: $expected_result"
        fi
        ((TESTS_FAILED++))
        return 1
    fi
}

# ヘルパー関数
check_url() {
    local url="$1"
    local expected_status="${2:-200}"
    
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$status_code" = "$expected_status" ]; then
        return 0
    else
        return 1
    fi
}

check_docker_container() {
    local container_name="$1"
    local expected_status="${2:-running}"
    
    local status=$(docker inspect --format='{{.State.Status}}' "$container_name" 2>/dev/null || echo "not_found")
    
    if [ "$status" = "$expected_status" ]; then
        return 0
    else
        return 1
    fi
}

# メイン処理
main() {
    log "🚀 Simple CRUD セットアップテストを開始します..."
    echo
    
    # 1. 前提条件の確認
    log "📋 前提条件の確認"
    
    run_test "Docker がインストールされている" "docker --version"
    run_test "Docker Compose がインストールされている" "docker-compose --version"
    run_test "Node.js がインストールされている" "node --version"
    run_test "npm がインストールされている" "npm --version"
    run_test "Git がインストールされている" "git --version"
    
    echo
    
    # 2. プロジェクトファイルの確認
    log "📁 プロジェクトファイルの確認"
    
    run_test "README.md が存在する" "test -f README.md"
    run_test "docker-compose.dev.yml が存在する" "test -f docker-compose.dev.yml"
    run_test "Makefile が存在する" "test -f Makefile"
    run_test "env.example が存在する" "test -f env.example"
    run_test ".env ファイルが存在する" "test -f .env"
    
    echo
    
    # 3. Docker環境の確認
    log "🐳 Docker環境の確認"
    
    run_test "Docker デーモンが動作している" "docker info > /dev/null 2>&1"
    
    # コンテナの状態確認
    if check_docker_container "simple-crud-mysql-dev" "running"; then
        success "MySQL コンテナが動作している"
        ((TESTS_PASSED++))
    else
        error "MySQL コンテナが動作していない"
        ((TESTS_FAILED++))
    fi
    
    if check_docker_container "simple-crud-backend-dev" "running"; then
        success "Backend コンテナが動作している"
        ((TESTS_PASSED++))
    else
        error "Backend コンテナが動作していない"
        ((TESTS_FAILED++))
    fi
    
    if check_docker_container "simple-crud-frontend-dev" "running"; then
        success "Frontend コンテナが動作している"
        ((TESTS_PASSED++))
    else
        error "Frontend コンテナが動作していない"
        ((TESTS_FAILED++))
    fi
    
    if check_docker_container "simple-crud-phpmyadmin-dev" "running"; then
        success "phpMyAdmin コンテナが動作している"
        ((TESTS_PASSED++))
    else
        error "phpMyAdmin コンテナが動作していない"
        ((TESTS_FAILED++))
    fi
    
    echo
    
    # 4. サービス接続の確認
    log "🌐 サービス接続の確認"
    
    run_test "Backend API が応答する" "check_url http://localhost:3000/health 200"
    run_test "Frontend が応答する" "check_url http://localhost:5173 200"
    run_test "API仕様書が応答する" "check_url http://localhost:3000/api-docs/ 200"
    run_test "phpMyAdmin が応答する" "check_url http://localhost:8080 200"
    
    echo
    
    # 5. API機能の確認
    log "🔌 API機能の確認"
    
    # ヘルスチェックAPIの詳細確認
    local health_response=$(curl -s http://localhost:3000/health 2>/dev/null || echo "")
    if echo "$health_response" | grep -q "healthy"; then
        success "ヘルスチェックAPI が正常なレスポンスを返す"
        ((TESTS_PASSED++))
    else
        error "ヘルスチェックAPI が正常なレスポンスを返さない"
        ((TESTS_FAILED++))
    fi
    
    # ユーザーAPIの確認
    run_test "ユーザー一覧API が応答する" "check_url http://localhost:3000/api/users 200"
    
    echo
    
    # 6. データベース接続の確認
    log "🗄️ データベース接続の確認"
    
    local db_test=$(docker-compose -f docker-compose.dev.yml exec -T mysql mysql -u root -ppassword -e "SHOW DATABASES;" 2>/dev/null | grep -c "simple_crud_db" || echo "0")
    if [ "$db_test" -gt 0 ]; then
        success "データベース接続が正常"
        ((TESTS_PASSED++))
    else
        error "データベース接続に問題がある"
        ((TESTS_FAILED++))
    fi
    
    echo
    
    # 7. 型生成の確認
    log "📝 型生成の確認"
    
    run_test "バックエンド型ファイルが存在する" "test -f backend/src/types/api.ts"
    run_test "フロントエンド型ファイルが存在する" "test -f frontend/src/types/api.ts"
    
    # 型生成テストの実行
    if cd backend && npm run test:types > /dev/null 2>&1; then
        success "型生成テストが成功"
        ((TESTS_PASSED++))
    else
        error "型生成テストが失敗"
        ((TESTS_FAILED++))
    fi
    cd ..
    
    echo
    
    # 8. 開発ツールの確認
    log "🛠️ 開発ツールの確認"
    
    run_test "package.json が存在する" "test -f backend/package.json"
    run_test "package.json が存在する" "test -f frontend/package.json"
    
    echo
    
    # 結果の表示
    log "📊 テスト結果"
    echo "=================================="
    success "成功: $TESTS_PASSED テスト"
    if [ $TESTS_FAILED -gt 0 ]; then
        error "失敗: $TESTS_FAILED テスト"
    else
        success "失敗: $TESTS_FAILED テスト"
    fi
    echo "=================================="
    
    # 総合結果
    if [ $TESTS_FAILED -eq 0 ]; then
        echo
        success "🎉 すべてのテストが成功しました！"
        success "開発環境のセットアップが完了しています。"
        echo
        log "次のステップ:"
        echo "1. http://localhost:5173 でフロントエンドを確認"
        echo "2. http://localhost:3000/api-docs でAPI仕様書を確認"
        echo "3. http://localhost:8080 でデータベースを管理"
        echo "4. README.md を読んで開発を開始"
        exit 0
    else
        echo
        error "❌ いくつかのテストが失敗しました。"
        error "トラブルシューティングセクションを確認してください。"
        echo
        log "推奨される対処法:"
        echo "1. make clean でコンテナをクリーンアップ"
        echo "2. make dev で開発環境を再起動"
        echo "3. SETUP.md のトラブルシューティングを参照"
        exit 1
    fi
}

# スクリプトの実行
main "$@"
