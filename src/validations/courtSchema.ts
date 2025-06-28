import * as yup from "yup";

export const courtSchema = yup.object({
    courtName: yup.string().required("El nombre es obligatorio"),
    type: yup.string().oneOf(["baloncesto", "volleyball"], "Debe soleccionar un Tipo").required(),
    location: yup.string().required("La locación es requerida"),
    indoorOrOutdoor: yup.string().oneOf(["destechado", "techado"], "Debe seleccionar al menos una opción").required(),
    playerCapacity: yup
    .number()
    .transform((value, originalValue) =>
      String(originalValue).trim() === "" ? undefined : value
    )
    .typeError("La capacidad debe ser un número válido")
    .min(1, "La capacidad mínima es 1 jugador")
    .max(50, "La capacidad máxima es 50 jugadores")
    .required("La capacidad es obligatoria"),
    hourStartTime: yup.string().required("Hora inicio es requerida"),
    hourEndTime: yup.string().required("Hora final es requerida"),
    status: yup.string().oneOf(["activo", "mantenimiento"], "Debe seleccionar un estado").required(),
    hasLight: yup.boolean().required(),
    description: yup.string().required("Debe indicar al menos un detalle de la cancha").default(""),
    operatingDays: yup.array().of(yup.string()).typeError("Debe seleccionar al menos un día de operación").min(1, "Debe seleccionar al menos un dia de operación").required(),
});