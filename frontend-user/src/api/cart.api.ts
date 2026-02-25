import type { AddToCartRequest, CartResponse, UpdateCartItemRequest } from "@/types/Cart"
import axiosClient from "./axios"
import type { AxiosResponse } from "axios"
export const cartApi = {
    getCarts(): Promise<AxiosResponse<CartResponse>> {
        return axiosClient.get("/carts")
    },
    addToCart(
        data: AddToCartRequest
    ): Promise<AxiosResponse<CartResponse>> {
        return axiosClient.post("/carts", data)
    },
    updateCartItem(
        data: UpdateCartItemRequest
    ): Promise<AxiosResponse<CartResponse>> {
        return axiosClient.put("/carts/update", data)
    },
    removeCartItem(cartItemId: number): Promise<AxiosResponse<CartResponse>> {
        return axiosClient.delete(`/carts/${cartItemId}`)
    }

}