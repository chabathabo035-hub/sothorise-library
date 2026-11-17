import { useState, useEffect } from 'react';

const empty = { title: '', author: '', genre: '', isbn: '', quantity: 0 };

// Controlled form used for both adding and editing a book
export default function BookForm({ initial, onSubmit, onCancel, submitLabel = 'Save Book' }) {
  const [form, setForm] = useState(initial || empty);
  const [errors, setErrors] = useState({});

  useEffect(() => { setForm(initial || empty); }, [initial]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const err = {};
    if (!form.title.trim()) err.title = 'Title is required';
    if (!form.author.trim()) err.author = 'Author is required';
    if (!form.genre.trim()) err.genre = 'Genre is required';
    if (!form.isbn.trim()) err.isbn = 'ISBN is required';
    if (form.quantity === '' || Number(form.quantity) < 0 || !Number.isInteger(Number(form.quantity)))
      err.quantity = 'Quantity must be a whole number, 0 or more';
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;
    const ok = await onSubmit({ ...form, quantity: Number(form.quantity) });
    if (ok && !initial) setForm(empty);
  };

  const field = (name, label, type = 'text') => (
    <label>
      {label}
      <input name={name} type={type} value={form[name]} onChange={handleChange} min={type === 'number' ? 0 : undefined} />
      {errors[name] && <small className="error">{errors[name]}</small>}
    </label>
  );

  return (
    <form className="card form-grid" onSubmit={handleSubmit} noValidate>
      {field('title', 'Title')}
      {field('author', 'Author')}
      {field('genre', 'Genre')}
      {field('isbn', 'ISBN')}
      {field('quantity', 'Quantity', 'number')}
      <div className="actions">
        <button className="btn" type="submit">{submitLabel}</button>
        {onCancel && <button className="btn secondary" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
