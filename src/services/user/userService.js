import { apiClient } from "../apiClient";
export const getUsers = async (page = 1) => {
    return apiClient(`/api/user?page=${page}`, {
        method: "GET",
        credentials: "include",
    });
};
export const updateUser = async ({ id, data }) => {
    return apiClient(`/api/user/${id}/update`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
};
