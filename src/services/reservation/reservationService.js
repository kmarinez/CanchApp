import { apiClient } from "../apiClient";
export const getReservations = async ({ page = 1, filter, status, dateStart, dateEnd, }) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    if (filter)
        params.append("filter", filter);
    if (status && status !== "all")
        params.append("status", status);
    if (dateStart)
        params.append("dateStart", dateStart);
    if (dateEnd)
        params.append("dateEnd", dateEnd);
    return apiClient(`/api/reservations?${params.toString()}`, {
        method: "GET",
        credentials: "include",
    });
};
export const findReservation = async ({ identificationNum, pinCode, }) => {
    return apiClient("/api/reservations/find", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ identificationNum, pinCode }),
    });
};
export const verifyReservation = async ({ identificationNum, pinCode, }) => {
    return apiClient("/api/reservations/verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({ identificationNum, pinCode }),
    });
};
export const cancelReservation = async ({ id, reason }) => {
    return apiClient(`/api/reservations/${id}/cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reason })
    });
};
export const updateReservation = async (id, updatedData) => {
    return apiClient(`/api/reservations/${id}/edit`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
    });
};
export const createReservation = async (payload) => {
    return apiClient('/api/reservations', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });
};
export const summaryReservation = async () => {
    return apiClient('/api/reservations/summary', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });
};
export const myReservations = async () => {
    return apiClient('/api/reservations/my', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    });
};
