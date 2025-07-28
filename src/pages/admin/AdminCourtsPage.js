import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import placeholder from "../../assets/placeholder.png";
import { BrushCleaning, Funnel, Pencil, PlusIcon, Search, Trash2, X } from "lucide-react";
import { useCourts, useCreateCourt, useDeleteCourt, useUpdateCourt } from "../../hooks/courts/useCourts";
import { courtSchema } from "../../validations/courtSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import LoadingOverlay from "../../components/LoadingOverlay";
function AdminCourtPage() {
    const { data: courts = [], isLoading } = useCourts();
    const { mutate: deleteCourtMutation, isPending: isDeleting } = useDeleteCourt();
    const { mutate: createCourtMutation, isPending: isCreating } = useCreateCourt();
    const { mutate: updateCourtMutation, isPending: isUpdating } = useUpdateCourt();
    const courtTypes = ["baloncesto", "volleyball"];
    const daysOfWeek = ["lunes", "martes", "miércoles", "jueves", "viernes", "sabado", "domingo"];
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedCourt, setSelectedCourt] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [courtToDelete, setCourtToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(courtSchema),
    });
    const filteredCourts = courts.filter((court) => {
        const matchesSearch = court.courtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            court.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            court.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "all" || court.type === filterType;
        const matchesStatus = filterStatus === "all" || court.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });
    const handleAddCourt = () => {
        setModalMode("add");
        setSelectedCourt(null);
        reset({
            courtName: "",
            type: "",
            location: "",
            indoorOrOutdoor: "",
            playerCapacity: 1,
            hourStartTime: "08:00",
            hourEndTime: "22:00",
            status: "",
            hasLight: false,
            description: "",
            operatingDays: [],
        });
        setShowModal(true);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "activo":
                return "statusActive";
            case "mantenimiento":
                return "statusMaintenance";
            case "inactivo":
                return "statusInactive";
            default:
                return "";
        }
    };
    const handleEditCourt = (court) => {
        setModalMode("edit");
        setSelectedCourt(court);
        setShowModal(true);
        reset({
            courtName: court.courtName,
            type: court.type,
            location: court.location,
            indoorOrOutdoor: court.indoorOrOutdoor,
            playerCapacity: court.playerCapacity,
            hourStartTime: court.hourStartTime,
            hourEndTime: court.hourEndTime,
            status: court.status,
            hasLight: court.hasLight,
            description: court.description || "",
            operatingDays: court.operatingDays,
        });
        setShowModal(true);
    };
    const handleDeleteCourt = (court) => {
        setCourtToDelete(court);
        setShowDeleteModal(true);
    };
    const onSubmit = (court) => {
        const data = {
            ...court,
            operatingDays: court.operatingDays.filter(Boolean).filter((d) => !!d),
        };
        if (modalMode === "add") {
            createCourtMutation(data, {
                onSuccess: () => {
                    setShowModal(false);
                    setSelectedCourt(null);
                    reset();
                },
            });
        }
        else if (modalMode === "edit" && selectedCourt) {
            updateCourtMutation({ id: selectedCourt._id, data }, {
                onSuccess: () => {
                    setShowModal(false);
                    setSelectedCourt(null);
                    reset();
                },
            });
        }
        setShowModal(false);
        setSelectedCourt(null);
    };
    const confirmDelete = () => {
        if (courtToDelete) {
            deleteCourtMutation(courtToDelete._id, {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setCourtToDelete(null);
                },
                onError: (error) => {
                    console.log("Error eliminando la cancha", error);
                }
            });
        }
    };
    const clearFilters = () => {
        setSearchTerm("");
        setFilterType("all");
        setFilterStatus("all");
    };
    return (_jsxs("div", { className: "courtsManagement", children: [isLoading && _jsx(LoadingOverlay, {}), _jsxs("div", { className: "header", children: [_jsx("div", { className: "headerLeft", children: _jsx("h1", { className: "pageTitle", children: "Administrar Canchas" }) }), _jsxs("button", { className: "addButton", onClick: handleAddCourt, children: [_jsx(PlusIcon, { size: 18 }), "Add New Court"] })] }), _jsxs("div", { className: "filtersSection", children: [_jsxs("div", { className: "searchContainer", children: [_jsx(Search, { size: 18 }), _jsx("input", { type: "text", placeholder: "Buscar canchas por nombre, tipo o locaci\u00F3n...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "searchInput" })] }), _jsxs("div", { className: "filters", children: [_jsxs("div", { className: "filterGroup", children: [_jsx(Funnel, { size: 18 }), _jsxs("select", { value: filterType, onChange: (e) => setFilterType(e.target.value), className: "filterSelect", children: [_jsx("option", { value: "all", children: "Todos Tipos" }), courtTypes.map((type) => (_jsx("option", { value: type, children: type }, type)))] })] }), _jsx("div", { className: "filterGroup", children: _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "filterSelect", children: [_jsx("option", { value: "all", children: "Todos Estatus" }), _jsx("option", { value: "activo", children: "Activo" }), _jsx("option", { value: "mantenimiento", children: "Mantenimiento" })] }) }), _jsx("div", { className: "filterGroup", children: _jsxs("button", { onClick: clearFilters, className: "cleanFilter", children: [_jsx(BrushCleaning, { size: 18 }), "Limpiar filtros"] }) })] })] }), _jsx("div", { className: "courtsGrid", children: filteredCourts.map((court) => (_jsxs("div", { className: "courtCard", children: [_jsxs("div", { className: "courtImage", children: [_jsx("img", { src: placeholder, alt: court.courtName }), _jsx("div", { className: `courtStatus ${getStatusColor(court.status)}`, children: court.status })] }), _jsxs("div", { className: "courtContent", children: [_jsxs("div", { className: "courtHeader", children: [_jsx("h3", { className: "courtName", children: court.courtName }), _jsx("div", { className: "courtType", children: court.type })] }), _jsx("p", { className: "courtDescription", children: court.description }), _jsxs("div", { className: "courtDetails", children: [_jsxs("div", { className: "detailItem", children: [_jsx("span", { className: "detailLabel", children: "Ubicaci\u00F3n:" }), _jsx("span", { className: "detailValue", children: court.location })] }), _jsxs("div", { className: "detailItem", children: [_jsx("span", { className: "detailLabel", children: "Tipo:" }), _jsx("span", { className: "detailValue", children: court.indoorOrOutdoor })] }), _jsxs("div", { className: "detailItem", children: [_jsx("span", { className: "detailLabel", children: "Capacidad:" }), _jsxs("span", { className: "detailValue", children: [court.playerCapacity, " players"] })] })] }), _jsxs("div", { className: "courtActions", children: [_jsxs("button", { className: "editButton", onClick: () => handleEditCourt(court), children: [_jsx(Pencil, {}), "Editar"] }), _jsxs("button", { className: "deleteButton", onClick: () => handleDeleteCourt(court), children: [_jsx(Trash2, {}), "Eliminar"] })] })] })] }, court._id))) }), filteredCourts.length === 0 && (_jsx("div", { className: "emptyState", children: _jsxs("div", { className: "emptyStateContent", children: [_jsx("h3", { children: "Cancha no encontrada" }), _jsx("p", { children: "Ajusta los filtros de b\u00FAsqueda." })] }) })), showModal && (_jsx("div", { className: "modalOverlay", onClick: () => setShowModal(false), children: _jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "modalHeader", children: [_jsx("h2", { className: "modalTitle", children: modalMode === "add" ? "Agregar Nueva Cancha" : "Editar Cancha" }), _jsx("button", { className: "closeButton", onClick: () => setShowModal(false), children: _jsx(X, { size: 18 }) })] }), _jsxs("form", { className: "modalForm", onSubmit: handleSubmit(onSubmit), children: [_jsxs("div", { className: "formGrid", children: [_jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Nombre Cancha *" }), _jsx("input", { ...register("courtName"), placeholder: "Nombre", className: "formInput" }), _jsx("p", { className: "errorCourtForm", children: errors.courtName?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Tipo Cancha *" }), _jsxs("select", { ...register("type"), className: "formSelect", children: [_jsx("option", { value: "", children: "Seleccione una opci\u00F3n" }), courtTypes.map((type) => (_jsx("option", { value: type, children: type }, type)))] }), _jsx("p", { className: "errorCourtForm", children: errors.type?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Locaci\u00F3n *" }), _jsx("input", { ...register("location"), placeholder: "Locaci\u00F3n", className: "formInput" }), _jsx("p", { className: "errorCourtForm", children: errors.location?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Techado/Destechado *" }), _jsxs("select", { ...register("indoorOrOutdoor"), className: "formSelect", children: [_jsx("option", { value: "", children: "Seleccione una opci\u00F3n" }), _jsx("option", { value: "destechado", children: "Destechado" }), _jsx("option", { value: "techado", children: "Techado" })] }), _jsx("p", { className: "errorCourtForm", children: errors.indoorOrOutdoor?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Capacidad (jugadores) *" }), _jsx("input", { type: "number", ...register("playerCapacity"), placeholder: "1", className: "formInput" }), _jsx("p", { className: "errorCourtForm", children: errors.playerCapacity?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Hora Inicio *" }), _jsx("input", { type: "time", ...register("hourStartTime"), className: "formInput" }), _jsx("p", { className: "errorCourtForm", children: errors.hourStartTime?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Hora Final *" }), _jsx("input", { type: "time", ...register("hourEndTime"), className: "formInput" }), _jsx("p", { className: "errorCourtForm", children: errors.hourEndTime?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Estado *" }), _jsxs("select", { ...register("status"), className: "formSelect", children: [_jsx("option", { value: "", children: "Seleccione una opci\u00F3n" }), _jsx("option", { value: "activo", children: "Activo" }), _jsx("option", { value: "mantenimiento", children: "Mantenimiento" })] }), _jsx("p", { className: "errorCourtForm", children: errors.status?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsxs("label", { className: "formLabel", children: [_jsx("input", { type: "checkbox", ...register("hasLight"), className: "formCheckbox" }), "Tiene Luz"] }), _jsx("p", { className: "errorCourtForm", children: errors.hasLight?.message })] })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Descripci\u00F3n *" }), _jsx("textarea", { ...register("description"), className: "formTextarea", rows: 3 }), _jsx("p", { className: "errorCourtForm", children: errors.description?.message })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "D\u00EDas Operaci\u00F3n" }), _jsxs("div", { className: "checkboxGroup", children: [daysOfWeek.map((day) => (_jsxs("label", { className: "checkboxLabel", children: [_jsx("input", { type: "checkbox", value: day, ...register("operatingDays"), className: "formCheckbox" }), day] }, day))), _jsx("p", { className: "errorCourtForm", children: errors.operatingDays?.message })] })] }), _jsxs("div", { className: "modalActions", children: [_jsx("button", { type: "button", className: "cancelButton", disabled: isCreating, onClick: () => setShowModal(false), children: "Cancelar" }), _jsx("button", { type: "submit", className: "submitButton", disabled: isCreating, children: modalMode === "add"
                                                ? isCreating ? "Agregando..." : "Agregar"
                                                : isUpdating ? "Actualizando" : "Actualizar" })] })] })] }) })), showDeleteModal && courtToDelete && (_jsx("div", { className: "modalOverlay", onClick: () => setShowDeleteModal(false), children: _jsx("div", { className: "deleteModal", onClick: (e) => e.stopPropagation(), children: _jsxs("div", { className: "deleteModalContent", children: [_jsx("h3", { className: "deleteModalTitle", children: "Eliminar Cancha" }), _jsxs("p", { className: "deleteModalText", children: ["\u00BFEst\u00E1 seguro que desea eliminar la cancha ", _jsx("strong", { children: courtToDelete.courtName }), "? Esta acci\u00F3n no es reversible y puede afectar reservas activas."] }), _jsxs("div", { className: "deleteModalActions", children: [_jsx("button", { className: "cancelButton", onClick: () => setShowDeleteModal(false), disabled: isDeleting, children: "Cancelar" }), _jsx("button", { className: "confirmDeleteButton", onClick: confirmDelete, disabled: isDeleting, children: isDeleting ? "Eliminando..." : "Eliminar Cancha" })] })] }) }) }))] }));
}
;
export default AdminCourtPage;
