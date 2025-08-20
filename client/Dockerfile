# ビルドステージ
FROM node:18-alpine AS build

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci

# ソースコードをコピー
COPY . .

# アプリケーションをビルド
RUN npm run build

# 本番ステージ
FROM nginx:alpine

# ビルドされたファイルをnginxにコピー
COPY --from=build /app/dist /usr/share/nginx/html

# nginx設定ファイルをコピー
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ポートを公開
EXPOSE 80

# nginxを起動
CMD ["nginx", "-g", "daemon off;"]
