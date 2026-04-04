export interface CategoryResponse {
    id: number
    name: string
    description: string | null
    url: string | null          // image URL
    bookCount: number
}

export interface CategoryForm {
    name: string
    description: string
    url: string                 // preview URL or base64 for new upload
}

export interface CategoryStats {
    totalCategories: number
    totalBooks: number
    avgBooksPerCategory: number
    emptyCategories: number
}