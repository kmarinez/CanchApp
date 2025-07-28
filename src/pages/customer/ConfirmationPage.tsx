import { Calendar, Check, Clock, LandPlot, MapPin, MoveLeft, Pencil, SquareUserRound, UsersRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import placeholder from "../../assets/placeholder.png";
import { useCreateReservation } from "../../hooks/reservations/useReservations";
import { toast } from "react-hot-toast";
import { ReservationPartial } from "../../types/Reservations";

function ConfirmationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state;

    if (!data) {
        return <div>No hay información para mostrar el resumen.</div>;
    }

    const { court, date, startTime, endTime, numPerson, reservedFor } = data;

    const duration =
        parseInt(endTime.split(":")[0], 10) - parseInt(startTime.split(":")[0], 10);

    const { mutate: createReservation, isPending } = useCreateReservation();

    const handleCreateReservation = () => {
        const data: ReservationPartial = {
            courtId: court._id,
            date,
            startTime,
            endTime,
            peopleCount: parseInt(numPerson),
            reservedFor: reservedFor || undefined,
        };

        createReservation({data}, {
            onSuccess: () => {
                toast.success("Reserva realizada correctamente")
                navigate("/inicio")
            },
            onError: (error: any) => {
                toast.error(error)
            }
        })
    }

    return (
        <div className="confirmationPage">
            <div className="container">
                <div className="header">
                    <button className="backButton" onClick={() => navigate(-1)}>
                        <MoveLeft size={18} /> Volver
                    </button>
                    <h1 className="title">Confirmar Reserva</h1>
                </div>

                <div className="content">
                    {/* Court Info Card */}
                    <div className="courtCard">
                        <div className="courtImage">
                            <img
                                src={placeholder}
                                alt="courtName"
                            />
                            <div className="availabilityBadge">Disponible</div>
                        </div>
                        <div className="courtInfo">
                            <h3 className="courtName">{court.courtName}</h3>
                            <p className="courtLocation"><MapPin size={18} /> {court.location || "Ubicación no especificada"}</p>
                            <p className="courtType"><LandPlot size={18} /> {court.type || "No especificado"}</p>
                        </div>
                    </div>

                    {/* Reservation Summary */}
                    <div className="summaryCard">
                        <h2 className="summaryTitle">Resumen de la Reserva</h2>

                        <div className="summaryContent">
                            <div className="summaryItem">
                                <div className="summaryLabel">
                                    <span className="summaryIcon"><Calendar size={18} /></span>
                                    Fecha
                                </div>
                                <span className="summaryValue">{date}</span>
                            </div>

                            <div className="summaryItem">
                                <div className="summaryLabel">
                                    <span className="summaryIcon"><Clock size={18} /></span>
                                    Horario
                                </div>
                                <span className="summaryValue">
                                    {startTime} - {endTime}
                                </span>
                            </div>

                            <div className="summaryItem">
                                <div className="summaryLabel">
                                    <span className="summaryIcon"><Clock size={18} /></span>
                                    Duración
                                </div>
                                <span className="summaryValue">{duration} hora(s)</span>
                            </div>

                            <div className="summaryItem">
                                <div className="summaryLabel">
                                    <span className="summaryIcon"><UsersRound size={18} /></span>
                                    Personas
                                </div>
                                <span className="summaryValue">{numPerson}</span>
                            </div>

                            {reservedFor && (
                                <div className="summaryItem">
                                    <div className="summaryLabel">
                                        <span className="summaryIcon"><SquareUserRound size={18} /></span>
                                        Reservado para
                                    </div>
                                    <span className="summaryValue">{reservedFor}</span>
                                </div>
                            )}
                        </div>
                    </div>


                    {/* Important Notes */}
                    <div className="notesCard">
                        <h3 className="notesTitle">Información importante</h3>
                        <ul className="notesList">
                            <li>La reserva debe ser confirmada para garantizar la disponibilidad</li>
                            <li>Puedes cancelar hasta 2 horas antes del horario reservado</li>
                            <li>Recuerda llegar 10 minutos antes de tu horario</li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="actions">
                        <button className="cancelButton" onClick={() => navigate(-1)}>
                            <span className="buttonIcon"></span>
                            Cancelar
                        </button>
                        <button
                            className="confirmButton"
                            disabled={isPending}
                            onClick={handleCreateReservation}
                        >
                            <span className="buttonIcon"><Check size={18} /></span>
                            {isPending ? "Confirmando..." : "Confirmar reserva"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationPage;