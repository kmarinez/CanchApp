import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUser } from "../../services/user/userService";

export const USER_QUERY_KEY = ["user"];

export function useUsers(page: number){
    return useQuery({
        queryKey: [...USER_QUERY_KEY, page],
        queryFn: () => getUsers(page)
    });
}

export function useUpdateUser(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: USER_QUERY_KEY, exact: false});
        }
    })
}