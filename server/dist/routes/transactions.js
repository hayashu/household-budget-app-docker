"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionsRouter = void 0;
const express_1 = require("express");
const transactionsController_1 = require("../controllers/transactionsController");
const router = (0, express_1.Router)();
router.get('/', transactionsController_1.getAllTransactions);
router.get('/summary', transactionsController_1.getTransactionSummary);
router.get('/monthly', transactionsController_1.getMonthlyData); // 追加
router.get('/category', transactionsController_1.getCategoryData); // 追加
router.get('/:id', transactionsController_1.getTransactionById);
router.post('/', transactionsController_1.createTransaction);
router.put('/:id', transactionsController_1.updateTransaction);
router.delete('/:id', transactionsController_1.deleteTransaction);
exports.transactionsRouter = router;
