FROM postgres:15-alpine

# 環境変数の設定
ENV POSTGRES_DB=household_budget
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=password

# 初期化スクリプトをコピー
COPY migrations/ /docker-entrypoint-initdb.d/

# ポートを公開
EXPOSE 5432
