import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../services';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import ConfirmModal from '../../components/ConfirmModal';

const EMPTY = { name: '', email: '', password: '', role: 'student' };

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
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
    getUsers(search).then(({ data }) => setUsers(data)).catch(() => setError('Failed to load users')).finally(() => setLoading(false));
  };

  useEffect(load, [search]);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); setError(''); };
  const openEdit = (u) => { setForm({ name: u.name, email: u.email, password: '', role: u.role }); setEditId(u._id); setShowForm(true); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email) return setError('Name and email are required');
    if (!editId && !form.password) return setError('Password is required for new users');
    setSaving(true);
    try {
      if (editId) {
        const payload = { name: form.name, email: form.email, role: form.role };
        await updateUser(editId, payload);
        setSuccess('User updated');
      } else {
        await createUser(form);
        setSuccess('User created');
      }
      setShowForm(false); load();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(confirm.id);
      setUsers((prev) => prev.filter((u) => u._id !== confirm.id));
      setSuccess('User deleted');
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    } finally {
      setConfirm(null);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0" style={{ color: '#1a3c2e' }}>User Management</h2>
        <button className="btn btn-success" onClick={openAdd}>+ Add User</button>
      </div>
      <div className="mb-3">
        <input className="form-control" style={{ maxWidth: 360 }} placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <Alert message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      {showForm && (
        <div className="card border-0 shadow-sm p-4 mb-4">
          <h5 className="fw-bold mb-3">{editId ? 'Edit User' : 'Add New User'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Name *</label>
                <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email *</label>
                <input type="email" className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              {!editId && (
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Password *</label>
                  <input type="password" className="form-control" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                </div>
              )}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Role</label>
                <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-success" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save User'}</button>
              <button className="btn btn-outline-secondary" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <Spinner /> : users.length === 0 ? (
        <div className="text-center py-5 text-muted">No users found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead style={{ background: '#1a3c2e', color: 'white' }}>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="fw-semibold">{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge bg-${u.role === 'admin' ? 'danger' : 'success'}`}>{u.role}</span></td>
                  <td className="text-muted small">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-success" onClick={() => openEdit(u)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => setConfirm({ id: u._id, name: u.name })}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmModal show={!!confirm} title="Delete User" message={`Delete user "${confirm?.name}"?`} onConfirm={handleDelete} onCancel={() => setConfirm(null)} />
    </div>
  );
};

export default AdminUsers;
