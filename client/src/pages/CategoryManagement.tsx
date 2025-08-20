import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoriesApi } from '../services/api';
import type { Category } from '../types/api';


function CategoryManagement() {
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  async function fetchCategories() {
    try {
      setLoading(true);
      setError(null);
      const response = await categoriesApi.getAllCategories();
      setCategories(response.data);
    } catch (error: any) {
      console.log('Error fetching categories:', error);
      setError('カテゴリの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchCategories();
  },[])

  console.log(categories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      const newCategory: Category = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        name: newCategoryName.trim()
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      try {
        await categoriesApi.createCategory(newCategory);
      } catch (error) {
        console.error('Error creating category:', error);
        setError('カテゴリの追加に失敗しました');
      }
      console.log('Add category:', newCategory);
    }
  };

  const handleEditStart = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleEditSave = async (id: number) => {
    if (editingName.trim()) {
      setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, name: editingName.trim() } : cat
      ));
      setEditingId(null);
      setEditingName('');
      try {
        await categoriesApi.updateCategory(id, {id, name: editingName.trim()});
      } catch (error) {
        console.log('Error updating category:', error);
        setError('カテゴリの更新に失敗しました');
      }
      console.log('Update category:', { id, name: editingName });
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = async (id: number) => {
    setCategories(categories.filter(cat => cat.id !== id));
    try {
      await categoriesApi.deleteCategory(id);
    } catch (error) {
      console.log('Error deleting category:', error);
      setError('カテゴリの削除に失敗しました');
    }
    console.log('Delete category:', id);
  };

  return (
    <div className="drawer lg:drawer-open">
      <div className="drawer-content flex flex-col">
        <div className="min-h-screen bg-base-200">
          <NavBar />

          <div className="max-w-4xl mx-auto p-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">カテゴリ管理</h2>
                
                {/* 新規カテゴリ追加フォーム */}
                <div className="card bg-base-200 mb-6">
                  <div className="card-body">
                    <h3 className="card-title text-lg mb-4">新規カテゴリ追加</h3>
                    <form onSubmit={handleAddCategory} className="flex gap-4">
                      <input
                        type="text"
                        placeholder="カテゴリ名を入力"
                        className="input input-bordered flex-1"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        required
                      />
                      <button type="submit" className="btn btn-primary">
                        追加
                      </button>
                    </form>
                  </div>
                </div>

                {/* カテゴリ一覧 */}
                {loading ? (
                  <div className="text-center py-8">
                    <span className="loading loading-spinner loading-lg"></span>
                    <p className="mt-2">カテゴリを読み込み中...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>カテゴリ名</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map(category => (
                          <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>
                              {editingId === category.id ? (
                                <input
                                  type="text"
                                  className="input input-bordered input-sm"
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleEditSave(category.id);
                                    } else if (e.key === 'Escape') {
                                      handleEditCancel();
                                    }
                                  }}
                                  autoFocus
                                />
                              ) : (
                                category.name
                              )}
                            </td>
                            <td>
                              <div className="flex gap-2">
                                {editingId === category.id ? (
                                  <>
                                    <button 
                                      className="btn btn-sm btn-success"
                                      onClick={() => handleEditSave(category.id)}
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
                                      onClick={() => handleEditStart(category)}
                                    >
                                      編集
                                    </button>
                                    <button 
                                      className="btn btn-sm btn-error"
                                      onClick={() => handleDelete(category.id)}
                                    >
                                      削除
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {categories.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    カテゴリがありません
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

export default CategoryManagement;
