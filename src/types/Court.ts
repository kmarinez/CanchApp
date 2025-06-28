export interface Court {
    _id: string;
    courtName: string;
    type: string;
    location: string;
    indoorOrOutdoor: string;
    playerCapacity: number;
    hourStartTime: string;
    hourEndTime: string;
    status: string;
    hasLight: boolean;
    description: string;
    operatingDays: string[];
    isDeleted: boolean;
    createdAt?: string;
    updatedAt?: string;
}