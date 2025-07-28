import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ban, Pencil } from "lucide-react";
import placeholder from "../../assets/placeholder.png";
import { useNavigate } from "react-router-dom";
import { useCancelReservation, useMyReservations, } from "../../hooks/reservations/useReservations";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
const ReservationPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showModalCancel, setShowModalCancel] = useState(false);
    const [reservationToCancel, setReservationToCancel] = useState(null);
    const [reasonError, setReasonError] = useState("");
    const { data: myReservationsData, isLoading } = useMyReservations();
    const reservations = myReservationsData?.data ?? [];
    const canEdit = (status, date) => {
        if (status == "cancelada" || status == "usada") {
            return false;
        }
        const dateTime = Date.now();
        const today = new Date(dateTime).toISOString().split("T")[0];
        if (date < today) {
            return false;
        }
        return true;
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "confirmada":
                return "confirmed";
            case "pendiente":
                return "pending";
            case "completada":
                return "completed";
            case "cancelada":
                return "cancelled";
            default:
                return "";
        }
    };
    const handleShowModalCancel = (reservation) => {
        console.log(reservation);
        setReservationToCancel(reservation);
        setShowModalCancel(true);
    };
    const { mutate: cancelReservationMutate, isPending } = useCancelReservation();
    const handleSubmitCancel = (formData) => {
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/g;
        const reason = formData.get("reason")?.toString() || "";
        if (!reason.trim()) {
            setReasonError("Debe indicar la razon de la cancelación");
            return;
        }
        if (!regex.test(reason)) {
            setReasonError("Solo se aceptan letras en la descripción");
            return;
        }
        cancelReservationMutate({
            id: reservationToCancel._id,
            reason,
        }, {
            onSuccess: () => {
                toast.success("Reserva cancelada correctamente.");
                setShowModalCancel(false);
                setReasonError("");
            },
            onError: () => {
                toast.error("Error al cancelar la reserva.");
            },
        });
    };
    return (_jsxs("section", { className: "myReservationsPage", children: [isLoading && _jsx(LoadingOverlay, {}), _jsx("header", { className: "header", children: _jsxs("div", { className: "headerLeft", children: [_jsx("h1", { className: "pageTitle", children: "Mis reservas" }), _jsx("p", { className: "pageSubtitle", children: "Aqu\u00ED puedes revisar y gestionar tus reservas activas y pasadas" })] }) }), _jsx("div", { className: "reservationsGrid", children: reservations.map((res) => (_jsxs("article", { className: "reservationCard", "aria-label": "Resumen de reserva", children: [_jsxs("div", { className: "courtImage", children: [_jsx("img", { src: placeholder, alt: `Imagen de la cancha ${res.court.courtName}` }), _jsx("div", { className: `courtStatus ${getStatusColor(res.status)}`, children: res.status })] }), _jsxs("div", { className: "courtContent", children: [_jsxs("div", { children: [_jsx("h2", { className: "courtName", children: res.court.courtName }), _jsx("p", { className: "courtType", children: res.court.type }), _jsxs("p", { className: "courtDescription", children: [_jsx("strong", { children: res.date }), " de ", res.startTime, " a ", res.endTime, ", ", res.peopleCount, " personas"] }), _jsxs("div", { className: "courtDetails", children: [_jsxs("span", { children: [_jsx("strong", { children: "Ubicaci\u00F3n:" }), " ", res.court.location] }), _jsxs("span", { children: [_jsx("strong", { children: "Verificaci\u00F3n:" }), " ", res.verifyCode] }), res.reservedFor === `${user?.name} ${user?.lastName}` && (_jsxs("span", { children: [_jsx("strong", { children: "Para:" }), " ", res.reservedFor] }))] })] }), canEdit(res.status, res.date) ? (_jsxs("div", { className: "myReservationActions", children: [_jsxs("button", { className: "myReservationActionButton editar", "aria-label": `Editar reserva para la cancha ${res.court.courtName}`, onClick: () => navigate(`/reservacion/${res._id}/editar`, {
                                                state: { reservation: res },
                                            }), children: [_jsx(Pencil, { size: 18 }), "Editar"] }), _jsxs("button", { className: "myReservationActionButton cancelar", "aria-label": `Cancelar reserva para la cancha ${res.court.courtName}`, onClick: () => handleShowModalCancel(res), children: [_jsx(Ban, { size: 18 }), "Cancelar"] })] })) : ("")] })] }, res._id))) }), showModalCancel && (_jsx("div", { className: "modalOverlay", onClick: () => handleShowModalCancel(false), children: _jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "modalHeader", children: _jsx("h2", { className: "modalTitle", children: "Cancelar Reseva" }) }), _jsxs("form", { className: "modalForm", onSubmit: (e) => {
                                e.preventDefault();
                                handleSubmitCancel(new FormData(e.currentTarget));
                            }, children: [_jsx("div", { children: _jsxs("p", { className: "deleteModalText", children: ["Est\u00E1 a punto de cancelar la reserva de la cancha", " ", _jsx("strong", { children: reservationToCancel?.court.courtName }), " ", "realizada por el usuario", " ", _jsxs("strong", { children: [reservationToCancel?.user.name, " ", reservationToCancel?.user.lastName] }), ", programada para el d\u00EDa", " ", _jsx("strong", { children: reservationToCancel?.date }), " de", " ", _jsx("strong", { children: reservationToCancel?.startTime }), " a", " ", _jsx("strong", { children: reservationToCancel?.endTime }), ". Esta acci\u00F3n no es reversible y puede afectar reservas activas."] }) }), _jsx("div", { className: "formGrid", children: _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Raz\u00F3n *" }), _jsx("textarea", { name: "reason", className: "formTextarea", rows: 3 }), _jsx("p", { className: "errorCourtForm", children: reasonError ? reasonError : null })] }) }), _jsxs("div", { className: "modalActions", children: [_jsx("button", { type: "button", className: "cancelButton", onClick: () => setShowModalCancel(false), children: "Cerrar" }), _jsx("button", { type: "submit", className: "myReservationActionButton cancelar", disabled: false, children: isPending ? "Cancelando..." : "Cancelar" })] })] })] }) }))] }));
};
export default ReservationPage;
