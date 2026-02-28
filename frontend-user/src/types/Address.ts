export interface AddressResponse {
    id: number;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}
export interface CreateAddressRequest {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}