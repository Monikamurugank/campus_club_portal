import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClubById, joinClub, getMyMemberships } from '../services';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const ClubDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getClubById(id);
        setClub(data);
        if (user) {
          const { data: memberships } = await getMyMemberships();
          setIsMember(memberships.some((m) => m.clubId._id === id));
        }
      } catch {
        setMessage({ type: 'danger', text: 'Failed to load club details' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  const handleJoin = async () => {
    if (!user) return navigate('/login');
    setJoining(true);
    try {
      await joinClub(id);
      setIsMember(true);
      setMessage({ type: 'success', text: 'Successfully joined the club!' });
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to join' });
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <Spinner />;
  if (!club) return <div className="container py-5"><Alert message="Club not found" /></div>;

  return (
    <div className="container py-5" style={{ maxWidth: 700 }}>
      <Alert type={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />
      <div className="card border-0 shadow-sm p-4">
        <span className="badge mb-2" style={{ background: '#2d6a4f', width: 'fit-content' }}>{club.category}</span>
        <h2 className="fw-bold" style={{ color: '#1a3c2e' }}>{club.name}</h2>
        <p className="text-muted">{club.description}</p>
        <hr />
        <div className="row g-3">
          <div className="col-sm-6">
            <strong>Faculty Coordinator</strong>
            <p className="mb-0">{club.facultyCoordinator}</p>
          </div>
          <div className="col-sm-6">
            <strong>Meeting Details</strong>
            <p className="mb-0">{club.meetingDetails || 'TBA'}</p>
          </div>
          <div className="col-sm-6">
            <strong>Created</strong>
            <p className="mb-0">{new Date(club.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        {user && user.role === 'student' && (
          <div className="mt-4">
            {isMember ? (
              <span className="badge bg-success fs-6 px-3 py-2">✓ You are a member</span>
            ) : (
              <button className="btn btn-success px-4" onClick={handleJoin} disabled={joining}>
                {joining ? 'Joining…' : 'Join Club'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubDetail;
