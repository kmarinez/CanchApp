import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RecoveryPassword } from "../types/authTypes";
import { recoverySchema } from "../validations/authSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

type FormValues = RecoveryPassword;

function ChangePassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token") || "";

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormValues>({
        resolver: yupResolver(recoverySchema),
    })

    const onSubmit = async (data: RecoveryPassword) => {
        setIsLoading(true);

        if(data.newPassword !== data.confirmPassword) {
            setIsLoading(false);
            return toast.error("Las contraseñas deben ser similares.")
        }

        try {
            let newPassword = data.newPassword;
            const res = await fetch("http://localhost:4000/api/auth/resetpassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword }),
            });

            const response = await res.json();
            reset();

            if (!res.ok) {
                throw new Error(response.message || "No se pudo reestablecer la contraseña.");
            }

            toast.success("Contraseña restablecida correctamente. En 5 segundos sera redireccionado al incio de sesión.", {duration: 4000});
            setIsLoading(false);

            setTimeout(() => {
                navigate('/login')
            }, 5000);
        } catch (err: any) {
            console.error("Error", err);
            setIsLoading(false);
            toast.error(err.message || "Ocurrió un error");
        }
        setIsLoading(false);
    };

    return (
        <div className="recover-container">
            <form className="recover-form" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="recover-title">Cambiar contraseña</h1>
                <p className="recover-subtitle">
                    Restablece tu contraseña.
                </p>

                <label htmlFor="newPassword" className="recover-label">Nueva contraseña</label>
                <div className="passwordWrapper">
                    <input
                        className="recover-input"
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        placeholder="••••••••"
                        {...register("newPassword")}
                    />
                    <button
                        type="button"
                        className="togglePassword-recovery"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Mostrar u ocultar contraseña"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.newPassword && <p className="error">{errors.newPassword.message}</p>}

                <label htmlFor="confirmPassword" className="recover-label">Confirmar contraseña</label>
                <div className="passwordWrapper">
                    <input
                        className="recover-input"
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="••••••••"
                        {...register("confirmPassword")}
                    />
                    <button
                        type="button"
                        className="togglePassword-recovery"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label="Mostrar u ocultar contraseña"
                    >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
                {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}

                <button type="submit" className="recover-button" disabled={isLoading}>
                    {isLoading ? "Confirmando..." : "Confirmar"}
                </button>
            </form>
        </div>
    );
}

export default ChangePassword;