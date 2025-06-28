// hooks/courts/useCourts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourts, deleteCourt, createCourt, updateCourt } from "../../services/court/courtsService";
import { Court } from "../../types/Court";

export const COURTS_QUERY_KEY = ['courts'] as const;

export function useCourts() {
    return useQuery({
        queryKey: COURTS_QUERY_KEY,
        queryFn: getCourts,
    });
}

export function useDeleteCourt() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCourt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COURTS_QUERY_KEY });
        },
    });
}

export function useCreateCourt() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCourt,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COURTS_QUERY_KEY });
        }
    });
}

export function useUpdateCourt() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Court> }) =>
            updateCourt(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COURTS_QUERY_KEY });
        },
    });
}
