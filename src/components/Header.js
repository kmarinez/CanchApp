import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation } from "react-router-dom";
import UserInfo from "./UserInfo";
const Header = () => {
    const location = useLocation();
    const getPageName = () => {
        const path = location.pathname;
        if (path.includes("/dashboard"))
            return "Dashboard";
        if (path.includes("/canchas"))
            return "Canchas";
        if (path.includes("/reservas"))
            return "Reservas";
        if (path.includes("/usuarios"))
            return "Usuarios";
        return "Página";
    };
    return (_jsxs("header", { className: "admin-header", children: [_jsxs("div", { className: "page-path", children: [_jsx("span", { className: "parent", children: "Admin / " }), _jsx("span", { className: "child", children: getPageName() })] }), _jsx("div", { className: "user-info", children: _jsx(UserInfo, {}) })] }));
};
export default Header;
