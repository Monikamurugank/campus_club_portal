import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyMemberships, leaveClub } from '../../services';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import ConfirmModal from '../../components/ConfirmModal';

const MyMemberships = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(null); // { id, name }

  const load = () => {
    setLoading(true);
    getMyMemberships()
      .then(({ data }) => setMemberships(data))
      .catch(() => setError('Failed to load memberships'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleLeave = async () => {
    try {
      await leaveClub(confirm.id);
      setMemberships((prev) => prev.filter((m) => m._id !== confirm.id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to leave club');
    } finally {
      setConfirm(null);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4" style={{ color: '#1a3c2e' }}>My Club Memberships</h2>
      <Alert message={error} onClose={() => setError('')} />
      {loading ? <Spinner /> : memberships.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>You haven't joined any clubs yet.</p>
          <Link to="/clubs" className="btn btn-success">Browse Clubs</Link>
        </div>
      ) : (
        <div className="row g-4">
          {memberships.map((m) => (
            <div key={m._id} className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <span className="badge mb-2" style={{ background: '#2d6a4f' }}>{m.clubId?.category}</span>
                  <h5 className="fw-bold">{m.clubId?.name}</h5>
                  <p className="small text-muted">Joined: {new Date(m.joinedAt).toLocaleDateString()}</p>
                </div>
                <div className="card-footer bg-transparent border-0 d-flex gap-2">
                  <Link to={`/clubs/${m.clubId?._id}`} className="btn btn-sm btn-outline-success flex-fill">View Club</Link>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => setConfirm({ id: m._id, name: m.clubId?.name })}>Leave</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal
        show={!!confirm}
        title="Leave Club"
        message={`Are you sure you want to leave "${confirm?.name}"?`}
        onConfirm={handleLeave}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
};

export default MyMemberships;
