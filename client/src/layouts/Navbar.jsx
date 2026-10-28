import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const close = () => setIsOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: '#1a3c2e' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" onClick={close}>
          Campus Club Portal
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            {!user ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/clubs" onClick={close}>Clubs</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/events" onClick={close}>Events</Link></li>
                <li className="nav-item"><Link className="btn btn-outline-light btn-sm" to="/login" onClick={close}>Login</Link></li>
                <li className="nav-item"><Link className="btn btn-success btn-sm" to="/signup" onClick={close}>Sign Up</Link></li>
              </>
            ) : user.role === 'admin' ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/admin" onClick={close}>Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/clubs" onClick={close}>Clubs</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/events" onClick={close}>Events</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/users" onClick={close}>Users</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/registrations" onClick={close}>Registrations</Link></li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/dashboard" onClick={close}>Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/clubs" onClick={close}>Clubs</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/events" onClick={close}>Events</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/my-memberships" onClick={close}>My Clubs</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/my-registrations" onClick={close}>My Events</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/change-password" onClick={close}>Password</Link></li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
