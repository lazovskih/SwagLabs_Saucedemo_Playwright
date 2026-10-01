export interface Product {
    Id: string;
    Name: string;
    Description: string;
    Price: number;
    imageUrl: string;
}

export interface ShippingData {
    FirstName: string;
    LastName: string;
    PostalCode: string;
}