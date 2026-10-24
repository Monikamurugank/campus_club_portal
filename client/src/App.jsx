import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ClubsPage from './pages/ClubsPage';
import ClubDetail from './pages/ClubDetail';
import EventsPage from './pages/EventsPage';
import EventDetail from './pages/EventDetail';
import ChangePassword from './pages/ChangePassword';
import NotFound from './pages/NotFound';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyMemberships from './pages/student/MyMemberships';
import MyRegistrations from './pages/student/MyRegistrations';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminClubs from './pages/admin/AdminClubs';
import AdminEvents from './pages/admin/AdminEvents';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRegistrations from './pages/admin/AdminRegistrations';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <MainLayout>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/clubs/:id" element={<ClubDetail />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetail />} />

          {/* Student protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/my-memberships" element={<ProtectedRoute><MyMemberships /></ProtectedRoute>} />
          <Route path="/my-registrations" element={<ProtectedRoute><MyRegistrations /></ProtectedRoute>} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

          {/* Admin protected routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/clubs" element={<ProtectedRoute role="admin"><AdminClubs /></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute role="admin"><AdminEvents /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/registrations" element={<ProtectedRoute role="admin"><AdminRegistrations /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
