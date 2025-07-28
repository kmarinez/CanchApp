// src/services/courtsService.ts
import { apiClient } from "../apiClient";
export const getCourts = async () => {
    return apiClient("/api/courts");
};
export const deleteCourt = async (id) => {
    return apiClient(`/api/courts/${id}`, {
        method: "DELETE",
    });
};
export const createCourt = async (newCourt) => {
    return apiClient("/api/courts", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(newCourt),
    });
};
export const updateCourt = (id, updatedData) => apiClient(`/api/courts/${id}`, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
});
export const availableCourts = (date, timeRange, type) => {
    return apiClient(`/api/courts/available?date=${date}&timeRange=${timeRange}&type=${type}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", }
    });
};
export const unavailableDates = async (courtId) => {
    return apiClient(`/api/courts/${courtId}/unavailable-dates`, {
        method: "GET",
        headers: { "Content-Type": "application/json", }
    });
};
export const occupiedTimes = async (courtId, date) => {
    return apiClient(`/api/courts/${courtId}/occupied-times?date=${date}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", }
    });
};
