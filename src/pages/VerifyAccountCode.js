import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;
function VerifyAccountCode() {
    const { state } = useLocation();
    const email = state?.email;
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/auth/verifyAccount`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, code }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Código inválido o expirado.");
            }
            toast.success("Cuenta verificada exitosamente.");
            setIsVerified(true);
        }
        catch (err) {
            console.error("Error", err);
            toast.error(err.message || "Ocurrió un error al verificar.");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleResendCode = async () => {
        if (!email)
            return toast.error("No se encontró el correo electrónico.");
        try {
            const res = await fetch(`${apiUrl}/api/user/resend-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "No se pudo reenviar el código.");
            }
            toast.success("Nuevo código enviado al correo.");
            // reiniciar contador
            setSecondsLeft(30);
            setCanResend(false);
        }
        catch (err) {
            console.error("Error al reenviar código:", err);
            toast.error(err.message || "Ocurrió un error al reenviar.");
        }
    };
    return (_jsx("div", { className: "recover-container", children: isVerified ? (_jsxs("form", { className: "recover-form", children: [_jsx("h1", { className: "recover-title", children: "Cuenta verificada" }), _jsx("div", { className: "recover-icon", children: _jsx(Check, { size: 50 }) }), _jsx("p", { className: "recover-subtitle", children: "Tu cuenta ha sido verificada correctamente. Ya puedes iniciar sesi\u00F3n." }), _jsx("button", { type: "button", className: "recover-link", onClick: () => navigate("/login"), children: "Ir al inicio de sesi\u00F3n" })] })) : (_jsxs("form", { className: "recover-form", onSubmit: handleSubmit, children: [_jsx("h1", { className: "recover-title", children: "Verificar cuenta" }), _jsx("p", { className: "recover-subtitle", children: "Ingresa el c\u00F3digo de 6 d\u00EDgitos que te enviamos por correo para confirmar tu cuenta." }), _jsx("label", { htmlFor: "code", className: "recover-label", children: "C\u00F3digo de verificaci\u00F3n" }), _jsx("input", { id: "code", type: "text", placeholder: "Ej. 985302", value: code, onChange: (e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6)), className: "recover-input", required: true, pattern: "\\d{6}", maxLength: 6 }), _jsx("button", { type: "submit", className: "recover-button", disabled: isLoading, children: isLoading ? "Verificando..." : "Verificar código" }), _jsx("button", { type: "button", onClick: handleResendCode, disabled: !canResend, className: "recover-link", children: canResend ? "Reenviar código" : `Reenviar en ${secondsLeft}s` }), _jsx("button", { type: "button", className: "recover-link", onClick: () => navigate("/login"), children: "Volver al inicio" })] })) }));
}
export default VerifyAccountCode;
