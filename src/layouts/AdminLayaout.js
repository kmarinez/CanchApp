import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
const AdminLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const { loading } = useAuth();
    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth <= 735;
            setCollapsed(isMobile);
        };
        handleResize(); // Inicial
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    if (loading)
        return _jsx(Spinner, {});
    return (_jsxs("div", { className: `admin-layout ${collapsed ? "collapsed" : ""}`, children: [_jsx(Sidebar, { collapsed: collapsed, toggleSidebar: () => setCollapsed(!collapsed) }), _jsxs("div", { className: "admin-main", children: [_jsx(Header, {}), _jsx("main", { className: "admin-content", children: children })] })] }));
};
export default AdminLayout;
