export type CommentStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ReviewUserResponse {
    id: number;
    fullName: string;
}

export interface ReviewResponse {
    id: number;
    content: string;
    rating: number | null;
    status: CommentStatus;
    createdAt: string;
    user: ReviewUserResponse;
    parentId: number | null;
    replies: ReviewResponse[];
    helpfulCount: number;
    helpful: boolean;
}

export interface PageResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
}

export interface CreateReviewRequest {
    content: string;
    rating?: number;
    bookId: number;
    parentId?: number;
}

export interface UpdateReviewRequest {
    content: string;
    rating?: number;
}

export interface UpdateReviewStatusRequest {
    status: CommentStatus;
}