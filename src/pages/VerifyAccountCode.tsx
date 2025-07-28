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

    const handleSubmit = async (e: React.FormEvent) => {
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
        } catch (err: any) {
            console.error("Error", err);
            toast.error(err.message || "Ocurrió un error al verificar.");
        } finally {
            setIsLoading(false);
        }
    };


    const handleResendCode = async () => {
        if (!email) return toast.error("No se encontró el correo electrónico.");

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
        } catch (err: any) {
            console.error("Error al reenviar código:", err);
            toast.error(err.message || "Ocurrió un error al reenviar.");
        }
    };

    return (
        <div className="recover-container">
            {isVerified ? (
                <form className="recover-form">
                    <h1 className="recover-title">Cuenta verificada</h1>
                    <div className="recover-icon">
                        <Check size={50} />
                    </div>
                    <p className="recover-subtitle">
                        Tu cuenta ha sido verificada correctamente. Ya puedes iniciar sesión.
                    </p>
                    <button
                        type="button"
                        className="recover-link"
                        onClick={() => navigate("/login")}
                    >
                        Ir al inicio de sesión
                    </button>
                </form>
            ) : (
                <form className="recover-form" onSubmit={handleSubmit}>
                    <h1 className="recover-title">Verificar cuenta</h1>
                    <p className="recover-subtitle">
                        Ingresa el código de 6 dígitos que te enviamos por correo para confirmar tu cuenta.
                    </p>

                    <label htmlFor="code" className="recover-label">Código de verificación</label>
                    <input
                        id="code"
                        type="text"
                        placeholder="Ej. 985302"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="recover-input"
                        required
                        pattern="\d{6}"
                        maxLength={6}
                    />

                    <button type="submit" className="recover-button" disabled={isLoading}>
                        {isLoading ? "Verificando..." : "Verificar código"}
                    </button>

                    <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={!canResend}
                        className="recover-link"
                    >
                        {canResend ? "Reenviar código" : `Reenviar en ${secondsLeft}s`}
                    </button>

                    <button
                        type="button"
                        className="recover-link"
                        onClick={() => navigate("/login")}
                    >
                        Volver al inicio
                    </button>
                </form>
            )}
        </div>
    );
}

export default VerifyAccountCode;
