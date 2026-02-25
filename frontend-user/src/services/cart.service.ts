import { cartApi } from "@/api/cart.api"
import type { AddToCartRequest, CartResponse, UpdateCartItemRequest } from "@/types/Cart"



export const cartService = {
    async addToCart(data: AddToCartRequest): Promise<CartResponse> {
        const res = await cartApi.addToCart(data)
        return res.data.data
    },
    async getCart(): Promise<CartResponse> {
        const res = await cartApi.getCarts()
        return res.data.data
    },
    async updateCartItem(data: UpdateCartItemRequest): Promise<CartResponse> {
        const res = await cartApi.updateCartItem(data)
        return res.data.data
    },
    async removeCartItem(cartItemId: number): Promise<CartResponse> {
        const res = await cartApi.removeCartItem(cartItemId)
        return res.data.data
    }


  

}
