import { useState } from "react"
import { Court } from "../../types/Court"
import placeholder from "../../assets/placeholder.png";
import { BrushCleaning, Funnel, Pencil, PlusIcon, Search, Trash2, X } from "lucide-react"
import { useCourts, useCreateCourt, useDeleteCourt, useUpdateCourt } from "../../hooks/courts/useCourts";
import { courtSchema } from "../../validations/courtSchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";
import LoadingOverlay from "../../components/LoadingOverlay";

type CourtFormValues = InferType<typeof courtSchema>;

function AdminCourtPage() {
    const { data: courts = [], isLoading } = useCourts();
    const { mutate: deleteCourtMutation, isPending: isDeleting } = useDeleteCourt();
    const { mutate: createCourtMutation, isPending: isCreating } = useCreateCourt();
    const { mutate: updateCourtMutation, isPending: isUpdating } = useUpdateCourt();

    const courtTypes = ["baloncesto", "voleibol"]
    const daysOfWeek = ["lunes", "martes", "miércoles", "jueves", "viernes", "sabado", "domingo"]

    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState<"add" | "edit">("add")
    const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [courtToDelete, setCourtToDelete] = useState<Court | null>(null)

    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CourtFormValues>({
        resolver: yupResolver(courtSchema),
    });

    const filteredCourts = courts.filter((court) => {
        const matchesSearch =
            court.courtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            court.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            court.location.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = filterType === "all" || court.type === filterType
        const matchesStatus = filterStatus === "all" || court.status === filterStatus
        return matchesSearch && matchesType && matchesStatus
    })

    const handleAddCourt = () => {
        setModalMode("add")
        setSelectedCourt(null)
        reset({
            courtName: "",
            type: "" as any,
            location: "",
            indoorOrOutdoor: "" as any,
            playerCapacity: 1,
            hourStartTime: "08:00",
            hourEndTime: "22:00",
            status: "" as any,
            hasLight: false,
            description: "",
            operatingDays: [],
        });
        setShowModal(true)
    }

    const getStatusColor = (status: string) => {
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
    }

    const handleEditCourt = (court: Court) => {
        setModalMode("edit")
        setSelectedCourt(court)
        setShowModal(true)
        reset({
            courtName: court.courtName,
            type: court.type as 'baloncesto' | "voleibol",
            location: court.location,
            indoorOrOutdoor: court.indoorOrOutdoor as 'techado' | 'destechado',
            playerCapacity: court.playerCapacity,
            hourStartTime: court.hourStartTime,
            hourEndTime: court.hourEndTime,
            status: court.status as 'mantenimiento' | 'activo',
            hasLight: court.hasLight,
            description: court.description || "",
            operatingDays: court.operatingDays,
        });
        setShowModal(true);
    }

    const handleDeleteCourt = (court: Court) => {
        setCourtToDelete(court)
        setShowDeleteModal(true)
    }


    const onSubmit = (court: CourtFormValues) => {
        const data: Partial<Court> = {
            ...court,
            operatingDays: court.operatingDays.filter(Boolean).filter((d): d is string => !!d),
        };

        if (modalMode === "add") {
            createCourtMutation(data, {
                onSuccess: () => {
                    setShowModal(false);
                    setSelectedCourt(null);
                    reset();
                },
            });
        } else if (modalMode === "edit" && selectedCourt) {
            updateCourtMutation(
                { id: selectedCourt._id, data },
                {
                    onSuccess: () => {
                        setShowModal(false)
                        setSelectedCourt(null)
                        reset();
                    },
                });
        }

        setShowModal(false)
        setSelectedCourt(null)
    }

    const confirmDelete = () => {
        if (courtToDelete) {
            deleteCourtMutation(courtToDelete._id, {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setCourtToDelete(null);
                },
                onError: (error) => {
                    console.log("Error eliminando la cancha", error)
                }
            });
        }
    };

    const clearFilters = () => {
        setSearchTerm("")
        setFilterType("all")
        setFilterStatus("all")
    }

    return (
        <div className="courtsManagement">
            {isLoading && <LoadingOverlay />}
            <div className="header">
                <div className="headerLeft">
                    <h1 className="pageTitle">Administrar Canchas</h1>
                    {/* <p className="pageSubtitle">Manage your courts, pricing, and availability</p> */}
                </div>
                <button className="addButton" onClick={handleAddCourt}>
                    <PlusIcon size={18} />
                    Add New Court
                </button>
            </div>

            <div className="filtersSection">
                <div className="searchContainer">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Buscar canchas por nombre, tipo o locación..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="searchInput"
                    />
                </div>

                <div className="filters">
                    <div className="filterGroup">
                        <Funnel size={18} />
                        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filterSelect">
                            <option value="all">Todos Tipos</option>
                            {courtTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filterGroup">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="filterSelect"
                        >
                            <option value="all">Todos Estatus</option>
                            <option value="activo">Activo</option>
                            <option value="mantenimiento">Mantenimiento</option>
                        </select>
                    </div>

                    <div className="filterGroup">
                        <button onClick={clearFilters} className="cleanFilter">
                            <BrushCleaning size={18} />
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            </div>

            {/* Courts Grid */}
            <div className="courtsGrid">
                {filteredCourts.map((court) => (
                    <div key={court._id} className="courtCard">
                        <div className="courtImage">
                            <img src={placeholder} alt={court.courtName} />
                            <div className={`courtStatus ${getStatusColor(court.status)}`}>{court.status}</div>
                        </div>

                        <div className="courtContent">
                            <div className="courtHeader">
                                <h3 className="courtName">{court.courtName}</h3>
                                <div className="courtType">{court.type}</div>
                            </div>

                            <p className="courtDescription">{court.description}</p>

                            <div className="courtDetails">
                                <div className="detailItem">
                                    <span className="detailLabel">Ubicación:</span>
                                    <span className="detailValue">{court.location}</span>
                                </div>
                                <div className="detailItem">
                                    <span className="detailLabel">Tipo:</span>
                                    <span className="detailValue">{court.indoorOrOutdoor}</span>
                                </div>
                                <div className={"detailItem"}>
                                    <span className={"detailLabel"}>Capacidad:</span>
                                    <span className={"detailValue"}>{court.playerCapacity} players</span>
                                </div>
                            </div>

                            <div className={"courtActions"}>
                                <button className={"editButton"} onClick={() => handleEditCourt(court)}>
                                    <Pencil />
                                    Editar
                                </button>
                                <button className={"deleteButton"} onClick={() => handleDeleteCourt(court)}>
                                    <Trash2 />
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCourts.length === 0 && (
                <div className="emptyState">
                    <div className="emptyStateContent">
                        <h3>Cancha no encontrada</h3>
                        <p>Ajusta los filtros de búsqueda.</p>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modalOverlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modalHeader">
                            <h2 className="modalTitle">{modalMode === "add" ? "Agregar Nueva Cancha" : "Editar Cancha"}</h2>
                            <button className="closeButton" onClick={() => setShowModal(false)}>
                                <X size={18} />
                            </button>
                        </div>

                        <form
                            className="modalForm"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="formGrid">
                                <div className="formGroup">
                                    <label className={"formLabel"}>Nombre Cancha *</label>
                                    <input
                                        {...register("courtName")}
                                        placeholder="Nombre"
                                        className="formInput"
                                    />
                                    <p className="errorCourtForm">{errors.courtName?.message}</p>
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">Tipo Cancha *</label>
                                    <select {...register("type")} className="formSelect">
                                        <option value="">Seleccione una opción</option>
                                        {courtTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="errorCourtForm">{errors.type?.message}</p>
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">Locación *</label>
                                    <input
                                        {...register("location")}
                                        placeholder="Locación"
                                        className="formInput"
                                    />
                                    <p className="errorCourtForm">{errors.location?.message}</p>
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">Techado/Destechado *</label>
                                    <select
                                        {...register("indoorOrOutdoor")}
                                        className="formSelect"
                                    >
                                        <option value="">Seleccione una opción</option>
                                        <option value="destechado">Destechado</option>
                                        <option value="techado">Techado</option>
                                    </select>
                                    <p className="errorCourtForm">{errors.indoorOrOutdoor?.message}</p>
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">Capacidad (jugadores) *</label>
                                    <input
                                        type="number"
                                        {...register("playerCapacity")}
                                        placeholder="1"
                                        className="formInput"
                                    />
                                    <p className="errorCourtForm">{errors.playerCapacity?.message}</p>
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">Hora Inicio *</label>
                                    <input
                                        type="time"
                                        {...register("hourStartTime")}
                                        className="formInput"
                                    />
                                    <p className="errorCourtForm">{errors.hourStartTime?.message}</p>
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">Hora Final *</label>
                                    <input
                                        type="time"
                                        {...register("hourEndTime")}
                                        className="formInput"
                                    />
                                    <p className="errorCourtForm">{errors.hourEndTime?.message}</p>
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">Estado *</label>
                                    <select
                                        {...register("status")}
                                        className="formSelect"
                                    >
                                        <option value="">Seleccione una opción</option>
                                        <option value="activo">Activo</option>
                                        <option value="mantenimiento">Mantenimiento</option>
                                    </select>
                                    <p className="errorCourtForm">{errors.status?.message}</p>
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">
                                        <input
                                            type="checkbox"
                                            {...register("hasLight")}
                                            className="formCheckbox"
                                        />
                                        Tiene Luz
                                    </label>
                                    <p className="errorCourtForm">{errors.hasLight?.message}</p>
                                </div>
                            </div>

                            <div className="formGroup">
                                <label className="formLabel">Descripción *</label>
                                <textarea
                                    {...register("description")}
                                    className="formTextarea"
                                    rows={3}
                                />
                                <p className="errorCourtForm">{errors.description?.message}</p>
                            </div>

                            <div className="formGroup">
                                <label className="formLabel">Días Operación</label>
                                <div className="checkboxGroup">
                                    {daysOfWeek.map((day) => (
                                        <label key={day} className="checkboxLabel">
                                            <input
                                                type="checkbox"
                                                value={day}
                                                {...register("operatingDays")}
                                                className="formCheckbox"
                                            />
                                            {day}
                                        </label>
                                    ))}
                                    <p className="errorCourtForm">{errors.operatingDays?.message}</p>
                                </div>
                            </div>

                            <div className="modalActions">
                                <button type="button" className="cancelButton" disabled={isCreating} onClick={() => setShowModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="submitButton" disabled={isCreating}>
                                    {modalMode === "add"
                                        ? isCreating ? "Agregando..." : "Agregar"
                                        : isUpdating ? "Actualizando" : "Actualizar"
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && courtToDelete && (
                <div className="modalOverlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="deleteModal" onClick={(e) => e.stopPropagation()}>
                        <div className="deleteModalContent">
                            <h3 className="deleteModalTitle">Eliminar Cancha</h3>
                            <p className="deleteModalText">
                                ¿Está seguro que desea eliminar la cancha <strong>{courtToDelete.courtName}</strong>? Esta acción no es reversible y puede afectar reservas activas.
                            </p>
                            <div className="deleteModalActions">
                                <button
                                    className="cancelButton"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isDeleting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="confirmDeleteButton"
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "Eliminando..." : "Eliminar Cancha"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminCourtPage;