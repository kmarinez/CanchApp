import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import "../styles/styles.css";
import logo from "../assets/Logo_CanchApp.svg";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, registerSchema } from "../validations/authSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginRequest, registerRequest } from "../services/auth/authService";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
function formatCedula(value) {
    const part1 = value.slice(0, 3);
    const part2 = value.slice(3, 10);
    const part3 = value.slice(10, 11);
    return [part1, part2, part3].filter(Boolean).join("-");
}
const LoginPage = () => {
    const location = useLocation();
    useEffect(() => {
        if (location.state?.sessionExpired) {
            toast.error("Tu sesión ha expirado, por favor inicia sesión nuevamente.");
        }
    }, []);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [rawCedula, setRawCedula] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [wrongCredential, setWrongCredential] = useState(false);
    const schema = isLogin ? loginSchema : registerSchema;
    const { register, handleSubmit, setValue, formState: { errors }, reset, } = useForm({
        resolver: yupResolver(schema),
    });
    const onSubmit = async (data) => {
        setLoading(true);
        setWrongCredential(false);
        try {
            if (isLogin) {
                const res = await loginRequest({
                    email: data.email,
                    password: data.password,
                });
                if (!res.isVerified) {
                    navigate("/verificar-codigo", { state: { email: res.email } });
                }
                else {
                    login({ token: "", user: res });
                }
            }
            else {
                const res = await registerRequest(data);
                if (!res.isVerified) {
                    navigate("/verificar-codigo", { state: { email: res.email } });
                }
                else {
                    console.log("login", res);
                    login({ token: "", user: res });
                }
            }
            reset();
            setRawCedula("");
        }
        catch (error) {
            console.log("login", error);
            let errorMessage = error.message || "Ocurrió un error";
            toast.error(errorMessage, {
                position: "top-right",
            });
            setWrongCredential(true);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "login-container", children: [_jsx("div", { className: "login-logo", children: _jsx("img", { src: logo, alt: "CanchApp logo", className: "logo-image" }) }), _jsxs("div", { className: "login-card", children: [_jsx("h1", { className: "greatings", children: isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta" }), _jsxs("h1", { className: "logo", children: ["canch", _jsx("span", { className: "logo-accent", children: "App" })] }), _jsx("p", { className: "subtitle", children: "Bienvenido a tu espacio de juego." }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "login-form", children: [!isLogin && (_jsxs("div", { className: "inputsRow", children: [_jsxs("div", { className: "formGroup", children: [_jsx("label", { htmlFor: "name", children: "Nombre" }), _jsx("input", { id: "name", ...register("name"), placeholder: "Timmy" }), errors.name && (_jsx("p", { className: "error", children: errors.name.message }))] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { htmlFor: "lastName", children: "Apellido" }), _jsx("input", { id: "lastName", ...register("lastName"), placeholder: "Memo" }), errors.lastName && (_jsx("p", { className: "error", children: errors.lastName.message }))] })] })), _jsx("label", { htmlFor: "email", children: "Correo electr\u00F3nico" }), _jsx("input", { id: "email", ...register("email"), placeholder: "correo@ejemplo.com" }), errors.email && _jsx("p", { className: "error", children: errors.email.message }), !isLogin && (_jsx("div", { className: "inputsRow", children: _jsxs("div", { className: "formGroup", children: [_jsx("label", { htmlFor: "identificationNum", children: "C\u00E9dula" }), _jsx("input", { id: "identificationNum", ...register("identificationNum"), value: formatCedula(rawCedula), onChange: (e) => {
                                                const digitsOnly = e.target.value
                                                    .replace(/\D/g, "")
                                                    .slice(0, 11);
                                                setRawCedula(digitsOnly);
                                                setValue("identificationNum", digitsOnly);
                                            }, placeholder: "000-0000000-0" }), errors.identificationNum && (_jsx("p", { className: "error", children: errors.identificationNum.message }))] }) })), _jsxs("div", { className: "formGroup passwordGroup", children: [_jsx("label", { htmlFor: "password", children: "Contrase\u00F1a" }), _jsxs("div", { className: "passwordWrapper", children: [_jsx("input", { type: showPassword ? "text" : "password", id: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", ...register("password") }), _jsx("button", { type: "button", className: "togglePassword", onClick: () => setShowPassword(!showPassword), "aria-label": "Mostrar u ocultar contrase\u00F1a", children: showPassword ? _jsx(EyeOff, { size: 18 }) : _jsx(Eye, { size: 18 }) })] }), errors.password && (_jsx("p", { className: "error", children: errors.password.message }))] }), !isLogin && (_jsxs("div", { className: "formGroup passwordGroup", children: [_jsx("label", { htmlFor: "confirmPassword", children: "Confirmar Contrase\u00F1a" }), _jsxs("div", { className: "passwordWrapper", children: [_jsx("input", { type: showConfirmPassword ? "text" : "password", id: "confirmPassword", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", ...register("confirmPassword") }), _jsx("button", { type: "button", className: "togglePassword", onClick: () => setShowConfirmPassword(!showConfirmPassword), "aria-label": "Mostrar u ocultar contrase\u00F1a", children: showConfirmPassword ? (_jsx(EyeOff, { size: 18 })) : (_jsx(Eye, { size: 18 })) })] }), errors.confirmPassword && (_jsx("p", { className: "error", children: errors.confirmPassword.message }))] })), !isLogin && (_jsxs("div", { className: "formGroup", children: [_jsxs("label", { className: "labelcheckbox", children: [_jsx("input", { type: "checkbox", ...register("terms"), style: { marginRight: "0.5rem" } }), "Acepto los", " ", _jsx("a", { style: { color: "#1cb179" }, href: "/terminos", target: "_blank", rel: "noopener noreferrer", children: "t\u00E9rminos y condiciones" })] }), errors.terms && _jsx("p", { className: "error", children: errors.terms.message })] })), _jsx("button", { type: "submit", disabled: loading, className: "btn-submit", children: loading ? (_jsxs("span", { className: "btn-content", children: [isLogin ? "Iniciando..." : "Registrando...", _jsx(Spinner, { small: true })] })) : isLogin ? ("Iniciar sesión") : ("Registrarse") }), wrongCredential ? (_jsx("span", { style: { color: "#dc2626" }, children: "Usuario y/o contrase\u00F1a incorrecta." })) : ("")] }), _jsx("div", { children: _jsx("button", { type: "button", className: "btn-signUp", onClick: () => {
                                reset();
                                setRawCedula("");
                                navigate("/recuperar-acceso");
                            }, children: isLogin ? "Olvide mi contraseña" : "" }) }), _jsxs("div", { children: [_jsx("span", { className: "register-link", children: isLogin ? "¿No tienes cuenta?" : "¿Ya tienes una cuenta?" }), _jsx("button", { type: "button", className: "btn-signUp", onClick: () => {
                                    setIsLogin(!isLogin);
                                    reset();
                                    setRawCedula("");
                                }, children: isLogin ? "Regístrate" : "Inicia sesión" })] })] })] }));
};
export default LoginPage;
