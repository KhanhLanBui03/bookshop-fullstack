import type { OrderAdminParams, OrderAdminResponse, OrderDashboardStats, PageResponse } from "@/feature/order/order.types"
import axiosClient from "./axios"

export const orderApi = {
    getOrderDashboardStats: async (): Promise<OrderDashboardStats> => {
        const res = await axiosClient.get("/orders/admin/order-stats")
        return res.data.data
    },

    getAllOrderAdmins: async (params: OrderAdminParams): Promise<PageResponse<OrderAdminResponse>> => {
        const res = await axiosClient.get("/orders/admin/order-admin", { params })
        return res.data.data
    },

    updateOrderStatus: async (id: number, status: string): Promise<void> => {
        await axiosClient.patch(`/orders/${id}/status`, { status })
    },

    checkPurchased: async (userId: number, bookId: number): Promise<boolean> => {
        const res = await axiosClient.get("/orders/check-purchased", { params: { userId, bookId } })
        return res.data.data
    },
}
