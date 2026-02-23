import { bookApi } from "@/api/book.api"
import type { BookCard, BookDetail, PageResponse } from "@/types/Book"

export const bookService = {
    async getBooks(): Promise<BookCard[]> {
        const res = await bookApi.getAll()

        const items = res.data.data  
        return items.map((item: any): BookCard => ({
            id: item.id,
            title: item.title,
            salePrice: Number(item.salePrice),
            originalPrice: item.originalPrice
                ? Number(item.originalPrice)
                : undefined,
            rating: Number(item.rating ?? 0),
            soldCount: item.soldCount,
            image: item.image,
            authorName: item.authorName,
        }))
    },
    // async getListBooks(page: number): Promise<BookCard[]> {
    //     const res = await bookApi.getListBook(page, 12)

    //     const items = res.data.data.content
    //     return items.map((item: any): BookCard => ({
    //         id: item.id,
    //         title: item.title,
    //         salePrice: Number(item.salePrice),
    //         originalPrice: item.originalPrice
    //             ? Number(item.originalPrice)
    //             : undefined,
    //         rating: Number(item.rating ?? 0),
    //         soldCount: item.soldCount,
    //         image: item.image,
    //         authorName: item.authorName,
    //     }))
    // },
    // async getListBooks(page: number): Promise<PageResponse<BookCard>> {
    //     const res = await bookApi.getListBook(page, 12)
    //     const pageData = res.data.data

    //     return {
    //         content: pageData.content.map((item: any): BookCard => ({
    //             id: item.id,
    //             title: item.title,
    //             salePrice: Number(item.salePrice),
    //             originalPrice: item.originalPrice
    //                 ? Number(item.originalPrice)
    //                 : undefined,
    //             rating: Number(item.rating ?? 0),
    //             soldCount: item.soldCount,
    //             image: item.image,
    //             authorName: item.authorName,
    //         })),
    //         totalPages: pageData.totalPages,
    //         totalElements: pageData.totalElements,
    //         number: pageData.number,
    //         size: pageData.size,
    //     }
    // },
    async getListBooks(params: {
        page: number
        size: number
        search?: string
        genre?: string
        minPrice?: number
        maxPrice?: number
        minRating?: number
        sort?: string
    }): Promise<PageResponse<BookCard>> {

        const res = await bookApi.getListBook({
            page: params.page,
            size: params.size,
            keyword: params.search,
            category: params.genre,
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
            minRating: params.minRating,
            sort: params.sort
        })

        const pageData = res.data.data

        return {
            content: pageData.content.map((item: any): BookCard => ({
                id: item.id,
                title: item.title,
                salePrice: Number(item.salePrice),
                originalPrice: item.originalPrice
                    ? Number(item.originalPrice)
                    : undefined,
                rating: Number(item.rating ?? 0),
                soldCount: item.soldCount,
                image: item.image,
                authorName: item.authorName,
            })),
            totalPages: pageData.totalPages,
            totalElements: pageData.totalElements,
            number: pageData.number,
            size: pageData.size,
        }
    },
    async getTopBooksBestSeller(): Promise<BookCard[]> {
        const res = await bookApi.getTopBooksBestSeller()
        const items = res.data.data
        return items.map((item: any): BookCard => ({
            id: item.id,
            title: item.title,
            salePrice: Number(item.salePrice),
            originalPrice: item.originalPrice
                ? Number(item.originalPrice)
                : undefined,
            rating: Number(item.rating ?? 0),
            soldCount: item.soldCount,
            image: item.image,
            authorName: item.authorName,
        }))
    },

    async getBookById(id: number): Promise<BookDetail> {
        const res = await bookApi.getById(id)
        const item = res.data.data   // 👈 unwrap
        return {
            id: item.id,
            title: item.title,
            description: item.description,
            originalPrice: Number(item.originalPrice),
            salePrice: Number(item.salePrice),
            rating: Number(item.rating ?? 0),
            stock: item.stock,
            soldCount: item.soldCount,
            categoryName: item.categoryName,
            authorName: item.authorName,
            publisher: item.publisher,
            images: item.images,
            createdAt: item.createdAt,
        }
    },
    async getRelatedBooks(id: number): Promise<BookCard[]> {
        const res = await bookApi.getRelatedBooks(id)

        const items = res.data.data

        return items.map((item: any): BookCard => ({
            id: item.id,
            title: item.title,
            salePrice: Number(item.salePrice),
            originalPrice: item.originalPrice
                ? Number(item.originalPrice)
                : undefined,
            rating: Number(item.rating ?? 0),
            soldCount: item.soldCount,
            image: item.image,
            authorName: item.authorName,
        }))
    }

}
