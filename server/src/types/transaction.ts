export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  date: string;
  category_id: number | null;
  memo: string | null;
  category_name: string; // 追加
}

export interface CreateTransactionRequest {
  type: TransactionType;
  amount: number;
  date: string;
  category_id?: number;
  memo?: string;
}