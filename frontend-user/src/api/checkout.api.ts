import type { CheckoutRequest } from "@/types/Checkout";
import axiosClient from "./axios";


export const checkoutApi = {
    getCheckoutInfo(data: CheckoutRequest) {
        return axiosClient.post("/checkout/prepare", data);
    }
}