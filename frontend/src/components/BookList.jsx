import { useState } from 'react';
import BookForm from './BookForm.jsx';

export default function BookList({ books, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);

  if (!books.length) return <p>No books yet.</p>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr><th>Title</th><th>Author</th><th>Genre</th><th>ISBN</th><th>Qty</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {books.map((b) =>
            editingId === b.id ? (
              <tr key={b.id}>
                <td colSpan="6">
                  <BookForm
                    initial={b}
                    submitLabel="Save"
                    onCancel={() => setEditingId(null)}
                    onSubmit={async (data) => {
                      const ok = await onUpdate(b.id, data);
                      if (ok) setEditingId(null);
                      return ok;
                    }}
                  />
                </td>
              </tr>
            ) : (
              <tr key={b.id}>
                <td>{b.title}</td><td>{b.author}</td><td>{b.genre}</td><td>{b.isbn}</td><td>{b.quantity}</td>
                <td className="row-actions">
                  <button className="btn small" onClick={() => setEditingId(b.id)}>Update</button>
                  <button
                    className="btn small danger"
                    onClick={() => window.confirm(`Delete "${b.title}"?`) && onDelete(b.id)}
                  >Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
