export class PackageRequest {
    user_id: string;
    name: string;
    propertyType: string;
    no_of_ac: string;
    left: string;
    price: string;
    duration: string;
    area: string;
    services: Array<string>;
    num_ac: string;
}

export class Package {
    _id: string;
    order_id: string;
    left: string;
    user_id: string;
    property_type: string;
    verification_address: string;
    verification_date: string;
    verification_time: string;
    services: Array<string>;
    duration: string;
    price: string;
    status: string;
    area: string;
    scheduled_verify: string;
}

export class HomeMOPackage {
    email: String;
    number: String;
    name: String;
    location: String;
    message: string;
}

export class CorporatePackage {
    name: String;
    email: String;
    number: String;
    org_name: String;
    location: String;
    message: string;
}

export class Partner {
    email: String;
    number: String;
    name: String;
    location: String;
    message: string;
}