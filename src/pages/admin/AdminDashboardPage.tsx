import { Building, Calendar, Percent, User, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../../hooks/dashboard/useDashboard";
import { formatDistanceToNow, isToday, isTomorrow, isYesterday, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import LoadingOverlay from "../../components/LoadingOverlay";

function AdminDashboardPage() {
    const navigate = useNavigate();

    const { data, isLoading, isError } = useDashboard();

    const getDescriptionDate = (date: string) => {
        const fecha = parseISO(date);

        if (isToday(fecha)) return "hoy";
        if (isYesterday(fecha)) return "ayer";
        if (isTomorrow(fecha)) return "mañana";
      
        return formatDistanceToNow(fecha, { addSuffix: true, locale: es });
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmada":
                return "statusActive"
            case "usada":
                return "statusInactive"
            case "pendiente":
                return "statusPending"
            case "cancelada":
                return "statusSuspended"
            default:
                return ""
        }
    }

    return (
        <div className="dashboard-main">
            {isLoading && <LoadingOverlay />}
            <h1>Visión General</h1>
            <div className="statsGrid">
                <div className="statCard">
                    <div className="statHeader">
                        <div className="statTitle">Total Reservas</div>
                        <div className="statIcon green"><Calendar size={18} color="#16a34a" /></div>
                    </div>
                    <div className="statValue">{data?.totalReservations}</div>
                </div>
                <div className="statCard">
                    <div className="statHeader">
                        <div className="statTitle">Usuarios Activos</div>
                        <div className="statIcon blue"><Users size={18} color="#2563eb" /></div>
                    </div>
                    <div className="statValue">{data?.totalActiveUsers}</div>
                </div>
                <div className="statCard">
                    <div className="statHeader">
                        <div className="statTitle">Ocupación Canchas (Hoy)</div>
                        <div className="statIcon orange"><Percent size={18} color="#ea580c" /></div>
                    </div>
                    <div className="statValue">{data?.occupancyRateToday}%</div>
                </div>
            </div>
            <div className="contentGrid">
                {/**Reservas recientes*/}
                <div className="card">
                    <div className="cardHeader">
                        <h2 className="cardTitle">Reservas Recientes</h2>
                        <button className="viewAllButton" onClick={() => navigate("/reservas")}>Ver Todas</button>
                    </div>
                    <div className="cardContent">
                        <div className="bookingsTable">
                            <div className="tableHeader">
                                <div>Usuario</div>
                                <div>Cancha</div>
                                <div>Hora</div>
                                <div>Estatus</div>
                            </div>
                            {data?.recentReservations.map((reservation) => (
                                <div className="tableRow">
                                    <div className="userCell" key={reservation._id}>
                                        <div className="user-avatar">{reservation.user?.name.charAt(0) ?? ""}{reservation.user?.lastName.charAt(0) ?? ""}</div>
                                        <div>
                                            <div className="userName">{reservation.user.name} {reservation.user.lastName}</div>
                                            <div className="bookingDate">{getDescriptionDate(reservation.date)}</div>
                                        </div>
                                    </div>
                                    <div className="courtNameDashboard">{reservation.court?.courtName}</div>
                                    <div className="bookingTime">{reservation.startTime}</div>
                                    <div className={`bookingStatus status ${getStatusColor(reservation.status)}`}>{reservation.status}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/**Acciones rapidas*/}
                <div className="card">
                    <div className="cardHeader">
                        <h2 className="cardTitle">Acciones Rápidas</h2>
                    </div>
                    <div className="cardContent">
                        <div className="quickActions">
                            <button className="actionButton" onClick={() => navigate("/reservas")}>
                                <Calendar size={18} color="#16a34a" />
                                <span>Realizar Reserva</span>
                            </button>
                            <button className="actionButton" onClick={() => navigate("/canchas")}>
                                <Building size={18} color="#16a34a" />
                                <span>Crear Cancha</span>
                            </button>
                            <button className="actionButton" onClick={() => navigate("/usuarios")}>
                                <User size={18} color="#16a34a" />
                                <span>Administrar Usuarios</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AdminDashboardPage;