import type { AddressResponse } from "./Address";
import type { OrderResponse } from "./Order";

export interface ProfileResponse{
    id: number;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
    addresses: AddressResponse[];
    orders: OrderResponse[];
}