import { useState, useEffect, useCallback } from "react"
import { reviewApi } from "@/api/review.api"
import { useAuth } from "@/contexts/AuthContext"
import type { ReviewResponse } from "@/types/Review"
import RatingSummary from "./Ratingsummary"
import CreateReviewForm from "./Createreviewform"
import ReviewCard from "../BookDetail/ReviewCard"


interface Props {
    bookId: number
    bookRating: number
}

export default function ReviewSection({ bookId, bookRating }: Props) {
    const { user, loading: authLoading } = useAuth()

    const [reviews, setReviews] = useState<ReviewResponse[]>([])
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [totalElements, setTotalElements] = useState(0)
    const [loading, setLoading] = useState(true)
    const [hasPurchased, setHasPurchased] = useState(false)
    const [hasReviewed, setHasReviewed] = useState(false)

    /* ── Fetch reviews ── */
    const fetchReviews = useCallback(async (p = 0) => {
        setLoading(true)
        try {
            const data = await reviewApi.getBookReviews(bookId, p, 5)
            setReviews(data.content ?? [])
            setTotalPages(data.totalPages ?? 1)
            setTotalElements(data.totalElements ?? 0)
            setPage(p)
        } catch (e) {
            console.error("Lỗi tải reviews:", e)
        } finally {
            setLoading(false)
        }
    }, [bookId])

    useEffect(() => { fetchReviews(0) }, [fetchReviews])

    /* ── Check purchased / reviewed ── */
    useEffect(() => {
        if (authLoading || !user) return

        reviewApi.checkPurchased( bookId)
            .then(setHasPurchased)
            .catch(() => setHasPurchased(false))

        reviewApi.checkReviewed( bookId)
            .then(setHasReviewed)
            .catch(() => setHasReviewed(false))
    }, [user, authLoading, bookId])

    /* ── Handlers ── */
    const handleCreated = (newReview: ReviewResponse) => {
        setReviews(prev => [newReview, ...prev])
        setTotalElements(n => n + 1)
        setHasReviewed(true)
    }

    const handleToggleHelpful = async (reviewId: number) => {
        if (!user) return
        try {
            const updated = await reviewApi.toggleHelpful(reviewId)
            setReviews(prev => prev.map(r =>
                r.id === reviewId
                    ? { ...r, helpful: updated.helpful, helpfulCount: updated.helpfulCount }
                    : r
            ))
        } catch (e) {
            console.error("Lỗi toggle helpful:", e)
        }
    }

    const handleDelete = async (reviewId: number) => {
        if (!user) return
        try {
            await reviewApi.deleteReview(reviewId)
            setReviews(prev => prev.filter(r => r.id !== reviewId))
            setTotalElements(n => n - 1)
            setHasReviewed(false)
        } catch (e) {
            console.error("Lỗi xoá review:", e)
        }
    }

    const handleReply = async (parentId: number, content: string) => {
        if (!user) return
        try {
            const reply = await reviewApi.createReview({ bookId, content, parentId })
            setReviews(prev => prev.map(r =>
                r.id === parentId
                    ? { ...r, replies: [...(r.replies ?? []), reply] }
                    : r
            ))
        } catch (e) {
            console.error("Lỗi gửi reply:", e)
        }
    }

    /* ── Loading auth ── */
    if (authLoading) {
        return (
            <div className="text-sm text-gray-400 py-8 text-center">Đang tải...</div>
        )
    }

    return (
        <div className="max-w-2xl">
            <h2 className="text-lg font-semibold mb-5">Đánh giá &amp; Nhận xét</h2>

            <RatingSummary rating={bookRating} totalReviews={totalElements} />

            {/* ── Write review / login prompt ── */}
            {user ? (
                <CreateReviewForm
                    bookId={bookId}
                    userId={user.userId}
                    hasPurchased={hasPurchased}
                    hasReviewed={hasReviewed}
                    onCreated={handleCreated}
                />
            ) : (
                <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3 mb-6">
                    <a href="/login" className="text-blue-600 hover:underline">Đăng nhập</a>{" "}
                    để đánh giá sách.
                </div>
            )}

            <p className="text-base font-medium mb-3">
                Đánh giá từ độc giả
                {totalElements > 0 && (
                    <span className="text-sm font-normal text-gray-400 ml-2">
                        ({totalElements})
                    </span>
                )}
            </p>

            {/* ── Review list ── */}
            {loading ? (
                <div className="text-sm text-gray-400 py-8 text-center">Đang tải...</div>
            ) : reviews.length === 0 ? (
                <div className="text-sm text-gray-400 py-8 text-center">
                    Chưa có đánh giá nào.
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {reviews.map(r => (
                        <ReviewCard
                            key={r.id}
                            review={r}
                            currentUserId={user?.userId}
                            onToggleHelpful={handleToggleHelpful}
                            onDelete={handleDelete}
                            onReply={handleReply}
                        />
                    ))}
                </div>
            )}

            {/* ── Pagination ── */}
            {totalPages > 1 && (
                <div className="flex gap-2 justify-center mt-6">
                    <button
                        type="button"
                        disabled={page === 0}
                        onClick={() => fetchReviews(page - 1)}
                        className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-40 transition-colors"
                    >
                        ‹ Trước
                    </button>
                    <span className="text-sm text-gray-500 self-center">
                        {page + 1} / {totalPages}
                    </span>
                    <button
                        type="button"
                        disabled={page >= totalPages - 1}
                        onClick={() => fetchReviews(page + 1)}
                        className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-40 transition-colors"
                    >
                        Sau ›
                    </button>
                </div>
            )}
        </div>
    )
}