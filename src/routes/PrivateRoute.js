import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
function PrivateRoutes({ children, allowedRoles }) {
    const { isAuthenticated, user } = useAuth();
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true, state: { sessionExpired: true } });
    }
    if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
        return _jsx(Navigate, { to: "/not-authorized", replace: true });
    }
    return children;
}
export default PrivateRoutes;
