import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

// Password must be 8+ chars, have uppercase and number
const validatePassword = (p) => {
  if (p.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(p)) return 'Password must contain an uppercase letter';
  if (!/[0-9]/.test(p)) return 'Password must contain a number';
  return null;
};

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) return setError('Name is required');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email');
    const pwErr = validatePassword(form.password);
    if (pwErr) return setError(pwErr);
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');

    setLoading(true);
    try {
      const user = await signup({ name: form.name, email: form.email, password: form.password });
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <div className="card border-0 shadow-sm p-4">
        <h2 className="fw-bold mb-1 text-center" style={{ color: '#1a3c2e' }}>Create Account</h2>
        <p className="text-muted text-center small mb-4">Join the campus community</p>
        <Alert message={error} onClose={() => setError('')} />
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@college.edu" required />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min 8 chars, 1 uppercase, 1 number" required />
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input className="form-control" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" required />
          </div>
          <button className="btn btn-success w-100 fw-semibold" type="submit" disabled={loading}>
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center mt-3 small">
          Already have an account? <Link to="/login" style={{ color: '#2d6a4f' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
