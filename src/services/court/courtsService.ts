// src/services/courtsService.ts
import { apiClient } from "../apiClient";
import { Court } from "../../types/Court";

export const getCourts = async (): Promise<Court[]> => {
  return apiClient<Court[]>("/api/courts");
};

export const deleteCourt = async (id: string) => {
  return apiClient<{ message: string }>(`/api/courts/${id}`, {
    method: "DELETE",
  });
}

export const createCourt = async (newCourt: Partial<Court>) => {
  return apiClient<{ message: string; data: Court }>("/api/courts", {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify(newCourt),
  });
}

export const updateCourt = (id: string, updatedData: Partial<Court>) =>
  apiClient<{ message: string; data: Court }>(`/api/courts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  });

export const availableCourts = (date: string, timeRange: string, type: string) => {
  return apiClient<{ message: string; data: Court[] }>(`/api/courts/available?date=${date}&timeRange=${timeRange}&type=${type}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", }
  })
}

export const unavailableDates = async (courtId: string): Promise<{ message: string; data: string[] }> => {
  return apiClient(`/api/courts/${courtId}/unavailable-dates`, {
    method: "GET",
    headers: { "Content-Type": "application/json", }
  });
}

export const occupiedTimes = async (courtId: string, date: string): Promise<{ message: string; data: string[] }> => {
  return apiClient(`/api/courts/${courtId}/occupied-times?date=${date}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", }
  })
}