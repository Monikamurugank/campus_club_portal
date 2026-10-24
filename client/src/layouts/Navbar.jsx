import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: '#1a3c2e' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🎓 Campus Club Portal
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-2">
            {!user ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/clubs">Clubs</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/events">Events</Link></li>
                <li className="nav-item"><Link className="btn btn-outline-light btn-sm" to="/login">Login</Link></li>
                <li className="nav-item"><Link className="btn btn-success btn-sm" to="/signup">Sign Up</Link></li>
              </>
            ) : user.role === 'admin' ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/admin">Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/clubs">Clubs</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/events">Events</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/users">Users</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/registrations">Registrations</Link></li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/clubs">Clubs</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/events">Events</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/my-memberships">My Clubs</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/my-registrations">My Events</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/change-password">Password</Link></li>
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
