import axiosClient from "./axios"

export const bookApi = {
    getAll() {
        return axiosClient.get("/books")
    },

    getById(id: number) {
        return axiosClient.get(`/books/${id}`)
    },
    getTopBooksBestSeller() {
        return axiosClient.get("/books/top-best-seller")
    }
}
