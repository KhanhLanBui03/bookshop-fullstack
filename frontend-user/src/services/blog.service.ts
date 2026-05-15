import { blogApi } from "@/api/blog.api";
import type { BlogResponse } from "@/types/Blog";

export const blogService = {
    async getPublished(page?: number, size?: number): Promise<any> {
        const res = await blogApi.getPublished(page, size);
        return res.data.data;
    },
    async getBySlug(slug: string): Promise<BlogResponse> {
        const res = await blogApi.getBySlug(slug);
        return res.data.data;
    },
    async getRelated(id: number): Promise<BlogResponse[]> {
        const res = await blogApi.getRelated(id);
        return res.data.data;
    },
    async create(data: any): Promise<BlogResponse> {
        const res = await blogApi.create(data);
        return res.data.data;
    },
    async update(id: number, data: any): Promise<BlogResponse> {
        const res = await blogApi.update(id, data);
        return res.data.data;
    },
    async delete(id: number): Promise<void> {
        await blogApi.delete(id);
    },
    async getAllAdmin(page?: number, size?: number): Promise<any> {
        const res = await blogApi.getAllAdmin(page, size);
        return res.data.data;
    }
}
