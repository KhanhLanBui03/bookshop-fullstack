import type { CustomerAdminParams, UserAdminResponse, UserDashboardStats } from "@/feature/customer/customer.type"
import axiosClient from "./axios"

export interface PageResponse<T> {
    content: T[]
    totalElements: number
    totalPages: number
    number: number
    size: number
}

export const customerApi = {
    getDashboardStats: async (): Promise<UserDashboardStats> => {
        const res = await axiosClient.get("/users/admin/user-stats")
        return res.data.data
    },

    getAllAdminUsers: async (params: CustomerAdminParams): Promise<PageResponse<UserAdminResponse>> => {
        const res = await axiosClient.get("/users/admin/user-admin", { params })
        return res.data.data
    },
}