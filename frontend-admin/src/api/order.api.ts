import type { OrderDashboardStats } from "@/feature/order/order.types"
import axiosClient from "./axios"

export const orderApi = {
    getOrderDashboardStats : async (): Promise<OrderDashboardStats> => {
        const res = await axiosClient.get("/orders/admin/order-stats")
        return res.data.data
    }
}