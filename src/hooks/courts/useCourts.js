// hooks/courts/useCourts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourts, deleteCourt, createCourt, updateCourt, availableCourts, unavailableDates, occupiedTimes } from "../../services/court/courtsService";
export const COURTS_QUERY_KEY = ['courts'];
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
        mutationFn: ({ id, data }) => updateCourt(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COURTS_QUERY_KEY });
        },
    });
}
export function useAvailableCourts(date, timeRange, type) {
    return useQuery({
        queryKey: ['availableCourts', date, timeRange, type],
        queryFn: () => availableCourts(date, timeRange, type),
        enabled: !!date && !!timeRange && !!type,
    });
}
export function useUnavailableDates(courtId) {
    return useQuery({
        queryKey: ['unavailableDates', courtId],
        queryFn: () => unavailableDates(courtId),
        enabled: !!courtId
    });
}
export function useOccupiedTimes(courtId, date) {
    return useQuery({
        queryKey: ['occupiedTimes', courtId, date],
        queryFn: () => occupiedTimes(courtId, date),
        enabled: !!courtId && !!date
    });
}
