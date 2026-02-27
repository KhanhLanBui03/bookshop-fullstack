export interface AddToCartRequest {
    bookId: number;
    quantity: number;
}

export interface CartItem {
    cartItemId: number;
    bookId: number;
    title: string;
    image: string | null;
    quantity: number;
    price: number;
    totalPrice: number;
}

export interface CartResponse {
    cartId: number;
    items: CartItem[];
    totalAmount: number;
    totalItems: number;
}
export interface UpdateCartItemRequest {
    bookId: number;
    quantity: number;
}