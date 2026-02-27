import type { AddressResponse } from "./Address";


export interface CheckoutRequest {
    cartItemIds: number[];
}

export interface CheckoutResponse {
    customerName: string;
    customerEmail: string;
    customerPhone: string|null;
    customerAddresses: AddressResponse[];
    items: CheckoutItemResponse[];
    totalAmount: number;
}

export interface CheckoutItemResponse {
    bookId: number;
    bookName: string;
    image: string;
    price: number;
    quantity: number;
    subtotal: number;
}