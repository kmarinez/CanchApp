import { Check } from "lucide-react";
import { Court } from "../../types/Court";
import { useEffect, useState } from "react";
import placeholder from "../../assets/placeholder.png";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useAvailableCourts,
  useOccupiedTimes,
  useUnavailableDates,
} from "../../hooks/courts/useCourts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isValid, parseISO, getDay } from "date-fns";
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

  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

  useEffect(() => {
    if (courtIdParam && courts.length > 0) {
      const matchingCourt = courts.find((court) => court._id === courtIdParam);
      if (matchingCourt) {
        setSelectedCourt(matchingCourt);
      } else {
        toast(
          "La cancha no esta disponible, pero puedes reservar en estas opciones",
          { duration: 4000 }
        );
      }
    }
  }, [courtIdParam, courts]);

  const initialDate = date && isValid(parseISO(date)) ? parseISO(date) : null;
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [numPerson, setNumPerson] = useState(0);
  const [isForAnotherPerson, setIsForAnotherPerson] = useState(false);

  const [hourDateError, setHourDateError] = useState("");
  const [maxHours, setMaxHours] = useState("");

  const { data: unavailableDatesData } = useUnavailableDates(
    selectedCourt?._id || ""
  );
  const unavailableDates = (unavailableDatesData?.data || []).map((d) => {
    const [year, month, day] = d.split("-").map(Number);
    return new Date(year, month - 1, day, 12); // Mediodía, sin desfase
  });

  const { data: occupiedTimesData } = useOccupiedTimes(
    selectedCourt?._id || "",
    formattedDate
  );
  const occupiedTimes = (occupiedTimesData?.data ?? []).map((t) =>
    t.padStart(5, "0")
  );

  const generateTimeSlots = (start: string, end: string): string[] => {
    const slots: string[] = [];
    let [hour, minute] = start.split(":").map(Number);
    let [endHour, endMinute] = end.split(":").map(Number);

    while (hour < endHour || (hour === endHour && minute < endMinute)) {
      slots.push(
        `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`
      );
      hour++;
    }

    return slots;
  };

  const allTimeSlots = selectedCourt
    ? generateTimeSlots(selectedCourt.hourStartTime, selectedCourt.hourEndTime)
    : [];

  const availableStartTimes = allTimeSlots.filter(
    (slot) => !occupiedTimes.includes(slot)
  );

  const availableEndTimes = (() => {
    if (!startTime) return [];

    const startIndex = allTimeSlots.indexOf(startTime);
    const validEndTimes: string[] = [];

    for (let i = startIndex + 1; i < allTimeSlots.length; i++) {
      const currentSlot = allTimeSlots[i];
      const previousSlot = allTimeSlots[i - 1];

      // Si el bloque anterior o actual está ocupado, corta
      if (
        occupiedTimes.includes(previousSlot) ||
        occupiedTimes.includes(currentSlot)
      ) {
        break;
      }

      const hoursDiff = i - startIndex;
      if (hoursDiff > 7) break;

      validEndTimes.push(currentSlot);
    }

    return validEndTimes;
  })();

  const dayMap: Record<string, number> = {
    domingo: 0,
    lunes: 1,
    martes: 2,
    miércoles: 3,
    jueves: 4,
    viernes: 5,
    sábado: 6,
  };
  
  const isDayAllowed = (date: Date) => {
    if (!selectedCourt) return false;
  
    const dayNumber = getDay(date); // 0 (domingo) - 6 (sábado)
    const allowedDays = selectedCourt.operatingDays.map((day) => dayMap[day.toLowerCase()]);
    return allowedDays.includes(dayNumber);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(reservationFormSchema),
    defaultValues: {
      isForAnotherPerson: false,
    },
  });

  const getDurationInHours = (start: string, end: string): number => {
    const [startHour] = start.split(":").map(Number);
    const [endHour] = end.split(":").map(Number);
    return endHour - startHour;
  };

  const onValid = (data: any) => {
    if (!selectedCourt) {
      toast.error("Selecciona una cancha");
      return;
    }

    if (numPerson > selectedCourt.playerCapacity) {
      toast.error(
        `La capacidad máxima de esta cancha es ${selectedCourt.playerCapacity}`
      );
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
    return <LoadingOverlay />;
  }

  return (
    <div className="reservation-container">
      {!courts && (
        <div className="pageTitle">
          No hay canchas disponible que coincidan con los filtros de búsqueda
        </div>
      )}

      <div className="header">
        <div className="headerLeft">
          <h1 className="pageTitle">Reservar cancha</h1>
          <p className="subtitle">
            Selecciona una cancha y completa los detalles de tu reserva
          </p>
        </div>
        <div className="headerActions"></div>
      </div>

      {/* Court Selection */}
      <div className="section">
        <h3 className="sectionTitle">Seleccionar Cancha</h3>
        <div className="courtsGrid">
          {courts.map((court) => (
            <div
              key={court._id}
              className={`courtCard-form ${
                selectedCourt?._id === court._id ? "selected" : ""
              }`}
              onClick={() => setSelectedCourt(court)}
            >
              <div className="courtImage-form">
                <img src={placeholder} alt={court.courtName} />
              </div>
              <div className="courtInfo-form">
                <h4 className="courtName-form">{court.courtName}</h4>
                <p className="courtLocation-form">{court.location}</p>
                <div className="courtDetails-form">
                  <span className="courtType-form">{court.type}</span>
                  <span className="courtCapacity-form">
                    Hasta {court.playerCapacity} personas
                  </span>
                </div>
              </div>
              {selectedCourt?._id === court._id && (
                <div className="selectedBadge">
                  <span>
                    <Check size={18} />
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedCourt && (
        <form onSubmit={handleSubmit(onValid)} className="form">
          {/* Date and Time */}
          <div className="section">
            <h3 className="sectionTitle">Fecha y Horario</h3>
            <div className="formGrid">
              <div className="formGroup">
                <label className="label">Fecha *</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => setSelectedDate(date)}
                  minDate={new Date()}
                  excludeDates={unavailableDates}
                  filterDate={isDayAllowed}
                  placeholderText="Selecciona una fecha"
                  dateFormat="yyyy-MM-dd"
                  className="input"
                />
              </div>
              <div className="formGroup">
                <label className="label">Hora de inicio *</label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="select"
                >
                  <option value="">Seleccionar hora</option>
                  {availableStartTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="formGroup">
                <label className="label">Hora de fin *</label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="select"
                >
                  <option value="">Seleccionar hora</option>
                  {availableEndTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {hourDateError && <span className="error">{hourDateError}</span>}
            {maxHours && <span className="error">{maxHours}</span>}
          </div>

          {/* Additional Details */}
          <div className="section">
            <h3 className="sectionTitle">Detalles Adicionales</h3>
            <div className="formGrid">
              <div className="formGroup">
                <label className="label">Número de personas *</label>
                <input
                  type="number"
                  {...register("numPerson")}
                  min={1}
                  max={selectedCourt?.playerCapacity}
                  className="input"
                />
                {errors.numPerson && (
                  <span className="error">{errors.numPerson.message}</span>
                )}
              </div>
              <div className="formGroup">
                <div className="labelcheckbox">
                  <input
                    type="checkbox"
                    {...register("isForAnotherPerson")}
                    onChange={(e) => setIsForAnotherPerson(e.target.checked)}
                    style={{ marginRight: "0.5rem" }}
                  />
                  ¿Reservar para otra persona?
                </div>
              </div>
              {isForAnotherPerson && (
                <div className="formGroup">
                  <label className="label">Nombre de la persona</label>
                  <input
                    type="text"
                    {...register("reservedFor")}
                    className="input"
                    placeholder="Nombre completo"
                  />
                  {errors.reservedFor && (
                    <span className="error">{errors.reservedFor.message}</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="deleteModalActions">
            <button
              type="button"
              className="cancelButton"
              onClick={() => navigate("/inicio")}
            >
              Cancelar
            </button>
            <button className="submitButton" type="submit">
              Continuar al resumen
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ReservationForm;
