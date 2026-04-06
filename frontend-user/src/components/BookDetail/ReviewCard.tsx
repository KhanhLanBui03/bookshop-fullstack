import { useState } from "react"
import { Star, ThumbsUp, CornerDownRight, Trash2 } from "lucide-react"
import type { ReviewResponse } from "@/types/Review"

/* ── Status badge config ── */
const STATUS_CFG: Record<string, { label: string; cls: string }> = {
    PENDING: { label: "Chờ duyệt", cls: "bg-amber-50 text-amber-700" },
    APPROVED: { label: "Đã duyệt", cls: "bg-green-50 text-green-700" },
    REJECTED: { label: "Từ chối", cls: "bg-red-50 text-red-700" },
}

/* ── Sub-components ── */
function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                />
            ))}
        </div>
    )
}

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
    const initials = (name ?? "?")
        .split(" ")
        .slice(-2)
        .map(w => w[0])
        .join("")
        .toUpperCase()
    return (
        <div
            className="rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-medium shrink-0"
            style={{ width: size, height: size, fontSize: size / 2.8 }}
        >
            {initials}
        </div>
    )
}

function ReplyCard({ reply }: { reply: ReviewResponse }) {
    const badge = STATUS_CFG[reply.status]
    return (
        <div className="flex gap-2.5">
            <Avatar name={reply.user?.fullName ?? "?"} size={28} />
            <div>
                <p className="text-xs font-medium text-gray-700">
                    {reply.user?.fullName}
                    <span className="font-normal text-gray-400 ml-2">{reply.createdAt}</span>
                </p>
                <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{reply.content}</p>
                {reply.status !== "APPROVED" && (
                    <span className={`text-xs px-1.5 py-0.5 rounded mt-1 inline-block ${badge?.cls}`}>
                        {badge?.label}
                    </span>
                )}
            </div>
        </div>
    )
}

/* ── Main ── */
interface ReviewCardProps {
    review: ReviewResponse
    currentUserId?: number
    onToggleHelpful: (reviewId: number) => Promise<void>
    onDelete: (reviewId: number) => Promise<void>
    onReply: (parentId: number, content: string) => Promise<void>
}

export default function ReviewCard({
    review,
    currentUserId,
    onToggleHelpful,
    onDelete,
    onReply,
}: ReviewCardProps) {
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replyText, setReplyText] = useState("")
    const [submitting, setSubmitting] = useState(false)

    const isOwn = review.user?.id === currentUserId
    const badge = STATUS_CFG[review.status] ?? STATUS_CFG.PENDING

    const handleReply = async () => {
        if (!replyText.trim()) return
        setSubmitting(true)
        try {
            await onReply(review.id, replyText)
            setReplyText("")
            setShowReplyForm(false)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Bạn có chắc muốn xoá đánh giá này?")) return
        await onDelete(review.id)
    }

    return (
        <div className="py-5">
            {/* ── Header ── */}
            <div className="flex items-center gap-2.5 mb-2">
                <Avatar name={review.user?.fullName ?? "?"} />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                        {review.user?.fullName}
                        {isOwn && (
                            <span className="text-xs text-gray-400 font-normal ml-1">(bạn)</span>
                        )}
                    </p>
                    <p className="text-xs text-gray-400">{review.createdAt}</p>
                </div>
                {/* Only show badge if not APPROVED (approved is default expected state) */}
                {review.status !== "APPROVED" && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>
                        {badge.label}
                    </span>
                )}
            </div>

            {/* ── Stars ── */}
            {review.rating != null && (
                <div className="mb-2">
                    <Stars rating={review.rating} />
                </div>
            )}

            {/* ── Content ── */}
            <p className="text-sm text-gray-700 leading-relaxed mb-3">{review.content}</p>

            {/* ── Actions ── */}
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    onClick={() => onToggleHelpful(review.id)}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md transition-colors ${review.helpful
                            ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                >
                    <ThumbsUp className="w-3 h-3" />
                    Hữu ích ({review.helpfulCount})
                </button>

                {currentUserId && (
                    <button
                        type="button"
                        onClick={() => setShowReplyForm(v => !v)}
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                        <CornerDownRight className="w-3 h-3" />
                        Phản hồi
                    </button>
                )}

                {isOwn && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors ml-auto"
                    >
                        <Trash2 className="w-3 h-3" />
                        Xoá
                    </button>
                )}
            </div>

            {/* ── Reply form ── */}
            {showReplyForm && (
                <div className="mt-3 bg-gray-50 rounded-lg p-3">
                    <textarea
                        className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 resize-none outline-none focus:border-blue-300 bg-white"
                        rows={2}
                        placeholder="Viết phản hồi..."
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                    />
                    <div className="flex gap-2 mt-2">
                        <button
                            type="button"
                            onClick={handleReply}
                            disabled={submitting || !replyText.trim()}
                            className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-40 transition-colors"
                        >
                            {submitting ? "Đang gửi..." : "Gửi"}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setShowReplyForm(false); setReplyText("") }}
                            className="text-xs px-3 py-1.5 border rounded-md hover:bg-gray-100 transition-colors"
                        >
                            Huỷ
                        </button>
                    </div>
                </div>
            )}

            {/* ── Replies ── */}
            {(review.replies?.length ?? 0) > 0 && (
                <div className="mt-3 pl-4 border-l-2 border-gray-100 flex flex-col gap-3">
                    {review.replies.map(rep => (
                        <ReplyCard key={rep.id} reply={rep} />
                    ))}
                </div>
            )}
        </div>
    )
}