import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoriesApi,transactionsApi } from '../services/api';
import type { Category } from '../types/api';

function AddTransactionForm() {
  const navigate = useNavigate(); // 追加
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category_id: '',
    memo: ''
  });

  // const [categories] = useState([
  //   { id: 1, name: '食費' },
  //   { id: 2, name: '交通費' },
  //   { id: 3, name: '光熱費' },
  //   { id: 4, name: '娯楽費' },
  //   { id: 5, name: '日用品' },
  //   { id: 6, name: '医療費' },
  //   { id: 7, name: 'その他' }
  // ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  async function fetchCategories() {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching categories...'); // デバッグログ追加
      const response = await categoriesApi.getAllCategories();
      console.log('Categories response:', response.data); // デバッグログ追加
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('カテゴリの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }

  // カテゴリー状態の監視
  useEffect(() => {
    console.log('Categories state:', categories); // デバッグログ追加
  }, [categories]);

  useEffect(()=>{
    fetchCategories();
  },[])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await transactionsApi.createTransaction({
        type: formData.type,
        amount: parseInt(formData.amount),
        date: formData.date,
        category_id: formData.category_id ? parseInt(formData.category_id) : undefined,
        memo: formData.memo || undefined
      });
      
      console.log('Transaction created:', response.data);
      
      // 成功時に履歴ページにリダイレクト
      navigate('/history');
      
    } catch (error) {
      console.error('Error creating transaction:', error);
      setError('取引の作成に失敗しました');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="drawer lg:drawer-open">
      <div className="drawer-content flex flex-col">
        <div className="min-h-screen bg-base-200">
          <NavBar />

          <div className="max-w-2xl mx-auto p-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">新規取引追加</h2>
                
                {/* エラーメッセージ */}
                {error && (
                  <div className="alert alert-error mb-4">
                    <span>{error}</span>
                    <button onClick={() => setError(null)}>✕</button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 取引タイプ */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">取引タイプ</span>
                    </label>
                    <div className="flex gap-4">
                      <label className="label cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="income"
                          checked={formData.type === 'income'}
                          onChange={handleInputChange}
                          className="radio radio-primary"
                        />
                        <span className="label-text ml-2">収入</span>
                      </label>
                      <label className="label cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value="expense"
                          checked={formData.type === 'expense'}
                          onChange={handleInputChange}
                          className="radio radio-primary"
                        />
                        <span className="label-text ml-2">支出</span>
                      </label>
                    </div>
                  </div>

                  {/* 金額 */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">金額</span>
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="input input-bordered"
                      required
                    />
                  </div>

                  {/* 日付 */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">日付</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="input input-bordered"
                      required
                    />
                  </div>

                  {/* カテゴリ（支出の場合のみ表示） */}
                  {formData.type === 'expense' && (
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">カテゴリ</span>
                      </label>
                      {loading ? (
                        <div className="text-center py-2">
                          <span className="loading loading-spinner loading-sm"></span>
                          <span className="ml-2">カテゴリを読み込み中...</span>
                        </div>
                      ) : (
                        <select
                          name="category_id"
                          value={formData.category_id}
                          onChange={handleInputChange}
                          className="select select-bordered"
                          required
                        >
                          <option value="">カテゴリを選択 ({categories.length}件)</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  {/* メモ */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">メモ</span>
                    </label>
                    <textarea
                      name="memo"
                      value={formData.memo}
                      onChange={handleInputChange}
                      placeholder="メモを入力（任意）"
                      className="textarea textarea-bordered h-24"
                    />
                  </div>

                  {/* ボタン */}
                  <div className="flex gap-4">
                    <button type="submit" className="btn btn-primary flex-1">
                      保存
                    </button>
                    <Link to="/" className="btn btn-outline flex-1">
                      キャンセル
                    </Link>
                  </div>
                </form>
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

export default AddTransactionForm;
