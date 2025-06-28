import { Building, Calendar, Percent, User, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

function AdminDashboardPage() {
    const navigate = useNavigate();
    
    return (
        <div className="dashboard-main">
            <h1>Visión General</h1>
            <div className="statsGrid">
                <div className="statCard">
                    <div className="statHeader">
                        <div className="statTitle">Total Reservas</div>
                        <div className="statIcon green"><Calendar size={18} color="#16a34a" /></div>
                    </div>
                    <div className="statValue">1,247</div>
                </div>
                <div className="statCard">
                    <div className="statHeader">
                        <div className="statTitle">Usuarios Activos</div>
                        <div className="statIcon blue"><Users size={18} color="#2563eb" /></div>
                    </div>
                    <div className="statValue">10</div>
                </div>
                <div className="statCard">
                    <div className="statHeader">
                        <div className="statTitle">Ocupación Canchas</div>
                        <div className="statIcon orange"><Percent size={18} color="#ea580c" /></div>
                    </div>
                    <div className="statValue">47%</div>
                </div>
            </div>
            <div className="contentGrid">
                {/**Reservas recientes*/}
                <div className="card">
                    <div className="cardHeader">
                        <h2 className="cardTitle">Reservas Recientes</h2>
                        <button className="viewAllButton">Ver Todas</button>
                    </div>
                    <div className="cardContent">
                        <div className="bookingsTable">
                            <div className="tableHeader">
                                <div>Usuario</div>
                                <div>Cancha</div>
                                <div>Hora</div>
                                <div>Estatus</div>
                            </div>
                            <div className="tableRow">
                                <div className="userCell">
                                    <div className="user-avatar">A</div>
                                    <div>
                                        <div className="userName">Usuario1</div>
                                        <div className="bookingDate">Hoy</div>
                                    </div>
                                </div>
                                <div className="courtName">Cancha Abierta</div>
                                <div className="bookingTime">2:00 PM</div>
                                <div className="bookingStatus">Confirmado</div>
                            </div>
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
                            <button className="actionButton">
                                <Calendar size={18} color="#16a34a"/>
                                <span>Realizar Reserva</span>
                            </button>
                            <button className="actionButton" onClick={() => navigate("/canchas")}>
                                <Building size={18} color="#16a34a"/>
                                <span>Crear Cancha</span>
                            </button>
                            <button className="actionButton">
                                <User size={18} color="#16a34a"/>
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