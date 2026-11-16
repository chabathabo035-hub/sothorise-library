import { NavLink } from 'react-router-dom';

export default function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <h1 className="brand">SothoRise Library</h1>
      <div className="nav-row">
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          {user?.role === 'admin' && <NavLink to="/books">Books</NavLink>}
          {user && <NavLink to="/transactions">Transactions</NavLink>}
          <NavLink to="/users">Users</NavLink>
        </nav>
        <div className="who">
          {user ? (
            <>
              <span>{user.name} ({user.role})</span>
              <button className="btn small" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <span>Not logged in</span>
          )}
        </div>
      </div>
    </header>
  );
}
