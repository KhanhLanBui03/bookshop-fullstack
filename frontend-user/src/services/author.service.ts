import { authorApi } from "@/api/author.api"
import type { AuthorDetailResponse, AuthorResponse } from "@/types/Author"

export const authorService = {
    async getBooksByAuthor(id: number): Promise<AuthorDetailResponse> {
        const res = await authorApi.getAuthorOfBook(id)
        return res.data
    },
    async getAllAuthor():Promise<AuthorResponse>{
        const res = await authorApi.getAllAuthor()
        return res.data
    }
}