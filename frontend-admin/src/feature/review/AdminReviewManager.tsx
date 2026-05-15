import { useState, useEffect, useCallback } from "react"
import {
    CheckCircle,
    XCircle,
    Trash2,
    CornerDownRight,
    ChevronDown,
    ChevronUp,
    Star,
    RefreshCw,
    Send,
    MessageSquare,
    ThumbsUp,
    Clock,
    Search,
    Zap
} from "lucide-react"
import axiosClient from "@/api/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { CommentStatus, ReviewResponse } from "@/types/Review"

/* ════════ API ─────────────────────────────────────────────────────────────────────── */
const unwrap = (r: any) => r.data?.data ?? r.data

const adminReviewApi = {
    getAll: (page = 0, size = 10, status?: CommentStatus) =>
        axiosClient.get("/reviews/admin", { params: { page, size, ...(status ? { status } : {}) } }).then(unwrap),
    updateStatus: (id: number, status: CommentStatus) =>
        axiosClient.patch(`/reviews/${id}/status`, { status }).then(unwrap),
    delete: (id: number) =>
        axiosClient.delete(`/reviews/${id}`).then(() => undefined),
    reply: (bookId: number, parentId: number, content: string) =>
        axiosClient.post("/reviews", { bookId, parentId, content }).then(unwrap),
}

/* ════════ HELPERS ─────────────────────────────────────────────────────────────────── */
const STATUS_CFG: Record<CommentStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    PENDING: { label: "Chờ duyệt", color: "text-amber-500", bg: "bg-amber-500/10", icon: <Clock className="size-3" /> },
    APPROVED: { label: "Đã duyệt", color: "text-emerald-500", bg: "bg-emerald-500/10", icon: <CheckCircle className="size-3" /> },
    REJECTED: { label: "Từ chối", color: "text-rose-500", bg: "bg-rose-500/10", icon: <XCircle className="size-3" /> },
}

const avatarColors = ["bg-primary", "bg-emerald-500", "bg-sky-500", "bg-amber-500", "bg-indigo-500", "bg-rose-500"]
const avatarColor = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length]
const initials = (name: string) => (name ?? "?").split(" ").filter(Boolean).slice(-2).map(w => w[0]).join("").toUpperCase()

function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className={`size-3 ${i <= rating ? "fill-amber-500 text-amber-500" : "text-muted-foreground/20"}`} />
            ))}
        </div>
    )
}

/* ════════ REVIEW CARD ──────────────────────────────────────────────────────────────── */
interface CardProps {
    review: ReviewResponse
    index: number
    onStatusChange: (id: number, status: CommentStatus) => Promise<void>
    onDelete: (id: number) => Promise<void>
    onReply: (bookId: number, parentId: number, content: string) => Promise<void>
}

