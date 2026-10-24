import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyRegistrations, cancelRegistration } from '../../services';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import ConfirmModal from '../../components/ConfirmModal';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(null);

  const load = () => {
    setLoading(true);
    getMyRegistrations()
      .then(({ data }) => setRegistrations(data))
      .catch(() => setError('Failed to load registrations'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCancel = async () => {
    try {
      await cancelRegistration(confirm.id);
      setRegistrations((prev) => prev.filter((r) => r._id !== confirm.id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setConfirm(null);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4" style={{ color: '#1a3c2e' }}>My Event Registrations</h2>
      <Alert message={error} onClose={() => setError('')} />
      {loading ? <Spinner /> : registrations.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p>You haven't registered for any events yet.</p>
          <Link to="/events" className="btn btn-success">Browse Events</Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead style={{ background: '#1a3c2e', color: 'white' }}>
              <tr>
                <th>Event</th><th>Club</th><th>Date</th><th>Venue</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r._id}>
                  <td className="fw-semibold">{r.eventId?.title}</td>
                  <td>{r.eventId?.clubId?.name}</td>
                  <td>{r.eventId?.date ? new Date(r.eventId.date).toLocaleDateString() : '—'}</td>
                  <td>{r.eventId?.venue}</td>
                  <td><span className={`badge bg-${r.status === 'confirmed' ? 'success' : 'secondary'}`}>{r.status}</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => setConfirm({ id: r._id, title: r.eventId?.title })}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmModal
        show={!!confirm}
        title="Cancel Registration"
        message={`Cancel registration for "${confirm?.title}"?`}
        onConfirm={handleCancel}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
};

export default MyRegistrations;
