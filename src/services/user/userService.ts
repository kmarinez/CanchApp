import { GetUsersResponse, User } from "../../types/User";
import { apiClient } from "../apiClient";

export const getUsers = async (page = 1): Promise<GetUsersResponse> => {
    return apiClient(`/api/user?page=${page}`, {
        method: "GET",
        credentials: "include",
    });
};

export const updateUser = async ({id, data} : {id: string, data: Partial<User>}) => {
    return apiClient<{message: string; data: User}>(`/api/user/${id}/update`, {
        method: "PUT",
        credentials: "include",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
};