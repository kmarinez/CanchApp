import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const UserInfo = () => {
    const navigate = useNavigate();
    const { user, logout, loading } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setMenuOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    if (loading || !user)
        return _jsx("div", { className: "loading-user-info", children: "Cargando usuario..." });
    const initials = `${user?.name?.charAt(0) ?? ""}${user?.lastName?.charAt(0) ?? ""}`;
    return (_jsxs("div", { className: "user-info", ref: menuRef, children: [_jsxs("span", { className: "user-name", children: [user?.name, " ", user?.lastName] }), _jsx("div", { className: "user-avatar", onClick: toggleMenu, children: initials }), menuOpen && (_jsxs("div", { className: "user-dropdown", children: [user.role === 'customer' ? _jsx("button", { className: "dropdown-item", onClick: () => navigate('/micuenta', { state: user }), children: "Ver perfil" }) : "", _jsx("button", { className: "dropdown-item", style: { color: "red" }, onClick: logout, children: "Cerrar sesi\u00F3n" })] }))] }));
};
export default UserInfo;
