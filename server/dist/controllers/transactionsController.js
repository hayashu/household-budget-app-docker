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
const transactionsModel_1 = require("../models/transactionsModel");
const categoriesModel_1 = require("../models/categoriesModel");
const getAllTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const transactions = yield (0, transactionsModel_1.getAllTransactions)();
        console.log('=== CONTROLLER DEBUG ===');
        console.log('Transactions from model:', transactions);
        console.log('First transaction category_name:', (_a = transactions[0]) === null || _a === void 0 ? void 0 : _a.category_name);
        res.status(200).json(transactions);
    }
    catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getAllTransactions = getAllTransactions;
const getTransactionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id, 10))) {
        res.status(400).json({ error: 'Invalid transaction ID' });
        return;
    }
    try {
        const transaction = yield (0, transactionsModel_1.getTransactionById)(parseInt(id, 10));
        if (!transaction) {
            res.status(404).json({ error: 'Transaction not found' });
            return;
        }
        res.status(200).json(transaction);
    }
    catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getTransactionById = getTransactionById;
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, amount, date, category_id, memo } = req.body;
    if (!type || !amount || !date) {
        res.status(400).json({ error: 'Type, amount, and date are required' });
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        res.status(400).json({ error: 'Amount must be a positive number' });
        return;
    }
    if (!['income', 'expense'].includes(type)) {
        res.status(400).json({ error: 'Type must be either "income" or "expense"' });
        return;
    }
    if (type === 'income') {
        if (category_id) {
            res.status(400).json({ error: 'Category ID is not required for income' });
            return;
        }
    }
    if (type === 'expense') {
        if (!category_id) {
            res.status(400).json({ error: 'Category ID is required for expense' });
            return;
        }
        if (category_id) {
            const categoryExists = yield (0, categoriesModel_1.getCategoryById)(category_id);
            if (!categoryExists) {
                res.status(400).json({ error: 'Category ID does not exist' });
                return;
            }
        }
    }
    try {
        const result = yield (0, transactionsModel_1.createTransaction)(type, amount, date, category_id || null, memo || null);
        res.status(201).json(result);
        return;
    }
    catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
});
exports.createTransaction = createTransaction;
const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    var { type, amount, date, category_id, memo } = req.body;
    if (!id || isNaN(parseInt(id, 10))) {
        res.status(400).json({ error: 'Invalid transaction ID' });
        return;
    }
    const findTransaction = yield (0, transactionsModel_1.getTransactionById)(parseInt(id, 10));
    if (!findTransaction) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
    }
    amount = amount || findTransaction.amount;
    date = date || findTransaction.date;
    if (type && type !== findTransaction.type) {
        if (type === 'income') {
            category_id = null; // income transactions should not have a category
        }
        else if (type === 'expense') {
            if (!category_id) {
                res.status(400).json({ error: 'Category ID is required for expense' });
                return;
            }
            const categoryExists = yield (0, categoriesModel_1.getCategoryById)(category_id);
            if (!categoryExists) {
                res.status(400).json({ error: 'Category ID does not exist' });
                return;
            }
        }
    }
    if (!type) {
        type = findTransaction.type;
    }
    else if (!['income', 'expense'].includes(type)) {
        res.status(400).json({ error: 'Type must be either "income" or "expense"' });
        return;
    }
    try {
        const result = yield (0, transactionsModel_1.updateTransaction)(parseInt(id, 10), type || findTransaction.type, amount, date, category_id || findTransaction.category_id, memo || findTransaction.memo);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
});
exports.updateTransaction = updateTransaction;
const deleteTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id, 10))) {
        res.status(400).json({ error: 'Invalid transaction ID' });
        return;
    }
    const findTransaction = yield (0, transactionsModel_1.getTransactionById)(parseInt(id, 10));
    if (!findTransaction) {
        res.status(404).json({ error: 'Transaction not found' });
        return;
    }
    try {
        const result = yield (0, transactionsModel_1.deleteTransaction)(parseInt(id, 10));
        if (!result) {
            res.status(404).json({ error: 'Transaction not found' });
            return;
        }
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteTransaction = deleteTransaction;
const getTransactionSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield (0, transactionsModel_1.getTransactionSummary)();
        res.status(200).json(summary);
    }
    catch (error) {
        console.error('Error fetching transaction summary:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getTransactionSummary = getTransactionSummary;
const getMonthlyData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, transactionsModel_1.getMonthlyData)();
        res.status(200).json(data);
    }
    catch (error) {
        console.error('Error fetching monthly data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getMonthlyData = getMonthlyData;
const getCategoryData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, transactionsModel_1.getCategoryData)();
        res.status(200).json(data);
    }
    catch (error) {
        console.error('Error fetching category data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getCategoryData = getCategoryData;
