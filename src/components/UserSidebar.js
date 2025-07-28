import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/Logo_CanchApp.svg";
import { CalendarDays, House } from "lucide-react";
const UserSidebar = ({ collapsed, toggleSidebar }) => {
    const navItems = [
        { to: "/inicio", label: "Inicio", icon: _jsx(House, { size: collapsed ? 32 : 18 }) },
        {
            to: "/reservaciones",
            label: "Reservas",
            icon: _jsx(CalendarDays, { size: collapsed ? 32 : 18 }),
        },
    ];
    return (_jsxs("aside", { className: `admin-sidebar ${collapsed ? "collapsed" : ""}`, children: [_jsxs("div", { className: "sidebar-header", children: [_jsx("img", { src: logo, alt: "Logo", className: "sidebar-logo" }), !collapsed && _jsx("span", { className: "sidebar-title", children: "CanchApp" }), _jsx("button", { onClick: toggleSidebar, className: collapsed ? "toggle-button collapsed" : "toggle-button", children: "\u2630" })] }), collapsed ? (_jsx("div", { className: "icon-menu-collapsed", children: navItems.map(({ to, icon }) => (_jsx(Link, { to: to, className: "sidebar-logo-wrapper", children: _jsx("div", { className: collapsed ? "sidebar-logo collapsed" : "sidebar-logo", children: icon }) }))) })) : (_jsx("nav", { className: "sidebar-nav", children: _jsx("ul", { children: navItems.map(({ to, label, icon }) => (_jsx("li", { className: "nav-item", children: _jsxs(NavLink, { to: to, className: ({ isActive }) => `nav-link ${isActive ? "active" : ""}`, children: [_jsx("div", { className: "nav-logo", children: icon }), !collapsed && _jsx("div", { className: "nav-title", children: label })] }) }, to))) }) }))] }));
};
export default UserSidebar;
