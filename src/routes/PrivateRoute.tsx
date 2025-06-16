import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { JSX } from "react";

interface PrivateRouteProps {
    children: JSX.Element;
    requiredRole?: "user" | "admin";
}

function PrivateRoutes({ children, requiredRole }: PrivateRouteProps) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user || user.role !== requiredRole) {
        return <Navigate to="/not-authorized" replace />;
    }

    return children;
}

export default PrivateRoutes;