import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelReservation, createReservation, findReservation, getReservations, myReservations, summaryReservation, updateReservation, verifyReservation } from "../../services/reservation/reservationService";
export const RESERVATION_QUERY_KEY = ["reservations"];
export function useReservations(params) {
    return useQuery({
        queryKey: [...RESERVATION_QUERY_KEY, params],
        queryFn: () => getReservations(params)
    });
}
export function useFindReservation() {
    return useMutation({
        mutationFn: ({ identificationNum, pinCode }) => findReservation({ identificationNum, pinCode }),
        onError: (error) => {
            console.error("Error consultado la reserva", error);
        }
    });
}
export function useVerifyReservation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ identificationNum, pinCode }) => verifyReservation({ identificationNum, pinCode }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RESERVATION_QUERY_KEY });
        },
    });
}
export function useCancelReservation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, reason }) => cancelReservation({ id, reason }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RESERVATION_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ["myReservations"] });
        },
        onError: (error) => {
            console.log("Error tratando de cancelar", error);
        }
    });
}
export function useUpdateReservation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateReservation(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RESERVATION_QUERY_KEY });
        },
        onError: (error) => {
            console.log("Error tratando de actualizar", error);
        }
    });
}
export function useCreateReservation() {
    return useMutation({
        mutationFn: ({ data }) => createReservation(data),
        onError: (error) => {
            console.log("Error tratando de crear", error);
        }
    });
}
export function useSummaryReservation() {
    return useQuery({
        queryKey: ["reservation-summary"],
        queryFn: summaryReservation,
    });
}
export function useMyReservations() {
    return useQuery({
        queryKey: ["myReservations"],
        queryFn: myReservations,
    });
}
