import { LoginForm, RegisterForm } from "../../types/authTypes";

const API_URL = "http://localhost:4000/api/auth";

export const loginRequest = async ({ email, password }: LoginForm) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al iniciar sesión");
  }
  const data = await response.json();
  return data.user;
};

export const registerRequest = async (usr: RegisterForm) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: usr.name,
      lastName: usr.lastName,
      identificationNum: usr.identificationNum,
      email: usr.email,
      password: usr.password,
      role: "customer", // Puedes cambiar esto según lógica del frontend
    }),
    credentials: "include"
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log("service", errorData);
    throw new Error(errorData.message || "Error al registrar usuario");
  }

  const data = await response.json();
  return data.user;
};

export const getCurrentUser = async () => {
  const response = await fetch(`${API_URL}/me`, {
    method: "GET",
    credentials: "include", // importante para enviar la cookie
  });

  if (!response.ok) return null;

  const data = await response.json();
  console.log("getCurrent", data)
  return data.user;
};
