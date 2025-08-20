import { 
  getAllTransactions as getAllTransactionsModel, 
  getTransactionById as getTransactionByIdModel,
  createTransaction as createTransactionModel,
  updateTransaction as updateTransactionModel,
  deleteTransaction as deleteTransactionModel,
  getTransactionSummary as getTransactionSummaryModel,
  getMonthlyData as getMonthlyDataModel,
  getCategoryData as getCategoryDataModel
} from '../models/transactionsModel';
import { Request, Response } from 'express';
import { Transaction } from '../types/transaction';
import { getCategoryById } from '../models/categoriesModel';

const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await getAllTransactionsModel();
    console.log('=== CONTROLLER DEBUG ===');
    console.log('Transactions from model:', transactions);
    console.log('First transaction category_name:', transactions[0]?.category_name);
    
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTransactionById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id, 10))) {
    res.status(400).json({ error: 'Invalid transaction ID' });
    return;
  }
  try {
    const transaction = await getTransactionByIdModel(parseInt(id, 10));
    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    res.status(200).json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createTransaction = async (req: Request, res: Response): Promise<void> => {
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
  if (type === 'income'){
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
    if (category_id){
      const categoryExists = await getCategoryById(category_id);
      if (!categoryExists) {
        res.status(400).json({ error: 'Category ID does not exist' });
        return;
      }
    }
  }
  try {
    const result = await createTransactionModel(type, amount, date, category_id || null, memo || null);
    res.status(201).json(result);
    return;
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
}

const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  var { type, amount, date, category_id, memo } = req.body;
  if (!id || isNaN(parseInt(id, 10))) {
    res.status(400).json({ error: 'Invalid transaction ID' });
    return;
  }
  const findTransaction = await getTransactionByIdModel(parseInt(id, 10));
  if (!findTransaction) {
    res.status(404).json({ error: 'Transaction not found' });
    return;
  }
  amount = amount || findTransaction.amount;
  date = date || findTransaction.date;

  if (type && type !== findTransaction.type) {
    if (type === 'income'){
      category_id = null; // income transactions should not have a category
    }else if (type === 'expense') {
      if (!category_id) {
        res.status(400).json({ error: 'Category ID is required for expense' });
        return;
      }
      const categoryExists = await getCategoryById(category_id);
      if (!categoryExists) {
        res.status(400).json({ error: 'Category ID does not exist' });
        return;
      }
    }
  }
  if (!type) {
    type = findTransaction.type;
  } else if (!['income', 'expense'].includes(type)) {
    res.status(400).json({ error: 'Type must be either "income" or "expense"' });
    return;
  }
  
  try {
    const result = await updateTransactionModel(
      parseInt(id, 10),
      type || findTransaction.type,
      amount,
      date,
      category_id || findTransaction.category_id,
      memo || findTransaction.memo);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
}

const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id, 10))) {
    res.status(400).json({ error: 'Invalid transaction ID' });
    return;
  }
  const findTransaction = await getTransactionByIdModel(parseInt(id, 10));
  if (!findTransaction) {
    res.status(404).json({ error: 'Transaction not found' });
    return;
  }
  try {
    const result = await deleteTransactionModel(parseInt(id, 10));
    if (!result) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getTransactionSummary = async (req: Request, res: Response) => {
  try {
    const summary = await getTransactionSummaryModel();
    res.status(200).json(summary);
  } catch (error) {
    console.error('Error fetching transaction summary:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getMonthlyData = async (req: Request, res: Response) => {
  try {
    const data = await getMonthlyDataModel();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getCategoryData = async (req: Request, res: Response) => {
  try {
    const data = await getCategoryDataModel();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching category data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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