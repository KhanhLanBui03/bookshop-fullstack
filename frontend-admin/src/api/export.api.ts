import axiosClient from "./axios";

export const exportApi = {
    async exportOrders() {
        const response = await axiosClient.get(`/admin/export/orders`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'orders.xlsx');
        document.body.appendChild(link);
        link.click();
    },
    async exportInventory() {
        const response = await axiosClient.get(`/admin/export/inventory`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'inventory.xlsx');
        document.body.appendChild(link);
        link.click();
    }
}
