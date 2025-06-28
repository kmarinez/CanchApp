import { useLocation } from "react-router-dom";
import UserInfo from "./UserInfo";

const Header = () => {
  const location = useLocation();

  const getPageName = () => {
    const path = location.pathname;

    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/canchas")) return "Canchas";
    if (path.includes("/reservas")) return "Reservas";
    if (path.includes("/usuarios")) return "Usuarios";

    return "Página";
  };

  return (
    <header className="admin-header">
      <div className="page-path">
        <span className="parent">Admin / </span><span className="child">{getPageName()}</span>
      </div>
      <div className="user-info">
        <UserInfo />
      </div>
    </header>
  );
};

export default Header;