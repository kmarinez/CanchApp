import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Calendar, Check, Clock, LandPlot, MapPin, MoveLeft, SquareUserRound, UsersRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import placeholder from "../../assets/placeholder.png";
import { useCreateReservation } from "../../hooks/reservations/useReservations";
import { toast } from "react-hot-toast";
function ConfirmationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;
    if (!data) {
        return _jsx("div", { children: "No hay informaci\u00F3n para mostrar el resumen." });
    }
    const { court, date, startTime, endTime, numPerson, reservedFor } = data;
    const duration = parseInt(endTime.split(":")[0], 10) - parseInt(startTime.split(":")[0], 10);
    const { mutate: createReservation, isPending } = useCreateReservation();
    const handleCreateReservation = () => {
        const data = {
            courtId: court._id,
            date,
            startTime,
            endTime,
            peopleCount: parseInt(numPerson),
            reservedFor: reservedFor || undefined,
        };
        createReservation({ data }, {
            onSuccess: () => {
                toast.success("Reserva realizada correctamente");
                navigate("/inicio");
            },
            onError: (error) => {
                toast.error(error);
            }
        });
    };
    return (_jsx("div", { className: "confirmationPage", children: _jsxs("div", { className: "container", children: [_jsxs("div", { className: "header", children: [_jsxs("button", { className: "backButton", onClick: () => navigate(-1), children: [_jsx(MoveLeft, { size: 18 }), " Volver"] }), _jsx("h1", { className: "title", children: "Confirmar Reserva" })] }), _jsxs("div", { className: "content", children: [_jsxs("div", { className: "courtCard", children: [_jsxs("div", { className: "courtImage", children: [_jsx("img", { src: placeholder, alt: "courtName" }), _jsx("div", { className: "availabilityBadge", children: "Disponible" })] }), _jsxs("div", { className: "courtInfo", children: [_jsx("h3", { className: "courtName", children: court.courtName }), _jsxs("p", { className: "courtLocation", children: [_jsx(MapPin, { size: 18 }), " ", court.location || "Ubicación no especificada"] }), _jsxs("p", { className: "courtType", children: [_jsx(LandPlot, { size: 18 }), " ", court.type || "No especificado"] })] })] }), _jsxs("div", { className: "summaryCard", children: [_jsx("h2", { className: "summaryTitle", children: "Resumen de la Reserva" }), _jsxs("div", { className: "summaryContent", children: [_jsxs("div", { className: "summaryItem", children: [_jsxs("div", { className: "summaryLabel", children: [_jsx("span", { className: "summaryIcon", children: _jsx(Calendar, { size: 18 }) }), "Fecha"] }), _jsx("span", { className: "summaryValue", children: date })] }), _jsxs("div", { className: "summaryItem", children: [_jsxs("div", { className: "summaryLabel", children: [_jsx("span", { className: "summaryIcon", children: _jsx(Clock, { size: 18 }) }), "Horario"] }), _jsxs("span", { className: "summaryValue", children: [startTime, " - ", endTime] })] }), _jsxs("div", { className: "summaryItem", children: [_jsxs("div", { className: "summaryLabel", children: [_jsx("span", { className: "summaryIcon", children: _jsx(Clock, { size: 18 }) }), "Duraci\u00F3n"] }), _jsxs("span", { className: "summaryValue", children: [duration, " hora(s)"] })] }), _jsxs("div", { className: "summaryItem", children: [_jsxs("div", { className: "summaryLabel", children: [_jsx("span", { className: "summaryIcon", children: _jsx(UsersRound, { size: 18 }) }), "Personas"] }), _jsx("span", { className: "summaryValue", children: numPerson })] }), reservedFor && (_jsxs("div", { className: "summaryItem", children: [_jsxs("div", { className: "summaryLabel", children: [_jsx("span", { className: "summaryIcon", children: _jsx(SquareUserRound, { size: 18 }) }), "Reservado para"] }), _jsx("span", { className: "summaryValue", children: reservedFor })] }))] })] }), _jsxs("div", { className: "notesCard", children: [_jsx("h3", { className: "notesTitle", children: "Informaci\u00F3n importante" }), _jsxs("ul", { className: "notesList", children: [_jsx("li", { children: "La reserva debe ser confirmada para garantizar la disponibilidad" }), _jsx("li", { children: "Puedes cancelar hasta 2 horas antes del horario reservado" }), _jsx("li", { children: "Recuerda llegar 10 minutos antes de tu horario" })] })] }), _jsxs("div", { className: "actions", children: [_jsxs("button", { className: "cancelButton", onClick: () => navigate(-1), children: [_jsx("span", { className: "buttonIcon" }), "Cancelar"] }), _jsxs("button", { className: "confirmButton", disabled: isPending, onClick: handleCreateReservation, children: [_jsx("span", { className: "buttonIcon", children: _jsx(Check, { size: 18 }) }), isPending ? "Confirmando..." : "Confirmar reserva"] })] })] })] }) }));
}
export default ConfirmationPage;
