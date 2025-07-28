import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import placeholder from "../../assets/placeholder.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAvailableCourts, useOccupiedTimes, useUnavailableDates, } from "../../hooks/courts/useCourts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isValid, parseISO } from "date-fns";
import { toast } from "react-hot-toast";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { reservationFormSchema } from "../../validations/reservationSchema";
function ReservationForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const date = searchParams.get("date") || "";
    const timeRange = searchParams.get("timeRange") || "";
    const type = searchParams.get("type") || "";
    const courtIdParam = searchParams.get("courtId") || "";
    const { data, isLoading } = useAvailableCourts(date, timeRange, type);
    const courts = data?.data ?? [];
    const [selectedCourt, setSelectedCourt] = useState(null);
    useEffect(() => {
        if (courtIdParam && courts.length > 0) {
            const matchingCourt = courts.find((court) => court._id === courtIdParam);
            if (matchingCourt) {
                setSelectedCourt(matchingCourt);
            }
            else {
                toast("La cancha no esta disponible, pero puedes reservar en estas opciones", { duration: 4000 });
            }
        }
    }, [courtIdParam, courts]);
    const initialDate = date && isValid(parseISO(date)) ? parseISO(date) : null;
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [numPerson, setNumPerson] = useState(0);
    const [isForAnotherPerson, setIsForAnotherPerson] = useState(false);
    const [hourDateError, setHourDateError] = useState("");
    const [maxHours, setMaxHours] = useState("");
    const { data: unavailableDatesData } = useUnavailableDates(selectedCourt?._id || "");
    const unavailableDates = (unavailableDatesData?.data || []).map((d) => {
        const [year, month, day] = d.split("-").map(Number);
        return new Date(year, month - 1, day, 12); // Mediodía, sin desfase
    });
    const { data: occupiedTimesData } = useOccupiedTimes(selectedCourt?._id || "", formattedDate);
    const occupiedTimes = (occupiedTimesData?.data ?? []).map((t) => t.padStart(5, "0"));
    const generateTimeSlots = (start, end) => {
        const slots = [];
        let [hour, minute] = start.split(":").map(Number);
        let [endHour, endMinute] = end.split(":").map(Number);
        while (hour < endHour || (hour === endHour && minute < endMinute)) {
            slots.push(`${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}`);
            hour++;
        }
        return slots;
    };
    const allTimeSlots = selectedCourt
        ? generateTimeSlots(selectedCourt.hourStartTime, selectedCourt.hourEndTime)
        : [];
    const availableStartTimes = allTimeSlots.filter((slot) => !occupiedTimes.includes(slot));
    const availableEndTimes = (() => {
        if (!startTime)
            return [];
        const startIndex = allTimeSlots.indexOf(startTime);
        const validEndTimes = [];
        for (let i = startIndex + 1; i < allTimeSlots.length; i++) {
            const currentSlot = allTimeSlots[i];
            const previousSlot = allTimeSlots[i - 1];
            // Si el bloque anterior o actual está ocupado, corta
            if (occupiedTimes.includes(previousSlot) ||
                occupiedTimes.includes(currentSlot)) {
                break;
            }
            const hoursDiff = i - startIndex;
            if (hoursDiff > 7)
                break;
            validEndTimes.push(currentSlot);
        }
        return validEndTimes;
    })();
    const { register, handleSubmit, watch, formState: { errors }, } = useForm({
        resolver: yupResolver(reservationFormSchema),
        defaultValues: {
            isForAnotherPerson: false,
        },
    });
    const getDurationInHours = (start, end) => {
        const [startHour] = start.split(":").map(Number);
        const [endHour] = end.split(":").map(Number);
        return endHour - startHour;
    };
    const onValid = (data) => {
        if (!selectedCourt) {
            toast.error("Selecciona una cancha");
            return;
        }
        if (numPerson > selectedCourt.playerCapacity) {
            toast.error(`La capacidad máxima de esta cancha es ${selectedCourt.playerCapacity}`);
            return;
        }
        if (!selectedDate || !startTime || !endTime) {
            setHourDateError("Debes seleccionar fecha y horario");
            return;
        }
        const duration = getDurationInHours(startTime, endTime);
        if (duration > 7) {
            setMaxHours("No puedes reservar más de 7 horas seguidas");
            return;
        }
        setHourDateError("");
        setMaxHours("");
        navigate("/confirmarreserva", {
            state: {
                court: selectedCourt,
                date: formattedDate,
                startTime,
                endTime,
                numPerson: data.numPerson,
                reservedFor: data.isForAnotherPerson ? data.reservedFor : "",
            },
        });
    };
    if (isLoading) {
        return _jsx(LoadingOverlay, {});
    }
    return (_jsxs("div", { className: "reservation-container", children: [!courts && (_jsx("div", { className: "pageTitle", children: "No hay canchas disponible que coincidan con los filtros de b\u00FAsqueda" })), _jsxs("div", { className: "header", children: [_jsxs("div", { className: "headerLeft", children: [_jsx("h1", { className: "pageTitle", children: "Reservar cancha" }), _jsx("p", { className: "subtitle", children: "Selecciona una cancha y completa los detalles de tu reserva" })] }), _jsx("div", { className: "headerActions" })] }), _jsxs("div", { className: "section", children: [_jsx("h3", { className: "sectionTitle", children: "Seleccionar Cancha" }), _jsx("div", { className: "courtsGrid", children: courts.map((court) => (_jsxs("div", { className: `courtCard-form ${selectedCourt?._id === court._id ? "selected" : ""}`, onClick: () => setSelectedCourt(court), children: [_jsx("div", { className: "courtImage-form", children: _jsx("img", { src: placeholder, alt: court.courtName }) }), _jsxs("div", { className: "courtInfo-form", children: [_jsx("h4", { className: "courtName-form", children: court.courtName }), _jsx("p", { className: "courtLocation-form", children: court.location }), _jsxs("div", { className: "courtDetails-form", children: [_jsx("span", { className: "courtType-form", children: court.type }), _jsxs("span", { className: "courtCapacity-form", children: ["Hasta ", court.playerCapacity, " personas"] })] })] }), selectedCourt?._id === court._id && (_jsx("div", { className: "selectedBadge", children: _jsx("span", { children: _jsx(Check, { size: 18 }) }) }))] }, court._id))) })] }), selectedCourt && (_jsxs("form", { onSubmit: handleSubmit(onValid), className: "form", children: [_jsxs("div", { className: "section", children: [_jsx("h3", { className: "sectionTitle", children: "Fecha y Horario" }), _jsxs("div", { className: "formGrid", children: [_jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "label", children: "Fecha *" }), _jsx(DatePicker, { selected: selectedDate, onChange: (date) => setSelectedDate(date), minDate: new Date(), excludeDates: unavailableDates, placeholderText: "Selecciona una fecha", dateFormat: "yyyy-MM-dd", className: "input" })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "label", children: "Hora de inicio *" }), _jsxs("select", { value: startTime, onChange: (e) => setStartTime(e.target.value), className: "select", children: [_jsx("option", { value: "", children: "Seleccionar hora" }), availableStartTimes.map((time) => (_jsx("option", { value: time, children: time }, time)))] })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "label", children: "Hora de fin *" }), _jsxs("select", { value: endTime, onChange: (e) => setEndTime(e.target.value), className: "select", children: [_jsx("option", { value: "", children: "Seleccionar hora" }), availableEndTimes.map((time) => (_jsx("option", { value: time, children: time }, time)))] })] })] }), hourDateError && _jsx("span", { className: "error", children: hourDateError }), maxHours && _jsx("span", { className: "error", children: maxHours })] }), _jsxs("div", { className: "section", children: [_jsx("h3", { className: "sectionTitle", children: "Detalles Adicionales" }), _jsxs("div", { className: "formGrid", children: [_jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "label", children: "N\u00FAmero de personas *" }), _jsx("input", { type: "number", ...register("numPerson"), min: 1, max: selectedCourt?.playerCapacity, className: "input" }), errors.numPerson && (_jsx("span", { className: "error", children: errors.numPerson.message }))] }), _jsx("div", { className: "formGroup", children: _jsxs("div", { className: "labelcheckbox", children: [_jsx("input", { type: "checkbox", ...register("isForAnotherPerson"), onChange: (e) => setIsForAnotherPerson(e.target.checked), style: { marginRight: "0.5rem" } }), "\u00BFReservar para otra persona?"] }) }), isForAnotherPerson && (_jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "label", children: "Nombre de la persona" }), _jsx("input", { type: "text", ...register("reservedFor"), className: "input", placeholder: "Nombre completo" }), errors.reservedFor && (_jsx("span", { className: "error", children: errors.reservedFor.message }))] }))] })] }), _jsxs("div", { className: "deleteModalActions", children: [_jsx("button", { type: "button", className: "cancelButton", onClick: () => navigate("/inicio"), children: "Cancelar" }), _jsx("button", { className: "submitButton", type: "submit", children: "Continuar al resumen" })] })] }))] }));
}
export default ReservationForm;
