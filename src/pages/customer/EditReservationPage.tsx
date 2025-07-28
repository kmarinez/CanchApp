import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { Reservation } from "../../types/Reservations";
import { useUpdateReservation } from "../../hooks/reservations/useReservations";
import { useCourts, useOccupiedTimes, useUnavailableDates } from "../../hooks/courts/useCourts";
import { reservationSchema } from "../../validations/reservationSchema";
import { InferType } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { format, parseISO, isValid } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";

type ReservationFormValues = InferType<typeof reservationSchema>;

function EditReservationPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const reservation: Reservation = state?.reservation;

    if (!reservation) return <p>No se encontró la reserva.</p>;

    const { data: courts } = useCourts();
    const [selectedCourtId, setSelectedCourtId] = useState(reservation.court._id);
    const [selectedDate, setSelectedDate] = useState<Date | null>(
        reservation?.date && isValid(parseISO(reservation.date))
            ? parseISO(reservation.date)
            : null
    );

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
    const generateTimeSlots = (start: string, end: string): string[] => {
        const slots: string[] = [];
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

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<ReservationFormValues>({
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
        if (!watch("startTime")) return [];
    
        const startTime = watch("startTime");
        const startIndex = allTimeSlots.indexOf(startTime);
        const valid: string[] = [];
    
        for (let i = startIndex + 1; i < allTimeSlots.length; i++) {
            const prev = allTimeSlots[i - 1];
            const curr = allTimeSlots[i];
    
            // Si el tiempo está ocupado, pero es parte de la reserva actual, lo permitimos
            const isPrevOccupied = occupiedTimes.includes(prev) && prev !== reservation.startTime && prev !== reservation.endTime;
            const isCurrOccupied = occupiedTimes.includes(curr) && curr !== reservation.startTime && curr !== reservation.endTime;
    
            if (isPrevOccupied || isCurrOccupied) break;
    
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

    const onSubmit = (form: ReservationFormValues) => {
        if (!reservation) return;

        updateReservation(
            {
                id: reservation._id,
                data: {
                    ...form,
                    date: formattedDate,
                },
            },
            {
                onSuccess: () => {
                    toast.success("Reserva actualizada exitosamente.");
                    navigate("/reservaciones");
                },
                onError: () => {
                    toast.error("No se pudo actualizar la reserva.");
                },
            }
        );
    };

    return (
        <div className="editReservationPage">
            <h1>Editar Reserva</h1>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="section">
                    <h3 className="sectionTitle">Fecha y Horario</h3>
                    <div className="formGrid">
                        <div className="formGroup">
                            <label>Cancha</label>
                            <select
                                {...register("courtId")}
                                className="select"
                                onChange={(e) => {
                                    const courtId = e.target.value;
                                    setValue("courtId", courtId);
                                    setSelectedCourtId(courtId);
                                }}
                            >
                                <option value="">Selecciona una cancha</option>
                                {courts?.map((court) => (
                                    <option key={court._id} value={court._id}>
                                        {court.courtName}
                                    </option>
                                ))}
                            </select>
                            <p className="error">{errors.courtId?.message}</p>
                        </div>

                        <div className="formGroup">
                            <label>Fecha</label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => {
                                    setSelectedDate(date);
                                }}
                                minDate={new Date()}
                                excludeDates={unavailableDates}
                                dateFormat="yyyy-MM-dd"
                                className="formInput"
                            />
                            <p className="error">{errors.date?.message}</p>
                        </div>

                        <div className="formGroup">
                            <label>Hora Inicio</label>
                            <select className="select" {...register("startTime")}>
                                <option value="">Seleccionar hora</option>
                                {availableStartTimes.map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                            <p className="error">{errors.startTime?.message}</p>
                        </div>
                        <div className="formGroup">
                            <label>Hora Final</label>
                            <select className="select" {...register("endTime")}>
                                <option value="">Seleccionar hora</option>
                                {availableEndTimes.map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                            <p className="error">{errors.endTime?.message}</p>
                        </div>
                    </div>
                </div>

                <div className="section">
                    <h3 className="sectionTitle">Detalles adicionales</h3>
                    <div className="formGrid">
                        <div className="formGroup">
                            <label>Personas</label>
                            <input className="input" type="number" {...register("peopleCount")} min={1} max={50} />
                            <p className="error">{errors.peopleCount?.message}</p>
                        </div>

                        <div className="formGroup">
                            <label>Reservado para (opcional)</label>
                            <input className="input" type="text" {...register("reservedFor")} />
                            <p className="error">{errors.reservedFor?.message}</p>
                        </div>
                    </div>
                </div>
                <div className="deleteModalActions">
                    <button type="button" className="cancelButton" onClick={() => navigate(-1)}>
                        Cancelar
                    </button>
                    <button type="submit" className="submitButton" disabled={false}>
                        Guardar cambios
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditReservationPage;
