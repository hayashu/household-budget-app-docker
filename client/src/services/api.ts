import axios from 'axios';
import type { CreateCategoryRequest, Category, CreateTransactionRequest, Transaction } from '../types/api';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api', 
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});
const delay = 0;
export const categoriesApi = {
  getAllCategories: async() => {
    // 3秒の遅延を追加
    await new Promise(resolve => setTimeout(resolve, delay));
    return await api.get('/categories');
  },
  getCategoryById: async(id: number) => await api.get(`/categories/${id}`),
  createCategory: async(data: CreateCategoryRequest) => await api.post('/categories', data),
  updateCategory: async(id : number, data: Category) => await api.put(`/categories/${id}`, data),
  deleteCategory: async(id: number) => await api.delete(`/categories/${id}`),
}

export const transactionsApi = {
  getAllTransactions: async() => await api.get('/transactions'),
  getTransactionSummary: async() => await api.get('/transactions/summary'),
  getMonthlyData: async() => await api.get('/transactions/monthly'), // 追加
  getCategoryData: async() => await api.get('/transactions/category'), // 追加
  getTransactionById: async(id: number) => await api.get(`/transactions/${id}`),
  createTransaction: async(data: CreateTransactionRequest) => await api.post(`/transactions`, data),
  updateTransaction: async(id: number, data: Transaction) => await api.put(`/transactions/${id}`, data), 
  deleteTransaction: async(id: number) => await api.delete(`/transactions/${id}`),
}
export default api;