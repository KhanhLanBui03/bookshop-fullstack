import type {
    CommentStatus,
    CreateReviewRequest,
    PageResponse,
    ReviewResponse,
    UpdateReviewRequest,
    UpdateReviewStatusRequest,
} from "@/types/Review";
import axiosClient from "./axios";

// Helper: backend có thể wrap { code, message, data: T } hoặc trả thẳng T
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unwrap = (r: any) => r.data?.data ?? r.data;

export const reviewApi = {
    /** GET /reviews/book/{bookId}?page=0&size=5 */
    getBookReviews: (bookId: number, page = 0, size = 5): Promise<PageResponse<ReviewResponse>> =>
        axiosClient
            .get(`/reviews/book/${bookId}`, { params: { page, size } })
            .then(unwrap),

    /** POST /reviews */
    createReview: (userId: number, body: CreateReviewRequest): Promise<ReviewResponse> =>
        axiosClient
            .post("/reviews", body, { headers: { "X-User-Id": userId } })
            .then(unwrap),

    /** PUT /reviews/{id} */
    updateReview: (
        userId: number,
        reviewId: number,
        body: UpdateReviewRequest
    ): Promise<ReviewResponse> =>
        axiosClient
            .put(`/reviews/${reviewId}`, body, { headers: { "X-User-Id": userId } })
            .then(unwrap),

    /** DELETE /reviews/{id} */
    deleteReview: (userId: number, reviewId: number): Promise<void> =>
        axiosClient
            .delete(`/reviews/${reviewId}`, { headers: { "X-User-Id": userId } })
            .then(() => undefined),

    /** POST /reviews/{id}/helpful */
    toggleHelpful: (userId: number, reviewId: number): Promise<ReviewResponse> =>
        axiosClient
            .post(`/reviews/${reviewId}/helpful`, null, { headers: { "X-User-Id": userId } })
            .then(unwrap),

    /** PATCH /reviews/{id}/status (admin) */
    updateStatus: (reviewId: number, status: CommentStatus): Promise<ReviewResponse> =>
        axiosClient
            .patch(
                `/reviews/${reviewId}/status`,
                { status } satisfies UpdateReviewStatusRequest
            )
            .then(unwrap),

    /** GET /reviews/check-reviewed?userId=&bookId= */
    checkReviewed: (userId: number, bookId: number): Promise<boolean> =>
        axiosClient
            .get("/reviews/check-reviewed", { params: { userId, bookId } })
            .then((r) => {
                // Trả về boolean trực tiếp hoặc wrapped
                const val = r.data?.data ?? r.data;
                return Boolean(val);
            })
            .catch(() => false), // nếu endpoint chưa có thì mặc định false

    /** GET /orders/check-purchased?userId=&bookId= */
    checkPurchased: (userId: number, bookId: number): Promise<boolean> =>
        axiosClient
            .get("/orders/check-purchased", { params: { userId, bookId } })
            .then((r) => {
                const val = r.data?.data ?? r.data;
                return Boolean(val);
            })
            .catch(() => false), // nếu endpoint chưa có thì mặc định false
};