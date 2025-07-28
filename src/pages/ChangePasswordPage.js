import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { recoverySchema } from "../validations/authSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
const apiUrl = import.meta.env.VITE_API_URL;
function ChangePassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(recoverySchema),
    });
    const onSubmit = async (data) => {
        setIsLoading(true);
        if (data.newPassword !== data.confirmPassword) {
            setIsLoading(false);
            return toast.error("Las contraseñas deben ser similares.");
        }
        try {
            let newPassword = data.newPassword;
            const res = await fetch(`${apiUrl}/api/auth/resetpassword`, {
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
            toast.success("Contraseña restablecida correctamente. En 5 segundos sera redireccionado al incio de sesión.", { duration: 4000 });
            setIsLoading(false);
            setTimeout(() => {
                navigate('/login');
            }, 5000);
        }
        catch (err) {
            console.error("Error", err);
            setIsLoading(false);
            toast.error(err.message || "Ocurrió un error");
        }
        setIsLoading(false);
    };
    return (_jsx("div", { className: "recover-container", children: _jsxs("form", { className: "recover-form", onSubmit: handleSubmit(onSubmit), children: [_jsx("h1", { className: "recover-title", children: "Cambiar contrase\u00F1a" }), _jsx("p", { className: "recover-subtitle", children: "Restablece tu contrase\u00F1a." }), _jsx("label", { htmlFor: "newPassword", className: "recover-label", children: "Nueva contrase\u00F1a" }), _jsxs("div", { className: "passwordWrapper", children: [_jsx("input", { className: "recover-input", type: showPassword ? "text" : "password", id: "newPassword", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", ...register("newPassword") }), _jsx("button", { type: "button", className: "togglePassword-recovery", onClick: () => setShowPassword(!showPassword), "aria-label": "Mostrar u ocultar contrase\u00F1a", children: showPassword ? _jsx(EyeOff, { size: 18 }) : _jsx(Eye, { size: 18 }) })] }), errors.newPassword && _jsx("p", { className: "error", children: errors.newPassword.message }), _jsx("label", { htmlFor: "confirmPassword", className: "recover-label", children: "Confirmar contrase\u00F1a" }), _jsxs("div", { className: "passwordWrapper", children: [_jsx("input", { className: "recover-input", type: showConfirmPassword ? "text" : "password", id: "confirmPassword", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", ...register("confirmPassword") }), _jsx("button", { type: "button", className: "togglePassword-recovery", onClick: () => setShowConfirmPassword(!showConfirmPassword), "aria-label": "Mostrar u ocultar contrase\u00F1a", children: showConfirmPassword ? _jsx(EyeOff, { size: 18 }) : _jsx(Eye, { size: 18 }) })] }), errors.confirmPassword && _jsx("p", { className: "error", children: errors.confirmPassword.message }), _jsx("button", { type: "submit", className: "recover-button", disabled: isLoading, children: isLoading ? "Confirmando..." : "Confirmar" })] }) }));
}
export default ChangePassword;
