import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useUpdateReservation } from "../../hooks/reservations/useReservations";
import { useCourts, useOccupiedTimes, useUnavailableDates } from "../../hooks/courts/useCourts";
import { reservationSchema } from "../../validations/reservationSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { format, parseISO, isValid } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
function EditReservationPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const reservation = state?.reservation;
    if (!reservation)
        return _jsx("p", { children: "No se encontr\u00F3 la reserva." });
    const { data: courts } = useCourts();
    const [selectedCourtId, setSelectedCourtId] = useState(reservation.court._id);
    const [selectedDate, setSelectedDate] = useState(reservation?.date && isValid(parseISO(reservation.date))
        ? parseISO(reservation.date)
        : null);
    const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
    const selectedCourt = courts?.find(c => c._id === selectedCourtId);
    // Datos dinámicos por cancha y fecha
    const { data: unavailableDatesData } = useUnavailableDates(selectedCourtId);
    const unavailableDates = useMemo(() => {
        return (unavailableDatesData?.data || []).map(d => {
            const [year, month, day] = d.split("-").map(Number);
            return new Date(year, month - 1, day, 12);
        });
    }, [unavailableDatesData]);
    const { data: occupiedTimesData } = useOccupiedTimes(selectedCourtId, formattedDate);
    const occupiedTimes = (occupiedTimesData?.data ?? [])
        .filter(time => time !== reservation.startTime && time !== reservation.endTime)
        .map(t => t.padStart(5, "0"));
    // Time Slots
    const generateTimeSlots = (start, end) => {
        const slots = [];
        let [hour] = start.split(":").map(Number);
        const [endHour] = end.split(":").map(Number);
        while (hour < endHour) {
            slots.push(`${hour.toString().padStart(2, "0")}:00`);
            hour++;
        }
        return slots;
    };
    const allTimeSlots = selectedCourt
        ? generateTimeSlots(selectedCourt.hourStartTime, selectedCourt.hourEndTime)
        : [];
    const availableStartTimes = [
        ...new Set([
            ...allTimeSlots.filter(slot => !occupiedTimes.includes(slot)),
            reservation.startTime
        ])
    ].sort();
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(reservationSchema),
        defaultValues: {
            courtId: reservation.court._id,
            date: reservation.date,
            startTime: reservation.startTime,
            endTime: reservation.endTime,
            peopleCount: reservation.peopleCount,
            reservedFor: reservation.reservedFor || ""
        }
    });
    const availableEndTimes = (() => {
        if (!watch("startTime"))
            return [];
        const startTime = watch("startTime");
        const startIndex = allTimeSlots.indexOf(startTime);
        const valid = [];
        for (let i = startIndex + 1; i < allTimeSlots.length; i++) {
            const prev = allTimeSlots[i - 1];
            const curr = allTimeSlots[i];
            // Si el tiempo está ocupado, pero es parte de la reserva actual, lo permitimos
            const isPrevOccupied = occupiedTimes.includes(prev) && prev !== reservation.startTime && prev !== reservation.endTime;
            const isCurrOccupied = occupiedTimes.includes(curr) && curr !== reservation.startTime && curr !== reservation.endTime;
            if (isPrevOccupied || isCurrOccupied)
                break;
            valid.push(curr);
        }
        // Asegúrate que el `endTime` actual esté en la lista (si no se agregó)
        if (reservation.endTime && !valid.includes(reservation.endTime)) {
            valid.push(reservation.endTime);
            valid.sort(); // por si lo agregas fuera de orden
        }
        return valid;
    })();
    const { mutate: updateReservation, isPending } = useUpdateReservation();
    const onSubmit = (form) => {
        if (!reservation)
            return;
        updateReservation({
            id: reservation._id,
            data: {
                ...form,
                date: formattedDate,
            },
        }, {
            onSuccess: () => {
                toast.success("Reserva actualizada exitosamente.");
                navigate("/reservaciones");
            },
            onError: () => {
                toast.error("No se pudo actualizar la reserva.");
            },
        });
    };
    return (_jsxs("div", { className: "editReservationPage", children: [_jsx("h1", { children: "Editar Reserva" }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [_jsxs("div", { className: "section", children: [_jsx("h3", { className: "sectionTitle", children: "Fecha y Horario" }), _jsxs("div", { className: "formGrid", children: [_jsxs("div", { className: "formGroup", children: [_jsx("label", { children: "Cancha" }), _jsxs("select", { ...register("courtId"), className: "select", onChange: (e) => {
                                                    const courtId = e.target.value;
                                                    setValue("courtId", courtId);
                                                    setSelectedCourtId(courtId);
                                                }, children: [_jsx("option", { value: "", children: "Selecciona una cancha" }), courts?.map((court) => (_jsx("option", { value: court._id, children: court.courtName }, court._id)))] }), _jsx("p", { className: "error", children: errors.courtId?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { children: "Fecha" }), _jsx(DatePicker, { selected: selectedDate, onChange: (date) => {
                                                    setSelectedDate(date);
                                                }, minDate: new Date(), excludeDates: unavailableDates, dateFormat: "yyyy-MM-dd", className: "formInput" }), _jsx("p", { className: "error", children: errors.date?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { children: "Hora Inicio" }), _jsxs("select", { className: "select", ...register("startTime"), children: [_jsx("option", { value: "", children: "Seleccionar hora" }), availableStartTimes.map((time) => (_jsx("option", { value: time, children: time }, time)))] }), _jsx("p", { className: "error", children: errors.startTime?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { children: "Hora Final" }), _jsxs("select", { className: "select", ...register("endTime"), children: [_jsx("option", { value: "", children: "Seleccionar hora" }), availableEndTimes.map((time) => (_jsx("option", { value: time, children: time }, time)))] }), _jsx("p", { className: "error", children: errors.endTime?.message })] })] })] }), _jsxs("div", { className: "section", children: [_jsx("h3", { className: "sectionTitle", children: "Detalles adicionales" }), _jsxs("div", { className: "formGrid", children: [_jsxs("div", { className: "formGroup", children: [_jsx("label", { children: "Personas" }), _jsx("input", { className: "input", type: "number", ...register("peopleCount"), min: 1, max: 50 }), _jsx("p", { className: "error", children: errors.peopleCount?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { children: "Reservado para (opcional)" }), _jsx("input", { className: "input", type: "text", ...register("reservedFor") }), _jsx("p", { className: "error", children: errors.reservedFor?.message })] })] })] }), _jsxs("div", { className: "deleteModalActions", children: [_jsx("button", { type: "button", className: "cancelButton", onClick: () => navigate(-1), children: "Cancelar" }), _jsx("button", { type: "submit", className: "submitButton", disabled: false, children: "Guardar cambios" })] })] })] }));
}
export default EditReservationPage;
