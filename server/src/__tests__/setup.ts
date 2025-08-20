process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'household_budget_test';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_USER = 'postgres';
process.env.DB_PASSWORD = 'pass';

// テストタイムアウト設定
jest.setTimeout(30000);