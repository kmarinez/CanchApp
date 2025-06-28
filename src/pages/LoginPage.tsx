import React, { useState } from "react";
import "../styles/styles.css";
import logo from "../assets/Logo_CanchApp.svg";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, registerSchema } from "../validations/authSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginForm, RegisterForm } from "../types/authTypes";
import { loginRequest, registerRequest } from "../services/auth/authService";
import { toast } from "react-hot-toast";

type FormValues = LoginForm & Partial<RegisterForm>;

function formatCedula(value: string): string {
  const part1 = value.slice(0, 3);
  const part2 = value.slice(3, 10);
  const part3 = value.slice(10, 11);
  return [part1, part2, part3].filter(Boolean).join("-");
}

const LoginPage = () => {
  const { login } = useAuth();

  const [rawCedula, setRawCedula] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [wrongCredential, setWrongCredential] = useState(false);

  const schema = isLogin ? loginSchema : registerSchema;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  })


  const onSubmit = async (data: LoginForm | RegisterForm) => {
    setLoading(true);
    setWrongCredential(false);
    try {
      if (isLogin) {
        const res = await loginRequest({ email: data.email, password: data.password });
        login({ token: "", user: res });
      } else {
        const res = await registerRequest(data as RegisterForm);
        console.log("login", res);
        login({ token: "", user: res });
      }
      reset();
      setRawCedula("");
    } catch (error: any) {
      console.log("login", error)
      let errorMessage = error.message || "Ocurrió un error";
      toast.error(errorMessage, {
        position: "top-right"
      });
      setWrongCredential(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo">
        <img src={logo} alt="CanchApp logo" className="logo-image" />
      </div>
      <div className="login-card">
        <h1 className="greatings">{isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}</h1>
        <h1 className="logo">canch<span className="logo-accent">App</span></h1>
        <p className="subtitle">Bienvenido a tu espacio de juego.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          {!isLogin && (
            <div className="inputsRow">
              <div className="formGroup">
                <label htmlFor="name">Nombre</label>
                <input id="name" {...register("name")} placeholder="Timmy" />
                {errors.name && <p className="error">{errors.name.message as string}</p>}
              </div>
              <div className="formGroup">
                <label htmlFor="lastName">Apellido</label>
                <input id="lastName" {...register("lastName")} placeholder="Memo" />
                {errors.lastName && <p className="error">{errors.lastName.message}</p>}
              </div>
            </div>
          )}

          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            {...register("email")}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && <p className="error">{errors.email.message}</p>}

          {!isLogin && (
            <div className="inputsRow">
              <div className="formGroup">
                <label htmlFor="identificationNum">Cédula</label>
                <input
                  id="identificationNum"
                  {...register("identificationNum")}
                  value={formatCedula(rawCedula)}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 11);
                    setRawCedula(digitsOnly);
                    setValue("identificationNum", digitsOnly);
                  }}
                  placeholder="000-0000000-0"
                />
                {errors.identificationNum && <p className="error">{errors.identificationNum.message as string}</p>}
              </div>
            </div>
          )}

          <div className="formGroup passwordGroup">
            <label htmlFor="password">Contraseña</label>
            <div className="passwordWrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="••••••••"
                {...register("password")}
              />
              <button
                type="button"
                className="togglePassword"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Mostrar u ocultar contraseña"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="error">{errors.password.message}</p>}
          </div>

          {!isLogin && (
            <div className="formGroup passwordGroup">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <div className="passwordWrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  className="togglePassword"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Mostrar u ocultar contraseña"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? (
              <span className="btn-content">
                {isLogin ? "Iniciando..." : "Registrando..."}
                <Spinner small />
              </span>
            ) : (
              isLogin ? "Iniciar sesión" : "Registrarse"
            )}
          </button>
          {wrongCredential ? <span style={{color: "#dc2626"}}>Usuario y/o contraseña incorrecta.</span> : ""}
        </form>

        <div>
          <span className="register-link">
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes una cuenta?"}
          </span>
          <button
            type="button"
            className="btn-signUp"
            onClick={() => {
              setIsLogin(!isLogin);
              reset();
              setRawCedula("");
            }}
          >
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;