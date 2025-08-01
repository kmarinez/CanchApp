import { CalendarIcon, CalendarSync, ClockIcon, MapPin, SearchIcon } from "lucide-react";
import { useState } from "react";
import placeholder from "../../assets/placeholder.png";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSummaryReservation } from "../../hooks/reservations/useReservations";
import LoadingOverlay from "../../components/LoadingOverlay";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading, isError } = useSummaryReservation();

  const upcomingBookings = data?.upcoming ?? [];
  const recentBookings = data?.recent ?? [];

  const [quickSearchDate, setQuickSearchDate] = useState("")
  const [quickSearchTime, setQuickSearchTime] = useState("")
  const [quickSearchSport, setQuickSearchSport] = useState("")

  const todayDay = () => {
    let date = new Date().toLocaleDateString().split('/');
    let year = date[2];
    let month = `0${date[0]}`;
    let day = date[1];

    let formattedDate = `${year}-${month}-${day}`

    return formattedDate;
  }

  const handleQuickSearch = () => {
    if (!quickSearchDate || !quickSearchTime || !quickSearchSport) {
      toast.error("Por favor completa todos los campos para buscar.");
      return;
    }

    const queryParams = new URLSearchParams({
      date: quickSearchDate,
      timeRange: quickSearchTime,
      type: quickSearchSport,
    });
  
    navigate(`/canchasdisponibles?${queryParams.toString()}`);
  }

  const handleBookAgain = (booking: any) => {
    let timeOfDay;

    let today = todayDay();

      if(booking.startTime < "12:00") {
        timeOfDay = 'morning'
      }else if(booking.startTime >= "12:00" && booking.endTime <= "18:00"){
        timeOfDay = 'afternoon'
      }else {
        timeOfDay = 'evening'
      }
  
      return navigate(`/canchasdisponibles?date=${today}&timeRange=${timeOfDay}&type=${booking.court.type}&courtId=${booking.court._id}`)
  }

  const handleNewBooking = () => {
    let today = todayDay();

    return navigate(`/canchasdisponibles?date=${today}&timeRange=morning&type=baloncesto`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmada":
        return "confirmed"
      case "pendiente":
        return "pending"
      case "completada":
        return "completed"
      case "cancelada":
        return "cancelled"
      default:
        return ""
    }
  }


  return (
    <div className="dashboardContent">
      {isLoading && <LoadingOverlay />}
      {/* Welcome Section */}
      <section className="welcomeSection">
        <div className="welcomeContent">
          <h1 className="welcomeTitle">¡Hola, {user?.name} {user?.lastName}!</h1>
        </div>
      </section>

      {/* Quick Search */}
      <section className="quickSearch">
        <h2 className="sectionTitle">Reservar</h2>
        <div className="quickSearchForm">
          <div className="searchField">
            <CalendarIcon size={18} />
            <input
              type="date"
              value={quickSearchDate}
              min={todayDay()}
              onChange={(e) => setQuickSearchDate(e.target.value)}
              className="searchInput"
            />
          </div>
          <div className="searchField">
            <ClockIcon size={18} />
            <select
              value={quickSearchTime}
              onChange={(e) => setQuickSearchTime(e.target.value)}
              className="searchSelect"
            >
              <option value="">Selecciona el horario</option>
              <option value="morning">Mañana (6AM - 12PM)</option>
              <option value="afternoon">Tarde (12PM - 6PM)</option>
              <option value="evening">Noche (6PM - 10PM)</option>
            </select>
          </div>
          <div className="searchField">
            <select
              value={quickSearchSport}
              onChange={(e) => setQuickSearchSport(e.target.value)}
              className="searchSelect"
            >
              <option value="">Cualquier deporte</option>
              <option value="baloncesto">Baloncesto</option>
              <option value="voleibol">Voleibol</option>
            </select>
          </div>
          <button className="searchButton" onClick={handleQuickSearch}>
            <SearchIcon size={18} />
            Encontrar Canchas
          </button>
        </div>
      </section>

      <div className="dashboardGrid">
        {/* Upcoming Bookings */}
        <section className="upcomingBookings">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Próximas reservas</h2>
            <button className="viewAllButton" onClick={() => navigate("/reservaciones")}>Ver todas</button>
          </div>
          <div className="bookingsList">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((booking) => (
                <div key={booking._id} className="bookingCard">
                  <div className="bookingImage">
                    <img src={placeholder} alt={booking.court.courtName} />
                  </div>
                  <div className="bookingDetails">
                    <div className="bookingHeader">
                      <h3 className="bookingCourtName">{booking.court.courtName}</h3>
                      <span className={`status ${booking.status} ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="bookingType">{booking.court.type}</div>
                    <div className="bookingLocation">
                      <MapPin size={18} />
                      {booking.court.location}
                    </div>
                    <div className="bookingTime">
                      <CalendarIcon size={18} />
                      {booking.date}
                    </div>
                    <div className="bookingDuration">
                      <ClockIcon size={18} />
                      {booking.startTime} - {booking.endTime}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="emptyState">
                <p>No tienes reservas</p>
                <button onClick={handleNewBooking} className="bookNowButton">Agendar Cancha</button>
              </div>
            )}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="recentActivity">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Actividad Reciente</h2>
          </div>
          <div className="activityList">
            {recentBookings.map((booking) => (
              <div key={booking._id} className="activityItem">
                <div className="activityImage">
                  <img src={placeholder} alt={booking.court.courtName} />
                </div>
                <div className="activityDetails">
                  <div className="activityCourtName">{booking.court.courtName}</div>
                  <div className="activityDate">
                    {booking.startTime} • {booking.peopleCount} personas
                  </div>
                </div>
                <button
                  className="bookAgainButton"
                  onClick={() => handleBookAgain(booking)}
                  title="Volver a Reservar"
                >
                  <CalendarSync size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;