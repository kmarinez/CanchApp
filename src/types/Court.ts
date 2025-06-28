export interface Court {
    _id: string
    courtName: string
    type: string
    location: string
    indoorOrOutdoor: "techado" | "destechado"
    playerCapacity: number
    hourStartTime: string;
    hourEndTime: string;
    status: "activo" | "mantenimiento";
    hasLight: boolean
    description: string
    operatingDays: string[]
    isDeleted: boolean;
}