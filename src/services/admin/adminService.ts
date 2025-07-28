import { Dashboard } from "../../types/Dashboard"
import { apiClient } from "../apiClient"

export const dashboard = async (): Promise<Dashboard> => {
    return apiClient('/api/admin/dashboard', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include"
    })
}
