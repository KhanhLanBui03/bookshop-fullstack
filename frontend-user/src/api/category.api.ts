import axiosClient from "./axios"

export const categoryApi = {
    getAll() {
        return axiosClient.get("/categories")
    },
}
