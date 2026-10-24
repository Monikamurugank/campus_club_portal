import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyMemberships, getMyRegistrations, getEvents } from '../../services';
import Spinner from '../../components/Spinner';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ memberships: 0, registrations: 0, upcomingEvents: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyMemberships(), getMyRegistrations(), getEvents({ date: new Date().toISOString().split('T')[0] })])
      .then(([m, r, e]) => setStats({ memberships: m.data.length, registrations: r.data.length, upcomingEvents: e.data.length }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-1" style={{ color: '#1a3c2e' }}>Welcome, {user.name}! 👋</h2>
      <p className="text-muted mb-4">Here's your campus activity overview.</p>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        {[
          { label: 'Clubs Joined', value: stats.memberships, icon: '🏛️', link: '/my-memberships' },
          { label: 'Events Registered', value: stats.registrations, icon: '🎟️', link: '/my-registrations' },
          { label: 'Upcoming Events', value: stats.upcomingEvents, icon: '📅', link: '/events' },
        ].map((s) => (
          <div key={s.label} className="col-md-4">
            <Link to={s.link} className="text-decoration-none">
              <div className="card border-0 shadow-sm text-center p-4 h-100" style={{ transition: 'transform 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ fontSize: '2rem' }}>{s.icon}</div>
                <h2 className="fw-bold mt-2" style={{ color: '#1a3c2e' }}>{s.value}</h2>
                <p className="text-muted mb-0">{s.label}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h5 className="fw-bold mb-3" style={{ color: '#1a3c2e' }}>Quick Actions</h5>
      <div className="d-flex flex-wrap gap-3">
        <Link to="/clubs" className="btn btn-success">Browse Clubs</Link>
        <Link to="/events" className="btn btn-outline-success">View Events</Link>
        <Link to="/my-memberships" className="btn btn-outline-secondary">My Memberships</Link>
        <Link to="/my-registrations" className="btn btn-outline-secondary">My Registrations</Link>
        <Link to="/change-password" className="btn btn-outline-secondary">Change Password</Link>
      </div>
    </div>
  );
};

export default StudentDashboard;
