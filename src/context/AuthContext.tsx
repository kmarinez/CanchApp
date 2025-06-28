import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/auth/authService";

interface User {
    id: string;
    name: string;
    lastName: string;
    identificationNum: string;
    email: string;
    role: "admin" | "staff" | "customer";
    status: string;
}

interface AuthContextProp {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (data: { token: string; user: User; }) => void;
    logout: () => void;
    loading: boolean;
};

const AuthContext = createContext<AuthContextProp | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const currentUser = await getCurrentUser();
                console.log("auth", currentUser);
                if (currentUser) {
                    setUser(currentUser);
                }
            } catch (error) {
                console.error("Error al restaurar sesión:", error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = ({ user }: { user: User }) => {
        setUser(user);
        setToken(null);
        localStorage.setItem("user", JSON.stringify(user));
        if (user.role === "admin" || user.role === "staff") {
            navigate("/dashboard");
        } else if (user.role === "customer") {
            navigate("/reservations");
        } else {
            navigate("/not-authorized");
        }
    }

    const logout = async () => {
        try {
            await fetch("http://localhost:4000/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (error) {
            console.error("Error al cerrar sesión en el backend:", error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
