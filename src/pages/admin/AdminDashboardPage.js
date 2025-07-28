import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Building, Calendar, Percent, User, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../hooks/dashboard/useDashboard";
import { formatDistanceToNow, isToday, isTomorrow, isYesterday, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import LoadingOverlay from "../../components/LoadingOverlay";
function AdminDashboardPage() {
    const navigate = useNavigate();
    const { data, isLoading, isError } = useDashboard();
    const getDescriptionDate = (date) => {
        const fecha = parseISO(date);
        if (isToday(fecha))
            return "hoy";
        if (isYesterday(fecha))
            return "ayer";
        if (isTomorrow(fecha))
            return "mañana";
        return formatDistanceToNow(fecha, { addSuffix: true, locale: es });
    };
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
    return (_jsxs("div", { className: "dashboard-main", children: [isLoading && _jsx(LoadingOverlay, {}), _jsx("h1", { children: "Visi\u00F3n General" }), _jsxs("div", { className: "statsGrid", children: [_jsxs("div", { className: "statCard", children: [_jsxs("div", { className: "statHeader", children: [_jsx("div", { className: "statTitle", children: "Total Reservas" }), _jsx("div", { className: "statIcon green", children: _jsx(Calendar, { size: 18, color: "#16a34a" }) })] }), _jsx("div", { className: "statValue", children: data?.totalReservations })] }), _jsxs("div", { className: "statCard", children: [_jsxs("div", { className: "statHeader", children: [_jsx("div", { className: "statTitle", children: "Usuarios Activos" }), _jsx("div", { className: "statIcon blue", children: _jsx(Users, { size: 18, color: "#2563eb" }) })] }), _jsx("div", { className: "statValue", children: data?.totalActiveUsers })] }), _jsxs("div", { className: "statCard", children: [_jsxs("div", { className: "statHeader", children: [_jsx("div", { className: "statTitle", children: "Ocupaci\u00F3n Canchas (Hoy)" }), _jsx("div", { className: "statIcon orange", children: _jsx(Percent, { size: 18, color: "#ea580c" }) })] }), _jsxs("div", { className: "statValue", children: [data?.occupancyRateToday, "%"] })] })] }), _jsxs("div", { className: "contentGrid", children: [_jsxs("div", { className: "card", children: [_jsxs("div", { className: "cardHeader", children: [_jsx("h2", { className: "cardTitle", children: "Reservas Recientes" }), _jsx("button", { className: "viewAllButton", onClick: () => navigate("/reservas"), children: "Ver Todas" })] }), _jsx("div", { className: "cardContent", children: _jsxs("div", { className: "bookingsTable", children: [_jsxs("div", { className: "tableHeader", children: [_jsx("div", { children: "Usuario" }), _jsx("div", { children: "Cancha" }), _jsx("div", { children: "Hora" }), _jsx("div", { children: "Estatus" })] }), data?.recentReservations.map((reservation) => (_jsxs("div", { className: "tableRow", children: [_jsxs("div", { className: "userCell", children: [_jsxs("div", { className: "user-avatar", children: [reservation.user?.name.charAt(0) ?? "", reservation.user?.lastName.charAt(0) ?? ""] }), _jsxs("div", { children: [_jsxs("div", { className: "userName", children: [reservation.user.name, " ", reservation.user.lastName] }), _jsx("div", { className: "bookingDate", children: getDescriptionDate(reservation.date) })] })] }, reservation._id), _jsx("div", { className: "courtNameDashboard", children: reservation.court?.courtName }), _jsx("div", { className: "bookingTime", children: reservation.startTime }), _jsx("div", { className: `bookingStatus status ${getStatusColor(reservation.status)}`, children: reservation.status })] })))] }) })] }), _jsxs("div", { className: "card", children: [_jsx("div", { className: "cardHeader", children: _jsx("h2", { className: "cardTitle", children: "Acciones R\u00E1pidas" }) }), _jsx("div", { className: "cardContent", children: _jsxs("div", { className: "quickActions", children: [_jsxs("button", { className: "actionButton", onClick: () => navigate("/reservas"), children: [_jsx(Calendar, { size: 18, color: "#16a34a" }), _jsx("span", { children: "Realizar Reserva" })] }), _jsxs("button", { className: "actionButton", onClick: () => navigate("/canchas"), children: [_jsx(Building, { size: 18, color: "#16a34a" }), _jsx("span", { children: "Crear Cancha" })] }), _jsxs("button", { className: "actionButton", onClick: () => navigate("/usuarios"), children: [_jsx(User, { size: 18, color: "#16a34a" }), _jsx("span", { children: "Administrar Usuarios" })] })] }) })] })] })] }));
}
export default AdminDashboardPage;
