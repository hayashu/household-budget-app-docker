-- サンプル取引データの挿入
-- 収入データ
INSERT INTO transactions (type, amount, date, category_id, memo) VALUES
('income', 300000, '2025-08-01', 1, '8月給料'),
('income', 50000, '2025-08-15', 3, '副業収入');

-- 支出データ
INSERT INTO transactions (type, amount, date, category_id, memo) VALUES
('expense', 50000, '2025-08-05', 6, '食費'),
('expense', 80000, '2025-08-10', 7, '住居費'),
('expense', 15000, '2025-08-12', 8, '電気代'),
('expense', 8000, '2025-08-15', 9, '携帯電話料金'),
('expense', 12000, '2025-08-18', 10, '電車賃'),
('expense', 3000, '2025-08-20', 11, '薬代'),
('expense', 20000, '2025-08-22', 14, '映画鑑賞'),
('expense', 15000, '2025-08-25', 15, '洋服購入');
