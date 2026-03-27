
export interface BookDashboardStats {
    totalBooks: number;
    countActive: number;
    countLowStock: number;
    countOutOfStock: number;
}

export interface BookAdminResponse{
    id: number;
    title: string;
    publisher: string;
    author: string;
    images: string;
    category: string;
    salePrice: number;
    stock: number;
    soldCount: number;
    rating: number;
    status: BookStatus;
}
export enum BookStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    OUT_OF_STOCK = "OUT_OF_STOCK"
}
export interface GetAdminBooksParams {
    keyword?: string;
    status?: BookStatus | "ALL";
    categoryId?: number | "ALL";
    page?: number;       // 0-indexed (Spring)
    size?: number;
    sortBy?: string;
    sortDir?: "asc" | "desc";
}

export interface BookRequestPayload {
    title: string
    originalPrice?: number | null
    salePrice: number
    description?: string
    rating?: number
    stock: number
    categoryId: number
    authorId: number
    publisherId: number
    images: { name: string; url: string }[]
}
export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;  // current page (0-indexed)
    size: number;
    first: boolean;
    last: boolean;
}
export interface ImagePreview {
    id: string
    url: string
    name: string
    size: number
}
export interface BookForm {
    title: string
    originalPrice: string
    salePrice: string
    description: string
    status: BookStatus
    stock: string
    categoryId: string
    authorId: string
    publisherId: string
    images: ImagePreview[]
}

    
