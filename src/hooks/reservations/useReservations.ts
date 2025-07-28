import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancelReservation, createReservation, findReservation, getReservations, myReservations, summaryReservation, updateReservation, verifyReservation } from "../../services/reservation/reservationService";
import { ReservationPartial } from "../../types/Reservations";

export const RESERVATION_QUERY_KEY = ["reservations"];

export function useReservations(params: {
    page: number;
    filter?: string;
    status?: string;
    dateStart?: string;
    dateEnd?: string;
}) {
    return useQuery({
        queryKey: [...RESERVATION_QUERY_KEY, params],
        queryFn: () => getReservations(params)
    });
}

export function useFindReservation() {
    return useMutation({
        mutationFn: ({
            identificationNum,
            pinCode
        }: {
            identificationNum: string;
            pinCode: string;
        }) => findReservation({ identificationNum, pinCode }),
        onError: (error) => {
            console.error("Error consultado la reserva", error)
        }
    })
}

export function useVerifyReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            identificationNum,
            pinCode
        }: {
            identificationNum: string;
            pinCode: string
        }) => verifyReservation({ identificationNum, pinCode }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RESERVATION_QUERY_KEY });
        },
    });
}

export function useCancelReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            reason
        }: {
            id: string;
            reason: string;
        }) => cancelReservation({ id, reason }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RESERVATION_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: ["myReservations"] }); 
        },
        onError: (error) => {
            console.log("Error tratando de cancelar", error)
        }
    });
}

export function useUpdateReservation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<ReservationPartial> }) =>
            updateReservation(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RESERVATION_QUERY_KEY });
        },
        onError: (error) => {
            console.log("Error tratando de actualizar", error)
        }
    });
}

export function useCreateReservation() {
    return useMutation({
        mutationFn: ({ data }: { data: ReservationPartial }) => createReservation(data),
        onError: (error) => {
            console.log("Error tratando de crear", error)
        }
    })
}

export function useSummaryReservation() {
    return useQuery({
        queryKey: ["reservation-summary"],
        queryFn: summaryReservation,
    });
}

export function useMyReservations(){
    return useQuery({
        queryKey: ["myReservations"],
        queryFn: myReservations,
    })
}