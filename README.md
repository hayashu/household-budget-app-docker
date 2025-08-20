# 🏠 家計簿アプリ (Household Budget App)

React + TypeScript + Node.js + PostgreSQL で構築されたモダンな家計簿管理アプリケーションです。

## 📋 目次

- [機能](#機能)
- [技術スタック](#技術スタック)
- [セットアップ](#セットアップ)
- [使用方法](#使用方法)
- [API仕様](#api仕様)
- [開発](#開発)
- [デプロイ](#デプロイ)
- [貢献](#貢献)

## ✨ 機能

### 📊 ダッシュボード
- 収入・支出・残高のサマリー表示
- 月別収支グラフ
- カテゴリ別支出円グラフ
- 支出トレンド分析

### 💰 取引管理
- 収入・支出の記録
- カテゴリ分類
- メモ機能
- 取引履歴の表示・編集・削除

### 📁 カテゴリ管理
- カスタムカテゴリの作成
- カテゴリの編集・削除
- カテゴリ別統計

### 📈 分析機能
- 月別収支分析
- カテゴリ別支出分析
- 支出トレンド分析

## 🛠 技術スタック

### フロントエンド
- **React 19** - UIライブラリ
- **TypeScript** - 型安全性
- **Vite** - ビルドツール
- **Tailwind CSS** - スタイリング
- **DaisyUI** - UIコンポーネント
- **Recharts** - グラフ・チャート
- **React Router** - ルーティング
- **Axios** - HTTP通信

### バックエンド
- **Node.js** - ランタイム
- **Express.js** - Webフレームワーク
- **TypeScript** - 型安全性
- **PostgreSQL** - データベース
- **pg** - PostgreSQLクライアント

### インフラ
- **Docker** - コンテナ化
- **Docker Compose** - マルチコンテナ管理
- **Nginx** - リバースプロキシ（本番環境）

## 🚀 セットアップ

### 前提条件
- Docker & Docker Compose
- Node.js 20+ (ローカル開発用)

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd household-budget-app-docker
```

### 2. 環境変数の設定
```bash
cp env.example .env
# .envファイルを編集して必要な設定を行ってください
```

### 3. Dockerでの起動

#### 開発環境
```bash
# 開発環境で起動
docker compose -f docker-compose.dev.yml up --build

# バックグラウンドで起動
docker compose -f docker-compose.dev.yml up --build -d

# 停止
docker compose -f docker-compose.dev.yml down
```

#### 本番環境
```bash
# 本番環境で起動
docker compose up --build

# バックグラウンドで起動
docker compose up --build -d

# 停止
docker compose down
```

### 4. アクセス
- **フロントエンド**: http://localhost:5173 (開発) / http://localhost:80 (本番)
- **バックエンドAPI**: http://localhost:8080
- **データベース**: localhost:5432

## 📖 使用方法

### ダッシュボード
1. ホーム画面で収支サマリーを確認
2. グラフで月別・カテゴリ別の分析を確認
3. 最近の取引履歴を確認

### 取引の追加
1. 「新規追加」メニューをクリック
2. 取引タイプ（収入/支出）を選択
3. 金額、カテゴリ、日付、メモを入力
4. 「保存」をクリック

### カテゴリ管理
1. 「カテゴリ」メニューをクリック
2. 新しいカテゴリを追加
3. 既存カテゴリを編集・削除

### 取引履歴
1. 「取引履歴」メニューをクリック
2. 取引の詳細を確認
3. 編集・削除を実行

## 🔌 API仕様

### エンドポイント

#### 取引管理
- `GET /api/transactions` - 全取引取得
- `GET /api/transactions/:id` - 特定取引取得
- `POST /api/transactions` - 取引作成
- `PUT /api/transactions/:id` - 取引更新
- `DELETE /api/transactions/:id` - 取引削除
- `GET /api/transactions/summary` - 収支サマリー
- `GET /api/transactions/monthly` - 月別データ
- `GET /api/transactions/category` - カテゴリ別データ

#### カテゴリ管理
- `GET /api/categories` - 全カテゴリ取得
- `GET /api/categories/:id` - 特定カテゴリ取得
- `POST /api/categories` - カテゴリ作成
- `PUT /api/categories/:id` - カテゴリ更新
- `DELETE /api/categories/:id` - カテゴリ削除

### データ形式

#### 取引
```json
{
  "id": 1,
  "type": "expense",
  "amount": "20000.00",
  "date": "2025-08-20T00:00:00.000Z",
  "category_id": 1,
  "memo": "食費",
  "category_name": "食費"
}
```

#### カテゴリ
```json
{
  "id": 1,
  "name": "食費",
  "type": "expense",
  "color": "#ff0000"
}
```

## 🛠 開発

### ローカル開発環境

#### フロントエンド
```bash
cd client
npm install
npm run dev
```

#### バックエンド
```bash
cd server
npm install
npm run dev
```

#### データベース
```bash
# PostgreSQLを直接起動
docker run -d \
  --name postgres \
  -e POSTGRES_DB=household_budget \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15-alpine
```

### テスト
```bash
# サーバーのテスト
cd server
npm test

# クライアントのテスト
cd client
npm test
```

### コード品質
```bash
# リンター
npm run lint

# フォーマッター
npm run format
```

## 🚀 デプロイ

### Docker Compose (推奨)
```bash
# 本番環境用の環境変数を設定
cp env.example .env.prod

# 本番環境で起動
docker compose -f docker-compose.yml up --build -d
```

### 手動デプロイ
```bash
# フロントエンドのビルド
cd client
npm run build

# バックエンドのビルド
cd server
npm run build

# データベースのマイグレーション
npm run migrate
```

## 📁 プロジェクト構造

```
household-budget-app-docker/
├── client/                 # Reactフロントエンド
│   ├── src/
│   │   ├── components/     # 再利用可能コンポーネント
│   │   ├── pages/         # ページコンポーネント
│   │   ├── services/      # API通信
│   │   └── types/         # TypeScript型定義
│   ├── Dockerfile         # 本番用Dockerfile
│   └── Dockerfile.dev     # 開発用Dockerfile
├── server/                # Node.jsバックエンド
│   ├── src/
│   │   ├── controllers/   # コントローラー
│   │   ├── models/        # データモデル
│   │   ├── routes/        # ルーティング
│   │   └── types/         # TypeScript型定義
│   └── Dockerfile
├── database/              # データベース関連
│   ├── migrations/        # マイグレーションファイル
│   └── seeds/            # シードデータ
├── docker-compose.yml     # 本番環境設定
├── docker-compose.dev.yml # 開発環境設定
└── README.md
```

## 🤝 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🆘 トラブルシューティング

### よくある問題

#### Viteの起動エラー
```bash
# Node.jsバージョンを確認
node --version  # 20以上であることを確認

# 依存関係を再インストール
cd client
rm -rf node_modules package-lock.json
npm install
```

#### データベース接続エラー
```bash
# データベースコンテナの状態確認
docker ps

# データベースログの確認
docker logs household-budget-app-docker-database

# データベースの再起動
docker compose restart database
```

#### ポート競合
```bash
# 使用中のポートを確認
lsof -i :5173
lsof -i :8080
lsof -i :5432

# 競合するプロセスを停止
kill -9 <PID>
```

## 📞 サポート

問題が発生した場合は、以下の手順でサポートを受けてください：

1. [Issues](../../issues) で既存の問題を確認
2. 新しいIssueを作成し、詳細な情報を提供
3. エラーログやスクリーンショットを添付

---

**Happy Budgeting! 💰**
