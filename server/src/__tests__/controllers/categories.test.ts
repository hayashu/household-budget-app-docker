import { client, app } from '../../app';
import request from 'supertest';

describe('Categories API', () => {
  // 各テスト前にデータをリセット
  beforeEach(async () => {
    await client.query('DELETE FROM transactions');
    await client.query('DELETE FROM categories');

    // IDシーケンスもリセット
    await client.query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');
    await client.query('ALTER SEQUENCE transactions_id_seq RESTART WITH 1');

    // 基本カテゴリを再挿入
    await client.query(`
      INSERT INTO categories (name) VALUES 
      ('食費'), ('交通費'), ('光熱費')
    `);
  });

  test('should create a new category', async () => {
    const response = await request(app)
      .post('/api/categories')
      .send({ name: 'テスト用カテゴリ' })
      .expect(201);
  });
});