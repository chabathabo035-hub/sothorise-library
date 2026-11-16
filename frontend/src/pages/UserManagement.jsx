// User Management Page
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import LoginForm from '../components/LoginForm.jsx';
import UserForm from '../components/UserForm.jsx';

export default function UserManagement({ user, onLogin }) {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  const isAdmin = user?.role === 'admin';

  const load = () => api.get('/users').then(setUsers).catch((e) => setMessage({ text: e.message, type: 'error' }));
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const run = async (fn, okMsg) => {
    try { await fn(); setMessage({ text: okMsg, type: 'success' }); await load(); return true; }
    catch (e) { setMessage({ text: e.message, type: 'error' }); return false; }
  };

  if (!user) return <section><h2>User Management</h2><LoginForm onLogin={onLogin} /></section>;
  if (!isAdmin) return <section><h2>User Management</h2><p>Hello {user.name}. Only admins can manage users.</p></section>;

  return (
    <section>
      <h2>User Management</h2>
      {message.text && <p className={message.type}>{message.text}</p>}
      <h3>Add user</h3>
      <UserForm onSubmit={(d) => run(() => api.post('/users', d), 'User added')} />
      <h3>All users</h3>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Membership ID</th><th>Role</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map((u) => editingId === u.id ? (
              <tr key={u.id}><td colSpan="4">
                <UserForm
                  initial={u}
                  submitLabel="Save"
                  onCancel={() => setEditingId(null)}
                  onSubmit={async (d) => {
                    const ok = await run(() => api.put(`/users/${u.id}`, d), 'User updated');
                    if (ok) setEditingId(null);
                    return ok;
                  }}
                />
              </td></tr>
            ) : (
              <tr key={u.id}>
                <td>{u.name}</td><td>{u.membership_id}</td><td>{u.role}</td>
                <td className="row-actions">
                  <button className="btn small" onClick={() => setEditingId(u.id)}>Update</button>
                  <button
                    className="btn small danger"
                    disabled={u.id === user.id}
                    onClick={() => window.confirm(`Delete ${u.name}?`) && run(() => api.del(`/users/${u.id}`), 'User deleted')}
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
