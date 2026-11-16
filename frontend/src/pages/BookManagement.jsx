//BookManagement
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import BookForm from '../components/BookForm.jsx';
import BookList from '../components/BookList.jsx';
// This page is for managing books. It allows adding, updating, and deleting books.
export default function BookManagement() {
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

// Flash messages are used to show success or error messages to the user
  const flash = (text, type = 'success') => setMessage({ text, type });
  const load = () => api.get('/books').then(setBooks).catch((e) => flash(e.message, 'error'));
  useEffect(() => { load(); }, []);

  // Each handler returns true/false so forms know whether to reset
  const run = async (fn, okMsg) => {
    try { await fn(); flash(okMsg); await load(); return true; }
    catch (e) { flash(e.message, 'error'); return false; }
  };

  return (
    <section>
      <h2>Book Management</h2>
      {message.text && <p className={message.type}>{message.text}</p>}
      <h3>Add a new book</h3>
      <BookForm onSubmit={(data) => run(() => api.post('/books', data), 'Book added')} />
      <h3>All books</h3>
      <BookList
        books={books}
        onUpdate={(id, data) => run(() => api.put(`/books/${id}`, data), 'Book updated')}
        onDelete={(id) => run(() => api.del(`/books/${id}`), 'Book deleted')}
      />
    </section>
  );
}
