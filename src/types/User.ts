export interface User {
    _id: string;
    name: string;
    lastName: string;
    identificationNum: string;
    email: string;
    role: "admin" | "staff" | "customer";
    status: "active" | "inactive" | "suspend";
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    totalBookings: number;
}

export interface GetUsersResponse {
    page: number;
    totalPages: number;
    totalUsers: number;
    activeUsers: number;
    staffUsers: number;
    data: User[];
}