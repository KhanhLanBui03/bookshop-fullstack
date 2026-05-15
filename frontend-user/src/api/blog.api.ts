import axiosClient from "./axios";

export const blogApi = {
    getPublished(page = 0, size = 10) {
        return axiosClient.get(`/blogs`, { params: { page, size } });
    },
    getBySlug(slug: string) {
        return axiosClient.get(`/blogs/${slug}`);
    },
    getRelated(id: number) {
        return axiosClient.get(`/blogs/related/${id}`);
    },
    // Admin
    create(data: any) {
        return axiosClient.post(`/blogs`, data);
    },
    update(id: number, data: any) {
        return axiosClient.put(`/blogs/${id}`, data);
    },
    delete(id: number) {
        return axiosClient.delete(`/blogs/${id}`);
    },
    getAllAdmin(page = 0, size = 10) {
        return axiosClient.get(`/blogs/admin/all`, { params: { page, size } });
    }
}
