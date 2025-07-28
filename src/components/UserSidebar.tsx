import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/Logo_CanchApp.svg";
import { CalendarDays, House } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

const UserSidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar }) => {
  const navItems = [
    { to: "/inicio", label: "Inicio", icon: <House size={collapsed ? 32 : 18} /> },
    {
      to: "/reservaciones",
      label: "Reservas",
      icon: <CalendarDays size={collapsed ? 32 : 18} />,
    },
  ];

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="sidebar-logo" />
        {!collapsed && <span className="sidebar-title">CanchApp</span>}
        <button onClick={toggleSidebar} className={collapsed ? "toggle-button collapsed" : "toggle-button"}>☰</button>
      </div>
      {collapsed ? (
        <div className="icon-menu-collapsed">
          {navItems.map(({ to, icon }) => (
            <Link
              to={to}
              className="sidebar-logo-wrapper"
            >
              <div className={collapsed ? "sidebar-logo collapsed" : "sidebar-logo"}>{icon}</div>
            </Link>
          ))}
        </div>
      ) : (
        <nav className="sidebar-nav">
          <ul>
            {navItems.map(({ to, label, icon }) => (
              <li className="nav-item" key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <div className="nav-logo">{icon}</div>
                  {!collapsed && <div className="nav-title">{label}</div>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </aside>
  );
};

export default UserSidebar;
