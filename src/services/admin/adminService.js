import { apiClient } from "../apiClient";
export const dashboard = async () => {
    return apiClient('/api/admin/dashboard', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    });
};
