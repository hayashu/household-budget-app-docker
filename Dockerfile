FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

# 全サービスをインストール
RUN npm run install-all

# ポートを公開
EXPOSE 8080 5173

# 開発サーバーを起動
CMD ["npm", "run", "dev"]
