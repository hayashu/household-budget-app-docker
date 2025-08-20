-- デフォルトカテゴリーの挿入
-- 収入カテゴリー
INSERT INTO categories (name, type, color) VALUES
('給料', 'income', '#10B981'),
('その他収入', 'income', '#064E3B');

-- 支出カテゴリー
INSERT INTO categories (name, type, color) VALUES
('食費', 'expense', '#EF4444'),
('家賃', 'expense', '#DC2626'),
('交通費', 'expense', '#7F1D1D'),
('娯楽費', 'expense', '#B45309');
