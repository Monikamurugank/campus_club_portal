import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, registerForEvent, getMyRegistrations } from '../services';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getEventById(id);
        setEvent(data);
        if (user) {
          const { data: regs } = await getMyRegistrations();
          setIsRegistered(regs.some((r) => r.eventId?._id === id));
        }
      } catch {
        setMessage({ type: 'danger', text: 'Failed to load event' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) return navigate('/login');
    setRegistering(true);
    try {
      await registerForEvent(id);
      setIsRegistered(true);
      setMessage({ type: 'success', text: 'Successfully registered for the event!' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Registration failed' });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <Spinner />;
  if (!event) return <div className="container py-5"><Alert message="Event not found" /></div>;

  return (
    <div className="container py-5" style={{ maxWidth: 700 }}>
      <Alert type={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />
      <div className="card border-0 shadow-sm p-4">
        <h2 className="fw-bold" style={{ color: '#1a3c2e' }}>{event.title}</h2>
        <p className="text-muted">{event.description}</p>
        <hr />
        <div className="row g-3">
          <div className="col-sm-6"><strong>Club</strong><p className="mb-0">{event.clubId?.name}</p></div>
          <div className="col-sm-6"><strong>Date & Time</strong><p className="mb-0">{new Date(event.date).toLocaleDateString()} at {event.time}</p></div>
          <div className="col-sm-6"><strong>Venue</strong><p className="mb-0">{event.venue}</p></div>
          <div className="col-sm-6"><strong>Capacity</strong><p className="mb-0">{event.capacity} seats</p></div>
        </div>
        {user && user.role === 'student' && (
          <div className="mt-4">
            {isRegistered ? (
              <span className="badge bg-success fs-6 px-3 py-2">✓ You are registered</span>
            ) : (
              <button className="btn btn-success px-4" onClick={handleRegister} disabled={registering}>
                {registering ? 'Registering…' : 'Register for Event'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
