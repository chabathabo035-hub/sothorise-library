import { useState, useEffect } from 'react';

const empty = { name: '', membership_id: '', role: 'member', password: '' };

export default function UserForm({ initial, onSubmit, onCancel, submitLabel = 'Add User' }) {
  const [form, setForm] = useState(initial ? { ...initial, password: '' } : empty);
  const [errors, setErrors] = useState({});

  useEffect(() => { setForm(initial ? { ...initial, password: '' } : empty); }, [initial]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = 'Name is required';
    if (!form.membership_id.trim()) err.membership_id = 'Membership ID is required';
    if (!initial && form.password.length < 6) err.password = 'Password needs at least 6 characters';
    setErrors(err);
    if (Object.keys(err).length) return;
    const ok = await onSubmit(form);
    if (ok && !initial) setForm(empty);
  };

  return (
    <form className="card form-grid" onSubmit={handleSubmit} noValidate>
      <label>Name
        <input name="name" value={form.name} onChange={handleChange} />
        {errors.name && <small className="error">{errors.name}</small>}
      </label>
      <label>Membership ID
        <input name="membership_id" value={form.membership_id} onChange={handleChange} />
        {errors.membership_id && <small className="error">{errors.membership_id}</small>}
      </label>
      <label>Role
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      <label>Password {initial && '(leave blank to keep)'}
        <input name="password" type="password" value={form.password} onChange={handleChange} />
        {errors.password && <small className="error">{errors.password}</small>}
      </label>
      <div className="actions">
        <button className="btn" type="submit">{submitLabel}</button>
        {onCancel && <button className="btn secondary" type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
