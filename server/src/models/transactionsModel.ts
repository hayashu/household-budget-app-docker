import {client} from '../app';
import { Transaction, TransactionType } from '../types/transaction';

const getAllTransactions = async () => {
  const result = await client.query(`
    SELECT 
      t.id, 
      t.type, 
      t.amount, 
      t.date, 
      t.category_id, 
      t.memo,
      c.name as category_name
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    ORDER BY t.date DESC, t.id DESC
  `);
  return result.rows;
};

const getTransactionById = async (id: number): Promise<Transaction | null> => {
  const result = await client.query(`
    SELECT 
      t.id, 
      t.type, 
      t.amount, 
      t.date, 
      t.category_id, 
      t.memo,
      c.name as category_name
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.id = $1
  `, [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
};

const createTransaction = async (type: TransactionType, amount: number, date: string, category_id: number | null, memo?: string):Promise<Transaction> => {
  const result = await client.query(
    'insert into transactions (type, amount, date, category_id, memo) values ($1, $2, $3, $4, $5) returning *;',
    [type, amount, date, category_id, memo || null]
  );
  return result.rows[0];
};

const updateTransaction = async (id: number, type: TransactionType, amount: number, date: string, category_id: number | null, memo?: string):Promise<Transaction> => {
  const result = await client.query(
    'update transactions set type = $2, amount = $3, date = $4, category_id = $5, memo = $6 where id = $1 returning *;',
    [id, type, amount, date, category_id, memo || null]
  );
  return result.rows[0];
}

const deleteTransaction = async (id: number): Promise<Transaction | null> => {
  const result = await client.query('delete from transactions where id = $1 returning *;', [id]);
  return result.rows.length > 0 ? result.rows[0] : null;
}

const getTransactionSummary = async () => {
  const result = await client.query(`
    SELECT 
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
    FROM transactions
  `);
  return result.rows[0];
};

const getMonthlyData = async () => {
  const result = await client.query(`
    SELECT 
      TO_CHAR(date, 'YYYY-MM') as month,
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
    FROM transactions
    WHERE date >= CURRENT_DATE - INTERVAL '6 months'
    GROUP BY TO_CHAR(date, 'YYYY-MM')
    ORDER BY month ASC
    LIMIT 6
  `);
  return result.rows;
};

const getCategoryData = async () => {
  const result = await client.query(`
    SELECT 
      c.name,
      SUM(t.amount) as value
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.type = 'expense'
    GROUP BY c.id, c.name
    ORDER BY value DESC
    LIMIT 10
  `);
  return result.rows;
};

export {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  getMonthlyData,
  getCategoryData
};