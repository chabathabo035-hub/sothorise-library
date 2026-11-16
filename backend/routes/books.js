const express = require('express');
const db = require('../db');
const router = express.Router();

function validate(b) {
  if (!b.title || !b.author || !b.genre || !b.isbn) return 'Title, author, genre and ISBN are required';
  if (!Number.isInteger(Number(b.quantity)) || Number(b.quantity) < 0) return 'Quantity must be 0 or more';
  return null;
}

// READ all
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM books ORDER BY title');
    res.json(rows);
  } catch (e) { next(e); }
});

// CREATE
router.post('/', async (req, res, next) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  const { title, author, genre, isbn, quantity } = req.body;
  try {
    const [r] = await db.query(
      'INSERT INTO books (title, author, genre, isbn, quantity) VALUES (?,?,?,?,?)',
      [title, author, genre, isbn, Number(quantity)]
    );
    res.status(201).json({ id: r.insertId, title, author, genre, isbn, quantity: Number(quantity) });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'ISBN already exists' });
    next(e);
  }
});

// UPDATE
router.put('/:id', async (req, res, next) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  const { title, author, genre, isbn, quantity } = req.body;
  try {
    const [r] = await db.query(
      'UPDATE books SET title=?, author=?, genre=?, isbn=?, quantity=? WHERE id=?',
      [title, author, genre, isbn, Number(quantity), req.params.id]
    );
    if (!r.affectedRows) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book updated' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'ISBN already exists' });
    next(e);
  }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    const [r] = await db.query('DELETE FROM books WHERE id=?', [req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
