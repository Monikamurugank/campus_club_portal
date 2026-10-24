import { useState, useEffect } from 'react';
import { getEvents, getClubs, createEvent, updateEvent, deleteEvent } from '../../services';
import Spinner from '../../components/Spinner';
import Alert from '../../components/Alert';
import ConfirmModal from '../../components/ConfirmModal';

const EMPTY = { title: '', description: '', clubId: '', date: '', time: '', venue: '', capacity: '' };

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
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
    Promise.all([getEvents(), getClubs()])
      .then(([e, c]) => { setEvents(e.data); setClubs(c.data); })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true); setError(''); };
  const openEdit = (ev) => {
    setForm({
      title: ev.title, description: ev.description, clubId: ev.clubId?._id || ev.clubId,
      date: ev.date?.split('T')[0] || '', time: ev.time, venue: ev.venue, capacity: ev.capacity,
    });
    setEditId(ev._id); setShowForm(true); setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.clubId || !form.date || !form.time || !form.venue || !form.capacity) return setError('All fields are required');
    if (new Date(form.date) < new Date(new Date().toDateString())) return setError('Event date cannot be in the past');
    if (Number(form.capacity) < 1) return setError('Capacity must be at least 1');
    setSaving(true);
    try {
      if (editId) { await updateEvent(editId, form); setSuccess('Event updated'); }
      else { await createEvent(form); setSuccess('Event created'); }
      setShowForm(false); load();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEvent(confirm.id);
      setEvents((prev) => prev.filter((e) => e._id !== confirm.id));
      setSuccess('Event deleted');
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    } finally {
      setConfirm(null);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0" style={{ color: '#1a3c2e' }}>Event Management</h2>
        <button className="btn btn-success" onClick={openAdd}>+ Add Event</button>
      </div>
      <Alert message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      {showForm && (
        <div className="card border-0 shadow-sm p-4 mb-4">
          <h5 className="fw-bold mb-3">{editId ? 'Edit Event' : 'Add New Event'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Event Title *</label>
                <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Club *</label>
                <select className="form-select" value={form.clubId} onChange={(e) => setForm({ ...form, clubId: e.target.value })} required>
                  <option value="">Select club</option>
                  {clubs.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Description *</label>
                <textarea className="form-control" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Date *</label>
                <input type="date" className="form-control" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Time *</label>
                <input type="time" className="form-control" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} required />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Capacity *</label>
                <input type="number" className="form-control" min="1" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Venue *</label>
                <input className="form-control" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} required />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-success" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Event'}</button>
              <button className="btn btn-outline-secondary" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <Spinner /> : events.length === 0 ? (
        <div className="text-center py-5 text-muted">No events yet.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead style={{ background: '#1a3c2e', color: 'white' }}>
              <tr><th>Title</th><th>Club</th><th>Date</th><th>Venue</th><th>Capacity</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev._id}>
                  <td className="fw-semibold">{ev.title}</td>
                  <td>{ev.clubId?.name}</td>
                  <td>{new Date(ev.date).toLocaleDateString()} {ev.time}</td>
                  <td>{ev.venue}</td>
                  <td>{ev.capacity}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-success" onClick={() => openEdit(ev)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => setConfirm({ id: ev._id, name: ev.title })}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmModal show={!!confirm} title="Delete Event" message={`Delete "${confirm?.name}"?`} onConfirm={handleDelete} onCancel={() => setConfirm(null)} />
    </div>
  );
};

export default AdminEvents;
