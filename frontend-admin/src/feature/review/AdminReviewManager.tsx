import { useState, useEffect, useCallback } from "react"
import {
    CheckCircle, XCircle, Trash2, CornerDownRight,
    ChevronDown, ChevronUp, Star, RefreshCw, Send, X
} from "lucide-react"
import axiosClient from "@/api/axios"
import type { CommentStatus, ReviewResponse } from "@/types/Review"

// ── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  .rv * { box-sizing: border-box; margin: 0; padding: 0; }
  .rv {
    font-family: var(--font-body,'DM Sans',sans-serif);
    background: var(--bg,#0c0c10);
    min-height: 100vh;
    color: var(--text,#e8e4f0);
    padding: 32px;
  }
  @keyframes rvUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes rvSpin { to{transform:rotate(360deg)} }

  .rv-card {
    background: var(--bg3,#18181f);
    border: 1px solid var(--border,rgba(255,255,255,.07));
    border-radius: 14px;
    transition: border-color .15s ease;
    animation: rvUp .28s cubic-bezier(.22,1,.36,1) both;
  }
  .rv-card.pending { border-color: rgba(255,107,53,0.25); }
  .rv-card.rejected { border-color: rgba(251,113,133,0.2); }

  .rv-tab { transition: all .15s ease; cursor: pointer; border: none; }
  .rv-tab.active {
    background: var(--accent,#ff6b35) !important;
    color: #fff !important;
  }
  .rv-tab:not(.active):hover { background: rgba(255,255,255,0.07) !important; }

  .rv-icon-btn {
    transition: background .12s ease, color .12s ease;
    cursor: pointer;
    border: none;
    background: transparent;
  }
  .rv-icon-btn:hover { background: rgba(255,255,255,0.08) !important; }
  .rv-icon-btn:disabled { opacity: .3; cursor: not-allowed; }
  .rv-icon-btn.approve:hover { background: rgba(52,211,153,0.12) !important; color: #34d399 !important; }
  .rv-icon-btn.reject:hover  { background: rgba(251,113,133,0.12) !important; color: #fb7185 !important; }
  .rv-icon-btn.reply:hover   { background: rgba(96,165,250,0.12) !important; color: #60a5fa !important; }
  .rv-icon-btn.delete:hover  { background: rgba(251,113,133,0.12) !important; color: #fb7185 !important; }

  .rv-textarea {
    background: var(--bg,#0c0c10);
    border: 1px solid var(--border,rgba(255,255,255,.1));
    border-radius: 10px;
    color: var(--text,#e8e4f0);
    font-family: inherit;
    font-size: 13px;
    resize: none;
    outline: none;
    transition: border-color .15s ease;
    padding: 10px 12px;
    width: 100%;
  }
  .rv-textarea:focus { border-color: var(--accent,#ff6b35); box-shadow: 0 0 0 3px rgba(255,107,53,0.1); }

  .rv-btn-primary {
    background: var(--accent,#ff6b35);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 12px;
    font-family: inherit;
    cursor: pointer;
    transition: filter .15s ease;
    display: flex; align-items: center; gap: 5px;
    padding: 7px 14px;
  }
  .rv-btn-primary:hover { filter: brightness(1.1); }
  .rv-btn-primary:disabled { opacity: .4; cursor: not-allowed; }

  .rv-btn-ghost {
    background: rgba(255,255,255,0.05);
    color: var(--muted2,#9490a8);
    border: 1px solid var(--border,rgba(255,255,255,.07));
    border-radius: 8px;
    font-size: 12px;
    font-family: inherit;
    cursor: pointer;
    transition: background .15s ease;
    display: flex; align-items: center; gap: 5px;
    padding: 7px 14px;
  }
  .rv-btn-ghost:hover { background: rgba(255,255,255,0.09); }

  .rv-page-btn {
    background: transparent;
    border: 1px solid var(--border,rgba(255,255,255,.07));
    border-radius: 8px;
    color: var(--muted2,#9490a8);
    font-size: 13px;
    font-family: inherit;
    cursor: pointer;
    padding: 6px 14px;
    transition: all .15s ease;
  }
  .rv-page-btn:hover:not(:disabled) { border-color: var(--accent,#ff6b35); color: var(--accent,#ff6b35); }
  .rv-page-btn:disabled { opacity: .28; cursor: not-allowed; }

  .rv-spinner {
    width: 16px; height: 16px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.1);
    border-top-color: var(--accent,#ff6b35);
    animation: rvSpin .7s linear infinite;
  }
`

// ── API ───────────────────────────────────────────────────────────────────────
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

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_CFG: Record<CommentStatus, { label: string; color: string; bg: string }> = {
    PENDING: { label: "Chờ duyệt", color: "#ff6b35", bg: "rgba(255,107,53,0.12)" },
    APPROVED: { label: "Đã duyệt", color: "#34d399", bg: "rgba(52,211,153,0.12)" },
    REJECTED: { label: "Từ chối", color: "#fb7185", bg: "rgba(251,113,133,0.12)" },
}

const avatarColors = ["#ff6b35", "#22c55e", "#60a5fa", "#f59e0b", "#a78bfa", "#34d399", "#fb7185"]
const avatarColor = (name: string) => avatarColors[name.charCodeAt(0) % avatarColors.length]
const initials = (name: string) =>
    (name ?? "?").split(" ").filter(Boolean).slice(-2).map(w => w[0]).join("").toUpperCase()

function Stars({ rating }: { rating: number }) {
    return (
        <div style={{ display: "flex", gap: 2 }}>
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} style={{
                    width: 12, height: 12,
                    fill: i <= rating ? "#f59e0b" : "transparent",
                    color: i <= rating ? "#f59e0b" : "rgba(255,255,255,0.15)"
                }} />
            ))}
        </div>
    )
}

function Badge({ status }: { status: CommentStatus }) {
    const cfg = STATUS_CFG[status]
    return (
        <span style={{
            fontSize: 11, padding: "2px 8px", borderRadius: 20,
            background: cfg.bg, color: cfg.color, fontWeight: 600,
        }}>
            {cfg.label}
        </span>
    )
}

// ── Review Row ────────────────────────────────────────────────────────────────
interface RowProps {
    review: ReviewResponse
    index: number
    onStatusChange: (id: number, status: CommentStatus) => Promise<void>
    onDelete: (id: number) => Promise<void>
    onReply: (bookId: number, parentId: number, content: string) => Promise<void>
}

function ReviewRow({ review, index, onStatusChange, onDelete, onReply }: RowProps) {
    const [expanded, setExpanded] = useState(false)
    const [showReply, setShowReply] = useState(false)
    const [replyText, setReplyText] = useState("")
    const [loading, setLoading] = useState(false)

    const act = async (fn: () => Promise<void>) => {
        setLoading(true)
        try { await fn() } finally { setLoading(false) }
    }

    const handleReply = () =>
        act(async () => {
            if (!replyText.trim()) return
            await onReply(review.id, review.id, replyText)
            setReplyText(""); setShowReply(false)
        })

    const cardClass = `rv-card ${review.status === "PENDING" ? "pending" : review.status === "REJECTED" ? "rejected" : ""}`

    return (
        <div className={cardClass} style={{ animationDelay: `${index * 40}ms` }}>
            <div style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    {/* Avatar */}
                    <div style={{
                        width: 38, height: 38, borderRadius: "50%", shrink: 0,
                        background: avatarColor(review.user?.fullName ?? "?"),
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0,
                    }}>
                        {initials(review.user?.fullName ?? "?")}
                    </div>

                    {/* Body */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 14, fontWeight: 600 }}>{review.user?.fullName}</span>
                            <span style={{ fontSize: 12, color: "var(--muted2,#9490a8)" }}>{review.createdAt}</span>
                            <Badge status={review.status} />
                            {review.rating != null && <Stars rating={review.rating} />}
                            <span style={{ fontSize: 12, color: "var(--muted2,#9490a8)", marginLeft: "auto" }}>
                                👍 {review.helpfulCount}
                            </span>
                        </div>
                        <p style={{ fontSize: 13, color: "var(--muted,#c4bfd4)", lineHeight: 1.6 }}>{review.content}</p>

                        {(review.replies?.length ?? 0) > 0 && (
                            <button
                                onClick={() => setExpanded(v => !v)}
                                className="rv-icon-btn rv-btn-ghost"
                                style={{ marginTop: 10, padding: "4px 10px", fontSize: 12, borderRadius: 6 }}
                            >
                                {expanded ? <ChevronUp style={{ width: 12, height: 12 }} /> : <ChevronDown style={{ width: 12, height: 12 }} />}
                                {review.replies.length} phản hồi
                            </button>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                        {loading ? (
                            <div className="rv-spinner" />
                        ) : (
                            <>
                                {review.status !== "APPROVED" && (
                                    <button className="rv-icon-btn approve" title="Duyệt"
                                        onClick={() => act(() => onStatusChange(review.id, "APPROVED"))}
                                        style={{ padding: 7, borderRadius: 8, color: "#34d399" }}>
                                        <CheckCircle style={{ width: 16, height: 16 }} />
                                    </button>
                                )}
                                {review.status !== "REJECTED" && (
                                    <button className="rv-icon-btn reject" title="Từ chối"
                                        onClick={() => act(() => onStatusChange(review.id, "REJECTED"))}
                                        style={{ padding: 7, borderRadius: 8, color: "#fb7185" }}>
                                        <XCircle style={{ width: 16, height: 16 }} />
                                    </button>
                                )}
                                <button className="rv-icon-btn reply" title="Phản hồi"
                                    onClick={() => setShowReply(v => !v)}
                                    style={{ padding: 7, borderRadius: 8, color: "#60a5fa" }}>
                                    <CornerDownRight style={{ width: 16, height: 16 }} />
                                </button>
                                <button className="rv-icon-btn delete" title="Xoá"
                                    onClick={() => { if (confirm("Xoá đánh giá này?")) act(() => onDelete(review.id)) }}
                                    style={{ padding: 7, borderRadius: 8, color: "var(--muted2,#9490a8)" }}>
                                    <Trash2 style={{ width: 16, height: 16 }} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Reply form */}
                {showReply && (
                    <div style={{ marginTop: 14, paddingLeft: 52 }}>
                        <textarea
                            className="rv-textarea"
                            rows={2}
                            placeholder="Nhập phản hồi admin..."
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                        />
                        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                            <button className="rv-btn-primary" onClick={handleReply}
                                disabled={!replyText.trim() || loading}>
                                <Send style={{ width: 12, height: 12 }} /> Gửi
                            </button>
                            <button className="rv-btn-ghost"
                                onClick={() => { setShowReply(false); setReplyText("") }}>
                                <X style={{ width: 12, height: 12 }} /> Huỷ
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Replies */}
            {expanded && (review.replies?.length ?? 0) > 0 && (
                <div style={{
                    borderTop: "1px solid var(--border,rgba(255,255,255,.07))",
                    padding: "14px 20px 14px 72px",
                    display: "flex", flexDirection: "column", gap: 12,
                    background: "rgba(255,255,255,0.02)",
                }}>
                    {review.replies.map(rep => (
                        <div key={rep.id} style={{ display: "flex", gap: 10 }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                                background: avatarColor(rep.user?.fullName ?? "?"),
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 11, fontWeight: 700, color: "#fff",
                            }}>
                                {initials(rep.user?.fullName ?? "?")}
                            </div>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                    <span style={{ fontSize: 12, fontWeight: 600 }}>{rep.user?.fullName}</span>
                                    <span style={{ fontSize: 11, color: "var(--muted2,#9490a8)" }}>{rep.createdAt}</span>
                                    <Badge status={rep.status} />
                                </div>
                                <p style={{ fontSize: 13, color: "var(--muted,#c4bfd4)", lineHeight: 1.5 }}>{rep.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ── Main ──────────────────────────────────────────────────────────────────────
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
        <>
            <style>{CSS}</style>
            <div className="rv">
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
                    <div>
                        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>Quản lý đánh giá</h1>
                        <p style={{ fontSize: 13, color: "var(--muted2,#9490a8)", marginTop: 4 }}>
                            {totalElements} đánh giá
                            {pendingCount > 0 && (
                                <span style={{
                                    marginLeft: 10, fontSize: 12, padding: "2px 8px", borderRadius: 20,
                                    background: "rgba(255,107,53,0.15)", color: "#ff6b35", fontWeight: 600
                                }}>
                                    {pendingCount} chờ duyệt
                                </span>
                            )}
                        </p>
                    </div>
                    <button className="rv-btn-ghost" onClick={() => fetchReviews(page)}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10 }}>
                        <RefreshCw style={{ width: 14, height: 14 }} /> Làm mới
                    </button>
                </div>

                {/* Tabs */}
                <div style={{
                    display: "flex", gap: 4, marginBottom: 20,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border,rgba(255,255,255,.07))",
                    borderRadius: 12, padding: 4, width: "fit-content"
                }}>
                    {TABS.map(t => (
                        <button
                            key={t.value}
                            className={`rv-tab ${tab === t.value ? "active" : ""}`}
                            onClick={() => setTab(t.value)}
                            style={{ padding: "7px 18px", borderRadius: 9, fontSize: 13, fontFamily: "inherit", background: "transparent", color: "var(--muted2,#9490a8)" }}
                        >
                            {t.label}
                            {t.value === "PENDING" && pendingCount > 0 && (
                                <span style={{
                                    marginLeft: 6, background: tab === "PENDING" ? "rgba(255,255,255,0.25)" : "#ff6b35",
                                    color: "#fff", fontSize: 11, padding: "1px 6px", borderRadius: 10, fontWeight: 700
                                }}>
                                    {pendingCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* List */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted2,#9490a8)", fontSize: 14 }}>
                        <div className="rv-spinner" style={{ margin: "0 auto 12px" }} />
                        Đang tải...
                    </div>
                ) : reviews.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted2,#9490a8)", fontSize: 14 }}>
                        Không có đánh giá nào.
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {reviews.map((r, i) => (
                            <ReviewRow key={r.id} review={r} index={i}
                                onStatusChange={handleStatusChange}
                                onDelete={handleDelete}
                                onReply={handleReply}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 28 }}>
                        <button className="rv-page-btn" disabled={page === 0}
                            onClick={() => fetchReviews(page - 1)}>‹ Trước</button>
                        <span style={{ fontSize: 13, color: "var(--muted2,#9490a8)", alignSelf: "center" }}>
                            {page + 1} / {totalPages}
                        </span>
                        <button className="rv-page-btn" disabled={page >= totalPages - 1}
                            onClick={() => fetchReviews(page + 1)}>Sau ›</button>
                    </div>
                )}
            </div>
        </>
    )
}