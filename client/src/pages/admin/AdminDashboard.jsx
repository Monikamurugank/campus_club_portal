import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../services';
import Spinner from '../../components/Spinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const cards = [
    { label: 'Total Clubs', value: stats?.totalClubs ?? 0, link: '/admin/clubs', color: '#1a3c2e' },
    { label: 'Registered Students', value: stats?.totalUsers ?? 0, link: '/admin/users', color: '#2d6a4f' },
    { label: 'Total Events', value: stats?.totalEvents ?? 0, link: '/admin/events', color: '#40916c' },
    { label: 'Event Registrations', value: stats?.totalRegistrations ?? 0, link: '/admin/registrations', color: '#52b788' },
  ];

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-1" style={{ color: '#1a3c2e' }}>Admin Dashboard</h2>
      <p className="text-muted mb-4">Portal overview and management</p>

      <div className="row g-4 mb-5">
        {cards.map((c) => (
          <div key={c.label} className="col-md-6 col-lg-3">
            <Link to={c.link} className="text-decoration-none">
              <div className="card border-0 shadow-sm text-white text-center p-4 h-100"
                style={{ background: c.color, transition: 'transform 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <h2 className="fw-bold mt-2">{c.value}</h2>
                <p className="mb-0 opacity-75">{c.label}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <h5 className="fw-bold mb-3" style={{ color: '#1a3c2e' }}>Quick Actions</h5>
      <div className="d-flex flex-wrap gap-3">
        <Link to="/admin/clubs" className="btn btn-success">Manage Clubs</Link>
        <Link to="/admin/events" className="btn btn-outline-success">Manage Events</Link>
        <Link to="/admin/users" className="btn btn-outline-secondary">Manage Users</Link>
        <Link to="/admin/registrations" className="btn btn-outline-secondary">View Registrations</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
