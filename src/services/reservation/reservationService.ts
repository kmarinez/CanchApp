import { GetReservationsResponse, Reservation, ReservationList, ReservationPartial, ResponseMyReservations } from "../../types/Reservations"
import { apiClient } from "../apiClient"

export const getReservations = async ({
    page = 1,
    filter,
    status,
    dateStart,
    dateEnd,
}: {
    page?: number;
    filter?: string;
    status?: string;
    dateStart?: string;
    dateEnd?: string;
}): Promise<GetReservationsResponse> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    if (filter) params.append("filter", filter);
    if (status && status !== "all") params.append("status", status);
    if (dateStart) params.append("dateStart", dateStart);
    if (dateEnd) params.append("dateEnd", dateEnd);

    return apiClient(`/api/reservations?${params.toString()}`, {
        method: "GET",
        credentials: "include",
    });
};

export const findReservation = async ({
    identificationNum,
    pinCode,
}: {
    identificationNum: string;
    pinCode: string;
}) => {
    return apiClient<{ message: string; data: Reservation }>("/api/reservations/find", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ identificationNum, pinCode }),
    });
}

export const verifyReservation = async ({
    identificationNum,
    pinCode,
}: {
    identificationNum: string;
    pinCode: string
}) => {
    return apiClient<{message: string; data: Reservation}>("/api/reservations/verify", {
        method: "POST",
        credentials: "include",
        headers: {"Content-Type": "application/json", },
        body: JSON.stringify({identificationNum, pinCode}),
    });
}

export const cancelReservation = async ({
    id,
    reason
}: {
    id: string;
    reason: string;
}) => {
    return apiClient(`/api/reservations/${id}/cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({reason})
    });
}

export const updateReservation = async (id: string, updatedData: Partial<ReservationPartial>) => {
    return apiClient<{ message: string; data: Reservation }>(`/api/reservations/${id}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
    });
}

export const createReservation = async (payload: ReservationPartial) => {
    return apiClient<{ message: string; data: Reservation }>('/api/reservations', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });
}

export const summaryReservation = async () => {
    return apiClient<{upcoming: ReservationList[], recent: ReservationList[]}>('/api/reservations/summary', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
    });
}

export const myReservations = async (): Promise<ResponseMyReservations> => {
    return apiClient('/api/reservations/my', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    })
}
