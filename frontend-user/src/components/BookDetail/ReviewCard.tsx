import { useState } from "react"
import { Star, ThumbsUp, CornerDownRight, Trash2 } from "lucide-react"
import type { ReviewResponse } from "@/types/Review"

/* ── Status badge config ── */
const STATUS_CFG: Record<string, { label: string; cls: string }> = {
    PENDING: { label: "CHỜ DUYỆT", cls: "bg-amber-500/10 text-amber-500 border border-amber-500/20" },
    APPROVED: { label: "ĐÃ DUYỆT", cls: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" },
    REJECTED: { label: "TỪ CHỐI", cls: "bg-rose-500/10 text-rose-500 border border-rose-500/20" },
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
    const isAdmin = reply.user?.isAdmin

    return (
        <div className={`group relative flex gap-4 p-5 rounded-2xl transition-all duration-300 ${
            isAdmin 
            ? "bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
            : "hover:bg-white/5 border border-transparent"
        }`}>
            <div className="relative shrink-0">
                <Avatar name={reply.user?.fullName ?? "?"} size={36} />
                {isAdmin && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-[#0f172a]">
                        <Star className="w-2.5 h-2.5 fill-white text-white" />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1.5">
                    <p className={`text-[14px] font-bold truncate ${isAdmin ? "text-blue-400" : "text-gray-200"}`}>
                        {reply.user?.fullName}
                    </p>
                    {isAdmin && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500 text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-blue-500/20">
                            OFFICIAL
                        </span>
                    )}
                    <span className="text-[11px] text-gray-500 font-medium ml-auto shrink-0">
                        {reply.createdAt}
                    </span>
                </div>

                <div className={`text-[14px] leading-relaxed ${isAdmin ? "text-blue-100/90 font-medium" : "text-gray-400"}`}>
                    {reply.content}
                </div>

                {reply.status !== "APPROVED" && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold mt-2.5 inline-block uppercase tracking-wider ${badge?.cls}`}>
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
            <p className="text-sm text-gray-700 leading-relaxed mb-4">{review.content}</p>

            {/* ── Images ── */}
            {review.imageUrls && review.imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2.5 mb-5">
                    {review.imageUrls.map((img, idx) => (
                        <div 
                            key={idx} 
                            className="group/review-img relative size-20 rounded-xl overflow-hidden border border-black/5 shadow-sm hover:shadow-md transition-all cursor-zoom-in"
                            onClick={() => window.open(img, '_blank')}
                        >
                            <img src={img} alt="review" className="w-full h-full object-cover transition-transform duration-500 group-hover/review-img:scale-110" />
                            <div className="absolute inset-0 bg-black/10 group-hover/review-img:bg-black/0 transition-colors" />
                        </div>
                    ))}
                </div>
            )}

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
                <div className="mt-4 pl-4 border-l-2 border-gray-100/60 flex flex-col gap-4">
                    {review.replies.map(rep => (
                        <ReplyCard key={rep.id} reply={rep} />
                    ))}
                </div>
            )}
        </div>
    )
}