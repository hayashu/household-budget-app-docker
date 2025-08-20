import { useState } from 'react';
import { categoriesApi, transactionsApi } from '../services/api';

export const ApiTest = () => {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  const testCategories = async () => {
    try {
      const response = await categoriesApi.getAllCategories();
      setCategories(response.data);
      setError('');
    } catch (err: any) {
      setError('Categories API Error: ' + (err.message || 'Unknown error'));
    }
  };

  const testTransactions = async () => {
    try {
      const response = await transactionsApi.getAllTransactions();
      setTransactions(response.data);
      setError('');
    } catch (err: any) {
      setError('Transactions API Error: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">API Connection Test</h2>
      
      <div className="space-y-4">
        <button 
          onClick={testCategories}
          className="btn btn-primary"
        >
          Test Categories API
        </button>
        
        <button 
          onClick={testTransactions}
          className="btn btn-secondary"
        >
          Test Transactions API
        </button>
      </div>

      {error && (
        <div className="alert alert-error mt-4">
          <span>{error}</span>
        </div>
      )}

      {categories.length > 0 && (
        <div className="mt-4">
          <h3>Categories ({categories.length})</h3>
          <pre>{JSON.stringify(categories, null, 2)}</pre>
        </div>
      )}

      {transactions.length > 0 && (
        <div className="mt-4">
          <h3>Transactions ({transactions.length})</h3>
          <pre>{JSON.stringify(transactions, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};