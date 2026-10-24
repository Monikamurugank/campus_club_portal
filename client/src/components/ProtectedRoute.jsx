import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirects unauthenticated users to login
// If role='admin', also checks that user is admin
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (role === 'admin' && user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
};

export default ProtectedRoute;
