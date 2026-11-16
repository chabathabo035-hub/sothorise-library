import { useState } from 'react';
import { api } from '../api.js';

export default function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ membership_id: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.membership_id || !form.password) return setError('Enter your membership ID and password');
    try {
      onLogin(await api.post('/users/login', form));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="card login" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label>Membership ID
        <input value={form.membership_id} onChange={(e) => setForm({ ...form, membership_id: e.target.value })} />
      </label>
      <label>Password
        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      </label>
      {error && <small className="error">{error}</small>}
      <button className="btn" type="submit">Login</button>
    </form>
  );
}
