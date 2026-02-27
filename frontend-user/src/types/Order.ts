

export interface OrderResponse {
    id: number;
    paymentMethod: PaymentMethod;
    totalAmount: number;
    orderCode: string;
    createdAt: string;
}
export interface CreateOrderRequest{
    addressId: number;
    paymentMethod: PaymentMethod;
    cartItemIds: number[];

}
export const PAYMENT_METHOD = {
    COD: "COD",
    BANK: "BANK",
} as const;

export type PaymentMethod =
    typeof PAYMENT_METHOD[keyof typeof PAYMENT_METHOD];