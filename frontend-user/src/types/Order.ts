export type PaymentMethod = 'COD' | 'BANK' | 'VNPAY'

export const PAYMENT_METHOD = {
    COD: 'COD' as PaymentMethod,
    BANK: 'BANK' as PaymentMethod,
    VNPAY: 'VNPAY' as PaymentMethod,
}

export interface CreateOrderRequest {
    addressId: number
    paymentMethod: PaymentMethod
    cartItemIds: number[]
}

export interface OrderResponse {
    id: number
    orderCode: string
    totalAmount: number
    status: string
    createdAt: string
    paymentMethod: PaymentMethod
}