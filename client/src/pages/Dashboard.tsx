import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transactionsApi } from '../services/api';
import { MonthlyBarChart, CategoryPieChart, ExpenseTrendChart } from '../components/Charts';

function Dashboard() {
  const [summary, setSummary] = useState<{
    total_income: number | null;
    total_expense: number | null;
  }>({
    total_income: null,
    total_expense: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await transactionsApi.getTransactionSummary();
      setSummary(response.data);
    } catch (error: any) {
      console.error('Error fetching summary:', error);
      setError('サマリーの取得に失敗しました');
      // エラー時でもデフォルト値を設定
      setSummary({
        total_income: null,
        total_expense: null
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const balance = (summary.total_income || 0) - (summary.total_expense || 0);

  return (
    <div className="drawer lg:drawer-open">
      <div className="drawer-content flex flex-col">
        <div className="min-h-screen bg-base-200">
          <NavBar />

          {/* ダッシュボードのコンテンツ */}
          <div className="max-w-6xl mx-auto p-6">
            
            {/* エラーメッセージ表示 */}
            {error && (
              <div className="alert alert-error mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            
            {/* サマリーカード */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {loading ? (
                <div className="col-span-3 text-center">
                  <span className="loading loading-spinner loading-lg"></span>
                  <p className="mt-2">データを読み込み中...</p>
                </div>
              ) : (
                <>
                  <MoneyCard 
                    title="収入" 
                    amount={summary.total_income !== null ? summary.total_income.toLocaleString() : '0'} 
                    color="green" 
                  />
                  <MoneyCard 
                    title="支出" 
                    amount={summary.total_expense !== null ? summary.total_expense.toLocaleString() : '0'} 
                    color="red" 
                  />
                  <MoneyCard 
                    title="残高" 
                    amount={balance.toLocaleString()} 
                    color="blue" 
                  />
                </>
              )}
            </div>
            
            {/* グラフセクション */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <MonthlyBarChart />
              <CategoryPieChart />
            </div>
            
            {/* トレンドグラフ */}
            <div className="mb-8">
              <ExpenseTrendChart />
            </div>

            {/* 取引履歴テーブル */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-4">最近の取引</h3>
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>カテゴリ</th>
                        <th>金額</th>
                        <th>日にち</th>
                        <th>メモ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>家賃</td>
                        <td>¥80,000</td>
                        <td>2025/7/1</td>
                        <td>7月分</td>
                      </tr>
                      <tr>
                        <td>食費</td>
                        <td>¥50,000</td>
                        <td>2025/7/15</td>
                        <td>食材・外食</td>
                      </tr>
                      <tr>
                        <td>光熱費</td>
                        <td>¥15,000</td>
                        <td>2025/7/10</td>
                        <td>電気・ガス</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <SideBar />
    </div>
  );
}

function MoneyCard({ title, amount, color }: { title: string; amount: string; color: string }) {

  return (
  <div className="card w-60 bg-base-100 card-xs shadow-sm">
    <div className="card-body">
      {/* <h2 className="card-title text-green-600">収入</h2> */}
      <h2 className={`card-title text-${color}-600`}>{title}</h2>
      <p className="text-3xl font-bold">¥{amount}</p>
    </div>
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

export default Dashboard;