import { useState } from 'react';
import { changePassword } from '../services';
import Alert from '../components/Alert';

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmNew: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.newPassword.length < 8) return setError('New password must be at least 8 characters');
    if (!/[A-Z]/.test(form.newPassword)) return setError('New password must contain an uppercase letter');
    if (!/[0-9]/.test(form.newPassword)) return setError('New password must contain a number');
    if (form.newPassword !== form.confirmNew) return setError('New passwords do not match');

    setLoading(true);
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      setSuccess('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmNew: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <div className="card border-0 shadow-sm p-4">
        <h3 className="fw-bold mb-4" style={{ color: '#1a3c2e' }}>Change Password</h3>
        <Alert message={error} onClose={() => setError('')} />
        <Alert type="success" message={success} onClose={() => setSuccess('')} />
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Current Password</label>
            <input className="form-control" type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">New Password</label>
            <input className="form-control" type="password" name="newPassword" value={form.newPassword} onChange={handleChange} placeholder="Min 8 chars, 1 uppercase, 1 number" required />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Confirm New Password</label>
            <input className="form-control" type="password" name="confirmNew" value={form.confirmNew} onChange={handleChange} required />
          </div>
          <button className="btn btn-success w-100 fw-semibold" type="submit" disabled={loading}>
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
