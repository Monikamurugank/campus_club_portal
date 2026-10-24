import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getClubs } from '../services';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Literary', 'Social', 'Other'];

const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const { data } = await getClubs({ search, category });
      setClubs(data);
    } catch {
      setError('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClubs(); }, [search, category]);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4" style={{ color: '#1a3c2e' }}>Campus Clubs</h2>
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <input className="form-control" placeholder="Search clubs…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <Alert message={error} />
      {loading ? <Spinner /> : clubs.length === 0 ? (
        <div className="text-center py-5 text-muted">No clubs found.</div>
      ) : (
        <div className="row g-4">
          {clubs.map((club) => (
            <div key={club._id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <span className="badge mb-2" style={{ background: '#2d6a4f' }}>{club.category}</span>
                  <h5 className="card-title fw-bold">{club.name}</h5>
                  <p className="card-text text-muted small">{club.description.slice(0, 100)}…</p>
                  <p className="small text-muted mb-0">👨‍🏫 {club.facultyCoordinator}</p>
                </div>
                <div className="card-footer bg-transparent border-0">
                  <Link to={`/clubs/${club._id}`} className="btn btn-sm btn-outline-success w-100">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClubsPage;
