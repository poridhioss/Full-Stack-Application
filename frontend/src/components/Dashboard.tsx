import React, { useState, useEffect } from 'react';
import { userService, User } from '../services/userService';

interface DashboardProps {
  currentUser: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ username: '', email: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersData = await userService.getAllUsers();
      setUsers(Array.isArray(usersData) ? usersData : []); // Ensure it's always an array
    } catch (err: any) {
      setError('Failed to fetch users');
      setUsers([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({ username: user.username, email: user.email });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const updatedUser = await userService.updateUser(editingUser.id, editForm);
      setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
      setEditingUser(null);
    } catch (err: any) {
      setError('Failed to update user');
    }
  };

  const handleDelete = async (userId: number) => {
    const isCurrentUser = userId === currentUser.id;
    const confirmMessage = isCurrentUser 
      ? 'Are you sure you want to delete your own account? You will be logged out automatically.' 
      : 'Are you sure you want to delete this user?';
    
    if (!window.confirm(confirmMessage)) return;

    try {
      await userService.deleteUser(userId);
      
      if (isCurrentUser) {
        // If deleting current user, clear storage and logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        onLogout();
      } else {
        // If deleting another user, just update the users list
        setUsers(users.filter(u => u.id !== userId));
      }
    } catch (err: any) {
      setError('Failed to delete user');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>User Management Dashboard</h1>
        <div>
          <span style={{ marginRight: '10px' }}>Welcome, {currentUser.username}!</span>
          <button
            onClick={handleLogout}
            style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h2>All Users</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left' }}>ID</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left' }}>Username</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left' }}>Email</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left' }}>Created At</th>
              <th style={{ border: '1px solid #dee2e6', padding: '8px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.map(user => (
              <tr key={user.id} style={{ backgroundColor: user.id === currentUser.id ? '#e3f2fd' : 'transparent' }}>
                <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>
                  {user.id} {user.id === currentUser.id && <span style={{ color: '#007bff', fontWeight: 'bold' }}>(You)</span>}
                </td>
                <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{user.username}</td>
                <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>{user.email}</td>
                <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td style={{ border: '1px solid #dee2e6', padding: '8px' }}>
                  <button
                    onClick={() => handleEdit(user)}
                    style={{ marginRight: '5px', padding: '3px 8px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{ 
                      padding: '3px 8px', 
                      backgroundColor: user.id === currentUser.id ? '#ff6b35' : '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '3px',
                      fontWeight: user.id === currentUser.id ? 'bold' : 'normal'
                    }}
                    title={user.id === currentUser.id ? 'Delete your account (will logout)' : 'Delete user'}
                  >
                    {user.id === currentUser.id ? 'Delete Account' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px'
          }}>
            <h3>Edit User</h3>
            <form onSubmit={handleEditSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label>Username:</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Email:</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div>
                <button
                  type="submit"
                  style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;