import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
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
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/login", replace: true }) }), _jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/recuperar-acceso", element: _jsx(RecoveryPassword, {}) }), _jsx(Route, { path: '/clave-nueva', element: _jsx(ChangePassword, {}) }), _jsx(Route, { path: '/verificar-codigo', element: _jsx(VerifyAccountCode, {}) }), _jsx(Route, { path: '/terminos', element: _jsx(TermsAndConditionsPage, {}) }), _jsx(Route, { path: "/micuenta", element: _jsx(PrivateRoutes, { allowedRoles: ["customer"], children: _jsx(UserLayout, { children: _jsx(ViewProfile, {}) }) }) }), _jsx(Route, { path: "/adm-micuenta", element: _jsx(PrivateRoutes, { allowedRoles: ["admin", "staff"], children: _jsx(AdminLayout, { children: _jsx(ViewProfile, {}) }) }) }), _jsx(Route, { path: "/inicio", element: _jsx(PrivateRoutes, { allowedRoles: ["customer"], children: _jsx(UserLayout, { children: _jsx(HomePage, {}) }) }) }), _jsx(Route, { path: "/reservaciones", element: _jsx(PrivateRoutes, { allowedRoles: ["customer"], children: _jsx(UserLayout, { children: _jsx(ReservationPage, {}) }) }) }), _jsx(Route, { path: "/reservacion/:id/editar", element: _jsx(PrivateRoutes, { allowedRoles: ["customer"], children: _jsx(UserLayout, { children: _jsx(EditReservationPage, {}) }) }) }), _jsx(Route, { path: "/canchasdisponibles", element: _jsx(PrivateRoutes, { allowedRoles: ["customer"], children: _jsx(UserLayout, { children: _jsx(ReservationForm, {}) }) }) }), _jsx(Route, { path: "/confirmarreserva", element: _jsx(PrivateRoutes, { allowedRoles: ["customer"], children: _jsx(UserLayout, { children: _jsx(ConfirmationPage, {}) }) }) }), _jsx(Route, { path: "/dashboard", element: _jsx(PrivateRoutes, { allowedRoles: ["admin", "staff"], children: _jsx(AdminLayout, { children: _jsx(AdminDashboardPage, {}) }) }) }), _jsx(Route, { path: "/canchas", element: _jsx(PrivateRoutes, { allowedRoles: ["admin", "staff"], children: _jsx(AdminLayout, { children: _jsx(AdminCourtPage, {}) }) }) }), _jsx(Route, { path: "/usuarios", element: _jsx(PrivateRoutes, { allowedRoles: ["admin", "staff"], children: _jsx(AdminLayout, { children: _jsx(AdminUsersPage, {}) }) }) }), _jsx(Route, { path: "/reservas", element: _jsx(PrivateRoutes, { allowedRoles: ["admin", "staff"], children: _jsx(AdminLayout, { children: _jsx(AdminReservationsPage, {}) }) }) }), _jsx(Route, { path: "/not-authorized", element: _jsx(NotAuthorizedPage, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] }));
}
export default AppRoute;
