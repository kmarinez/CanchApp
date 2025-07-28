import { useLocation } from "react-router-dom";
import UserInfo from "./UserInfo";

const UserHeader = () => {
  const location = useLocation();

  const getPageName = () => {
    const path = location.pathname;

    if (path.includes("/inicio")) return "Inicio";
    if (path.includes("/reservaciones")) return "Reservas";
    if(path.includes("/canchasdisponibles")) return "Formulario Reserva";
    if(path.includes("/confirmarreserva")) return "Confirmar Reserva";
    if(path.includes("/reservacion")) return "Editar Reserva";
    if(path.includes("/micuenta")) return "Mi cuenta"

    return "Página";
  };

  return (
    <header className="admin-header">
      <div className="page-path">
        <span className="parent"></span><span className="child">{getPageName()}</span>
      </div>
      <div className="user-info">
        <UserInfo />
      </div>
    </header>
  );
};

export default UserHeader;