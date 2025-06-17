import * as yup from "yup";

export const loginSchema = yup.object({
    email: yup.string().email("Correo inválido").required("Correo requerido"),
    password: yup.string().min(6, "Minimo 6 caracteres").required("Contraseña requerida"),
});

export const registerSchema = yup.object({
    name: yup.string().required("Nombre requerido"),
    lastName: yup.string().required("Apellido requerido"),
    email: yup.string().email("Correo inválido").required("Correo requerido"),
    password: yup.string().min(6, "Mínimo 6 caracteres").required("Contraseña requerida"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
        .required("Confirmación requerida"),
});