function ReviewCard({ review, index, onStatusChange, onDelete, onReply }: CardProps) {
    const [expanded, setExpanded] = useState(false)
    const [showReply, setShowReply] = useState(false)
    const [replyText, setReplyText] = useState("")
    const [loading, setLoading] = useState(false)

    const act = async (fn: () => Promise<void>) => {
        setLoading(true)
        try { await fn() } catch (e) { console.error(e) } finally { setLoading(false) }
    }

    const handleReply = () => act(async () => {
        if (!replyText.trim()) return
        if (!review.bookId) return console.error("Missing bookId for reply")
        await onReply(review.bookId, review.id, replyText)
        setReplyText(""); setShowReply(false); setExpanded(true)
    })

    const status = STATUS_CFG[review.status]

    return (
        <div className={`glass rounded-[2rem] border-white/20 overflow-hidden transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${review.status === "PENDING" ? "ring-2 ring-primary/30" : ""}`} style={{ animationDelay: `${index * 50}ms` }}>
            <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left: User Info & Avatar */}
                    <div className="flex lg:flex-col items-center lg:items-start gap-4 lg:gap-6 shrink-0 w-full lg:w-48">
                        <div className={`size-20 rounded-[2rem] flex items-center justify-center text-white font-black text-2xl shadow-2xl ${avatarColor(review.user?.fullName ?? "?")} flex-shrink-0 hover:scale-110 transition-transform duration-500`}>
                            {initials(review.user?.fullName ?? "?")}
                        </div>
                        <div className="flex-1 lg:flex-none">
                            <h4 className="text-xl font-black text-foreground tracking-tight leading-tight mb-2">{review.user?.fullName}</h4>
                            <div className="flex flex-col gap-2">
                                <div className="inline-flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-xl w-fit">
                                    <Clock className="size-3" /> {review.createdAt}
                                </div>
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${status.bg} ${status.color} text-[10px] font-black uppercase tracking-widest w-fit`}>
                                    {status.icon} {status.label}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle: Content & Images */}
                    <div className="flex-1 min-w-0 space-y-6 w-full">
                        <div className="flex flex-wrap items-center gap-3">
                            {review.rating != null && <Stars rating={review.rating} />}
                            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase bg-white/5 px-3 py-1.5 rounded-xl">
                                <ThumbsUp className="size-3 text-primary" /> {review.helpfulCount} Hữu ích
                            </div>
                            <div className="ml-auto text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">ID: #{review.id}</div>
                        </div>

                        <div className="relative group">
                            <p className="text-base font-medium text-foreground/90 leading-relaxed bg-white/5 p-6 rounded-3xl border border-white/5 shadow-inner">
                                {review.content}
                            </p>
                        </div>

                        {/* Image Grid */}
                        {review.imageUrls && review.imageUrls.length > 0 && (
                            <div className="flex flex-wrap gap-3 p-2 bg-white/5 rounded-3xl border border-white/5">
                                {review.imageUrls.map((img, idx) => (
                                    <div 
                                        key={idx} 
                                        className="relative size-24 rounded-2xl overflow-hidden border border-white/10 group/img cursor-zoom-in hover:scale-105 transition-transform"
                                        onClick={() => window.open(img, '_blank')}
                                    >
                                        <img src={img} alt="review" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/20 group-hover/img:bg-transparent transition-colors" />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            {(review.replies?.length ?? 0) > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setExpanded(!expanded)}
                                    className="rounded-xl font-black uppercase text-[10px] tracking-widest h-10 px-5 gap-2 bg-primary/10 text-primary hover:bg-primary/20"
                                >
                                    {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                                    {review.replies.length} phản hồi
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowReply(!showReply)}
                                className="rounded-xl font-black uppercase text-[10px] tracking-widest h-10 px-5 gap-2 hover:bg-white/5"
                            >
                                <CornerDownRight className="size-3" /> Phản hồi
                            </Button>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-row lg:flex-col gap-3 shrink-0 w-full lg:w-auto justify-end lg:justify-start">
                        {loading ? (
                            <div className="size-14 rounded-2xl border-4 border-primary/10 border-t-primary animate-spin" />
                        ) : (
                            <>
                                {review.status !== "APPROVED" && (
                                    <Button size="icon" variant="ghost" title="Duyệt" className="size-14 rounded-2xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white shadow-lg hover:shadow-emerald-500/20 transition-all" onClick={() => act(() => onStatusChange(review.id, "APPROVED"))}>
                                        <CheckCircle className="size-7" />
                                    </Button>
                                )}
                                {review.status !== "REJECTED" && (
                                    <Button size="icon" variant="ghost" title="Từ chối" className="size-14 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white shadow-lg hover:shadow-rose-500/20 transition-all" onClick={() => act(() => onStatusChange(review.id, "REJECTED"))}>
                                        <XCircle className="size-7" />
                                    </Button>
                                )}
                                <Button size="icon" variant="ghost" title="Xoá" className="size-14 rounded-2xl bg-white/5 text-muted-foreground hover:bg-rose-500 hover:text-white shadow-lg transition-all" onClick={() => { if (confirm("Xoá đánh giá này vĩnh viễn?")) act(() => onDelete(review.id)) }}>
                                    <Trash2 className="size-7" />
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Reply Form */}
                {showReply && (
                    <div className="mt-8 ml-0 lg:ml-56 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="glass border-white/10 rounded-3xl p-6 bg-white/5">
                            <textarea
                                className="w-full bg-foreground/5 border border-white/10 rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none min-h-[150px] transition-all resize-none"
                                placeholder="Nhập nội dung phản hồi chính thức từ quản trị viên..."
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                            />
                            <div className="flex gap-3 mt-6">
                                <Button className="rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] h-12 px-8 gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95" onClick={handleReply} disabled={!replyText.trim() || loading}>
                                    <Send className="size-4" /> Gửi phản hồi
                                </Button>
                                <Button variant="ghost" className="rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] h-12 px-8 hover:bg-white/5" onClick={() => { setShowReply(false); setReplyText("") }}>
                                    Huỷ bỏ
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Nested Replies */}
            {expanded && (review.replies?.length ?? 0) > 0 && (
                <div className="bg-white/5 border-t border-white/5 p-8 lg:pl-56 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="space-y-6">
                        {review.replies.map(rep => (
                            <div key={rep.id} className="flex gap-6 group relative">
                                <div className="absolute left-[-2rem] top-0 bottom-0 w-px bg-white/10 hidden lg:block" />
                                <div className={`size-12 rounded-2xl flex items-center justify-center text-white font-black text-xs shadow-xl ${avatarColor(rep.user?.fullName ?? "?")} flex-shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                                    {initials(rep.user?.fullName ?? "?")}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-sm font-black text-foreground">{rep.user?.fullName}</span>
                                        <span className="text-[9px] font-black text-muted-foreground uppercase bg-white/5 px-2.5 py-1 rounded-lg tracking-widest">{rep.createdAt}</span>
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${STATUS_CFG[rep.status].bg} ${STATUS_CFG[rep.status].color} text-[8px] font-black uppercase tracking-widest`}>
                                            {STATUS_CFG[rep.status].icon} {STATUS_CFG[rep.status].label}
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-foreground/70 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5 inline-block">{rep.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

/* ════════ MAIN PAGE ─────────────────────────────────────────────────────────────── */
const TABS: { label: string; value: CommentStatus | "ALL" }[] = [
    { label: "Tất cả", value: "ALL" },
    { label: "Chờ duyệt", value: "PENDING" },
    { label: "Đã duyệt", value: "APPROVED" },
    { label: "Từ chối", value: "REJECTED" },
]

export default function AdminReviewManager() {
    const [reviews, setReviews] = useState<ReviewResponse[]>([])
    const [tab, setTab] = useState<CommentStatus | "ALL">("ALL")
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [totalElements, setTotalElements] = useState(0)
    const [pendingCount, setPendingCount] = useState(0)
    const [loading, setLoading] = useState(true)

    const fetchReviews = useCallback(async (p = 0, status: CommentStatus | "ALL" = tab) => {
        setLoading(true)
        try {
            const data = await adminReviewApi.getAll(p, 10, status === "ALL" ? undefined : status)
            setReviews(data.content ?? [])
            setTotalPages(data.totalPages ?? 1)
            setTotalElements(data.totalElements ?? 0)
            setPage(p)
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }, [tab])

    useEffect(() => { fetchReviews(0, tab) }, [tab])

    useEffect(() => {
        adminReviewApi.getAll(0, 1, "PENDING")
            .then(d => setPendingCount(d.totalElements ?? 0)).catch(() => { })
    }, [reviews])

    const handleStatusChange = async (id: number, status: CommentStatus) => {
        await adminReviewApi.updateStatus(id, status)
        setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    }

    const handleDelete = async (id: number) => {
        await adminReviewApi.delete(id)
        setReviews(prev => prev.filter(r => r.id !== id))
        setTotalElements(n => n - 1)
    }

    const handleReply = async (bookId: number, parentId: number, content: string) => {
        const reply = await adminReviewApi.reply(bookId, parentId, content)
        setReviews(prev => prev.map(r =>
            r.id === parentId ? { ...r, replies: [...(r.replies ?? []), reply] } : r
        ))
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20">

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-primary/20">
                        <MessageSquare className="size-3 fill-current" /> Trung tâm điều phối dư luận
                    </div>
                    <h1 className="text-4xl font-black text-foreground tracking-tight uppercase leading-none">Quản lý <span className="text-primary italic">Đánh giá</span></h1>
                    <div className="flex items-center gap-3">
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">
                            {totalElements.toLocaleString()} phản hồi từ cộng đồng
                        </p>
                        {pendingCount > 0 && (
                            <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 px-3 py-1 rounded-xl text-[10px] font-black uppercase animate-pulse border border-amber-500/20">
                                <Zap className="size-3 fill-current" /> {pendingCount} Đang chờ duyệt
                            </div>
                        )}
                    </div>
                </div>

                <Button variant="outline" className="rounded-2xl font-black h-14 px-8 border-white/10 hover:bg-primary hover:text-white transition-all shadow-lg group" onClick={() => fetchReviews(page)}>
                    <RefreshCw className="size-5 mr-3 group-hover:rotate-180 transition-transform duration-700" /> Làm mới dữ liệu
                </Button>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass p-2 rounded-[2rem] border-white/20">
                <div className="flex gap-1 p-1 bg-white/5 rounded-[1.5rem]">
                    {TABS.map(t => (
                        <button
                            key={t.value}
                            onClick={() => setTab(t.value)}
                            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative ${tab === t.value ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-white/5 text-muted-foreground"}`}
                        >
                            {t.label}
                            {t.value === "PENDING" && pendingCount > 0 && (
                                <span className={`ml-2 px-2 py-0.5 rounded-lg text-[9px] font-black ${tab === "PENDING" ? "bg-white/20 text-white" : "bg-primary text-white"}`}>
                                    {pendingCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 max-w-md group pr-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input placeholder="Tìm kiếm nội dung đánh giá..." className="pl-11 h-12 bg-background/50 border-border/50 rounded-2xl focus-visible:ring-primary/20" />
                </div>
            </div>

            {/* Reviews List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Đang trích xuất dữ liệu...</p>
                </div>
            ) : reviews.length === 0 ? (
                <div className="glass p-20 rounded-[3rem] text-center border-white/20">
                    <div className="size-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="size-10 text-muted-foreground/30" />
                    </div>
                    <p className="text-base font-black text-muted-foreground uppercase tracking-[0.2em]">Danh sách đánh giá hiện đang trống</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {reviews.map((r, i) => (
                        <ReviewCard key={r.id} review={r} index={i}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDelete}
                            onReply={handleReply}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-6 pt-10">
                    <Button
                        variant="outline"
                        disabled={page === 0}
                        onClick={() => fetchReviews(page - 1)}
                        className="rounded-2xl font-black uppercase text-[10px] tracking-widest h-12 px-8 border-white/10"
                    >
                        Trang trước
                    </Button>
                    <div className="glass px-6 py-3 rounded-2xl border-white/10 text-[11px] font-black text-foreground">
                        {page + 1} <span className="text-muted-foreground mx-2">/</span> {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        disabled={page >= totalPages - 1}
                        onClick={() => fetchReviews(page + 1)}
                        className="rounded-2xl font-black uppercase text-[10px] tracking-widest h-12 px-8 border-white/10"
                    >
                        Trang sau
                    </Button>
                </div>
            )}
        </div>
    )
}