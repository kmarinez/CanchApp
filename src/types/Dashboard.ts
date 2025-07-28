export interface RecentReservations {
    _id: string;
    court: {
        _id: string;
        courtName: string;
    };
    user: {
        _id: string;
        name: string;
        lastName: string;
        email: string;
    };
    date: string;
    startTime: string;
    endTime: string;
    status: string;
}

export interface Dashboard {
    totalReservations: number;
    totalActiveUsers: number;
    occupancyRateToday: number;
    recentReservations: [RecentReservations];
} 