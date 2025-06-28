import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/Logo_CanchApp.svg";
import { CalendarDays, House } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const UserSidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const navItems = [
    { to: "/home", label: "Inicio", icon: <House size={18} /> },
    { to: "/reservations", label: "Reservas", icon: <CalendarDays size={18} /> },
  ];

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="sidebar-logo" />
        {!collapsed && <span className="sidebar-title">CanchApp Admin</span>}
        <button onClick={toggleSidebar} className="toggle-button">☰</button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {navItems.map(({ to, label, icon }) => (
            <li className="nav-item" key={to}>
              <NavLink
                to={to}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                <div className="nav-logo">{icon}</div>
                {!collapsed && <div className="nav-title">{label}</div>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default UserSidebar;
