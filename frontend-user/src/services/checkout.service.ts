import { checkoutApi } from "@/api/checkout.api";
import type { CheckoutRequest, CheckoutResponse } from "@/types/Checkout";


export const checkoutService = {
    async getCheckoutInfo(data: CheckoutRequest) {
        const res = await checkoutApi.getCheckoutInfo(data);
        return res.data.data as CheckoutResponse;
    }
       
}