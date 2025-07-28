import { Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function RecoveryPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSend, setIsSend] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true)

        try {
            const res = await fetch("http://localhost:4000/api/user/passwordrecovery", {
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
        } catch (err: any) {
            console.error("Error", err);
            toast.error(err.message || "Ocurrió un error");
        }
    };

    return (
        <div className="recover-container">
            {isSend ?
                <form className="recover-form" onSubmit={handleSubmit}>
                    <h1 className="recover-title">Recuperar contraseña</h1>
                    <div className="recover-icon">
                        <Check size={50} />
                    </div>

                    <p className="recover-subtitle">
                        Te hemos enviado un código para restablecer tu contraseña.
                        Por favor, revisa tu bandeja de entrada o la carpeta de spam y sigue las instrucciones.
                    </p>


                    <button
                        type="button"
                        className="recover-link"
                        onClick={() => navigate("/inicio")}
                    >
                        Volver al inicio
                    </button>
                </form> :
                <form className="recover-form" onSubmit={handleSubmit}>
                    <h1 className="recover-title">Recuperar contraseña</h1>
                    <p className="recover-subtitle">
                        Ingresa tu correo electrónico y te enviaremos un código para restablecer tu contraseña.
                    </p>

                    <label htmlFor="email" className="recover-label">Correo electrónico</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="recover-input"
                        required
                    />

                    <button type="submit" className="recover-button">
                        {isLoading ? "Enviando..." : "Enviar código"}
                    </button>

                    <button
                        type="button"
                        className="recover-link"
                        onClick={() => navigate("/inicio")}
                    >
                        Volver al inicio
                    </button>
                </form>}
        </div>
    );
}

export default RecoveryPassword;