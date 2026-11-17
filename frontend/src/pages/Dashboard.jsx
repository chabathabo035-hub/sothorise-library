// Dashboard Page
import { useEffect, useState } from 'react';
import { api } from '../api.js';

const LOW_STOCK = 10;

export default function Dashboard() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/books').then(setBooks).catch((e) => setError(e.message));
  }, []);

  // Search by title, author or genre
  const shown = books.filter((b) =>
    `${b.title} ${b.author} ${b.genre}`.toLowerCase().includes(search.toLowerCase())
  );
  const totalCopies = books.reduce((sum, b) => sum + b.quantity, 0);
  const lowCount = books.filter((b) => b.quantity < LOW_STOCK).length;

  return (
    <section>
      <h2>Library Overview</h2>
      {error && <p className="error">{error}</p>}

      <div className="stats">
        <div className="card stat"><strong>{books.length}</strong><span>Book titles</span></div>
        <div className="card stat"><strong>{totalCopies}</strong><span>Copies in stock</span></div>
        <div className="card stat warn"><strong>{lowCount}</strong><span>Low stock</span></div>
      </div>

      <input
        className="search"
        placeholder="Search title, author or genre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid">
        {shown.map((b) => {
          const low = b.quantity < LOW_STOCK;
          return (
            <article key={b.id} className={`card book ${low ? 'low' : ''}`}>
              <h3>{b.title}</h3>
              <p>{b.author} · {b.genre}</p>
              <p className="qty">{b.quantity} in stock</p>
              {low && <span className="badge">Low stock</span>}
            </article>
          );
        })}
      </div>
      {!shown.length && !error && <p>No books found.</p>}
    </section>
  );
}
