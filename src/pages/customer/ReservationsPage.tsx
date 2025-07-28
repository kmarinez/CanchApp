import { Ban, Pencil, X } from "lucide-react";
import placeholder from "../../assets/placeholder.png";
import { useNavigate } from "react-router-dom";
import {
  useCancelReservation,
  useMyReservations,
} from "../../hooks/reservations/useReservations";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const ReservationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showModalCancel, setShowModalCancel] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<any | null>(
    null
  );
  const [reasonError, setReasonError] = useState("");

  const { data: myReservationsData, isLoading } = useMyReservations();
  const reservations = myReservationsData?.data ?? [];

  const canEdit = (status: string, date: string) => {
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

  const getStatusColor = (status: string) => {
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

  const handleShowModalCancel = (reservation: any) => {
    console.log(reservation);
    setReservationToCancel(reservation);
    setShowModalCancel(true);
  };

  const { mutate: cancelReservationMutate, isPending } = useCancelReservation();

  const handleSubmitCancel = (formData: FormData) => {
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/g;
    const reason = formData.get("reason")?.toString() || "";
    if (!reason.trim()) {
      setReasonError("Debe indicar la razon de la cancelación");
      return
    }

    if(!regex.test(reason)){
      setReasonError("Solo se aceptan letras en la descripción")
      return
    }

    cancelReservationMutate(
      {
        id: reservationToCancel._id,
        reason,
      },
      {
        onSuccess: () => {
          toast.success("Reserva cancelada correctamente.");
          setShowModalCancel(false);
          setReasonError("");
        },
        onError: () => {
          toast.error("Error al cancelar la reserva.");
        },
      }
    );
  };

  return (
    <section className="myReservationsPage">
      {isLoading && <LoadingOverlay />}
      <header className="header">
        <div className="headerLeft">
          <h1 className="pageTitle">Mis reservas</h1>
          <p className="pageSubtitle">
            Aquí puedes revisar y gestionar tus reservas activas y pasadas
          </p>
        </div>
      </header>

      <div className="reservationsGrid">
        {reservations.map((res) => (
          <article
            key={res._id}
            className="reservationCard"
            aria-label="Resumen de reserva"
          >
            <div className="courtImage">
              <img
                src={placeholder}
                alt={`Imagen de la cancha ${res.court.courtName}`}
              />
              <div className={`courtStatus ${getStatusColor(res.status)}`}>
                {res.status}
              </div>
            </div>

            <div className="courtContent">
              <div>
                <h2 className="courtName">{res.court.courtName}</h2>
                <p className="courtType">{res.court.type}</p>
                <p className="courtDescription">
                  <strong>{res.date}</strong> de {res.startTime} a {res.endTime}
                  , {res.peopleCount} personas
                </p>
                <div className="courtDetails">
                  <span>
                    <strong>Ubicación:</strong> {res.court.location}
                  </span>
                  <span>
                    <strong>Verificación:</strong> {res.verifyCode}
                  </span>
                  {res.reservedFor === `${user?.name} ${user?.lastName}` && (
                    <span>
                      <strong>Para:</strong> {res.reservedFor}
                    </span>
                  )}
                </div>
              </div>

              {canEdit(res.status, res.date) ? (
                <div className="myReservationActions">
                  <button
                    className="myReservationActionButton editar"
                    aria-label={`Editar reserva para la cancha ${res.court.courtName}`}
                    onClick={() =>
                      navigate(`/reservacion/${res._id}/editar`, {
                        state: { reservation: res },
                      })
                    }
                  >
                    <Pencil size={18} />
                    Editar
                  </button>
                  <button
                    className="myReservationActionButton cancelar"
                    aria-label={`Cancelar reserva para la cancha ${res.court.courtName}`}
                    onClick={() => handleShowModalCancel(res)}
                  >
                    <Ban size={18} />
                    Cancelar
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </article>
        ))}
      </div>

      {showModalCancel && (
        <div
          className="modalOverlay"
          onClick={() => handleShowModalCancel(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2 className="modalTitle">Cancelar Reseva</h2>
            </div>

            <form
              className="modalForm"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitCancel(new FormData(e.currentTarget));
              }}
            >
              <div>
                <p className="deleteModalText">
                  Está a punto de cancelar la reserva de la cancha{" "}
                  <strong>{reservationToCancel?.court.courtName}</strong>{" "}
                  realizada por el usuario{" "}
                  <strong>
                    {reservationToCancel?.user.name}{" "}
                    {reservationToCancel?.user.lastName}
                  </strong>
                  , programada para el día{" "}
                  <strong>{reservationToCancel?.date}</strong> de{" "}
                  <strong>{reservationToCancel?.startTime}</strong> a{" "}
                  <strong>{reservationToCancel?.endTime}</strong>. Esta acción
                  no es reversible y puede afectar reservas activas.
                </p>
              </div>
              <div className="formGrid">
                <div className="formGroup">
                  <label className="formLabel">Razón *</label>
                  <textarea name="reason" className="formTextarea" rows={3} />
                  <p className="errorCourtForm">{reasonError ? reasonError : null}</p>
                </div>
              </div>

              <div className="modalActions">
                <button
                  type="button"
                  className="cancelButton"
                  onClick={() => setShowModalCancel(false)}
                >
                  Cerrar
                </button>
                <button type="submit" className="myReservationActionButton cancelar" disabled={false}>
                  {isPending ? "Cancelando..." : "Cancelar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ReservationPage;
