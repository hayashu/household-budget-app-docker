export type TransactionType = 'income' | 'expense';

export interface Category {
  id: number;
  name: string;
  created_at?: string;
}

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  date: string;
  category_id: number | null;
  memo: string | null;
  category_name?: string; // この行があるか確認
  created_at?: string;
  updated_at?: string;
}

export interface CreateTransactionRequest {
  type: TransactionType;
  amount: number;
  date: string;
  category_id?: number;
  memo?: string;
}

export interface CreateCategoryRequest {
  name: string;
}
