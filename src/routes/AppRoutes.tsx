import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import ReservationPage from '../pages/customer/ReservationsPage';
import NotFoundPage from '../pages/NotFoundPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import NotAuthorizedPage from '../pages/NotAuthorizedPage';
import UserLayout from '../layouts/UserLayaout';
import AdminLayout from '../layouts/AdminLayaout';
import AdminCourtPage from '../pages/admin/AdminCourtsPage';
import PrivateRoutes from '../routes/PrivateRoute';
import HomePage from '../pages/customer/HomePage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminReservationsPage from '../pages/admin/AdminReservationsPage';
import ReservationForm from '../pages/customer/ReservationForm';
import ConfirmationPage from '../pages/customer/ConfirmationPage';
import EditReservationPage from '../pages/customer/EditReservationPage';
import ViewProfile from '../pages/customer/ViewProfilePage';
import RecoveryPassword from '../pages/RecoveryPasswordPage';
import ChangePassword from '../pages/ChangePasswordPage';
import VerifyAccountCode from '../pages/VerifyAccountCode';
import TermsAndConditionsPage from '../pages/TermsPage';

function AppRoute() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recuperar-acceso" element={<RecoveryPassword />} />
      <Route path='/clave-nueva' element={<ChangePassword />} />
      <Route path='/verificar-codigo' element={<VerifyAccountCode />} />
      <Route path='/terminos' element={<TermsAndConditionsPage />} />
      <Route
        path="/micuenta"
        element={
          <PrivateRoutes allowedRoles={["customer"]}>
            <UserLayout>
              <ViewProfile />
            </UserLayout>
          </PrivateRoutes>
        }
      />
      <Route
        path="/adm-micuenta"
        element={
          <PrivateRoutes allowedRoles={["admin", "staff"]}>
            <AdminLayout>
              <ViewProfile />
            </AdminLayout>
          </PrivateRoutes>
        }
      />
      <Route
        path="/inicio"
        element={
          <PrivateRoutes allowedRoles={["customer"]}>
            <UserLayout>
              <HomePage />
            </UserLayout>
          </PrivateRoutes>
        }
      />
      <Route
        path="/reservaciones"
        element={
          <PrivateRoutes allowedRoles={["customer"]}>
            <UserLayout>
              <ReservationPage />
            </UserLayout>
          </PrivateRoutes>
        }
      />
      <Route
        path="/reservacion/:id/editar"
        element={
          <PrivateRoutes allowedRoles={["customer"]}>
            <UserLayout>
              <EditReservationPage />
            </UserLayout>
          </PrivateRoutes>
        }
      >
      </Route>
      <Route
        path="/canchasdisponibles"
        element={
          <PrivateRoutes allowedRoles={["customer"]}>
            <UserLayout>
              <ReservationForm />
            </UserLayout>
          </PrivateRoutes>
        }
      />
      <Route
        path="/confirmarreserva"
        element={
          <PrivateRoutes allowedRoles={["customer"]}>
            <UserLayout>
              <ConfirmationPage />
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
      <Route
        path="/usuarios"
        element={
          <PrivateRoutes allowedRoles={["admin", "staff"]}>
            <AdminLayout>
              <AdminUsersPage />
            </AdminLayout>
          </PrivateRoutes>
        }
      />
      <Route
        path="/reservas"
        element={
          <PrivateRoutes allowedRoles={["admin", "staff"]}>
            <AdminLayout>
              <AdminReservationsPage />
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