// Run once: npm run seed  -> creates an admin + sample books
const bcrypt = require('bcryptjs');
const db = require('./db');

(async () => {
  const hash = await bcrypt.hash('admin123', 10);
  await db.query(
    "INSERT IGNORE INTO users (name, membership_id, role, password) VALUES ('Admin', 'ADMIN001', 'admin', ?)", [hash]);
  await db.query(`INSERT IGNORE INTO books (title, author, genre, isbn, quantity) VALUES
    ('Things Fall Apart','Chinua Achebe','Fiction','9780385474542',5),
    ('Clean Code','Robert C. Martin','Programming','9780132350884',1),
    ('Introduction to Algorithms','Cormen et al.','Computer Science','9780262033848',3)`);
  console.log('Seeded. Login: ADMIN001 / admin123');
  process.exit(0);
})();
