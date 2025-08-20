import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transactionsApi } from '../services/api';
import type { Transaction } from '../types/api';

function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 編集状態の管理
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    date: '',
    category_id: '',
    memo: ''
  });

  async function fetchTransactions() {
    try {
      const response = await transactionsApi.getAllTransactions();
      console.log('Transactions response:', response.data);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('取引履歴の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesSearch = searchTerm === '' || 
      transaction.memo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesSearch;
  });

  const handleDelete = async (id: number) => {
    try {
      await transactionsApi.deleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setError('取引の削除に失敗しました');
    }
  };

  const handleEditStart = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditingData({
      type: transaction.type,
      amount: transaction.amount.toString(),
      date: transaction.date,
      category_id: transaction.category_id?.toString() || '',
      memo: transaction.memo || ''
    });
  };

  const handleEditSave = async (id: number) => {
    try {
      await transactionsApi.updateTransaction(id, {
        id,
        type: editingData.type,
        amount: parseInt(editingData.amount),
        date: editingData.date,
        category_id: editingData.category_id ? parseInt(editingData.category_id) : null,
        memo: editingData.memo || null
      });
      
      // 状態を更新
      setTransactions(transactions.map(t => 
        t.id === id ? {
          ...t,
          type: editingData.type,
          amount: parseInt(editingData.amount),
          date: editingData.date,
          category_id: editingData.category_id ? parseInt(editingData.category_id) : null,
          memo: editingData.memo || null
        } : t
      ));
      
      setEditingId(null);
      setEditingData({ type: 'expense', amount: '', date: '', category_id: '', memo: '' });
    } catch (error) {
      console.error('Error updating transaction:', error);
      setError('取引の更新に失敗しました');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingData({ type: 'expense', amount: '', date: '', category_id: '', memo: '' });
  };

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const formatted = amount.toLocaleString();
    return type === 'income' ? `+¥${formatted}` : `-¥${formatted}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP');
  };

  return (
    <div className="drawer lg:drawer-open">
      <div className="drawer-content flex flex-col">
        <div className="min-h-screen bg-base-200">
          <NavBar />

          <div className="max-w-6xl mx-auto p-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="card-title text-2xl">取引履歴</h2>
                  <Link to="/add" className="btn btn-primary">
                    <span className="mr-2">+</span>
                    新規追加
                  </Link>
                </div>

                {/* フィルターと検索 */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex gap-2">
                    <button
                      className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setFilterType('all')}
                    >
                      全て
                    </button>
                    <button
                      className={`btn btn-sm ${filterType === 'income' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setFilterType('income')}
                    >
                      収入
                    </button>
                    <button
                      className={`btn btn-sm ${filterType === 'expense' ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setFilterType('expense')}
                    >
                      支出
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="メモやカテゴリで検索..."
                      className="input input-bordered w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* 取引一覧テーブル */}
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>日付</th>
                        <th>タイプ</th>
                        <th>カテゴリ</th>
                        <th>金額</th>
                        <th>メモ</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8">
                            <span className="loading loading-spinner loading-lg"></span>
                            <p className="mt-2">取引履歴を読み込み中...</p>
                          </td>
                        </tr>
                      ) : filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-500">
                            取引が見つかりませんでした
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map(transaction => (
                          <tr key={transaction.id}>
                            <td>
                              {editingId === transaction.id ? (
                                <input
                                  type="date"
                                  className="input input-bordered input-sm"
                                  value={editingData.date}
                                  onChange={(e) => setEditingData({...editingData, date: e.target.value})}
                                />
                              ) : (
                                formatDate(transaction.date)
                              )}
                            </td>
                            <td>
                              {editingId === transaction.id ? (
                                <select
                                  className="select select-bordered select-sm"
                                  value={editingData.type}
                                  onChange={(e) => setEditingData({...editingData, type: e.target.value as 'income' | 'expense'})}
                                >
                                  <option value="income">収入</option>
                                  <option value="expense">支出</option>
                                </select>
                              ) : (
                                <span className={`badge ${transaction.type === 'income' ? 'badge-success' : 'badge-error'}`}>
                                  {transaction.type === 'income' ? '収入' : '支出'}
                                </span>
                              )}
                            </td>
                            <td>
                              {editingId === transaction.id ? (
                                <input
                                  type="text"
                                  className="input input-bordered input-sm"
                                  value={editingData.category_id}
                                  onChange={(e) => setEditingData({...editingData, category_id: e.target.value})}
                                  placeholder="カテゴリID"
                                />
                              ) : (
                                transaction.category_name || '-'
                              )}
                            </td>
                            <td>
                              {editingId === transaction.id ? (
                                <input
                                  type="number"
                                  className="input input-bordered input-sm"
                                  value={editingData.amount}
                                  onChange={(e) => setEditingData({...editingData, amount: e.target.value})}
                                />
                              ) : (
                                <span className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatAmount(transaction.amount, transaction.type)}
                                </span>
                              )}
                            </td>
                            <td>
                              {editingId === transaction.id ? (
                                <input
                                  type="text"
                                  className="input input-bordered input-sm"
                                  value={editingData.memo}
                                  onChange={(e) => setEditingData({...editingData, memo: e.target.value})}
                                />
                              ) : (
                                transaction.memo || '-'
                              )}
                            </td>
                            <td>
                              <div className="flex gap-2">
                                {editingId === transaction.id ? (
                                  <>
                                    <button 
                                      className="btn btn-sm btn-success"
                                      onClick={() => handleEditSave(transaction.id)}
                                    >
                                      保存
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-outline"
                                      onClick={handleEditCancel}
                                    >
                                      キャンセル
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button 
                                      className="btn btn-sm btn-outline"
                                      onClick={() => handleEditStart(transaction)}
                                    >
                                      編集
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-error"
                                      onClick={() => handleDelete(transaction.id)}
                                    >
                                      削除
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {error && (
                  <div className="alert alert-error mb-4">
                    <span>{error}</span>
                    <button onClick={() => setError(null)}>✕</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SideBar />
    </div>
  );
}

function NavBar(){
  return (
      <div className="navbar bg-base-100 shadow-sm">
    <div className="flex-1">
      <Link to="/" className="btn btn-ghost text-xl">家計簿アプリ</Link>
    </div>
    <div className="flex gap-2">
      <SearchBar />
      
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
          <li>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li>
          <li><a>Settings</a></li>
          <li><a>Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
  )
}

function SearchBar() {
  return (
    <label className="input">
      <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2.5"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </g>
      </svg>
      <input type="search" required placeholder="Search" />
    </label>
  );
}

function SideBar(){
  return (
  <>
    <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
    <div className="drawer-side">
      <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
      <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
        <DashboardCard icon= '📊' title='ダッシュボード' link='/'/>
        <DashboardCard icon='💰' title='取引履歴' link='/history'/>
        <DashboardCard icon = '📝' title='新規追加' link='/add'/>
        <DashboardCard icon = '📁 ' title='カテゴリ' link='/category'/>
      </ul>
    </div>
  </>
  )
}

function DashboardCard({ icon, title, link }: { icon: string; title: string ; link?: string }) {
  return (
    <li>
      <Link to={link || '#'} className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary hover:text-primary-content">
        <span className="text-xl">{icon}</span>
        <span>{title}</span>
      </Link>
    </li>
  );
}

export default TransactionHistory;
