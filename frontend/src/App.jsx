import { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BookManagement from './pages/BookManagement.jsx';
import Transactions from './pages/Transactions.jsx';
import UserManagement from './pages/UserManagement.jsx';

// Shown instead of a page when the person is not allowed to see it
function Locked({ message }) {
  return (
    <section>
      <h2>Access denied</h2>
      <p>{message}</p>
      <Link to="/users">Go to login</Link>
    </section>
  );
}

export default function App() {
  // Logged-in user kept in state (and sessionStorage so a refresh keeps you in)
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (u) => {
    sessionStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  };
  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/books"
            element={isAdmin ? <BookManagement /> : <Locked message="Only admins can manage books. Please log in as an admin." />}
          />
          <Route
            path="/transactions"
            element={user ? <Transactions user={user} /> : <Locked message="Please log in to record transactions." />}
          />
          <Route
            path="/users"
            element={<UserManagement user={user} onLogin={handleLogin} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}
