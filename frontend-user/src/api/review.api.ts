import type {
    CommentStatus,
    CreateReviewRequest,
    PageResponse,
    ReviewResponse,
    UpdateReviewRequest,
    UpdateReviewStatusRequest,
} from "@/types/Review";
import axiosClient from "./axios";

// unwrap response
const unwrap = (r: any) => r.data?.data ?? r.data;

export const reviewApi = {
    /** GET /api/v1/reviews/book/{bookId}?page=0&size=5 */
    getBookReviews: (bookId: number, page = 0, size = 5): Promise<PageResponse<ReviewResponse>> =>
        axiosClient
            .get(`/reviews/book/${bookId}`, { params: { page, size } })
            .then(unwrap),

    /** POST /api/v1/reviews */
    createReview: (body: CreateReviewRequest): Promise<ReviewResponse> =>
        axiosClient
            .post("/reviews", body)
            .then(unwrap),

    /** PUT /api/v1/reviews/{id} */
    updateReview: (
        reviewId: number,
        body: UpdateReviewRequest
    ): Promise<ReviewResponse> =>
        axiosClient
            .put(`/reviews/${reviewId}`, body)
            .then(unwrap),

    /** DELETE /api/v1/reviews/{id} */
    deleteReview: (reviewId: number): Promise<void> =>
        axiosClient
            .delete(`/reviews/${reviewId}`)
            .then(() => undefined),

    /** POST /api/v1/reviews/{id}/helpful */
    toggleHelpful: (reviewId: number): Promise<ReviewResponse> =>
        axiosClient
            .post(`/reviews/${reviewId}/helpful`)
            .then(unwrap),

    /** PATCH /api/v1/reviews/{id}/status (admin) */
    updateStatus: (reviewId: number, status: CommentStatus): Promise<ReviewResponse> =>
        axiosClient
            .patch(
                `/reviews/${reviewId}/status`,
                { status } satisfies UpdateReviewStatusRequest
            )
            .then(unwrap),

    /** ✅ FIX: bỏ userId */
    /** GET /api/v1/reviews/check-reviewed?bookId= */
    checkReviewed: (bookId: number): Promise<boolean> =>
        axiosClient
            .get("/reviews/check-reviewed", { params: { bookId } })
            .then((r) => Boolean(r.data?.data ?? r.data))
            .catch(() => false),

    /** (nếu backend cũng sửa JWT thì nên bỏ userId luôn) */
    /** GET /api/v1/orders/check-purchased?bookId= */
    checkPurchased: (bookId: number): Promise<boolean> =>
        axiosClient
            .get("/orders/check-purchased", { params: { bookId } })
            .then((r) => Boolean(r.data?.data ?? r.data))
            .catch(() => false),
};