import axiosClient from "./axios";

export const blogApi = {
    getAll(page = 0, size = 10) {
        return axiosClient.get(`/blogs/admin/all`, { params: { page, size } }).then(res => res.data.data);
    },
    create(data: any) {
        return axiosClient.post(`/blogs`, data).then(res => res.data.data);
    },
    update(id: number, data: any) {
        return axiosClient.put(`/blogs/${id}`, data).then(res => res.data.data);
    },
    delete(id: number) {
        return axiosClient.delete(`/blogs/${id}`).then(res => res.data.data);
    }
}
