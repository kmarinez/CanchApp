import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserSidebar from "../components/UserSidebar";
const UserLayout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth <= 735;
            setCollapsed(isMobile);
        };
        handleResize(); // Inicial
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (_jsxs("div", { className: `admin-layout ${collapsed ? "collapsed" : ""}`, children: [_jsx(UserSidebar, { collapsed: collapsed, toggleSidebar: () => setCollapsed(!collapsed) }), _jsxs("div", { className: "admin-main", children: [_jsx(UserHeader, {}), _jsx("main", { className: "user-content", children: children })] })] }));
};
export default UserLayout;
