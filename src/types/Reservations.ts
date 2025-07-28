export interface Reservation {
    _id: string;
    court: {
        _id: string;
        courtName: string;
        location: string;
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
    peopleCount: number;
    reservedFor: string;
    verifyCode: string;
    status: string;
    identificationNum: string;
    createdAt: string;
    updatedAt: string;
}

export interface GetReservationsResponse {
    page: number;
    totalPages: number;
    total: number;
    totalConfirmed: number;
    totalPending: number;
    totalToday: number;
    data: Reservation[];
}

export interface MyReservation {
    _id: string;
    court: {
        _id: string;
        location: string;
        courtName: string;
        type: string;
    };
    user: string;
    date: string;
    startTime: string;
    endTime: string;
    peopleCount: number;
    reservedFor: string;
    verifyCode: string;
    status: string;
    identificationNum: string;
    createdAt: string;
    updatedAt: string;
    cancelReason: string;
    cancelledBy: string;
}

export interface ResponseMyReservations {
    page: number;
    totalPages: number;
    total: number;
    data: MyReservation[];
}

export interface ReservationPartial {
    courtId: string;
    date: string;
    startTime: string;
    endTime: string;
    peopleCount: number;
    reservedFor: string;
}

export interface ReservationList {
    _id: string;
    court: {
        _id: string;
        courtName: string;
        location: string;
        type: string;
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
    peopleCount: number;
    reservedFor: string;
    verifyCode: string;
    status: string;
}