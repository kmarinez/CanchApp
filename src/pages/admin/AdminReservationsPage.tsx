import {
  Ban,
  Check,
  Eye,
  Funnel,
  Pencil,
  PlusIcon,
  Search,
  X,
} from "lucide-react";
import { use, useEffect, useState } from "react";
import {
  useCancelReservation,
  useFindReservation,
  useReservations,
  useUpdateReservation,
  useVerifyReservation,
} from "../../hooks/reservations/useReservations";
import { toast } from "react-hot-toast";
import { useCourts } from "../../hooks/courts/useCourts";
import { useForm } from "react-hook-form";
import { reservationSchema } from "../../validations/reservationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import { Reservation } from "../../types/Reservations";
import LoadingOverlay from "../../components/LoadingOverlay";

type ReservationFormValues = InferType<typeof reservationSchema>;

function AdminReservationsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [identificationNum, setIdentificationNum] = useState("");
  const [pinCode, setPinCode] = useState("");

  const [showModalVerify, setShowModalVerify] = useState(false);

  const {
    data: courts,
    isLoading: loadingCourts,
    error: errorCourts,
  } = useCourts();
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [reservationToEdit, setReservationToEdit] = useState<any | null>(null);

  const [showModalCancel, setShowModalCancel] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<any | null>(
    null
  );

  const {
    mutate: updateReservationMutation,
    isPending: isUpdating,
    error: errorReservation,
  } = useUpdateReservation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReservationFormValues>({
    resolver: yupResolver(reservationSchema),
  });

  const [queryFilters, setQueryFilters] = useState({
    search: "",
    status: "all",
    start: "",
    end: "",
  });

  const {
    data: reservationData,
    isLoading,
    error: reservationError,
  } = useReservations({
    page: currentPage,
    filter: queryFilters.search,
    status: queryFilters.status,
    dateStart: queryFilters.start,
    dateEnd: queryFilters.end,
  });
  const reservations = reservationData?.data || [];
  const totalPages = reservationData?.totalPages || 1;

  useEffect(() => {
    if (reservationError) {
      console.log(toast.error("Error al buscar reserva."));
    }
  }, [reservationError]);

  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.court.courtName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      reservation.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const currentReservations = filteredReservations;

  const handleSearch = () => {
    setQueryFilters({
      search: searchTerm,
      status: filterStatus,
      start: dateStart,
      end: dateEnd,
    });
    setCurrentPage(1);
  };

  const {
    mutate: findReservation,
    data: foundReservation,
    isPending,
    error: errorFound,
    reset: resetFoundReservation,
  } = useFindReservation();

  useEffect(() => {
    if (errorFound) {
      toast.error(errorFound.message);
    }
  }, [errorFound]);

  const handleSearchReserve = () => {
    findReservation({ identificationNum: identificationNum, pinCode: pinCode });
  };

  const handleVerifyReservation = () => {
    setIdentificationNum("");
    setPinCode("");
    resetFoundReservation();
    setShowModalVerify(true);
  };

  const {
    mutate: verifyReservationMutate,
    isPending: isPendingVerifying,
    isSuccess: isVerified,
    error: verifyError,
    reset: verifyReset,
  } = useVerifyReservation();

  const handleSubmitVerify = (formData: FormData) => {
    const identificationNum =
      formData.get("identificationNum")?.toString() || "";
    const pinCode = formData.get("pinCode")?.toString() || "";

    verifyReservationMutate(
      { identificationNum, pinCode },
      {
        onSuccess: () => {
          toast.success("Reserva confirmada correctamente.");
          verifyReset();
          setShowModalVerify(false);
        },
        onError: () => {
          toast.error(
            verifyError?.message || "No se pudo confirmar la reserva."
          );
        },
      }
    );
  };

  const handleShowEditModal = (reservation: Reservation) => {
    setReservationToEdit(reservation);
    console.log(reservation)
    reset({
      courtId: reservation.court._id,
      date: reservation.date,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      peopleCount: reservation.peopleCount,
      reservedFor: reservation.reservedFor,
    });
    setShowModalEdit(true);
  };

  const handleSubmitEdit = (reservation: ReservationFormValues) => {
    const data: Partial<Reservation> = {
      ...reservation,
    };

    if (reservationToEdit) {
      updateReservationMutation(
        { id: reservationToEdit._id, data },
        {
          onSuccess: () => {
            setShowModalEdit(false);
            setReservationToEdit(null);
            reset();
          },
          onError: (error) => {
            const errorMessage =
              (error as Error)?.message || "Error tratando de actualizar";
            toast.error(errorMessage);
          },
        }
      );
    }
  };

  const { mutate: cancelReservationMutate, isPending: isCancelling } =
    useCancelReservation();

  const handleShowModalCancel = (reservation: any) => {
    console.log(reservation);
    setReservationToCancel(reservation);
    setShowModalCancel(true);
  };

  const handleSubmitCancel = (formData: FormData) => {
    const reason = formData.get("reason")?.toString() || "";

    if (!reason.trim()) {
      toast.error("Debe indicar la razon de la cancelación");
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
        },
        onError: () => {
          toast.error("Error al cancelar la reserva.");
        },
      }
    );
  };

  const statuses = ["confirmada", "pendiente", "usada", "cancelada"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmada":
        return "statusActive";
      case "usada":
        return "statusInactive";
      case "pendiente":
        return "statusPending";
      case "cancelada":
        return "statusSuspended";
      default:
        return "";
    }
  };

  return (
    <div className="usersManagement">
      {isLoading && <LoadingOverlay />}
      <div className="header">
        <div className="headerLeft">
          <h1 className="pageTitle">Administrar Reservas</h1>
        </div>
        <div className="headerActions">
          <button className="addButton" onClick={handleVerifyReservation}>
            <Check size={18} />
            Verificar Reserva
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="statsGrid">
        <div className="statCard">
          <div className="statValue">{reservationData?.total}</div>
          <div className="statLabel">Total Reservas</div>
        </div>
        <div className="statCard">
          <div className="statValue">{reservationData?.totalConfirmed}</div>
          <div className="statLabel">Reservas Usadas</div>
        </div>
        <div className="statCard">
          <div className="statValue">{reservationData?.totalPending}</div>
          <div className="statLabel">Reservas Confirmadas</div>
        </div>
        <div className="statCard">
          <div className="statValue">{reservationData?.totalToday}</div>
          <div className="statLabel">Reservas para hoy</div>
        </div>
      </div>

      <div className="filtersSection">
        <div className="searchContainer">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar reserva por cancha o correo electrónico"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="searchInput"
          />
        </div>

        <div className="filterGroup">
          <div className="filterGroup">
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="filterDate"
            />
          </div>
          <div className="filterGroup">
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="filterDate"
            />
          </div>
        </div>

        <div className="filterGroup">
          <Funnel size={18} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filterSelect"
          >
            <option value="all">Todos Estados</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filterGroup">
          <button onClick={handleSearch} className="searchButton">
            <Search size={18} />
            Buscar
          </button>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="tableContainer">
        <table className="reservationTable">
          <thead>
            <tr>
              <th>Cancha</th>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Personas</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentReservations.map((reservation) => (
              <tr key={reservation._id} className="">
                <td>
                  <span className={"cancha"}>
                    {reservation.court.courtName}
                  </span>
                </td>
                <td>
                  <span className={"user"}>{reservation.user.email}</span>
                </td>
                <td>
                  <div className="dateDetails">
                    <div className="date">{reservation.date}</div>
                    <div className="hours">
                      {reservation.startTime} {reservation.endTime}
                    </div>
                  </div>
                </td>
                <td>
                  <span className={"persons"}>{reservation.peopleCount}</span>
                </td>
                <td>
                  <span
                    className={`status ${getStatusColor(reservation.status)}`}
                  >
                    {reservation.status}
                  </span>
                </td>
                <td>
                  {reservation.status == "cancelada" || reservation.status == "usada" ? (
                    <button
                      className="actionButton"
                      onClick={() => handleShowEditModal(reservation)}
                      title="Ver Reserva"
                    >
                      <Eye size={18} />
                    </button>
                  ) : (
                    <div className="actionButtons">
                      <button
                        className="actionButton"
                        onClick={() => handleShowModalCancel(reservation)}
                        title="Cancelar Reserva"
                      >
                        <Ban size={18} />
                      </button>
                      <button
                        className="actionButton"
                        onClick={() => handleShowEditModal(reservation)}
                        title="Editar Reserva"
                      >
                        <Pencil size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <div className="paginationInfo">
            Página {currentPage} de {totalPages}
          </div>
          <div className="paginationControls">
            <button
              className="paginationButton"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`paginationButton ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="paginationButton"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {showModalVerify && (
        <div className="modalOverlay" onClick={() => setShowModalVerify(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2 className="modalTitle">Verificar Reseva</h2>
              <button
                className="closeButton"
                onClick={() => setShowModalVerify(false)}
              >
                <X />
              </button>
            </div>

            <form
              className="modalForm"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitVerify(new FormData(e.currentTarget));
              }}
            >
              <div className="formGrid">
                <div className="formGroup">
                  <label className="formLabel">Número identificación *</label>
                  <input
                    type="text"
                    value={identificationNum}
                    onChange={(e) => setIdentificationNum(e.target.value)}
                    name="identificationNum"
                    className="formInput"
                    required
                  />
                </div>

                <div className="formGroup">
                  <label className="formLabel">Pin confirmación *</label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    name="pinCode"
                    className="formInput"
                    required
                  />
                </div>

                <div className="formGroup">
                  <button
                    type="button"
                    onClick={handleSearchReserve}
                    className="searchButton"
                  >
                    <Search size={18} />
                    Buscar
                  </button>
                </div>
              </div>

              <div className="modalDetails">
                <div className="verifyDetails">
                  <div className="detailSection">
                    <h4>Resumen</h4>
                    <div className="detailGrid">
                      <div className="detailItem">
                        <span className="detailLabel">Cancha:</span>
                        <span className="detailValue">
                          {foundReservation?.data.court.courtName || ""}
                        </span>
                      </div>
                    </div>
                    <div className="detailGrid">
                      <div className="detailItem">
                        <span className="detailLabel">Fecha:</span>
                        <span className="detailValue">
                          {foundReservation?.data.date}{" "}
                          {foundReservation?.data.startTime}-
                          {foundReservation?.data.endTime}
                        </span>
                      </div>
                    </div>
                    <div className="detailGrid">
                      <div className="detailItem">
                        <span className="detailLabel">Reserva para:</span>
                        <span className="detailValue">
                          {foundReservation?.data.reservedFor}
                        </span>
                      </div>
                    </div>
                    <div className="detailGrid">
                      <div className="detailItem">
                        <span className="detailLabel">Cantidad personas:</span>
                        <span className="detailValue">
                          {foundReservation?.data.peopleCount}
                        </span>
                      </div>
                    </div>
                    <div className="detailGrid">
                      <div className="detailItem">
                        <span className="detailLabel">Estado:</span>
                        <span
                          className={`detailValue status ${getStatusColor(
                            foundReservation?.data.status || ""
                          )}`}
                        >
                          {foundReservation?.data.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modalActions">
                <button
                  type="button"
                  className="cancelButton"
                  onClick={() => setShowModalVerify(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="submitButton" disabled={false}>
                  {isPendingVerifying ? "Confirmando" : "Confirmar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModalEdit && (
        <div className="modalOverlay" onClick={() => setShowModalEdit(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h2 className="modalTitle">Editar Reseva</h2>
              <button
                className="closeButton"
                onClick={() => setShowModalEdit(false)}
              >
                <X />
              </button>
            </div>

            {reservationToEdit.status == "cancelada" ? (
              <form className="modalForm">
                <div className="formGrid">
                  <div className="formGroup">
                    <label className="formLabel">Cancha</label>
                    <select
                      disabled
                      {...register("courtId")}
                      className="formSelect"
                    >
                      <option value="">Seleccione una opción</option>
                      {courts?.map((court) => (
                        <option key={court._id} value={court._id}>
                          {court.courtName}
                        </option>
                      ))}
                    </select>
                    <p className="errorCourtForm">{errors.courtId?.message}</p>
                  </div>

                  <div className="formGroup">
                    <label className="formLabel">Fecha</label>
                    <input
                      disabled
                      type="date"
                      {...register("date")}
                      className="formInput"
                    />
                    <p className="errorCourtForm">{errors.date?.message}</p>
                  </div>

                  <div className="formGroup">
                    <label className="formLabel">Hora Inicio</label>
                    <input
                      type="time"
                      disabled
                      {...register("startTime")}
                      className="formInput"
                    />
                    <p className="errorCourtForm">
                      {errors.startTime?.message}
                    </p>
                  </div>

                  <div className="formGroup">
                    <label className="formLabel">Hora Final</label>
                    <input
                      type="time"
                      disabled
                      {...register("endTime")}
                      className="formInput"
                    />
                    <p className="errorCourtForm">{errors.endTime?.message}</p>
                  </div>

                  <div className="formGroup">
                    <label className="formLabel">Cantidad personas</label>
                    <input
                      type="number"
                      disabled
                      {...register("peopleCount")}
                      placeholder="1"
                      min={1}
                      max={50}
                      className="formInput"
                    />
                    <p className="errorCourtForm">
                      {errors.peopleCount?.message}
                    </p>
                  </div>

                  <div className="formGroup">
                    <label className="formLabel">Reserva para</label>
                    <input
                      disabled
                      {...register("reservedFor")}
                      className="formInput"
                    />
                    <p className="errorCourtForm">
                      {errors.reservedFor?.message}
                    </p>
                  </div>
                </div>

                <div className="formGrid">
                  <div className="formGroup">
                    <label className="formLabel">Razón</label>
                    <textarea name="reason" disabled defaultValue={reservationToEdit.cancelReason} className="formTextarea" rows={3} />
                  </div>
                </div>

                <div className="modalActions">
                  <button
                    type="button"
                    className="cancelButton"
                    onClick={() => setShowModalEdit(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </form>
            ) : (
              <form
                className="modalForm"
                onSubmit={handleSubmit(handleSubmitEdit)}
              >
                <div className="formGrid">
                  <div className="formGroup">
                    <label className="formLabel">Cancha</label>
                    <select {...register("courtId")} className="formSelect">
                      <option value="">Seleccione una opción</option>
                      {courts?.map((court) => (
                        <option key={court._id} value={court._id}>
                          {court.courtName}
                        </option>
                      ))}
                    </select>
                    <p className="errorCourtForm">{errors.courtId?.message}</p>
                  </div>

                  <div className="formGroup">
                    <label className="formLabel">Fecha</label>
                    <input
                      type="date"
                      {...register("date")}
                      className="formInput"
                    />
                    <p className="errorCourtForm">{errors.date?.message}</p>
                  </div>

                  <div className="formGroup">
                    <label className="formLabel">Hora Inicio</label>
                    <input
                      type="time"
                      {...register("startTime")}
                      className="formInput"
                    />
                    <p className="errorCourtForm">
                      {errors.startTime?.message}
                    </p>
                  </div>

                  <div className="formGroup">
                    <label className="formLabel">Hora Final</label>
                    <input
                      type="time"
                      {...register("endTime")}
                      className="formInput"
                    />
                    <p className="errorCourtForm">{errors.endTime?.message}</p>
                  </div>

                  <div className="formGroup">
                    <label className="formLabel">Cantidad personas</label>
                    <input
                      type="number"
                      {...register("peopleCount")}
                      placeholder="1"
                      min={1}
                      max={50}
                      className="formInput"
                    />
                    <p className="errorCourtForm">
                      {errors.peopleCount?.message}
                    </p>
                  </div>

                  <div className="formGroup">
                    <label className="formLabel">Reserva para</label>
                    <input {...register("reservedFor")} className="formInput" />
                    <p className="errorCourtForm">
                      {errors.reservedFor?.message}
                    </p>
                  </div>
                </div>

                <div className="modalActions">
                  <button
                    type="button"
                    className="cancelButton"
                    onClick={() => setShowModalEdit(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="submitButton"
                    disabled={false}
                  >
                    Editar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

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
                <button type="submit" className="submitButton" disabled={false}>
                  Aceptar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReservationsPage;
