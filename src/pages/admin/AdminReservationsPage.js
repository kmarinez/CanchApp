import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Ban, Check, Eye, Funnel, Pencil, Search, X, } from "lucide-react";
import { useEffect, useState } from "react";
import { useCancelReservation, useFindReservation, useReservations, useUpdateReservation, useVerifyReservation, } from "../../hooks/reservations/useReservations";
import { toast } from "react-hot-toast";
import { useCourts } from "../../hooks/courts/useCourts";
import { useForm } from "react-hook-form";
import { reservationSchema } from "../../validations/reservationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingOverlay from "../../components/LoadingOverlay";
function AdminReservationsPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateStart, setDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [identificationNum, setIdentificationNum] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [showModalVerify, setShowModalVerify] = useState(false);
    const { data: courts, isLoading: loadingCourts, error: errorCourts, } = useCourts();
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [reservationToEdit, setReservationToEdit] = useState(null);
    const [showModalCancel, setShowModalCancel] = useState(false);
    const [reservationToCancel, setReservationToCancel] = useState(null);
    const { mutate: updateReservationMutation, isPending: isUpdating, error: errorReservation, } = useUpdateReservation();
    const { register, handleSubmit, formState: { errors }, reset, } = useForm({
        resolver: yupResolver(reservationSchema),
    });
    const [queryFilters, setQueryFilters] = useState({
        search: "",
        status: "all",
        start: "",
        end: "",
    });
    const { data: reservationData, isLoading, error: reservationError, } = useReservations({
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
        const matchesSearch = reservation.court.courtName
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
    const { mutate: findReservation, data: foundReservation, isPending, error: errorFound, reset: resetFoundReservation, } = useFindReservation();
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
    const { mutate: verifyReservationMutate, isPending: isPendingVerifying, isSuccess: isVerified, error: verifyError, reset: verifyReset, } = useVerifyReservation();
    const handleSubmitVerify = (formData) => {
        const identificationNum = formData.get("identificationNum")?.toString() || "";
        const pinCode = formData.get("pinCode")?.toString() || "";
        verifyReservationMutate({ identificationNum, pinCode }, {
            onSuccess: () => {
                toast.success("Reserva confirmada correctamente.");
                verifyReset();
                setShowModalVerify(false);
            },
            onError: () => {
                toast.error(verifyError?.message || "No se pudo confirmar la reserva.");
            },
        });
    };
    const handleShowEditModal = (reservation) => {
        setReservationToEdit(reservation);
        console.log(reservation);
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
    const handleSubmitEdit = (reservation) => {
        const data = {
            ...reservation,
        };
        if (reservationToEdit) {
            updateReservationMutation({ id: reservationToEdit._id, data }, {
                onSuccess: () => {
                    setShowModalEdit(false);
                    setReservationToEdit(null);
                    reset();
                },
                onError: (error) => {
                    const errorMessage = error?.message || "Error tratando de actualizar";
                    toast.error(errorMessage);
                },
            });
        }
    };
    const { mutate: cancelReservationMutate, isPending: isCancelling } = useCancelReservation();
    const handleShowModalCancel = (reservation) => {
        console.log(reservation);
        setReservationToCancel(reservation);
        setShowModalCancel(true);
    };
    const handleSubmitCancel = (formData) => {
        const reason = formData.get("reason")?.toString() || "";
        if (!reason.trim()) {
            toast.error("Debe indicar la razon de la cancelación");
        }
        cancelReservationMutate({
            id: reservationToCancel._id,
            reason,
        }, {
            onSuccess: () => {
                toast.success("Reserva cancelada correctamente.");
                setShowModalCancel(false);
            },
            onError: () => {
                toast.error("Error al cancelar la reserva.");
            },
        });
    };
    const statuses = ["confirmada", "pendiente", "usada", "cancelada"];
    const getStatusColor = (status) => {
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
    return (_jsxs("div", { className: "usersManagement", children: [isLoading && _jsx(LoadingOverlay, {}), _jsxs("div", { className: "header", children: [_jsx("div", { className: "headerLeft", children: _jsx("h1", { className: "pageTitle", children: "Administrar Reservas" }) }), _jsx("div", { className: "headerActions", children: _jsxs("button", { className: "addButton", onClick: handleVerifyReservation, children: [_jsx(Check, { size: 18 }), "Verificar Reserva"] }) })] }), _jsxs("div", { className: "statsGrid", children: [_jsxs("div", { className: "statCard", children: [_jsx("div", { className: "statValue", children: reservationData?.total }), _jsx("div", { className: "statLabel", children: "Total Reservas" })] }), _jsxs("div", { className: "statCard", children: [_jsx("div", { className: "statValue", children: reservationData?.totalConfirmed }), _jsx("div", { className: "statLabel", children: "Reservas Usadas" })] }), _jsxs("div", { className: "statCard", children: [_jsx("div", { className: "statValue", children: reservationData?.totalPending }), _jsx("div", { className: "statLabel", children: "Reservas Confirmadas" })] }), _jsxs("div", { className: "statCard", children: [_jsx("div", { className: "statValue", children: reservationData?.totalToday }), _jsx("div", { className: "statLabel", children: "Reservas para hoy" })] })] }), _jsxs("div", { className: "filtersSection", children: [_jsxs("div", { className: "searchContainer", children: [_jsx(Search, { size: 18 }), _jsx("input", { type: "text", placeholder: "Buscar reserva por cancha o correo electr\u00F3nico", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "searchInput" })] }), _jsxs("div", { className: "filterGroup", children: [_jsx("div", { className: "filterGroup", children: _jsx("input", { type: "date", value: dateStart, onChange: (e) => setDateStart(e.target.value), className: "filterDate" }) }), _jsx("div", { className: "filterGroup", children: _jsx("input", { type: "date", value: dateEnd, onChange: (e) => setDateEnd(e.target.value), className: "filterDate" }) })] }), _jsxs("div", { className: "filterGroup", children: [_jsx(Funnel, { size: 18 }), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "filterSelect", children: [_jsx("option", { value: "all", children: "Todos Estados" }), statuses.map((status) => (_jsx("option", { value: status, children: status.charAt(0).toUpperCase() + status.slice(1) }, status)))] })] }), _jsx("div", { className: "filterGroup", children: _jsxs("button", { onClick: handleSearch, className: "searchButton", children: [_jsx(Search, { size: 18 }), "Buscar"] }) })] }), _jsx("div", { className: "tableContainer", children: _jsxs("table", { className: "reservationTable", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Cancha" }), _jsx("th", { children: "Usuario" }), _jsx("th", { children: "Fecha" }), _jsx("th", { children: "Personas" }), _jsx("th", { children: "Estado" }), _jsx("th", { children: "Acciones" })] }) }), _jsx("tbody", { children: currentReservations.map((reservation) => (_jsxs("tr", { className: "", children: [_jsx("td", { children: _jsx("span", { className: "cancha", children: reservation.court.courtName }) }), _jsx("td", { children: _jsx("span", { className: "user", children: reservation.user.email }) }), _jsx("td", { children: _jsxs("div", { className: "dateDetails", children: [_jsx("div", { className: "date", children: reservation.date }), _jsxs("div", { className: "hours", children: [reservation.startTime, " ", reservation.endTime] })] }) }), _jsx("td", { children: _jsx("span", { className: "persons", children: reservation.peopleCount }) }), _jsx("td", { children: _jsx("span", { className: `status ${getStatusColor(reservation.status)}`, children: reservation.status }) }), _jsx("td", { children: reservation.status == "cancelada" || reservation.status == "usada" ? (_jsx("button", { className: "actionButton", onClick: () => handleShowEditModal(reservation), title: "Ver Reserva", children: _jsx(Eye, { size: 18 }) })) : (_jsxs("div", { className: "actionButtons", children: [_jsx("button", { className: "actionButton", onClick: () => handleShowModalCancel(reservation), title: "Cancelar Reserva", children: _jsx(Ban, { size: 18 }) }), _jsx("button", { className: "actionButton", onClick: () => handleShowEditModal(reservation), title: "Editar Reserva", children: _jsx(Pencil, { size: 18 }) })] })) })] }, reservation._id))) })] }) }), totalPages > 1 && (_jsxs("div", { className: "pagination", children: [_jsxs("div", { className: "paginationInfo", children: ["P\u00E1gina ", currentPage, " de ", totalPages] }), _jsxs("div", { className: "paginationControls", children: [_jsx("button", { className: "paginationButton", onClick: () => setCurrentPage(currentPage - 1), disabled: currentPage === 1, children: "Anterior" }), Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (_jsx("button", { className: `paginationButton ${currentPage === page ? "active" : ""}`, onClick: () => setCurrentPage(page), children: page }, page))), _jsx("button", { className: "paginationButton", onClick: () => setCurrentPage(currentPage + 1), disabled: currentPage === totalPages, children: "Siguiente" })] })] })), showModalVerify && (_jsx("div", { className: "modalOverlay", onClick: () => setShowModalVerify(false), children: _jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "modalHeader", children: [_jsx("h2", { className: "modalTitle", children: "Verificar Reseva" }), _jsx("button", { className: "closeButton", onClick: () => setShowModalVerify(false), children: _jsx(X, {}) })] }), _jsxs("form", { className: "modalForm", onSubmit: (e) => {
                                e.preventDefault();
                                handleSubmitVerify(new FormData(e.currentTarget));
                            }, children: [_jsxs("div", { className: "formGrid", children: [_jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "N\u00FAmero identificaci\u00F3n *" }), _jsx("input", { type: "text", value: identificationNum, onChange: (e) => setIdentificationNum(e.target.value), name: "identificationNum", className: "formInput", required: true })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Pin confirmaci\u00F3n *" }), _jsx("input", { type: "text", value: pinCode, onChange: (e) => setPinCode(e.target.value), name: "pinCode", className: "formInput", required: true })] }), _jsx("div", { className: "formGroup", children: _jsxs("button", { type: "button", onClick: handleSearchReserve, className: "searchButton", children: [_jsx(Search, { size: 18 }), "Buscar"] }) })] }), _jsx("div", { className: "modalDetails", children: _jsx("div", { className: "verifyDetails", children: _jsxs("div", { className: "detailSection", children: [_jsx("h4", { children: "Resumen" }), _jsx("div", { className: "detailGrid", children: _jsxs("div", { className: "detailItem", children: [_jsx("span", { className: "detailLabel", children: "Cancha:" }), _jsx("span", { className: "detailValue", children: foundReservation?.data.court.courtName || "" })] }) }), _jsx("div", { className: "detailGrid", children: _jsxs("div", { className: "detailItem", children: [_jsx("span", { className: "detailLabel", children: "Fecha:" }), _jsxs("span", { className: "detailValue", children: [foundReservation?.data.date, " ", foundReservation?.data.startTime, "-", foundReservation?.data.endTime] })] }) }), _jsx("div", { className: "detailGrid", children: _jsxs("div", { className: "detailItem", children: [_jsx("span", { className: "detailLabel", children: "Reserva para:" }), _jsx("span", { className: "detailValue", children: foundReservation?.data.reservedFor })] }) }), _jsx("div", { className: "detailGrid", children: _jsxs("div", { className: "detailItem", children: [_jsx("span", { className: "detailLabel", children: "Cantidad personas:" }), _jsx("span", { className: "detailValue", children: foundReservation?.data.peopleCount })] }) }), _jsx("div", { className: "detailGrid", children: _jsxs("div", { className: "detailItem", children: [_jsx("span", { className: "detailLabel", children: "Estado:" }), _jsx("span", { className: `detailValue status ${getStatusColor(foundReservation?.data.status || "")}`, children: foundReservation?.data.status })] }) })] }) }) }), _jsxs("div", { className: "modalActions", children: [_jsx("button", { type: "button", className: "cancelButton", onClick: () => setShowModalVerify(false), children: "Cancelar" }), _jsx("button", { type: "submit", className: "submitButton", disabled: false, children: isPendingVerifying ? "Confirmando" : "Confirmar" })] })] })] }) })), showModalEdit && (_jsx("div", { className: "modalOverlay", onClick: () => setShowModalEdit(false), children: _jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "modalHeader", children: [_jsx("h2", { className: "modalTitle", children: "Editar Reseva" }), _jsx("button", { className: "closeButton", onClick: () => setShowModalEdit(false), children: _jsx(X, {}) })] }), reservationToEdit.status == "cancelada" ? (_jsxs("form", { className: "modalForm", children: [_jsxs("div", { className: "formGrid", children: [_jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Cancha" }), _jsxs("select", { disabled: true, ...register("courtId"), className: "formSelect", children: [_jsx("option", { value: "", children: "Seleccione una opci\u00F3n" }), courts?.map((court) => (_jsx("option", { value: court._id, children: court.courtName }, court._id)))] }), _jsx("p", { className: "errorCourtForm", children: errors.courtId?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Fecha" }), _jsx("input", { disabled: true, type: "date", ...register("date"), className: "formInput" }), _jsx("p", { className: "errorCourtForm", children: errors.date?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Hora Inicio" }), _jsx("input", { type: "time", disabled: true, ...register("startTime"), className: "formInput" }), _jsx("p", { className: "errorCourtForm", children: errors.startTime?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Hora Final" }), _jsx("input", { type: "time", disabled: true, ...register("endTime"), className: "formInput" }), _jsx("p", { className: "errorCourtForm", children: errors.endTime?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Cantidad personas" }), _jsx("input", { type: "number", disabled: true, ...register("peopleCount"), placeholder: "1", min: 1, max: 50, className: "formInput" }), _jsx("p", { className: "errorCourtForm", children: errors.peopleCount?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Reserva para" }), _jsx("input", { disabled: true, ...register("reservedFor"), className: "formInput" }), _jsx("p", { className: "errorCourtForm", children: errors.reservedFor?.message })] })] }), _jsx("div", { className: "formGrid", children: _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Raz\u00F3n" }), _jsx("textarea", { name: "reason", disabled: true, defaultValue: reservationToEdit.cancelReason, className: "formTextarea", rows: 3 })] }) }), _jsx("div", { className: "modalActions", children: _jsx("button", { type: "button", className: "cancelButton", onClick: () => setShowModalEdit(false), children: "Cerrar" }) })] })) : (_jsxs("form", { className: "modalForm", onSubmit: handleSubmit(handleSubmitEdit), children: [_jsxs("div", { className: "formGrid", children: [_jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Cancha" }), _jsxs("select", { ...register("courtId"), className: "formSelect", children: [_jsx("option", { value: "", children: "Seleccione una opci\u00F3n" }), courts?.map((court) => (_jsx("option", { value: court._id, children: court.courtName }, court._id)))] }), _jsx("p", { className: "errorCourtForm", children: errors.courtId?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Fecha" }), _jsx("input", { type: "date", ...register("date"), className: "formInput" }), _jsx("p", { className: "errorCourtForm", children: errors.date?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Hora Inicio" }), _jsx("input", { type: "time", ...register("startTime"), className: "formInput" }), _jsx("p", { className: "errorCourtForm", children: errors.startTime?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Hora Final" }), _jsx("input", { type: "time", ...register("endTime"), className: "formInput" }), _jsx("p", { className: "errorCourtForm", children: errors.endTime?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Cantidad personas" }), _jsx("input", { type: "number", ...register("peopleCount"), placeholder: "1", min: 1, max: 50, className: "formInput" }), _jsx("p", { className: "errorCourtForm", children: errors.peopleCount?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Reserva para" }), _jsx("input", { ...register("reservedFor"), className: "formInput" }), _jsx("p", { className: "errorCourtForm", children: errors.reservedFor?.message })] })] }), _jsxs("div", { className: "modalActions", children: [_jsx("button", { type: "button", className: "cancelButton", onClick: () => setShowModalEdit(false), children: "Cancelar" }), _jsx("button", { type: "submit", className: "submitButton", disabled: false, children: "Editar" })] })] }))] }) })), showModalCancel && (_jsx("div", { className: "modalOverlay", onClick: () => handleShowModalCancel(false), children: _jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "modalHeader", children: _jsx("h2", { className: "modalTitle", children: "Cancelar Reseva" }) }), _jsxs("form", { className: "modalForm", onSubmit: (e) => {
                                e.preventDefault();
                                handleSubmitCancel(new FormData(e.currentTarget));
                            }, children: [_jsx("div", { children: _jsxs("p", { className: "deleteModalText", children: ["Est\u00E1 a punto de cancelar la reserva de la cancha", " ", _jsx("strong", { children: reservationToCancel?.court.courtName }), " ", "realizada por el usuario", " ", _jsxs("strong", { children: [reservationToCancel?.user.name, " ", reservationToCancel?.user.lastName] }), ", programada para el d\u00EDa", " ", _jsx("strong", { children: reservationToCancel?.date }), " de", " ", _jsx("strong", { children: reservationToCancel?.startTime }), " a", " ", _jsx("strong", { children: reservationToCancel?.endTime }), ". Esta acci\u00F3n no es reversible y puede afectar reservas activas."] }) }), _jsx("div", { className: "formGrid", children: _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Raz\u00F3n *" }), _jsx("textarea", { name: "reason", className: "formTextarea", rows: 3 })] }) }), _jsxs("div", { className: "modalActions", children: [_jsx("button", { type: "button", className: "cancelButton", onClick: () => setShowModalCancel(false), children: "Cerrar" }), _jsx("button", { type: "submit", className: "submitButton", disabled: false, children: "Aceptar" })] })] })] }) }))] }));
}
export default AdminReservationsPage;
