import axiosClient from "./axios";

export const inventoryApi = {
    updateStock(bookId: number, amount: number, reason: string) {
        return axiosClient.post(`/admin/inventory/update-stock`, null, {
            params: { bookId, amount, reason }
        }).then(res => res.data.data);
    },
    getLogs(page = 0, size = 10) {
        return axiosClient.get(`/admin/inventory/logs`, { params: { page, size } }).then(res => res.data.data);
    },
    getLogsByBook(bookId: number, page = 0, size = 10) {
        return axiosClient.get(`/admin/inventory/logs/${bookId}`, { params: { page, size } }).then(res => res.data.data);
    }
}
