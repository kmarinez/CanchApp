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