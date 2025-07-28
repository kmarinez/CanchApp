import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/auth/authService";
import { toast } from "react-hot-toast";
const apiUrl = import.meta.env.VITE_API_URL;
;
const AuthContext = createContext(undefined);
let externalLogout = null;
export const setLogoutCallback = (callback) => {
    externalLogout = callback;
};
export const triggerLogout = () => {
    if (externalLogout) {
        externalLogout();
    }
};
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        setLogoutCallback(logout);
        const loadUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                console.log(currentUser);
                if (currentUser) {
                    setUser(currentUser);
                }
            }
            catch (error) {
                console.error("Error al restaurar sesión:", error);
                if (error.message.includes("expirada")) {
                    toast.error(error.message);
                    logout();
                }
            }
            finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);
    const login = ({ user }) => {
        setUser(user);
        setToken(null);
        localStorage.setItem("user", JSON.stringify(user));
        if (user.role === "admin" || user.role === "staff") {
            navigate("/dashboard");
        }
        else if (user.role === "customer") {
            navigate("/inicio");
        }
        else {
            navigate("/not-authorized");
        }
    };
    const logout = async () => {
        try {
            await fetch(`${apiUrl}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        }
        catch (error) {
            console.error("Error al cerrar sesión en el backend:", error);
        }
        finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem("user");
            navigate("/login", {
                replace: true,
                state: { sessionExpired: true },
            });
        }
    };
    return (_jsx(AuthContext.Provider, { value: { user, token, isAuthenticated: !!user, login, logout, loading, setUser }, children: !loading && children }));
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
