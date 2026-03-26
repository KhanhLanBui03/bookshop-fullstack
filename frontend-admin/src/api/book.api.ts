import type { BookAdminResponse, BookDashboardStats, BookStatus } from "@/feature/book/book.type";
import axiosClient from "./axios";

export interface GetAdminBooksParams {
    keyword?: string;
    status?: BookStatus | "ALL";
    categoryId?: number | "ALL";
    page?: number;       // 0-indexed (Spring)
    size?: number;
    sortBy?: string;
    sortDir?: "asc" | "desc";
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;  // current page (0-indexed)
    size: number;
    first: boolean;
    last: boolean;
}

export const bookApi = {
    getBookDashboardStats: async (): Promise<BookDashboardStats> => {
        const response = await axiosClient.get("/books/admin/stats");
        return response.data.data;
    },

    getAdminBooks: async (
        params: GetAdminBooksParams
    ): Promise<PageResponse<BookAdminResponse>> => {
        const query: Record<string, unknown> = {
            page: params.page ?? 0,
            size: params.size ?? 10,
        };
        if (params.keyword) query.keyword = params.keyword;
        if (params.status && params.status !== "ALL") query.status = params.status;
        if (params.categoryId && params.categoryId !== "ALL") query.categoryId = params.categoryId;
        if (params.sortBy) query.sortBy = params.sortBy;
        if (params.sortDir) query.sortDir = params.sortDir;

        const response = await axiosClient.get("/books/admin/book-admin", { params: query });
        return response.data.data;
    },
};