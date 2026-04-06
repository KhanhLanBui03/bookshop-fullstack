export type CommentStatus = "PENDING" | "APPROVED" | "REJECTED"

export interface ReviewUserResponse {
    id: number
    fullName: string
}

export interface ReviewResponse {
    id: number
    content: string
    rating: number | null       // null for replies
    status: CommentStatus
    createdAt: string           // "dd/MM/yyyy" from backend
    user: ReviewUserResponse
    parentId: number | null
    replies: ReviewResponse[]
    helpfulCount: number
    helpful: boolean            // whether current user marked helpful
}

/* ── Requests ── */
export interface CreateReviewRequest {
    bookId: number
    content: string
    rating?: number             // required for root reviews, omitted for replies
    parentId?: number           // set to create a reply
}

export interface UpdateReviewRequest {
    content: string
    rating?: number
}

export interface UpdateReviewStatusRequest {
    status: CommentStatus
}

/* ── Pagination wrapper ── */
export interface PageResponse<T> {
    content: T[]
    page: number
    size: number
    totalElements: number
    totalPages: number
    last: boolean
}