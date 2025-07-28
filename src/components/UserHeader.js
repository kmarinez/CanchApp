import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation } from "react-router-dom";
import UserInfo from "./UserInfo";
const UserHeader = () => {
    const location = useLocation();
    const getPageName = () => {
        const path = location.pathname;
        if (path.includes("/inicio"))
            return "Inicio";
        if (path.includes("/reservaciones"))
            return "Reservas";
        if (path.includes("/canchasdisponibles"))
            return "Formulario Reserva";
        if (path.includes("/confirmarreserva"))
            return "Confirmar Reserva";
        if (path.includes("/reservacion"))
            return "Editar Reserva";
        if (path.includes("/micuenta"))
            return "Mi cuenta";
        return "Página";
    };
    return (_jsxs("header", { className: "admin-header", children: [_jsxs("div", { className: "page-path", children: [_jsx("span", { className: "parent" }), _jsx("span", { className: "child", children: getPageName() })] }), _jsx("div", { className: "user-info", children: _jsx(UserInfo, {}) })] }));
};
export default UserHeader;
