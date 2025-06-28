import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import ReservationPage from '../pages/ReservationsPage';
import NotFoundPage from '../pages/NotFoundPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import NotAuthorizedPage from '../pages/NotAuthorizedPage';
import UserLayout from '../layouts/UserLayaout';
import AdminLayout from '../layouts/AdminLayaout';
import AdminCourtPage from '../pages/AdminCourtsPage';
import PrivateRoutes from '../routes/PrivateRoute';
import HomePage from '../pages/HomePage';

function AppRoute() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/home"
        element={
          <PrivateRoutes allowedRoles={["customer"]}>
            <UserLayout>
              <HomePage />
            </UserLayout>
          </PrivateRoutes>
        }
      />
      <Route
        path="/reservations"
        element={
          <PrivateRoutes allowedRoles={["customer"]}>
            <UserLayout>
              <ReservationPage />
            </UserLayout>
          </PrivateRoutes>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoutes allowedRoles={["admin", "staff"]}>
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          </PrivateRoutes>
        }
      />
      <Route
        path="/canchas"
        element={
          <PrivateRoutes allowedRoles={["admin", "staff"]}>
            <AdminLayout>
              <AdminCourtPage />
            </AdminLayout>
          </PrivateRoutes>
        }
      />
      <Route path="/not-authorized" element={<NotAuthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoute;