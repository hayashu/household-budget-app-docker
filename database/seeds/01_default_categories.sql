-- デフォルトカテゴリーの挿入
-- 収入カテゴリー
INSERT INTO categories (name, type, color) VALUES
('給料', 'income', '#10B981'),
('ボーナス', 'income', '#059669'),
('副業', 'income', '#047857'),
('投資収益', 'income', '#065F46'),
('その他収入', 'income', '#064E3B');

-- 支出カテゴリー
INSERT INTO categories (name, type, color) VALUES
('食費', 'expense', '#EF4444'),
('住居費', 'expense', '#DC2626'),
('光熱費', 'expense', '#B91C1C'),
('通信費', 'expense', '#991B1B'),
('交通費', 'expense', '#7F1D1D'),
('医療費', 'expense', '#F59E0B'),
('教育費', 'expense', '#D97706'),
('娯楽費', 'expense', '#B45309'),
('衣服費', 'expense', '#92400E'),
('美容費', 'expense', '#78350F'),
('交際費', 'expense', '#8B5CF6'),
('保険料', 'expense', '#7C3AED'),
('税金', 'expense', '#6D28D9'),
('その他支出', 'expense', '#5B21B6');
