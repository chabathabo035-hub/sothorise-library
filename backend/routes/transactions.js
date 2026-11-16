const express = require('express');
const db = require('../db');
const router = express.Router();

// History log
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT t.id, t.type, t.quantity, t.created_at,
             b.title AS book_title, u.name AS user_name
      FROM transactions t
      JOIN books b ON b.id = t.book_id
      LEFT JOIN users u ON u.id = t.user_id
      ORDER BY t.created_at DESC, t.id DESC`);
    res.json(rows);
  } catch (e) { next(e); }
});

// Record ADD_STOCK, BORROW or RETURN and update stock together (DB transaction)
router.post('/', async (req, res, next) => {
  const { book_id, user_id, type } = req.body;
  const quantity = Number(req.body.quantity);
  if (!book_id || !['ADD_STOCK', 'BORROW', 'RETURN'].includes(type))
    return res.status(400).json({ error: 'book_id and valid type required' });
  if (!Number.isInteger(quantity) || quantity < 1)
    return res.status(400).json({ error: 'Quantity must be at least 1' });

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [[book]] = await conn.query('SELECT quantity FROM books WHERE id=? FOR UPDATE', [book_id]);
    if (!book) { await conn.rollback(); return res.status(404).json({ error: 'Book not found' }); }

    if (type === 'BORROW' && book.quantity < quantity) {
      await conn.rollback();
      return res.status(400).json({ error: `Only ${book.quantity} copies in stock` });
    }
    // Borrow takes copies out of stock; add stock and return put copies back
    const delta = type === 'BORROW' ? -quantity : quantity;
    await conn.query('UPDATE books SET quantity = quantity + ? WHERE id=?', [delta, book_id]);
    await conn.query(
      'INSERT INTO transactions (book_id, user_id, type, quantity) VALUES (?,?,?,?)',
      [book_id, user_id || null, type, quantity]
    );
    await conn.commit();
    res.status(201).json({ message: 'Transaction recorded' });
  } catch (e) {
    await conn.rollback();
    next(e);
  } finally {
    conn.release();
  }
});

module.exports = router;
