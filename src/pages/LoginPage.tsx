import React, { useState } from "react";
import "../styles/styles.css";
import logo from "../assets/Logo_CanchApp.svg";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";
import "../styles/styles.css";

const LoginPage = () => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password });
    setError(null);
    setLoading(true);

    // Aquí conectarías con tu backend
    setTimeout(() => {
      try {
        const dummyResponse = {
          message: "Inicio de sesión exitoso",
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          user: {
            _id: "665f9f42792d8f4567abc123",
            name: "Katerin Marinez",
            email: "carlos@example.com",
            role: "user",
            isActive: true,
          },
          expiresIn: 900,
        };



        login({ token: dummyResponse.token, user: dummyResponse.user });
      } catch (err: any) {
        setError("Error al simular el login");
      } finally {
        setLoading(false);
      }
    }, 1500); // 1.5 segundos de simulación
  };

  return (

    <div className="login-container">

      <div className="login-container">
        <div className="login-logo">
          <img src={logo} alt="CanchApp logo" className="logo-image" />
        </div>
        <div className="login-card">
          <h1 className="logo">canch<span className="logo-accent">App</span></h1>
          <p className="subtitle">Bienvenido a tu espacio de juego.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? (
                <span className="btn-content">
                  Iniciando...
                  <Spinner small />
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          <p className="register-link">
            ¿No tienes cuenta? <a href="#">Regístrate</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
