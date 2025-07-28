import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
function RecoveryPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSend, setIsSend] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/user/passwordrecovery`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "No se pudo enviar el código.");
            }
            toast.success("Código enviado al correo.");
            setIsLoading(false);
            setIsSend(true);
        }
        catch (err) {
            console.error("Error", err);
            toast.error(err.message || "Ocurrió un error");
        }
    };
    return (_jsx("div", { className: "recover-container", children: isSend ?
            _jsxs("form", { className: "recover-form", onSubmit: handleSubmit, children: [_jsx("h1", { className: "recover-title", children: "Recuperar contrase\u00F1a" }), _jsx("div", { className: "recover-icon", children: _jsx(Check, { size: 50 }) }), _jsx("p", { className: "recover-subtitle", children: "Te hemos enviado un c\u00F3digo para restablecer tu contrase\u00F1a. Por favor, revisa tu bandeja de entrada o la carpeta de spam y sigue las instrucciones." }), _jsx("button", { type: "button", className: "recover-link", onClick: () => navigate("/inicio"), children: "Volver al inicio" })] }) :
            _jsxs("form", { className: "recover-form", onSubmit: handleSubmit, children: [_jsx("h1", { className: "recover-title", children: "Recuperar contrase\u00F1a" }), _jsx("p", { className: "recover-subtitle", children: "Ingresa tu correo electr\u00F3nico y te enviaremos un c\u00F3digo para restablecer tu contrase\u00F1a." }), _jsx("label", { htmlFor: "email", className: "recover-label", children: "Correo electr\u00F3nico" }), _jsx("input", { id: "email", type: "email", placeholder: "ejemplo@correo.com", value: email, onChange: (e) => setEmail(e.target.value), className: "recover-input", required: true }), _jsx("button", { type: "submit", className: "recover-button", children: isLoading ? "Enviando..." : "Enviar código" }), _jsx("button", { type: "button", className: "recover-link", onClick: () => navigate("/inicio"), children: "Volver al inicio" })] }) }));
}
export default RecoveryPassword;
