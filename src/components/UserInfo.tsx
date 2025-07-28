import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserInfo = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading || !user) return <div className="loading-user-info">Cargando usuario...</div>;

  const initials = `${user?.name?.charAt(0) ?? ""}${user?.lastName?.charAt(0) ?? ""}`;

  return (
    <div className="user-info" ref={menuRef}>
      <span className="user-name">{user?.name} {user?.lastName}</span>
      <div className="user-avatar" onClick={toggleMenu}>
        {initials}
      </div>

      {menuOpen && (
        <div className="user-dropdown">
          {user.role === 'customer' ? <button className="dropdown-item" onClick={() => navigate('/micuenta', {state: user})}>
            Ver perfil
          </button> : ""}
          <button className="dropdown-item" style={{color: "red"}} onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
