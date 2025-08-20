# 家計簿アプリ API仕様書

## 概要

- **ベースURL**: `http://localhost:8080/api`
- **Content-Type**: `application/json`
- **認証**: なし（開発版）

## エンドポイント一覧

### 1. カテゴリ管理 API

#### 1.1 カテゴリ一覧取得
```
GET /categories
```

**レスポンス**
```json
[
  {
    "id": 1,
    "name": "食費",
    "created_at": "2025-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "name": "交通費",
    "created_at": "2025-01-01T00:00:00.000Z"
  }
]
```

#### 1.2 カテゴリ詳細取得
```
GET /categories/:id
```

**パラメータ**
- `id` (number): カテゴリID

**レスポンス**
```json
{
  "id": 1,
  "name": "食費",
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

**エラーレスポンス**
- `400`: Invalid category ID
- `404`: Category not found
- `500`: Internal Server Error

#### 1.3 カテゴリ作成
```
POST /categories
```

**リクエストボディ**
```json
{
  "name": "新しいカテゴリ"
}
```

**レスポンス**
```json
{
  "id": 8,
  "name": "新しいカテゴリ",
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

**エラーレスポンス**
- `400`: Category name is required
- `500`: Internal Server Error

#### 1.4 カテゴリ更新
```
PUT /categories/:id
```

**パラメータ**
- `id` (number): カテゴリID

**リクエストボディ**
```json
{
  "name": "更新されたカテゴリ名"
}
```

**レスポンス**
```json
{
  "id": 1,
  "name": "更新されたカテゴリ名",
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

**エラーレスポンス**
- `400`: Invalid category ID / Category name is required
- `404`: Category not found
- `500`: Internal Server Error

#### 1.5 カテゴリ削除
```
DELETE /categories/:id
```

**パラメータ**
- `id` (number): カテゴリID

**レスポンス**
```json
{
  "id": 1,
  "name": "削除されたカテゴリ",
  "created_at": "2025-01-01T00:00:00.000Z"
}
```

**エラーレスポンス**
- `400`: Invalid category ID
- `404`: Category not found
- `500`: Internal Server Error

### 2. 取引管理 API

#### 2.1 取引一覧取得
```
GET /transactions
```

**レスポンス**
```json
[
  {
    "id": 1,
    "type": "expense",
    "amount": 80000,
    "date": "2025-07-01",
    "category_id": 1,
    "memo": "7月分家賃",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  },
  {
    "id": 2,
    "type": "income",
    "amount": 250000,
    "date": "2025-07-25",
    "category_id": null,
    "memo": "給料",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
]
```

#### 2.2 取引詳細取得
```
GET /transactions/:id
```

**パラメータ**
- `id` (number): 取引ID

**レスポンス**
```json
{
  "id": 1,
  "type": "expense",
  "amount": 80000,
  "date": "2025-07-01",
  "category_id": 1,
  "memo": "7月分家賃",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

**エラーレスポンス**
- `400`: Invalid transaction ID
- `404`: Transaction not found
- `500`: Internal Server Error

#### 2.3 取引作成
```
POST /transactions
```

**リクエストボディ（支出の場合）**
```json
{
  "type": "expense",
  "amount": 80000,
  "date": "2025-07-01",
  "category_id": 1,
  "memo": "7月分家賃"
}
```

**リクエストボディ（収入の場合）**
```json
{
  "type": "income",
  "amount": 250000,
  "date": "2025-07-25",
  "memo": "給料"
}
```

**レスポンス**
```json
{
  "id": 1,
  "type": "expense",
  "amount": 80000,
  "date": "2025-07-01",
  "category_id": 1,
  "memo": "7月分家賃",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

**バリデーションルール**
- `type`: "income" または "expense" のみ
- `amount`: 正の数値のみ
- `date`: 必須
- `category_id`: 支出の場合は必須、収入の場合は不要
- `memo`: 任意

**エラーレスポンス**
- `400`: Type, amount, and date are required / Amount must be a positive number / Type must be either "income" or "expense" / Category ID is required for expense / Category ID is not required for income / Category ID does not exist
- `500`: Internal Server Error

#### 2.4 取引更新
```
PUT /transactions/:id
```

**パラメータ**
- `id` (number): 取引ID

**リクエストボディ**
```json
{
  "type": "expense",
  "amount": 85000,
  "date": "2025-07-01",
  "category_id": 1,
  "memo": "7月分家賃（更新）"
}
```

**レスポンス**
```json
{
  "id": 1,
  "type": "expense",
  "amount": 85000,
  "date": "2025-07-01",
  "category_id": 1,
  "memo": "7月分家賃（更新）",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

**更新ルール**
- 部分更新対応（指定されたフィールドのみ更新）
- 収入から支出に変更する場合、category_idが必須
- 支出から収入に変更する場合、category_idは自動的にnullに設定

**エラーレスポンス**
- `400`: Invalid transaction ID / Type must be either "income" or "expense" / Category ID is required for expense / Category ID does not exist
- `404`: Transaction not found
- `500`: Internal Server Error

#### 2.5 取引削除
```
DELETE /transactions/:id
```

**パラメータ**
- `id` (number): 取引ID

**レスポンス**
```json
{
  "id": 1,
  "type": "expense",
  "amount": 80000,
  "date": "2025-07-01",
  "category_id": 1,
  "memo": "7月分家賃",
  "created_at": "2025-01-01T00:00:00.000Z",
  "updated_at": "2025-01-01T00:00:00.000Z"
}
```

**エラーレスポンス**
- `400`: Invalid transaction ID
- `404`: Transaction not found
- `500`: Internal Server Error

## データ型定義

### TransactionType
```typescript
type TransactionType = 'income' | 'expense';
```

### Transaction
```typescript
interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  date: string;
  category_id: number | null;
  memo: string | null;
  created_at?: string;
  updated_at?: string;
}
```

### CreateTransactionRequest
```typescript
interface CreateTransactionRequest {
  type: TransactionType;
  amount: number;
  date: string;
  category_id?: number;
  memo?: string;
}
```

### Category
```typescript
interface Category {
  id: number;
  name: string;
  created_at?: string;
}
```

## エラーレスポンス形式

```json
{
  "error": "エラーメッセージ"
}
```

## HTTPステータスコード

- `200`: 成功（GET, PUT, DELETE）
- `201`: 作成成功（POST）
- `400`: バリデーションエラー
- `404`: リソースが見つからない
- `500`: サーバー内部エラー

## 使用例

### cURL での使用例

#### カテゴリ作成
```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "食費"}'
```

#### 取引作成（支出）
```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "expense",
    "amount": 80000,
    "date": "2025-07-01",
    "category_id": 1,
    "memo": "7月分家賃"
  }'
```

#### 取引作成（収入）
```bash
curl -X POST http://localhost:8080/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "income",
    "amount": 250000,
    "date": "2025-07-25",
    "memo": "給料"
  }'
```

#### 取引一覧取得
```bash
curl -X GET http://localhost:8080/api/transactions
```

## 注意事項

1. **収入取引**: category_idは不要（null）
2. **支出取引**: category_idは必須
3. **日付形式**: YYYY-MM-DD形式
4. **金額**: 正の数値のみ
5. **CORS**: 開発環境では全てのオリジンからのアクセスを許可

---

**作成日**: 2025年1月  
**バージョン**: 1.0.0
