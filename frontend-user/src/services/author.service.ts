import { authorApi } from "@/api/author.api"
import type { AuthorDetailResponse, AuthorResponse } from "@/types/Author"
import type { ApiResponse } from "@/types/Blog" // Reusing ApiResponse if similar

export const authorService = {
    async getBooksByAuthor(id: number): Promise<AuthorDetailResponse> {
        const res = await authorApi.getAuthorOfBook(id)
        return res.data.data
    },
    async getAllAuthor(): Promise<AuthorResponse[]> {
        const res = await authorApi.getAllAuthor()
        return res.data.data
    },
    async getFeatured(): Promise<AuthorResponse[]> {
        const res = await authorApi.getFeatured()
        return res.data.data
    }
}