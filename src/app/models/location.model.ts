export class Location {
    _id: string;
    city_name: string;
    state_name: string;
    enabled: boolean;
}

export interface GeoLocation {
    latitude: string;
    longitude: string;
    address: string;
    pincode: number;
    city: string;
}

