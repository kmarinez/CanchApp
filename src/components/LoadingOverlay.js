import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import LogoLoading from "../components/LogoLoading";
import "../styles/LogoLoading.css";
export default function LoadingOverlay({ text = "Cargando..." }) {
    return (_jsxs("div", { className: "loading-modal", children: [_jsx(LogoLoading, {}), _jsx("p", { className: "text-white mt-4", children: text })] }));
}
