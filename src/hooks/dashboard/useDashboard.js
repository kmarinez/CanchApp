import { useQuery } from "@tanstack/react-query";
import { dashboard } from "../../services/admin/adminService";
export const DASHBOARD_QUERY_KEY = ["dashboard"];
export function useDashboard() {
    return useQuery({
        queryKey: [DASHBOARD_QUERY_KEY],
        queryFn: () => dashboard(),
    });
}
