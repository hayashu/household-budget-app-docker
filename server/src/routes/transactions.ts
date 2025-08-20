import {Router} from "express";
import { 
  getAllTransactions, 
  getTransactionById, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction,
  getTransactionSummary,
  getMonthlyData, // 追加
  getCategoryData // 追加
} from "../controllers/transactionsController";

const router = Router();
router.get('/', getAllTransactions);
router.get('/summary', getTransactionSummary);
router.get('/monthly', getMonthlyData); // 追加
router.get('/category', getCategoryData); // 追加
router.get('/:id', getTransactionById);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export const transactionsRouter = router;