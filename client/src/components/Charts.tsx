import { useState, useEffect } from 'react';
import { transactionsApi } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

// カラーパレット
const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff88', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];

// 月別収支バーチャート
export function MonthlyBarChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching monthly data...');
        const response = await transactionsApi.getMonthlyData();
        console.log('Monthly data response:', response);
        
        const formattedData = response.data.map((item: any) => ({
          month: new Date(item.month + '-01').toLocaleDateString('ja-JP', { month: 'short' }),
          収入: parseInt(item.income) || 0,
          支出: parseInt(item.expense) || 0
        }));
        
        console.log('Formatted monthly data:', formattedData);
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching monthly data:', error);
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl p-6">
        <h3 className="card-title mb-4">月別収支</h3>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-100 shadow-xl p-6">
        <h3 className="card-title mb-4">月別収支</h3>
        <div className="flex justify-center items-center h-64">
          <p className="text-error">{error}</p>
        </div>
      </div>
    );
  }

  // データが空の場合のフォールバック
  if (data.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl p-6">
        <h3 className="card-title mb-4">月別収支</h3>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">データがありません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <h3 className="card-title mb-4">月別収支</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
          <Legend />
          <Bar dataKey="収入" fill="#10b981" />
          <Bar dataKey="支出" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// カテゴリ別円グラフ
export function CategoryPieChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching category data...');
        const response = await transactionsApi.getCategoryData();
        console.log('Category data response:', response);
        
        const formattedData = response.data.map((item: any, index: number) => ({
          name: item.name,
          value: parseInt(item.value) || 0,
          color: colors[index % colors.length]
        }));
        
        console.log('Formatted category data:', formattedData);
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching category data:', error);
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl p-6">
        <h3 className="card-title mb-4">カテゴリ別支出</h3>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-100 shadow-xl p-6">
        <h3 className="card-title mb-4">カテゴリ別支出</h3>
        <div className="flex justify-center items-center h-64">
          <p className="text-error">{error}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl p-6">
        <h3 className="card-title mb-4">カテゴリ別支出</h3>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">データがありません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <h3 className="card-title mb-4">カテゴリ別支出</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, value }) => `${name}: ¥${value?.toLocaleString() || '0'}`}
          >
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// 支出トレンド線グラフ
export function ExpenseTrendChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching trend data...');
        const response = await transactionsApi.getMonthlyData();
        console.log('Trend data response:', response);
        
        const formattedData = response.data.map((item: any) => ({
          month: new Date(item.month + '-01').toLocaleDateString('ja-JP', { month: 'short' }),
          支出: parseInt(item.expense) || 0
        }));
        
        console.log('Formatted trend data:', formattedData);
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching trend data:', error);
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl p-6">
        <h3 className="card-title mb-4">支出トレンド</h3>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-100 shadow-xl p-6">
        <h3 className="card-title mb-4">支出トレンド</h3>
        <div className="flex justify-center items-center h-64">
          <p className="text-error">{error}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card bg-base-100 shadow-xl p-6">
        <h3 className="card-title mb-4">支出トレンド</h3>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">データがありません</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <h3 className="card-title mb-4">支出トレンド</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `¥${value.toLocaleString()}`} />
          <Line 
            type="monotone" 
            dataKey="支出" 
            stroke="#ef4444" 
            strokeWidth={3}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}