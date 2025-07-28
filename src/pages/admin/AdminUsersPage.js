import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Eye, Funnel, Pencil, Search, X } from "lucide-react";
import { useUpdateUser, useUsers } from "../../hooks/users/useUsers";
import LoadingOverlay from "../../components/LoadingOverlay";
function AdminUsersPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const { data, isLoading, error } = useUsers(currentPage);
    const users = data?.data || [];
    const totalPages = data?.totalPages || 1;
    const { mutate: updateUserMutation, isPending: isUpdating } = useUpdateUser();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedUser, setSelectedUser] = useState(null);
    const [usersPerPage] = useState(10);
    const roles = ["customer", "admin", "staff"];
    const statuses = ["active", "inactive", "suspend"];
    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.identificationNum.includes(searchTerm);
        const matchesRole = filterRole === "all" || user.role === filterRole;
        const matchesStatus = filterStatus === "all" || user.status === filterStatus;
        return matchesSearch && matchesRole && matchesStatus;
    });
    const currentUsers = filteredUsers;
    const handleAddUser = () => {
        setModalMode("add");
        setSelectedUser(null);
        setShowModal(true);
    };
    const handleEditUser = (user) => {
        setModalMode("edit");
        setSelectedUser(user);
        setShowModal(true);
    };
    const handleViewUser = (user) => {
        setModalMode("view");
        setSelectedUser(user);
        setShowModal(true);
    };
    const handleSubmitUser = (formData) => {
        const userData = {
            name: formData.get("firstName"),
            lastName: formData.get("lastName"),
            email: formData.get("email"),
            role: formData.get("role"),
            status: formData.get("status"),
        };
        if (modalMode === "add") {
        }
        else if (modalMode === "edit" && selectedUser) {
            updateUserMutation({ id: selectedUser._id, data: userData }, {
                onSuccess: () => {
                    setShowModal(false);
                    setSelectedUser(null);
                },
                onError: (error) => {
                    console.log("Error al tratar de actualizar usuario", error);
                }
            });
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "statusActive";
            case "inactive":
                return "statusInactive";
            case "pending":
                return "statusPending";
            case "suspend":
                return "statusSuspended";
            default:
                return "";
        }
    };
    const getRoleColor = (role) => {
        switch (role) {
            case "admin":
                return "roleAdmin";
            case "staff":
                return "roleStaff";
            case "customer":
                return "roleCustomer";
            default:
                return "";
        }
    };
    return (_jsxs("div", { className: "usersManagement", children: [isLoading && _jsx(LoadingOverlay, {}), _jsxs("div", { className: "header", children: [_jsx("div", { className: "headerLeft", children: _jsx("h1", { className: "pageTitle", children: "Administrar Usuarios" }) }), _jsx("div", { className: "headerActions" })] }), _jsxs("div", { className: "statsGrid", children: [_jsxs("div", { className: "statCard", children: [_jsx("div", { className: "statValue", children: data?.totalUsers }), _jsx("div", { className: "statLabel", children: "Total Usuarios" })] }), _jsxs("div", { className: "statCard", children: [_jsx("div", { className: "statValue", children: data?.activeUsers }), _jsx("div", { className: "statLabel", children: "Usuarios Activos" })] }), _jsxs("div", { className: "statCard", children: [_jsx("div", { className: "statValue", children: data?.staffUsers }), _jsx("div", { className: "statLabel", children: "Staff" })] })] }), _jsxs("div", { className: "filtersSection", children: [_jsxs("div", { className: "searchContainer", children: [_jsx(Search, { size: 18 }), _jsx("input", { type: "text", placeholder: "Buscar usuario por nombre, n\u00FAmero de identificaci\u00F3n o correo electr\u00F3nico", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "searchInput" })] }), _jsxs("div", { className: "filters", children: [_jsxs("div", { className: "filterGroup", children: [_jsx(Funnel, { size: 18 }), _jsxs("select", { value: filterRole, onChange: (e) => setFilterRole(e.target.value), className: "filterSelect", children: [_jsx("option", { value: "all", children: "Todos Roles" }), roles.map((role) => (_jsx("option", { value: role, children: role.charAt(0).toUpperCase() + role.slice(1) }, role)))] })] }), _jsx("div", { className: "filterGroup", children: _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "filterSelect", children: [_jsx("option", { value: "all", children: "Todos Estados" }), statuses.map((status) => (_jsx("option", { value: status, children: status.charAt(0).toUpperCase() + status.slice(1) }, status)))] }) })] })] }), _jsx("div", { className: "tableContainer", children: _jsxs("table", { className: "usersTable", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Nombre usuario" }), _jsx("th", { children: "Rol" }), _jsx("th", { children: "Estado" }), _jsx("th", { children: "Reservas" }), _jsx("th", { children: "Acciones" })] }) }), _jsx("tbody", { children: currentUsers.map((user) => (_jsxs("tr", { className: selectedUsers.includes(user._id) ? "selectedRow" : "", children: [_jsx("td", { children: _jsxs("div", { className: "userInfo", children: [_jsxs("div", { className: "userAvatar", children: [user.name.charAt(0).toUpperCase(), user.lastName.charAt(0).toUpperCase()] }), _jsxs("div", { className: "userDetails", children: [_jsxs("div", { className: "userName", children: [user.name, " ", user.lastName] }), _jsx("div", { className: "userEmail", children: user.email })] })] }) }), _jsx("td", { children: _jsx("span", { className: `role ${getRoleColor(user.role)}`, children: user.role }) }), _jsx("td", { children: _jsx("span", { className: `status ${getStatusColor(user.status)}`, children: user.status }) }), _jsx("td", { children: _jsx("div", { className: "bookingStats", children: _jsxs("div", { className: "bookingCount", children: [user.totalBookings, " reservas"] }) }) }), _jsx("td", { children: _jsxs("div", { className: "actionButtons", children: [_jsx("button", { className: "actionButton", onClick: () => handleViewUser(user), title: "Ver Usuario", children: _jsx(Eye, { size: 18 }) }), _jsx("button", { className: "actionButton", onClick: () => handleEditUser(user), title: "Editar Usuario", children: _jsx(Pencil, { size: 18 }) })] }) })] }, user._id))) })] }) }), totalPages > 1 && (_jsxs("div", { className: "pagination", children: [_jsxs("div", { className: "paginationInfo", children: ["P\u00E1gina ", currentPage, " de ", totalPages] }), _jsxs("div", { className: "paginationControls", children: [_jsx("button", { className: "paginationButton", onClick: () => setCurrentPage(currentPage - 1), disabled: currentPage === 1, children: "Anterior" }), Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (_jsx("button", { className: `paginationButton ${currentPage === page ? "active" : ""}`, onClick: () => setCurrentPage(page), children: page }, page))), _jsx("button", { className: "paginationButton", onClick: () => setCurrentPage(currentPage + 1), disabled: currentPage === totalPages, children: "Siguiente" })] })] })), showModal && (_jsx("div", { className: "modalOverlay", onClick: () => setShowModal(false), children: _jsxs("div", { className: "modal", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "modalHeader", children: [_jsx("h2", { className: "modalTitle", children: modalMode === "add" ? "Agregar Usuario" : modalMode === "edit" ? "Editar Usuario" : "Detalles Usuario" }), _jsx("button", { className: "closeButton", onClick: () => setShowModal(false), children: _jsx(X, {}) })] }), modalMode === "view" ? (_jsx("div", { className: "modalContent", children: selectedUser && (_jsxs("div", { className: "userProfile", children: [_jsxs("div", { className: "profileHeader", children: [_jsxs("div", { className: "profileAvatar", children: [selectedUser.name.charAt(0), selectedUser.lastName.charAt(0)] }), _jsxs("div", { className: "profileInfo", children: [_jsxs("h3", { children: [selectedUser.name, " ", selectedUser.lastName] }), _jsx("p", { children: selectedUser.email }), _jsx("p", { children: selectedUser.identificationNum }), _jsxs("div", { className: "profileBadges", children: [_jsx("span", { className: `role ${getRoleColor(selectedUser.role)}`, children: selectedUser.role }), _jsx("span", { className: `status ${getStatusColor(selectedUser.status)}`, children: selectedUser.status })] })] })] }), _jsxs("div", { className: "profileDetails", children: [_jsxs("div", { className: "detailSection", children: [_jsx("h4", { children: "Contacto Informaci\u00F3n" }), _jsx("div", { className: "detailGrid", children: _jsxs("div", { className: "detailItem", children: [_jsx("span", { className: "detailLabel", children: "Correo electr\u00F3nico:" }), _jsx("span", { className: "detailValue", children: selectedUser.email })] }) })] }), _jsxs("div", { className: "detailSection", children: [_jsx("h4", { children: "Informaci\u00F3n Cuenta" }), _jsx("div", { className: "detailGrid", children: _jsxs("div", { className: "detailItem", children: [_jsx("span", { className: "detailLabel", children: "Se uni\u00F3 en:" }), _jsx("span", { className: "detailValue", children: new Date(selectedUser.createdAt).toLocaleDateString() })] }) })] }), _jsxs("div", { className: "detailSection", children: [_jsx("h4", { children: "Reservas" }), _jsx("div", { className: "detailGrid", children: _jsxs("div", { className: "detailItem", children: [_jsx("span", { className: "detailLabel", children: "Total Reservas:" }), _jsx("span", { className: "detailValue", children: selectedUser.totalBookings })] }) })] })] })] })) })) : (_jsxs("form", { className: "modalForm", onSubmit: (e) => {
                                e.preventDefault();
                                handleSubmitUser(new FormData(e.currentTarget));
                            }, children: [_jsxs("div", { className: "formGrid", children: [_jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Primer Nombre *" }), _jsx("input", { type: "text", name: "firstName", defaultValue: selectedUser?.name || "", className: "formInput", required: true })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Apellido *" }), _jsx("input", { type: "text", name: "lastName", defaultValue: selectedUser?.lastName || "", className: "formInput", required: true })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Correo Electr\u00F3nico *" }), _jsx("input", { type: "email", name: "email", defaultValue: selectedUser?.email || "", className: "formInput", required: true })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "N\u00FAmero de Identificaci\u00F3n" }), _jsx("input", { type: "identificationNum", name: "identificationNum", defaultValue: selectedUser?.identificationNum || "", className: "formInput", style: { backgroundColor: "#f8fafc" }, disabled: true })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Rol *" }), _jsx("select", { name: "role", defaultValue: selectedUser?.role || "customer", className: "formSelect", required: true, children: roles.map((role) => (_jsx("option", { value: role, children: role.charAt(0).toUpperCase() + role.slice(1) }, role))) })] }), _jsxs("div", { className: "formGroup", children: [_jsx("label", { className: "formLabel", children: "Estado *" }), _jsx("select", { name: "status", defaultValue: selectedUser?.status || "active", className: "formSelect", required: true, children: statuses.map((status) => (_jsx("option", { value: status, children: status.charAt(0).toUpperCase() + status.slice(1) }, status))) })] })] }), _jsxs("div", { className: "modalActions", children: [_jsx("button", { type: "button", className: "cancelButton", onClick: () => setShowModal(false), children: "Cancelar" }), _jsx("button", { type: "submit", className: "submitButton", disabled: isUpdating, children: modalMode === "add" ?
                                                "Agregar" :
                                                isUpdating ? "Actualizando..." : "Actualizar" })] })] }))] }) }))] }));
}
export default AdminUsersPage;
