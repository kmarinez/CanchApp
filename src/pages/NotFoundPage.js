import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const NotFoundPage = () => {
    return (_jsxs("div", { style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "100vh",
            textAlign: "center"
        }, children: [_jsx("h1", { style: { fontSize: "4rem", marginBottom: "1rem", color: "#2E8B57" }, children: "404" }), _jsx("p", { style: { fontSize: "1.2rem", color: "#555" }, children: "Lo sentimos, la p\u00E1gina que buscas no existe." }), _jsx("a", { href: "/login", style: { marginTop: "2rem", color: "#1E90FF", fontWeight: "bold", textDecoration: "none" }, children: "Volver al inicio" })] }));
};
export default NotFoundPage;
