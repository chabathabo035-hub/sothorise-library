// Transactions Page
import { useEffect, useState } from 'react';
import { api } from '../api.js';
// Constants for transaction types and their labels
const LABELS = { ADD_STOCK: 'Added stock', BORROW: 'Borrowed', RETURN: 'Returned' };

export default function Transactions({ user }) {
  const [books, setBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({ book_id: '', type: 'BORROW', quantity: 1 });
  const [message, setMessage] = useState({ text: '', type: '' });
// Load books and transaction history from the API
  const load = async () => {
    try {
      setBooks(await api.get('/books'));
      setHistory(await api.get('/transactions'));
    } catch (e) { setMessage({ text: e.message, type: 'error' }); }
  };
  useEffect(() => { load(); }, []);
// Handle form submission for recording a transaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.book_id) return setMessage({ text: 'Choose a book', type: 'error' });
    if (Number(form.quantity) < 1) return setMessage({ text: 'Quantity must be at least 1', type: 'error' });
    try {
      await api.post('/transactions', { ...form, quantity: Number(form.quantity), user_id: user?.id });
      setMessage({ text: 'Transaction recorded', type: 'success' });
      setForm({ ...form, quantity: 1 });
      load();
    } catch (err) { setMessage({ text: err.message, type: 'error' }); }
  };

  return (
    <section>
      <h2>Transactions</h2>
      {message.text && <p className={message.type}>{message.text}</p>}
      <form className="card form-grid" onSubmit={handleSubmit}>
        <label>Book
          <select value={form.book_id} onChange={(e) => setForm({ ...form, book_id: e.target.value })}>
            <option value="">-- select --</option>
            {books.map((b) => <option key={b.id} value={b.id}>{b.title} ({b.quantity} in stock)</option>)}
          </select>
        </label>
        <label>Action
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="BORROW">Borrow (deduct stock)</option>
            <option value="RETURN">Return (add back to stock)</option>
            {user?.role === 'admin' && <option value="ADD_STOCK">Add stock (new books)</option>}
          </select>
        </label>
        <label>Quantity
          <input type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
        </label>
        <div className="actions"><button className="btn" type="submit">Record</button></div>
      </form>

      <h3>History</h3>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Book</th><th>Type</th><th>Qty</th><th>By</th></tr></thead>
          <tbody>
            {history.map((t) => (
              <tr key={t.id}>
                <td>{new Date(t.created_at).toLocaleString()}</td>
                <td>{t.book_title}</td>
                <td><span className={`pill ${t.type}`}>{LABELS[t.type]}</span></td>
                <td>{t.quantity}</td>
                <td>{t.user_name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
