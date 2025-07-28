const API_URL = import.meta.env.VITE_API_URL;
export const loginRequest = async ({ email, password }) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
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
export const registerRequest = async (usr) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
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
            role: "customer",
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
    const response = await fetch(`${API_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include",
    });
    if (!response.ok)
        return null;
    const data = await response.json();
    return data.user;
};
