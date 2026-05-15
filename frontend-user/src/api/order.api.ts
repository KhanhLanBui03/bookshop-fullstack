
import axiosClient from "./axios";
import type { CreateOrderRequest } from "@/types/Order";


export const orderApi = {
    createOrder(data: CreateOrderRequest) {
        return axiosClient.post("/orders", data);
    },
    cancelOrder(id: number) {
        return axiosClient.post(`/orders/${id}/cancel`);
    }
}