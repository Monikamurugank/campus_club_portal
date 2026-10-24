import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, getClubs } from '../services';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [clubId, setClubId] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getClubs().then(({ data }) => setClubs(data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (clubId) params.clubId = clubId;
    if (date) params.date = date;
    getEvents(params)
      .then(({ data }) => setEvents(data))
      .catch(() => setError('Failed to load events'))
      .finally(() => setLoading(false));
  }, [clubId, date]);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4" style={{ color: '#1a3c2e' }}>Upcoming Events</h2>
      <div className="row g-3 mb-4">
        <div className="col-md-5">
          <select className="form-select" value={clubId} onChange={(e) => setClubId(e.target.value)}>
            <option value="">All Clubs</option>
            {clubs.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div className="col-md-4">
          <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        {(clubId || date) && (
          <div className="col-md-3">
            <button className="btn btn-outline-secondary w-100" onClick={() => { setClubId(''); setDate(''); }}>Clear Filters</button>
          </div>
        )}
      </div>
      <Alert message={error} />
      {loading ? <Spinner /> : events.length === 0 ? (
        <div className="text-center py-5 text-muted">No events found.</div>
      ) : (
        <div className="row g-4">
          {events.map((event) => (
            <div key={event._id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title fw-bold">{event.title}</h5>
                  <p className="small text-muted mb-1">🏛️ {event.clubId?.name}</p>
                  <p className="small text-muted mb-1">📅 {new Date(event.date).toLocaleDateString()} at {event.time}</p>
                  <p className="small text-muted mb-1">📍 {event.venue}</p>
                  <p className="small text-muted">👥 Capacity: {event.capacity}</p>
                </div>
                <div className="card-footer bg-transparent border-0">
                  <Link to={`/events/${event._id}`} className="btn btn-sm btn-outline-success w-100">View & Register</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
