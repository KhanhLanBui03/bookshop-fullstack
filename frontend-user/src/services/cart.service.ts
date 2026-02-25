import { cartApi } from "@/api/cart.api"
import type { AddToCartRequest, CartResponse } from "@/types/Cart"



export const cartService = {
    async addToCart(data: AddToCartRequest): Promise<CartResponse> {
        const res = await cartApi.addToCart(data)
        return res.data.data
    },
    async getCart(): Promise<CartResponse> {
        const res = await cartApi.getCarts()
        return res.data.data
    }

  

}
