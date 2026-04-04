import axiosClient from "./axios"
import type { CategoryForm, CategoryResponse, CategoryStats } from "@/feature/category/category.type"

export const categoryApi = {
    getAll: async (): Promise<CategoryResponse[]> => {
        const res = await axiosClient.get("/categories")
        return res.data.data
    },

    getStats: async (): Promise<CategoryStats> => {
        const res = await axiosClient.get("/categories/stats")
        return res.data.data
    },

    create: async (form: CategoryForm): Promise<CategoryResponse> => {
        const res = await axiosClient.post("/categories", form)
        return res.data.data
    },

    update: async (id: number, form: Partial<CategoryForm>): Promise<CategoryResponse> => {
        const res = await axiosClient.put(`/categories/${id}`, form)
        return res.data.data
    },

    delete: async (id: number): Promise<void> => {
        await axiosClient.delete(`/categories/${id}`)
    },
}