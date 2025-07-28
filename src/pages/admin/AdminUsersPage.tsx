import { useState } from "react";
import { Eye, Funnel, Pencil, Plus, Search, X } from "lucide-react";
import { useUpdateUser, useUsers } from "../../hooks/users/useUsers";
import { User } from "../../types/User";
import LoadingOverlay from "../../components/LoadingOverlay";


function AdminUsersPage() {
    const [currentPage, setCurrentPage] = useState(1)

    const {data, isLoading, error} = useUsers(currentPage);
    const users = data?.data || [];
    const totalPages = data?.totalPages || 1;

    const {mutate: updateUserMutation, isPending: isUpdating} = useUpdateUser();

    const [searchTerm, setSearchTerm] = useState("")
    const [filterRole, setFilterRole] = useState("all")
    const [filterStatus, setFilterStatus] = useState("all")
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add")
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [usersPerPage] = useState(10)

    const roles = ["customer", "admin", "staff"]
    const statuses = ["active", "inactive", "suspend"]

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.identificationNum.includes(searchTerm)
        const matchesRole = filterRole === "all" || user.role === filterRole
        const matchesStatus = filterStatus === "all" || user.status === filterStatus
        return matchesSearch && matchesRole && matchesStatus
    })

    const currentUsers = filteredUsers;


    const handleAddUser = () => {
        setModalMode("add")
        setSelectedUser(null)
        setShowModal(true)
    }

    const handleEditUser = (user: User) => {
        setModalMode("edit")
        setSelectedUser(user)
        setShowModal(true)
    }

    const handleViewUser = (user: User) => {
        setModalMode("view")
        setSelectedUser(user)
        setShowModal(true)
    }

    const handleSubmitUser = (formData: FormData) => {
        const userData = {
            name: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            email: formData.get("email") as string,
            role: formData.get("role") as User["role"],
            status: formData.get("status") as User["status"],
        }

        if (modalMode === "add") {
        } else if (modalMode === "edit" && selectedUser) {
            updateUserMutation(
                {id: selectedUser._id, data: userData},
                {
                    onSuccess: () => {
                        setShowModal(false);
                        setSelectedUser(null);
                    },
                    onError: (error) => {
                        console.log("Error al tratar de actualizar usuario", error);
                    }
                }
            )
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "statusActive"
            case "inactive":
                return "statusInactive"
            case "pending":
                return "statusPending"
            case "suspend":
                return "statusSuspended"
            default:
                return ""
        }
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case "admin":
                return "roleAdmin"
            case "staff":
                return "roleStaff"
            case "customer":
                return "roleCustomer"
            default:
                return ""
        }
    }

    return (
        <div className="usersManagement">
            {isLoading && <LoadingOverlay />}
            <div className="header">
                <div className="headerLeft">
                    <h1 className="pageTitle">Administrar Usuarios</h1>
                </div>
                <div className="headerActions">
                </div>
            </div>

            {/* Stats Overview */}
            <div className="statsGrid">
                <div className="statCard">
                    <div className="statValue">{data?.totalUsers}</div>
                    <div className="statLabel">Total Usuarios</div>
                </div>
                <div className="statCard">
                    <div className="statValue">{data?.activeUsers}</div>
                    <div className="statLabel">Usuarios Activos</div>
                </div>
                <div className="statCard">
                    <div className="statValue">{data?.staffUsers}</div>
                    <div className="statLabel">Staff</div>
                </div>
            </div>


            <div className="filtersSection">
                <div className="searchContainer">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Buscar usuario por nombre, número de identificación o correo electrónico"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="searchInput"
                    />
                </div>

                <div className="filters">
                    <div className="filterGroup">
                        <Funnel size={18} />
                        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="filterSelect">
                            <option value="all">Todos Roles</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
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
                            <option value="all">Todos Estados</option>
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="tableContainer">
                <table className="usersTable">
                    <thead>
                        <tr>
                            <th>Nombre usuario</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Reservas</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user._id} className={selectedUsers.includes(user._id) ? "selectedRow" : ""}>
                                <td>
                                    <div className="userInfo">
                                        <div className="userAvatar">
                                            {user.name.charAt(0).toUpperCase()}
                                            {user.lastName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="userDetails">
                                            <div className="userName">
                                                {user.name} {user.lastName}
                                            </div>
                                            <div className="userEmail">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`role ${getRoleColor(user.role)}`}>{user.role}</span>
                                </td>
                                <td>
                                    <span className={`status ${getStatusColor(user.status)}`}>{user.status}</span>
                                </td>
                                <td>
                                    <div className="bookingStats">
                                        <div className="bookingCount">{user.totalBookings} reservas</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="actionButtons">
                                        <button className="actionButton" onClick={() => handleViewUser(user)} title="Ver Usuario">
                                            <Eye size={18} />
                                        </button>
                                        <button className="actionButton" onClick={() => handleEditUser(user)} title="Editar Usuario">
                                            <Pencil size={18} />
                                        </button>
                                    </div>
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
                                className={`paginationButton ${currentPage === page ? "active" : ""}`}
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


            {/* User Modal */}
            {showModal && (
                <div className="modalOverlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modalHeader">
                            <h2 className="modalTitle">
                                {modalMode === "add" ? "Agregar Usuario" : modalMode === "edit" ? "Editar Usuario" : "Detalles Usuario"}
                            </h2>
                            <button className="closeButton" onClick={() => setShowModal(false)}>
                                <X />
                            </button>
                        </div>

                        {modalMode === "view" ? (
                            <div className="modalContent">
                                {selectedUser && (
                                    <div className="userProfile">
                                        <div className="profileHeader">
                                            <div className="profileAvatar">
                                                {selectedUser.name.charAt(0)}
                                                {selectedUser.lastName.charAt(0)}
                                            </div>
                                            <div className="profileInfo">
                                                <h3>
                                                    {selectedUser.name} {selectedUser.lastName}
                                                </h3>
                                                <p>{selectedUser.email}</p>
                                                <p>{selectedUser.identificationNum}</p>
                                                <div className="profileBadges">
                                                    <span className={`role ${getRoleColor(selectedUser.role)}`}>
                                                        {selectedUser.role}
                                                    </span>
                                                    <span className={`status ${getStatusColor(selectedUser.status)}`}>
                                                        {selectedUser.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="profileDetails">
                                            <div className="detailSection">
                                                <h4>Contacto Información</h4>
                                                <div className="detailGrid">
                                                    <div className="detailItem">
                                                        <span className="detailLabel">Correo electrónico:</span>
                                                        <span className="detailValue">{selectedUser.email}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="detailSection">
                                                <h4>Información Cuenta</h4>
                                                <div className="detailGrid">
                                                    <div className="detailItem">
                                                        <span className="detailLabel">Se unió en:</span>
                                                        <span className="detailValue">
                                                            {new Date(selectedUser.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="detailSection">
                                                <h4>Reservas</h4>
                                                <div className="detailGrid">
                                                    <div className="detailItem">
                                                        <span className="detailLabel">Total Reservas:</span>
                                                        <span className="detailValue">{selectedUser.totalBookings}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <form
                                className="modalForm"
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    handleSubmitUser(new FormData(e.currentTarget))
                                }}
                            >
                                <div className="formGrid">
                                    <div className="formGroup">
                                        <label className="formLabel">Primer Nombre *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            defaultValue={selectedUser?.name || ""}
                                            className="formInput"
                                            required
                                        />
                                    </div>

                                    <div className="formGroup">
                                        <label className="formLabel">Apellido *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            defaultValue={selectedUser?.lastName || ""}
                                            className="formInput"
                                            required
                                        />
                                    </div>

                                    <div className="formGroup">
                                        <label className="formLabel">Correo Electrónico *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            defaultValue={selectedUser?.email || ""}
                                            className="formInput"
                                            required
                                        />
                                    </div>

                                    <div className="formGroup">
                                        <label className="formLabel">Número de Identificación</label>
                                        <input
                                            type="identificationNum"
                                            name="identificationNum"
                                            defaultValue={selectedUser?.identificationNum || ""}
                                            className="formInput"
                                            style={{backgroundColor: "#f8fafc"}}
                                            disabled={true}
                                        />
                                    </div>

                                    <div className="formGroup">
                                        <label className="formLabel">Rol *</label>
                                        <select
                                            name="role"
                                            defaultValue={selectedUser?.role || "customer"}
                                            className="formSelect"
                                            required
                                        >
                                            {roles.map((role) => (
                                                <option key={role} value={role}>
                                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="formGroup">
                                        <label className="formLabel">Estado *</label>
                                        <select
                                            name="status"
                                            defaultValue={selectedUser?.status || "active"}
                                            className="formSelect"
                                            required
                                        >
                                            {statuses.map((status) => (
                                                <option key={status} value={status}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="modalActions">
                                    <button type="button" className="cancelButton" onClick={() => setShowModal(false)}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="submitButton" disabled={isUpdating}>
                                        {modalMode === "add" ? 
                                        "Agregar" : 
                                        isUpdating ? "Actualizando..." : "Actualizar"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUsersPage;