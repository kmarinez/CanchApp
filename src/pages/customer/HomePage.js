import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const [quickSearchDate, setQuickSearchDate] = useState("");
    const [quickSearchTime, setQuickSearchTime] = useState("");
    const [quickSearchSport, setQuickSearchSport] = useState("");
    const todayDay = () => {
        let date = new Date().toLocaleDateString().split('/');
        let year = date[2];
        let month = `0${date[0]}`;
        let day = date[1];
        let formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    };
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
    };
    const handleBookAgain = (booking) => {
        let timeOfDay;
        let today = todayDay();
        if (booking.startTime < "12:00") {
            timeOfDay = 'morning';
        }
        else if (booking.startTime >= "12:00" && booking.endTime <= "18:00") {
            timeOfDay = 'afternoon';
        }
        else {
            timeOfDay = 'evening';
        }
        return navigate(`/canchasdisponibles?date=${today}&timeRange=${timeOfDay}&type=${booking.court.type}&courtId=${booking.court._id}`);
    };
    const handleNewBooking = () => {
        let today = todayDay();
        return navigate(`/canchasdisponibles?date=${today}&timeRange=morning&type=baloncesto`);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "confirmada":
                return "confirmed";
            case "pendiente":
                return "pending";
            case "completada":
                return "completed";
            case "cancelada":
                return "cancelled";
            default:
                return "";
        }
    };
    return (_jsxs("div", { className: "dashboardContent", children: [isLoading && _jsx(LoadingOverlay, {}), _jsx("section", { className: "welcomeSection", children: _jsx("div", { className: "welcomeContent", children: _jsxs("h1", { className: "welcomeTitle", children: ["\u00A1Hola, ", user?.name, " ", user?.lastName, "!"] }) }) }), _jsxs("section", { className: "quickSearch", children: [_jsx("h2", { className: "sectionTitle", children: "Reservar" }), _jsxs("div", { className: "quickSearchForm", children: [_jsxs("div", { className: "searchField", children: [_jsx(CalendarIcon, { size: 18 }), _jsx("input", { type: "date", value: quickSearchDate, min: todayDay(), onChange: (e) => setQuickSearchDate(e.target.value), className: "searchInput" })] }), _jsxs("div", { className: "searchField", children: [_jsx(ClockIcon, { size: 18 }), _jsxs("select", { value: quickSearchTime, onChange: (e) => setQuickSearchTime(e.target.value), className: "searchSelect", children: [_jsx("option", { value: "", children: "Selecciona el horario" }), _jsx("option", { value: "morning", children: "Mana\u00F1a (6AM - 12PM)" }), _jsx("option", { value: "afternoon", children: "Tarde (12PM - 6PM)" }), _jsx("option", { value: "evening", children: "Noche (6PM - 10PM)" })] })] }), _jsx("div", { className: "searchField", children: _jsxs("select", { value: quickSearchSport, onChange: (e) => setQuickSearchSport(e.target.value), className: "searchSelect", children: [_jsx("option", { value: "", children: "Cualquier deporte" }), _jsx("option", { value: "baloncesto", children: "Baloncesto" }), _jsx("option", { value: "volleyball", children: "voleibol" })] }) }), _jsxs("button", { className: "searchButton", onClick: handleQuickSearch, children: [_jsx(SearchIcon, { size: 18 }), "Encontrar Canchas"] })] })] }), _jsxs("div", { className: "dashboardGrid", children: [_jsxs("section", { className: "upcomingBookings", children: [_jsxs("div", { className: "sectionHeader", children: [_jsx("h2", { className: "sectionTitle", children: "Pr\u00F3ximas reservas" }), _jsx("button", { className: "viewAllButton", onClick: () => navigate("/reservaciones"), children: "Ver todas" })] }), _jsx("div", { className: "bookingsList", children: upcomingBookings.length > 0 ? (upcomingBookings.map((booking) => (_jsxs("div", { className: "bookingCard", children: [_jsx("div", { className: "bookingImage", children: _jsx("img", { src: placeholder, alt: booking.court.courtName }) }), _jsxs("div", { className: "bookingDetails", children: [_jsxs("div", { className: "bookingHeader", children: [_jsx("h3", { className: "bookingCourtName", children: booking.court.courtName }), _jsx("span", { className: `status ${booking.status} ${getStatusColor(booking.status)}`, children: booking.status })] }), _jsx("div", { className: "bookingType", children: booking.court.type }), _jsxs("div", { className: "bookingLocation", children: [_jsx(MapPin, { size: 18 }), booking.court.location] }), _jsxs("div", { className: "bookingTime", children: [_jsx(CalendarIcon, { size: 18 }), booking.date] }), _jsxs("div", { className: "bookingDuration", children: [_jsx(ClockIcon, { size: 18 }), booking.startTime, " - ", booking.endTime] })] })] }, booking._id)))) : (_jsxs("div", { className: "emptyState", children: [_jsx("p", { children: "No tienes reservas" }), _jsx("button", { onClick: handleNewBooking, className: "bookNowButton", children: "Agendar Cancha" })] })) })] }), _jsxs("section", { className: "recentActivity", children: [_jsx("div", { className: "sectionHeader", children: _jsx("h2", { className: "sectionTitle", children: "Actividad Reciente" }) }), _jsx("div", { className: "activityList", children: recentBookings.map((booking) => (_jsxs("div", { className: "activityItem", children: [_jsx("div", { className: "activityImage", children: _jsx("img", { src: placeholder, alt: booking.court.courtName }) }), _jsxs("div", { className: "activityDetails", children: [_jsx("div", { className: "activityCourtName", children: booking.court.courtName }), _jsxs("div", { className: "activityDate", children: [booking.startTime, " \u2022 ", booking.peopleCount, " personas"] })] }), _jsx("button", { className: "bookAgainButton", onClick: () => handleBookAgain(booking), title: "Volver a Reservar", children: _jsx(CalendarSync, { size: 18 }) })] }, booking._id))) })] })] })] }));
};
export default HomePage;
