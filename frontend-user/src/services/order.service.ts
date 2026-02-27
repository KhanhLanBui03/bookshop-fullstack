import { orderApi } from "@/api/order.api";
import type { CreateOrderRequest, OrderResponse } from "@/types/Order";


export const orderService = {
    async createOrder(data: CreateOrderRequest):Promise<OrderResponse> {
        const res = await orderApi.createOrder(data);
        return res.data.data as OrderResponse;
    }
       
}