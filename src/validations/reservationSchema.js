import * as yup from "yup";
export const reservationSchema = yup.object({
    courtId: yup.string().required("El nombre es obligatorio"),
    date: yup.string().required("La fecha es obligatoria"),
    startTime: yup.string().required("Hora inicio es requerida"),
    endTime: yup.string().required("Hora final es requerida"),
    peopleCount: yup
        .number()
        .transform((value, originalValue) => String(originalValue).trim() === "" ? undefined : value)
        .typeError("La capacidad debe ser un número válido")
        .min(1, "La capacidad mínima es 1 jugador")
        .max(50, "La capacidad máxima es 50 jugadores")
        .required("La capacidad es obligatoria"),
    reservedFor: yup.string().matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo se permiten letras").defined(),
});
export const reservationFormSchema = yup.object({
    numPerson: yup
        .number()
        .transform((value, originalValue) => String(originalValue).trim() === "" ? undefined : value)
        .required("Indica la cantidad de personas")
        .typeError("La capacidad debe ser un número válido")
        .min(1, "Debe ser al menos 1"),
    isForAnotherPerson: yup.boolean(),
    reservedFor: yup.string().when("isForAnotherPerson", {
        is: true,
        then: (schema) => schema.required("Debe ingresar el nombre de la persona")
            .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, "Solo se permiten letras"),
        otherwise: (schema) => schema.optional(),
    }),
});
