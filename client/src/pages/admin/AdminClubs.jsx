import { useState, useEffect } from 'react';
import { getClubs, createClub, updateClub, deleteClub } from '../../services';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import ConfirmModal from '../../components/ConfirmModal';

const CATEGORIES = ['Technical', 'Cultural', 'Sports', 'Literary', 'Social', 'Other'];
const EMPTY = { name: '', description: '', category: '', facultyCoordinator: '', meetingDetails: '' };

const AdminClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getClubs().then(({ data }) => setClubs(data)).catch(() => setError('Failed to load clubs')).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); setError(''); };
  const openEdit = (club) => { setForm({ name: club.name, description: club.description, category: club.category, facultyCoordinator: club.facultyCoordinator, meetingDetails: club.meetingDetails || '' }); setEditId(club._id); setShowForm(true); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.description || !form.category || !form.facultyCoordinator) return setError('All required fields must be filled');
    setSaving(true);
    try {
      if (editId) {
        await updateClub(editId, form);
        setSuccess('Club updated successfully');
      } else {
        await createClub(form);
        setSuccess('Club created successfully');
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClub(confirm.id);
      setClubs((prev) => prev.filter((c) => c._id !== confirm.id));
      setSuccess('Club deleted');
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    } finally {
      setConfirm(null);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0" style={{ color: '#1a3c2e' }}>Club Management</h2>
        <button className="btn btn-success" onClick={openAdd}>+ Add Club</button>
      </div>
      <Alert message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      {/* Add/Edit Form */}
      {showForm && (
        <div className="card border-0 shadow-sm p-4 mb-4">
          <h5 className="fw-bold mb-3">{editId ? 'Edit Club' : 'Add New Club'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Club Name *</label>
                <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Category *</label>
                <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Description *</label>
                <textarea className="form-control" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Faculty Coordinator *</label>
                <input className="form-control" value={form.facultyCoordinator} onChange={(e) => setForm({ ...form, facultyCoordinator: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Meeting Details</label>
                <input className="form-control" value={form.meetingDetails} onChange={(e) => setForm({ ...form, meetingDetails: e.target.value })} placeholder="e.g. Every Friday 4PM, Room 201" />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-success" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Club'}</button>
              <button className="btn btn-outline-secondary" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <Spinner /> : clubs.length === 0 ? (
        <div className="text-center py-5 text-muted">No clubs yet. Add one above.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead style={{ background: '#1a3c2e', color: 'white' }}>
              <tr><th>Name</th><th>Category</th><th>Coordinator</th><th>Meeting</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {clubs.map((club) => (
                <tr key={club._id}>
                  <td className="fw-semibold">{club.name}</td>
                  <td><span className="badge" style={{ background: '#2d6a4f' }}>{club.category}</span></td>
                  <td>{club.facultyCoordinator}</td>
                  <td className="text-muted small">{club.meetingDetails || '—'}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-success" onClick={() => openEdit(club)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => setConfirm({ id: club._id, name: club.name })}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmModal show={!!confirm} title="Delete Club" message={`Delete "${confirm?.name}"? This cannot be undone.`} onConfirm={handleDelete} onCancel={() => setConfirm(null)} />
    </div>
  );
};

export default AdminClubs;
