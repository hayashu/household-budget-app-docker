-- サンプル取引データの挿入
-- 収入データ
INSERT INTO transactions (type, amount, date, category_id, memo) VALUES
('income', 300000, '2025-08-01', 1, '8月給料');

-- 支出データ
INSERT INTO transactions (type, amount, date, category_id, memo) VALUES
('expense', 50000, '2025-08-05', 3, '食費'),
('expense', 80000, '2025-08-10', 4, '家賃'),
('expense', 12000, '2025-08-18', 5, '電車賃'),
('expense', 20000, '2025-08-22', 6, '映画鑑賞');
