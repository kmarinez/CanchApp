import { useState } from "react"
import { Court } from "../types/Court"
import placeholder from "../assets/placeholder.png";
import { BrushCleaning, Funnel, Pencil, PlusIcon, Search, Trash2, X } from "lucide-react"

function AdminCourtPage() {
    const [courts, setCourts] = useState<Court[]>(
        [
            {
                isDeleted: false,
                _id: "685861002dead9911c73677d",
                courtName: "Cancha A",
                type: "baloncesto",
                location: "Edificio Norte",
                indoorOrOutdoor: "techado",
                playerCapacity: 10,
                hourStartTime: "08:00",
                hourEndTime: "22:00",
                status: "activo",
                hasLight: true,
                description: "Cancha techada con iluminación LED",
                operatingDays: [
                    "lunes",
                    "martes",
                    "miércoles",
                    "jueves",
                    "viernes"
                ]
            },
            {
                _id: "685864f9d2220da975a7e11f",
                courtName: "Cancha B",
                type: "volleyball",
                location: "Zona Norte",
                indoorOrOutdoor: "destechado",
                playerCapacity: 12,
                hourStartTime: "08:00",
                hourEndTime: "22:00",
                status: "activo",
                hasLight: true,
                description: "Cancha con iluminación LED",
                operatingDays: [
                    "lunes",
                    "martes",
                    "miércoles",
                    "jueves",
                    "viernes"
                ],
                isDeleted: false,
            }
        ])

    const courtTypes = ["baloncesto", "volleyball"]
    const daysOfWeek = ["lunes", "martes", "miércoles", "jueves", "viernes", "sabado", "domingo"]

    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState<"add" | "edit">("add")
    const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [courtToDelete, setCourtToDelete] = useState<Court | null>(null)

    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")

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
    }

    const handleDeleteCourt = (court: Court) => {
        setCourtToDelete(court)
        setShowDeleteModal(true)
    }


    const handleSubmitCourt = (formData: FormData) => {
        const newCourt: Court = {
            _id: Date.now().toString(), // o usa uuid si prefieres
            courtName: formData.get("courtName") as string,
            type: formData.get("type") as string,
            location: formData.get("location") as string,
            indoorOrOutdoor: formData.get("indoor") as Court["indoorOrOutdoor"],
            playerCapacity: Number(formData.get("playerCapacity")),
            hourStartTime: formData.get("hourStartTime") as string,
            hourEndTime: formData.get("hourEndTime") as string,
            status: formData.get("status") as Court["status"],
            hasLight: formData.get("hasLight") === "on",
            description: (formData.get("description") as string) || "",
            operatingDays: formData.getAll("operatingDays") as string[],
            isDeleted: false,
        }

        if (modalMode === "add") {
            setCourts([...courts, newCourt])
        } else if (modalMode === "edit" && selectedCourt) {
            setCourts(
                courts.map((court) => (court._id === selectedCourt._id ? { ...newCourt, _id: selectedCourt._id } : court))
            )
        }

        setShowModal(false)
        setSelectedCourt(null)
    }

    const confirmDelete = () => {
        if (courtToDelete) {
            setCourts(courts.filter((court) => court._id !== courtToDelete._id))
            setShowDeleteModal(false)
            setCourtToDelete(null)
        }
    }

    const clearFilters = () => {
        setSearchTerm("")
        setFilterType("all")
        setFilterStatus("all")
    }

    return (
        <div className="courtsManagement">
            <div className="header">
                <div className="headerLeft">
                    <h1 className="pageTitle">Administración Canchas</h1>
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
                        <BrushCleaning size={18}/>
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
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleSubmitCourt(new FormData(e.currentTarget))
                            }}
                        >
                            <div className="formGrid">
                                <div className="formGroup">
                                    <label className={"formLabel"}>Nombre Cancha *</label>
                                    <input
                                        type="text"
                                        name="courtName"
                                        defaultValue={selectedCourt?.courtName || ""}
                                        className="formInput"
                                        required
                                    />
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">Tipo Cancha *</label>
                                    <select name="type" defaultValue={selectedCourt?.type || ""} className="formSelect" required>
                                        <option value="">Select Type</option>
                                        {courtTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">Locación *</label>
                                    <input
                                        type="text"
                                        name="location"
                                        defaultValue={selectedCourt?.location || ""}
                                        className="formInput"
                                        required
                                    />
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">Techado/Destechado *</label>
                                    <select
                                        name="indoor"
                                        defaultValue={selectedCourt?.indoorOrOutdoor}
                                        className="formSelect"
                                        required
                                    >
                                        <option value="Destechado">Destechado</option>
                                        <option value="Techado">Techado</option>
                                    </select>
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">Capacidad (jugadores) *</label>
                                    <input
                                        type="number"
                                        name="playerCapacity"
                                        min="1"
                                        max="50"
                                        defaultValue={selectedCourt?.playerCapacity || ""}
                                        className="formInput"
                                        required
                                    />
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">Hora Inicio *</label>
                                    <input
                                        type="time"
                                        name="hourStartTime"
                                        defaultValue={selectedCourt?.hourStartTime || "08:00"}
                                        className="formInput"
                                        required
                                    />
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">Hora Final *</label>
                                    <input
                                        type="time"
                                        name="hourEndTime"
                                        defaultValue={selectedCourt?.hourEndTime || "22:00"}
                                        className="formInput"
                                        required
                                    />
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">Estado *</label>
                                    <select
                                        name="status"
                                        defaultValue={selectedCourt?.status || "active"}
                                        className="formSelect"
                                        required
                                    >
                                        <option value="activo">Activo</option>
                                        <option value="mantenimiento">Mantenimiento</option>
                                    </select>
                                </div>

                                <div className="formGroup">
                                    <label className="formLabel">
                                        <input
                                            type="checkbox"
                                            name="hasLight"
                                            defaultChecked={selectedCourt?.hasLight || false}
                                            className="formCheckbox"
                                        />
                                        Tiene Luz
                                    </label>
                                </div>
                            </div>

                            <div className="formGroup">
                                <label className="formLabel">Descripción</label>
                                <textarea
                                    name="description"
                                    defaultValue={selectedCourt?.description || ""}
                                    className="formTextarea"
                                    rows={3}
                                />
                            </div>

                            <div className="formGroup">
                                <label className="formLabel">Días Operación</label>
                                <div className="checkboxGroup">
                                    {daysOfWeek.map((day) => (
                                        <label key={day} className="checkboxLabel">
                                            <input
                                                type="checkbox"
                                                name="operatingDays"
                                                value={day}
                                                defaultChecked={selectedCourt?.operatingDays.includes(day) || false}
                                                className="formCheckbox"
                                            />
                                            {day}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="modalActions">
                                <button type="button" className="cancelButton" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="submitButton">
                                    {modalMode === "add" ? "Agregar" : "Actualizar"}
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
                                Esta seguro que desea eliminar la cancha <strong>{courtToDelete.courtName}</strong>? Esta acción no es rebocable y puede afectar reservas activas.
                            </p>
                            <div className={"deleteModalActions"}>
                                <button className={"cancelButton"} onClick={() => setShowDeleteModal(false)}>
                                    Cancel
                                </button>
                                <button className={"confirmDeleteButton"} onClick={confirmDelete}>
                                    Delete Court
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