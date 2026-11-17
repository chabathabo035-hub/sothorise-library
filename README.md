# SothoRise Library

A library management web application for the Web Application Development.
It manages books, stock levels, borrowing and returning, and user accounts.

- **Frontend:** React (Vite), React Router, React hooks, Fetch API, plain CSS
- **Backend:** Express.js (REST API) with `express.json()` and `cors`
- **Database:** MySQL (XAMPP)

## Features

- **Dashboard:** book availability cards, summary numbers (titles, copies, low stock), search by title, author or genre, and a "Low stock" highlight for books with fewer than 10 opies
- **Book Management (admin):** add, update and delete books (title, author, genre, ISBN, quantity) with form validation
- **Transactions:** borrow (deducts stock), return (adds stock back) and add stock (admin only), with a full history log
- **User Management:** login form, and for admins: add, update and delete users (name, membership ID, role, password)
- **Roles:** the Books page is for admins only. Transactions need a login. Members can borrow and return. Only admins can add stock.


## How to run

### Start the database
Open the XAMPP Control Panel and click **Start** next to **MySQL** (it turns green).

### Start the backend
Open a terminal in the project folder(VIisual Studio Code):

cd backend
npm install
npm run setup
npm run seed
npm run dev


- `npm run setup` creates the `library_db` database and its tables
- `npm run seed` adds an admin account and 3 sample books
- The API runs on http://localhost:5000


### 3. Start the frontend
Open a second terminal:

```
cd frontend
npm install
npm run dev
```

### 4. Open the app
Go to **http://localhost:5173** in your browser.

## Login

Go to the **Users** page and log in with:

| Membership ID | Password |
|---|---|
| `CHABA620` | '123456789` |


## Project structure

```
library-app/
├── backend/
│   ├── server.js            starts Express and connects the routes
│   ├── db.js                MySQL connection (settings from .env)
│   ├── schema.sql           database tables
│   ├── setup.js             creates the database from schema.sql
│   ├── seed.js              adds the admin user and sample books
│   └── routes/
│       ├── books.js         /books
│       ├── transactions.js  /transactions
│       └── users.js         /users
└── frontend/src/
    ├── App.jsx              routes, logged-in user, role checks
    ├── api.js               all fetch calls in one place
    ├── index.css            styling
    ├── components/          Navbar, BookForm, BookList, UserForm, LoginForm
    └── pages/               Dashboard, BookManagement, Transactions, UserManagement
```

## API endpoints

| Method | Route | What it does |
|---|---|---|
| GET | `/books` | list all books |
| POST | `/books` | add a book |
| PUT | `/books/:id` | update a book |
| DELETE | `/books/:id` | delete a book |
| GET | `/transactions` | transaction history |
| POST | `/transactions` | record ADD_STOCK, BORROW or RETURN and update stock |
| POST | `/users/login` | log in |
| GET | `/users` | list users |
| POST | `/users` | add a user |
| PUT | `/users/:id` | update a user |
| DELETE | `/users/:id` | delete a user |

## Database tables

- **books:** id, title, author, genre, isbn (unique), quantity
- **users:** id, name, membership_id (unique), role (admin or member), password (hashed with bcrypt)
- **transactions:** id, book_id, user_id, type (ADD_STOCK, BORROW or RETURN), quantity, created_at

## Notes

- A borrow is rejected if there are not enough copies in stock.
- Stock and the transaction record are saved together in one database transaction.
- Page access is controlled in the React frontend. A production system would also check the role on the server (for example with JWT tokens).


