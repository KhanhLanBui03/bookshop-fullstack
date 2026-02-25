import type { AddToCartRequest, CartResponse } from "@/types/Cart"
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
}