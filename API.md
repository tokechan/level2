# API 仕様書

Simple CRUD アプリケーションの API 仕様について説明します。

## 📋 目次

- [API 概要](#-api概要)
- [認証](#-認証)
- [エラーハンドリング](#-エラーハンドリング)
- [エンドポイント一覧](#-エンドポイント一覧)
- [データモデル](#-データモデル)
- [レスポンス形式](#-レスポンス形式)
- [OpenAPI 仕様の更新](#-openapi仕様の更新)

## 🌐 API 概要

### ベース URL

- **開発環境**: `http://localhost:3000`
- **本番環境**: `https://your-domain.com`

### API バージョン

現在の API バージョン: `v1`

### データ形式

- **Content-Type**: `application/json`
- **Accept**: `application/json`

### レート制限

- **制限**: 1000 requests/hour per IP
- **ヘッダー**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## 🔐 認証

現在の API は認証機能を実装していませんが、将来的に JWT 認証を追加予定です。

### 将来の認証方式

```http
Authorization: Bearer <jwt_token>
```

## ❌ エラーハンドリング

### エラーレスポンス形式

```json
{
  "error": "ValidationError",
  "message": "Invalid input data",
  "statusCode": 400,
  "timestamp": "2025-09-12T08:00:00.000Z",
  "details": {
    "field": "email",
    "reason": "Invalid email format"
  }
}
```

### HTTP ステータスコード

| コード | 説明                  | 使用場面               |
| ------ | --------------------- | ---------------------- |
| 200    | OK                    | リクエスト成功         |
| 201    | Created               | リソース作成成功       |
| 400    | Bad Request           | リクエストデータが不正 |
| 404    | Not Found             | リソースが見つからない |
| 500    | Internal Server Error | サーバー内部エラー     |

### エラータイプ

| エラータイプ    | 説明                   | ステータスコード |
| --------------- | ---------------------- | ---------------- |
| ValidationError | バリデーションエラー   | 400              |
| NotFoundError   | リソースが見つからない | 404              |
| DatabaseError   | データベースエラー     | 500              |
| InternalError   | 内部サーバーエラー     | 500              |

## 📡 エンドポイント一覧

### ヘルスチェック

#### GET /health

サーバーの状態を確認します。

**リクエスト**

```http
GET /health
```

**レスポンス**

```json
{
  "status": "healthy",
  "timestamp": "2025-09-12T08:00:00.000Z",
  "version": "1.0.0",
  "uptime": 3600
}
```

### ユーザー管理

#### GET /api/users

ユーザー一覧を取得します。

**リクエスト**

```http
GET /api/users?page=1&limit=10&search=john
```

**クエリパラメータ**

- `page` (optional): ページ番号 (デフォルト: 1)
- `limit` (optional): 取得件数 (デフォルト: 10, 最大: 100)
- `search` (optional): 検索キーワード

**レスポンス**

```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-09-12T08:00:00.000Z",
      "updatedAt": "2025-09-12T08:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### GET /api/users/{id}

特定のユーザーを取得します。

**リクエスト**

```http
GET /api/users/1
```

**パスパラメータ**

- `id`: ユーザー ID (integer)

**レスポンス**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-09-12T08:00:00.000Z",
  "updatedAt": "2025-09-12T08:00:00.000Z"
}
```

#### POST /api/users

新しいユーザーを作成します。

**リクエスト**

```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**リクエストボディ**

```json
{
  "name": "string (required, max: 100)",
  "email": "string (required, email format)"
}
```

**レスポンス**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-09-12T08:00:00.000Z",
  "updatedAt": "2025-09-12T08:00:00.000Z"
}
```

#### PUT /api/users/{id}

ユーザー情報を更新します。

**リクエスト**

```http
PUT /api/users/1
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**パスパラメータ**

- `id`: ユーザー ID (integer)

**リクエストボディ**

```json
{
  "name": "string (optional, max: 100)",
  "email": "string (optional, email format)"
}
```

**レスポンス**

```json
{
  "id": 1,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "createdAt": "2025-09-12T08:00:00.000Z",
  "updatedAt": "2025-09-12T08:30:00.000Z"
}
```

#### DELETE /api/users/{id}

ユーザーを削除します。

**リクエスト**

```http
DELETE /api/users/1
```

**パスパラメータ**

- `id`: ユーザー ID (integer)

**レスポンス**

```json
{
  "message": "User deleted successfully"
}
```

## 📊 データモデル

### User

ユーザー情報を表すモデルです。

```typescript
interface User {
  id: number; // ユーザーID (自動生成)
  name: string; // ユーザー名 (最大100文字)
  email: string; // メールアドレス (ユニーク)
  createdAt: string; // 作成日時 (ISO 8601)
  updatedAt: string; // 更新日時 (ISO 8601)
}
```

### バリデーションルール

#### User 作成時

- `name`: 必須、文字列、最大 100 文字
- `email`: 必須、有効なメールアドレス形式、ユニーク

#### User 更新時

- `name`: オプション、文字列、最大 100 文字
- `email`: オプション、有効なメールアドレス形式、ユニーク

## 📤 レスポンス形式

### 成功レスポンス

#### 単一リソース

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-09-12T08:00:00.000Z",
  "updatedAt": "2025-09-12T08:00:00.000Z"
}
```

#### 複数リソース

```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2025-09-12T08:00:00.000Z",
      "updatedAt": "2025-09-12T08:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### エラーレスポンス

#### バリデーションエラー

```json
{
  "error": "ValidationError",
  "message": "Invalid input data",
  "statusCode": 400,
  "timestamp": "2025-09-12T08:00:00.000Z",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

#### リソースが見つからない

```json
{
  "error": "NotFoundError",
  "message": "User not found",
  "statusCode": 404,
  "timestamp": "2025-09-12T08:00:00.000Z"
}
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

#### 新しいスキーマの追加

```yaml
components:
  schemas:
    Post:
      type: object
      required:
        - title
        - content
        - userId
      properties:
        id:
          type: integer
          description: Post ID
        title:
          type: string
          maxLength: 200
          description: Post title
        content:
          type: string
          description: Post content
        userId:
          type: integer
          description: Author user ID
        createdAt:
          type: string
          format: date-time
          description: Creation timestamp
        updatedAt:
          type: string
          format: date-time
          description: Last update timestamp
```

#### エラーレスポンスの定義

```yaml
components:
  responses:
    ValidationError:
      description: Validation error
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: string
                example: 'ValidationError'
              message:
                type: string
                example: 'Invalid input data'
              statusCode:
                type: integer
                example: 400
              timestamp:
                type: string
                format: date-time
              details:
                type: array
                items:
                  type: object
                  properties:
                    field:
                      type: string
                    message:
                      type: string
```

### ベストプラクティス

1. **一貫性の維持**: 既存の API パターンに従う
2. **詳細な説明**: 各エンドポイントに適切な説明を追加
3. **例の提供**: リクエスト・レスポンスの例を含める
4. **バリデーション**: 入力データの制約を明確に定義
5. **エラーハンドリング**: 考えられるエラーケースを網羅

---

この API 仕様書を参考に、一貫性のある API を設計・実装してください。質問や改善提案があれば、お気軽にお声がけください！
