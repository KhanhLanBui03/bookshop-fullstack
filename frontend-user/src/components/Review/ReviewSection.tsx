import { reviewApi } from "@/api/review.api";
import { useAuth } from "@/contexts/AuthContext";
import type { ReviewResponse } from "@/types/Review";
import { useState, useEffect, useCallback } from "react";
import ReviewCard from "../BookDetail/ReviewCard";
import RatingSummary from "./Ratingsummary";
import CreateReviewForm from "./Createreviewform";

interface ReviewSectionProps {
    bookId: number;
    bookRating: number;
}

export default function ReviewSection({ bookId, bookRating }: ReviewSectionProps) {
    const { user, loading: authLoading } = useAuth();

    const [reviews, setReviews] = useState<ReviewResponse[]>([]);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasPurchased, setHasPurchased] = useState<boolean>(true);
    const [hasReviewed, setHasReviewed] = useState<boolean>(false);

    // ─── Fetch reviews ────────────────────────────────────────────────────────
    const fetchReviews = useCallback(
        async (p: number = 0) => {
            setLoading(true);
            try {
                const data = await reviewApi.getBookReviews(bookId, p, 5);
                setReviews(data.content ?? []);
                setTotalPages(data.totalPages ?? 1);
                setTotalElements(data.totalElements ?? 0);
                setPage(p);
            } catch (e) {
                console.error("Lỗi tải reviews:", e);
            } finally {
                setLoading(false);
            }
        },
        [bookId]
    );

    useEffect(() => {
        fetchReviews(0);
    }, [fetchReviews]);

    // ─── Check purchased / reviewed ───────────────────────────────────────────
    useEffect(() => {
        if (authLoading || !user) return;

        reviewApi.checkPurchased(user.userId, bookId)
            .then((result) => {
                console.log("checkPurchased:", result);
                setHasPurchased(result);
            })
            .catch((e) => {
                console.log("checkPurchased error:", e);
                setHasPurchased(true);
            });

        reviewApi.checkReviewed(user.userId, bookId)
            .then((result) => {
                console.log("checkReviewed:", result);
                setHasReviewed(result);
            })
            .catch((e) => {
                console.log("checkReviewed error:", e);
                setHasReviewed(false);
            });
    }, [user, authLoading, bookId]);

    // ─── Handlers ─────────────────────────────────────────────────────────────
    const handleCreated = (newReview: ReviewResponse) => {
        setReviews((prev) => [newReview, ...prev]);
        setTotalElements((n) => n + 1);
        setHasReviewed(true);
    };

    const handleToggleHelpful = async (reviewId: number) => {
        if (!user) return;
        try {
            const updated = await reviewApi.toggleHelpful(user.userId, reviewId);
            setReviews((prev) =>
                prev.map((r) =>
                    r.id === reviewId
                        ? { ...r, helpful: updated.helpful, helpfulCount: updated.helpfulCount }
                        : r
                )
            );
        } catch (e) {
            console.error("Lỗi toggle helpful:", e);
        }
    };

    const handleDelete = async (reviewId: number) => {
        if (!user) return;
        try {
            await reviewApi.deleteReview(user.userId, reviewId);
            setReviews((prev) => prev.filter((r) => r.id !== reviewId));
            setTotalElements((n) => n - 1);
            setHasReviewed(false);
        } catch (e) {
            console.error("Lỗi xoá review:", e);
        }
    };

    const handleReply = async (parentId: number, content: string) => {
        if (!user) return;
        try {
            const reply = await reviewApi.createReview(user.userId, {
                bookId,
                content,
                parentId,
            });
            setReviews((prev) =>
                prev.map((r) =>
                    r.id === parentId
                        ? { ...r, replies: [...(r.replies ?? []), reply] }
                        : r
                )
            );
        } catch (e) {
            console.error("Lỗi gửi reply:", e);
        }
    };

    // ─── Chờ auth load xong mới render ───────────────────────────────────────
    if (authLoading) {
        return (
            <div className="max-w-2xl py-8">
                <div className="text-sm text-gray-400 py-8 text-center">Đang tải...</div>
            </div>
        );
    }

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="max-w-2xl py-8">
            <h2 className="text-lg font-medium mb-5">Đánh giá &amp; Nhận xét</h2>

            <RatingSummary rating={bookRating} totalReviews={totalElements} />

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
                    <a href="/login" className="text-blue-600 hover:underline">Đăng nhập</a> để đánh giá sách.
                </div>
            )}

            <p className="text-base font-medium mb-3">Đánh giá từ độc giả</p>

            {loading ? (
                <div className="text-sm text-gray-400 py-8 text-center">Đang tải...</div>
            ) : reviews.length === 0 ? (
                <div className="text-sm text-gray-400 py-8 text-center">Chưa có đánh giá nào.</div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {reviews.map((r) => (
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
    );
}