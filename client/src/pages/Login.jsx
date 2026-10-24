import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Email and password are required');

    setLoading(true);
    try {
      const user = await login(form);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 440 }}>
      <div className="card border-0 shadow-sm p-4">
        <h2 className="fw-bold mb-1 text-center" style={{ color: '#1a3c2e' }}>Welcome Back</h2>
        <p className="text-muted text-center small mb-4">Login to your account</p>
        <Alert message={error} onClose={() => setError('')} />
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@college.edu" required />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Your password" required />
          </div>
          <button className="btn btn-success w-100 fw-semibold" type="submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-3 small">
          Don't have an account? <Link to="/signup" style={{ color: '#2d6a4f' }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
