import axiosClient from "./axios"

export const authorApi = {
    getAllAuthor() {
        return axiosClient.get("/authors")
    },
    getAuthorOfBook(id: number) {
        return axiosClient.get(`/authors/detail-author/${id}`)
    },
    getFeatured() {
        return axiosClient.get("/authors/featured")
    }
}