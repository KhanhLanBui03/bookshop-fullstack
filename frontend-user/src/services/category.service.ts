import { categoryApi } from "@/api/category.api"
import type { CategoryCard } from "@/types/Category"

export const categoryService = {
    async getCategories(): Promise<CategoryCard[]> {
            const res = await  categoryApi.getAll()
            const items = res.data.data 
            return items.map((item: any): CategoryCard => ({
                id: item.id,
                name: item.name,
                description: item.description,
                url: item.url,
            }))
        },
}