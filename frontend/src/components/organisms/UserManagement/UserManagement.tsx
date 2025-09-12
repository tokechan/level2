import React, { useState, useEffect } from 'react';
import { userApi, healthApi, useErrorHandler, type User, type CreateUserRequest } from '../../../apis';

interface UserManagementProps {
  className?: string;
}

export const UserManagement: React.FC<UserManagementProps> = ({ className }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<string>('checking');
  
  const { handleError } = useErrorHandler();

  // フォーム状態
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    email: '',
  });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // ヘルスチェック
  const checkHealth = async () => {
    try {
      const health = await healthApi.checkHealth();
      setHealthStatus(health.status);
    } catch (err) {
      const errorInfo = handleError(err);
      setHealthStatus('unhealthy');
      setError(errorInfo.message);
    }
  };

  // ユーザー一覧取得
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userApi.getUsers();
      setUsers(response.data);
    } catch (err) {
      const errorInfo = handleError(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  // ユーザー作成
  const createUser = async (userData: CreateUserRequest) => {
    try {
      await userApi.createUser(userData);
      await fetchUsers(); // 一覧を再取得
      setFormData({ name: '', email: '' });
    } catch (err) {
      const errorInfo = handleError(err);
      setError(errorInfo.message);
    }
  };

  // ユーザー更新
  const updateUser = async (id: number, userData: CreateUserRequest) => {
    try {
      await userApi.updateUser(id, userData);
      await fetchUsers(); // 一覧を再取得
      setEditingUser(null);
    } catch (err) {
      const errorInfo = handleError(err);
      setError(errorInfo.message);
    }
  };

  // ユーザー削除
  const deleteUser = async (id: number) => {
    if (!confirm('このユーザーを削除しますか？')) return;
    
    try {
      await userApi.deleteUser(id);
      await fetchUsers(); // 一覧を再取得
    } catch (err) {
      const errorInfo = handleError(err);
      setError(errorInfo.message);
    }
  };

  // フォーム送信
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      createUser(formData);
    }
  };

  // 編集開始
  const startEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
    });
  };

  // 編集キャンセル
  const cancelEdit = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '' });
  };

  // 初期化
  useEffect(() => {
    checkHealth();
    fetchUsers();
  }, []);

  return (
    <div className={className}>
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1>ユーザー管理システム</h1>
        
        {/* ヘルスステータス */}
        <div style={{ marginBottom: '20px' }}>
          <p>
            サーバー状態: 
            <span style={{ 
              color: healthStatus === 'healthy' ? 'green' : 'red',
              fontWeight: 'bold',
              marginLeft: '8px'
            }}>
              {healthStatus === 'healthy' ? '正常' : '異常'}
            </span>
          </p>
        </div>

        {/* エラー表示 */}
        {error && (
          <div style={{ 
            backgroundColor: '#ffebee', 
            color: '#c62828', 
            padding: '10px', 
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* ユーザー作成・編集フォーム */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
          <h2>{editingUser ? 'ユーザー編集' : '新規ユーザー作成'}</h2>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '5px' }}>
              名前:
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
              メールアドレス:
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <button 
              type="submit"
              style={{ 
                backgroundColor: '#1976d2', 
                color: 'white', 
                padding: '10px 20px', 
                border: 'none',
                borderRadius: '4px',
                marginRight: '10px',
                cursor: 'pointer'
              }}
            >
              {editingUser ? '更新' : '作成'}
            </button>
            
            {editingUser && (
              <button 
                type="button"
                onClick={cancelEdit}
                style={{ 
                  backgroundColor: '#757575', 
                  color: 'white', 
                  padding: '10px 20px', 
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                キャンセル
              </button>
            )}
          </div>
        </form>

        {/* ユーザー一覧 */}
        <div>
          <h2>ユーザー一覧</h2>
          
          {loading ? (
            <p>読み込み中...</p>
          ) : (
            <div>
              {users.length === 0 ? (
                <p>ユーザーが登録されていません。</p>
              ) : (
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse',
                  border: '1px solid #ddd'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                      <th style={{ padding: '10px', border: '1px solid #ddd' }}>名前</th>
                      <th style={{ padding: '10px', border: '1px solid #ddd' }}>メール</th>
                      <th style={{ padding: '10px', border: '1px solid #ddd' }}>作成日</th>
                      <th style={{ padding: '10px', border: '1px solid #ddd' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.id}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.name}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                          <button
                            onClick={() => startEdit(user)}
                            style={{ 
                              backgroundColor: '#ff9800', 
                              color: 'white', 
                              padding: '5px 10px', 
                              border: 'none',
                              borderRadius: '4px',
                              marginRight: '5px',
                              cursor: 'pointer'
                            }}
                          >
                            編集
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            style={{ 
                              backgroundColor: '#f44336', 
                              color: 'white', 
                              padding: '5px 10px', 
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            削除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
