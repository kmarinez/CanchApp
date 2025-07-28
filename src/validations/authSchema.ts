import * as yup from "yup";
import dominicanIDValidation from "./dominicanIDValidation";

export const loginSchema = yup.object({
    email: yup.string().email("Correo inválido").required("Correo requerido"),
    password: yup.string().min(6, "Minimo 6 caracteres").required("Contraseña requerida"),
});

export const registerSchema = yup.object({
    name: yup.string().required("Nombre requerido"),
    lastName: yup.string().required("Apellido requerido"),
    email: yup.string().email("Correo inválido").required("Correo requerido"),
    password: yup.string().min(6, "Mínimo 6 caracteres").required("Contraseña requerida"),
    confirmPassword: yup.string().min(6, "Mínimo 6 caracteres").required("Contraseña requerida")
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
    identificationNum: yup
    .string()
    .required("Número de identificación requerido")
    .matches(/^\d{3}-?\d{7}-?\d{1}$/, "Formato de cédula no válido")
    .test(
      "valid-cedula",
      "Número de identificación no válido",
      (value) => {
        const cleaned = value?.replace(/\D/g, "") || "";
        return dominicanIDValidation(cleaned);
      }
    ),
    terms: yup
    .boolean()
    .oneOf([true], "Debes aceptar los términos y condiciones"),
});

export const recoverySchema = yup.object({
  newPassword: yup.string().min(6, "Mínimo 6 caracteres").required("Contraseña requerida"),
  confirmPassword: yup.string().min(6, "Mínimo 6 caracteres").required("Contraseña requerida"),
})