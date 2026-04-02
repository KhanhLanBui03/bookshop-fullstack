import { useState } from "react";
import { Star } from "lucide-react";
import { reviewApi } from "@/api/review.api";
import type { ReviewResponse } from "@/types/Review";

const STAR_LABELS: Record<number, string> = {
    1: "Rất tệ",
    2: "Tệ",
    3: "Bình thường",
    4: "Tốt",
    5: "Tuyệt vời",
};

interface CreateReviewFormProps {
    bookId: number;
    userId: number;
    hasPurchased: boolean;
    hasReviewed: boolean;
    onCreated: (review: ReviewResponse) => void;
}

export default function CreateReviewForm({
    bookId,
    userId,
    hasPurchased,
    hasReviewed,
    onCreated,
}: CreateReviewFormProps) {
    const [rating, setRating] = useState<number>(0);
    const [hovered, setHovered] = useState<number>(0);
    const [content, setContent] = useState<string>("");
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    if (!hasPurchased) {
        return (
            <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3 mb-6">
                Bạn cần mua và nhận sách để có thể đánh giá.
            </div>
        );
    }

    if (hasReviewed) {
        return (
            <div className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3 mb-6">
                Bạn đã đánh giá sách này rồi.
            </div>
        );
    }

    const handleSubmit = async () => {
        if (!rating) return setError("Vui lòng chọn số sao.");
        if (!content.trim()) return setError("Vui lòng nhập nội dung đánh giá.");

        setError("");
        setSubmitting(true);
        try {
            const review = await reviewApi.createReview(userId, {
                bookId,
                content,
                rating,
            });
            onCreated(review);
            setRating(0);
            setContent("");
        } catch (e: unknown) {
            const msg =
                (e as { response?: { data?: { message?: string } } })?.response?.data
                    ?.message ?? "Có lỗi xảy ra, vui lòng thử lại.";
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const display = hovered || rating;

    return (
        <div className="border border-gray-100 rounded-xl p-5 mb-6 bg-white">
            <p className="text-sm font-medium mb-3">Viết đánh giá của bạn</p>

            {/* Star picker */}
            <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <button
                        key={i}
                        type="button"
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => setRating(i)}
                        className="p-0.5 focus:outline-none"
                        aria-label={`${i} sao`}
                    >
                        <Star
                            className={`w-7 h-7 transition-transform hover:scale-110 ${display >= i
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-200"
                                }`}
                        />
                    </button>
                ))}
                {display > 0 && (
                    <span className="text-sm text-gray-400 ml-2">
                        {STAR_LABELS[display]}
                    </span>
                )}
            </div>

            {/* Textarea */}
            <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none outline-none focus:border-blue-300 transition-colors"
                rows={3}
                maxLength={500}
                placeholder="Chia sẻ trải nghiệm đọc sách của bạn..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <div className="flex items-center justify-between mt-0.5 mb-3">
                {error ? (
                    <p className="text-xs text-red-500">{error}</p>
                ) : (
                    <span />
                )}
                <span className="text-xs text-gray-400">{content.length}/500</span>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || !rating || !content.trim()}
                    className="px-5 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                </button>

                {/* Gợi ý khi chưa đủ điều kiện */}
                {(!rating || !content.trim()) && (
                    <p className="text-xs text-gray-400">
                        {!rating ? "Vui lòng chọn số sao" : "Vui lòng nhập nội dung"}
                    </p>
                )}
            </div>
        </div>
    );
}