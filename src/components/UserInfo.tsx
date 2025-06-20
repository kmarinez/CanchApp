import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { CloudOff } from "lucide-react";

const UserInfo = () => {
  const { user, logout } = useAuth();
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

  return (
    <div className="user-info" ref={menuRef}>
      <span className="user-name">{user?.name}</span>
      <div className="user-avatar" onClick={toggleMenu}>
        {user?.name.charAt(0).toUpperCase()}
      </div>

      {menuOpen && (
        <div className="user-dropdown">
          <button className="dropdown-item" onClick={() => alert("Ver perfil")}>
            Ver perfil
          </button>
          <button className="dropdown-item" style={{color: "red"}} onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
