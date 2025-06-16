import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import ReservationPage from '../pages/ReservationsPage';
import NotFoundPage from '../pages/NotFoundPage';
import PrivateRoute from '../routes/PrivateRoute';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import NotAuthorizedPage from '../pages/NotAuthorizedPage';
import UserLayout from '../layouts/UserLayaout';
import AdminLayout from '../layouts/AdminLayaout';

function AppRoute() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/reservations"
        element={
          <PrivateRoute requiredRole="user">
            <UserLayout>
              <ReservationPage />
            </UserLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute requiredRole="admin">
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route path="/not-authorized" element={<NotAuthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoute;