import type { BookAdminResponse, BookDashboardStats, BookStatus, GetAdminBooksParams, PageResponse } from "@/feature/book/book.type";
import axiosClient from "./axios";



export const bookApi = {
    getBookDashboardStats: async (): Promise<BookDashboardStats> => {
        const res = await axiosClient.get("/books/admin/stats")
        return res.data.data
    },

    getAdminBooks: async (
        params: GetAdminBooksParams
    ): Promise<PageResponse<BookAdminResponse>> => {
        const query: Record<string, unknown> = {
            page: params.page ?? 0,
            size: params.size ?? 10,
        }
        if (params.keyword) query.keyword = params.keyword
        if (params.status && params.status !== "ALL") query.status = params.status
        if (params.categoryId && params.categoryId !== "ALL") query.categoryId = params.categoryId
        if (params.sortBy) query.sortBy = params.sortBy
        if (params.sortDir) query.sortDir = params.sortDir

        const res = await axiosClient.get("/books/admin/book-admin", { params: query })
        return res.data.data
    },

    createBook: async (payload: BookRequestPayload) => {
        const res = await axiosClient.post("/books", payload)
        return res.data.data
    },

    updateBook: async (id: number, payload: BookRequestPayload) => {
        const res = await axiosClient.put(`/books/${id}`, payload)
        return res.data.data
    },

    deleteBook: async (id: number) => {
        await axiosClient.delete(`/books/${id}`)
    },
}