import { useState, useEffect } from 'react';
import { getAllRegistrations } from '../../services';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAllRegistrations()
      .then(({ data }) => setRegistrations(data))
      .catch(() => setError('Failed to load registrations'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4" style={{ color: '#1a3c2e' }}>Registration Management</h2>
      <Alert message={error} onClose={() => setError('')} />
      {loading ? <Spinner /> : registrations.length === 0 ? (
        <div className="text-center py-5 text-muted">No registrations yet.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead style={{ background: '#1a3c2e', color: 'white' }}>
              <tr><th>Student</th><th>Email</th><th>Event</th><th>Club</th><th>Date</th><th>Status</th><th>Registered At</th></tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r._id}>
                  <td className="fw-semibold">{r.userId?.name}</td>
                  <td className="text-muted small">{r.userId?.email}</td>
                  <td>{r.eventId?.title}</td>
                  <td>{r.eventId?.clubId?.name}</td>
                  <td>{r.eventId?.date ? new Date(r.eventId.date).toLocaleDateString() : '—'}</td>
                  <td><span className={`badge bg-${r.status === 'confirmed' ? 'success' : 'secondary'}`}>{r.status}</span></td>
                  <td className="text-muted small">{new Date(r.registeredAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRegistrations;
