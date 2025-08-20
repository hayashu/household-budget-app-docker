"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryData = exports.getMonthlyData = exports.getTransactionSummary = exports.deleteTransaction = exports.updateTransaction = exports.createTransaction = exports.getTransactionById = exports.getAllTransactions = void 0;
const app_1 = require("../app");
const getAllTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield app_1.client.query(`
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
});
exports.getAllTransactions = getAllTransactions;
const getTransactionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield app_1.client.query(`
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
});
exports.getTransactionById = getTransactionById;
const createTransaction = (type, amount, date, category_id, memo) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield app_1.client.query('insert into transactions (type, amount, date, category_id, memo) values ($1, $2, $3, $4, $5) returning *;', [type, amount, date, category_id, memo || null]);
    return result.rows[0];
});
exports.createTransaction = createTransaction;
const updateTransaction = (id, type, amount, date, category_id, memo) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield app_1.client.query('update transactions set type = $2, amount = $3, date = $4, category_id = $5, memo = $6 where id = $1 returning *;', [id, type, amount, date, category_id, memo || null]);
    return result.rows[0];
});
exports.updateTransaction = updateTransaction;
const deleteTransaction = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield app_1.client.query('delete from transactions where id = $1 returning *;', [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
});
exports.deleteTransaction = deleteTransaction;
const getTransactionSummary = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield app_1.client.query(`
    SELECT 
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
    FROM transactions
  `);
    return result.rows[0];
});
exports.getTransactionSummary = getTransactionSummary;
const getMonthlyData = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield app_1.client.query(`
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
});
exports.getMonthlyData = getMonthlyData;
const getCategoryData = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield app_1.client.query(`
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
});
exports.getCategoryData = getCategoryData;
