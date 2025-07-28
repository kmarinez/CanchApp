import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { JSX } from "react";
import { toast } from "react-hot-toast";

interface PrivateRouteProps {
    children: JSX.Element;
    allowedRoles?: ("customer" | "admin" | "staff")[];
}

function PrivateRoutes({ children, allowedRoles }: PrivateRouteProps) {
    const { isAuthenticated, user} = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ sessionExpired: true }} />;
    }

    if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
        return <Navigate to="/not-authorized" replace />;
    }

    return children;
}

export default PrivateRoutes;