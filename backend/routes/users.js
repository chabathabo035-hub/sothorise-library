const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

const safe = 'id, name, membership_id, role';

// LOGIN
router.post('/login', async (req, res, next) => {
  const { membership_id, password } = req.body;
  if (!membership_id || !password) return res.status(400).json({ error: 'Membership ID and password required' });
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE membership_id=?', [membership_id]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid credentials' });
    const { password: _pw, ...publicUser } = user;
    res.json(publicUser);
  } catch (e) { next(e); }
});

// READ all
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query(`SELECT ${safe} FROM users ORDER BY name`);
    res.json(rows);
  } catch (e) { next(e); }
});

// CREATE
router.post('/', async (req, res, next) => {
  const { name, membership_id, role, password } = req.body;
  if (!name || !membership_id || !password) return res.status(400).json({ error: 'Name, membership ID and password required' });
  if (!['admin', 'member'].includes(role || 'member')) return res.status(400).json({ error: 'Invalid role' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const [r] = await db.query(
      'INSERT INTO users (name, membership_id, role, password) VALUES (?,?,?,?)',
      [name, membership_id, role || 'member', hash]
    );
    res.status(201).json({ id: r.insertId, name, membership_id, role: role || 'member' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Membership ID already exists' });
    next(e);
  }
});

// UPDATE (password optional)
router.put('/:id', async (req, res, next) => {
  const { name, membership_id, role, password } = req.body;
  if (!name || !membership_id || !['admin', 'member'].includes(role))
    return res.status(400).json({ error: 'Name, membership ID and valid role required' });
  try {
    let sql = 'UPDATE users SET name=?, membership_id=?, role=?';
    const params = [name, membership_id, role];
    if (password) { sql += ', password=?'; params.push(await bcrypt.hash(password, 10)); }
    sql += ' WHERE id=?';
    params.push(req.params.id);
    const [r] = await db.query(sql, params);
    if (!r.affectedRows) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated' });
  } catch (e) {
    if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Membership ID already exists' });
    next(e);
  }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    const [r] = await db.query('DELETE FROM users WHERE id=?', [req.params.id]);
    if (!r.affectedRows) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
