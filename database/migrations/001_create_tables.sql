-- カテゴリテーブル
CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 取引記録テーブル
CREATE TABLE transactions (
    id          SERIAL PRIMARY KEY,
    type        VARCHAR(10) NOT NULL,  -- 'income' or 'expense'
    amount      DECIMAL(10,2) NOT NULL,
    date        DATE NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    memo        TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);