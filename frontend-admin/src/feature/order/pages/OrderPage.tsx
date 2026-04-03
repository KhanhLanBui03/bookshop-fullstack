import React, { useState, useEffect, useCallback, useRef } from "react"
import type { OrderAdminResponse, OrderDashboardStats, OrderStatus, PaymentMethod } from "../order.types"
import { orderApi } from "@/api/order.api"

/* ════════ CONFIG ════════ */
const STATUS_CFG: Record<OrderStatus, { label: string; bg: string; color: string; dot: string; icon: string }> = {
    PENDING: { label: "Pending", bg: "rgba(245,158,11,0.12)", color: "#f59e0b", dot: "#f59e0b", icon: "⏳" },
    PENDING_PAYMENT: { label: "Awaiting Pay", bg: "rgba(251,113,133,0.12)", color: "#fb7185", dot: "#fb7185", icon: "💳" },
    CONFIRMED: { label: "Confirmed", bg: "rgba(96,165,250,0.12)", color: "#60a5fa", dot: "#60a5fa", icon: "✅" },
    SHIPPING: { label: "Shipping", bg: "rgba(167,139,250,0.12)", color: "#c4b5fd", dot: "#c4b5fd", icon: "🚚" },
    DELIVERED: { label: "Delivered", bg: "rgba(34,197,94,0.12)", color: "#22c55e", dot: "#22c55e", icon: "📦" },
    CANCELLED: { label: "Cancelled", bg: "rgba(255,255,255,0.06)", color: "#6b6880", dot: "#6b6880", icon: "✕" },
    REFUNDED: { label: "Refunded", bg: "rgba(239,68,68,0.12)", color: "#ef4444", dot: "#ef4444", icon: "↩" },
}

const STATUS_NEXT: Partial<Record<OrderStatus, OrderStatus[]>> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    PENDING_PAYMENT: ["CANCELLED"],
    CONFIRMED: ["SHIPPING", "CANCELLED"],
    SHIPPING: ["DELIVERED", "REFUNDED"],
    DELIVERED: ["REFUNDED"],
}

const PAYMENT_CFG: Record<PaymentMethod, { label: string; icon: string; color: string }> = {
    COD: { label: "COD", icon: "💵", color: "#9490a8" },
    VNPAY: { label: "VNPay", icon: "🏦", color: "#1a94ff" },
    BANK: { label: "Bank", icon: "💜", color: "#ae2070" },
}

const STATUS_ORDER: OrderStatus[] = ["PENDING", "PENDING_PAYMENT", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED", "REFUNDED"]

/* ════════ CSS ════════ */
const CSS = `
  .om * { box-sizing: border-box; margin: 0; padding: 0; }
  .om {
    font-family: var(--font-body, 'DM Sans', sans-serif);
    background: var(--bg, #0c0c10);
    min-height: 100vh;
    color: var(--text, #e8e4f0);
  }

  @keyframes omUp   { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes omFade { from { opacity:0; } to { opacity:1; } }
  @keyframes omSlide{ from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
  @keyframes omPulse{ 0%,100%{opacity:1} 50%{opacity:.4} }
  @keyframes omSpin { to { transform: rotate(360deg); } }

  .om-up      { animation: omUp .32s cubic-bezier(.22,1,.36,1) both; }
  .om-row     { transition: background .1s ease; cursor: pointer; }
  .om-row:hover { background: rgba(255,255,255,0.03) !important; }
  .om-overlay { animation: omFade .2s ease both; }
  .om-drawer  { animation: omSlide .28s cubic-bezier(.22,1,.36,1) both; }
  .om-modal   { animation: omUp .22s cubic-bezier(.22,1,.36,1) both; }

  .om-btn-primary { transition: all .15s ease; cursor: pointer; border: none; }
  .om-btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
  .om-btn-primary:active { transform: translateY(0); }
  .om-btn-ghost   { transition: background .15s ease; cursor: pointer; border: none; }
  .om-btn-ghost:hover { background: rgba(255,255,255,.07) !important; }

  .om-input { transition: border-color .15s ease; outline: none; }
  .om-input:focus { border-color: var(--accent,#ff6b35) !important; box-shadow: 0 0 0 3px rgba(255,107,53,.12); }

  .om-chip { cursor: pointer; transition: all .15s ease; }
  .om-chip:hover  { border-color: var(--accent,#ff6b35) !important; color: var(--accent,#ff6b35) !important; }
  .om-chip.active { background: var(--accent,#ff6b35) !important; border-color: var(--accent,#ff6b35) !important; color:#fff !important; }

  .om-icon-btn { transition: background .12s ease; cursor: pointer; }
  .om-icon-btn:hover { background: rgba(255,255,255,.1) !important; }

  .om-page-btn { transition: all .15s ease; cursor: pointer; border: 1px solid rgba(255,255,255,.07); }
  .om-page-btn:hover:not(:disabled) { border-color: var(--accent,#ff6b35) !important; color: var(--accent,#ff6b35) !important; background: rgba(255,107,53,.06) !important; }
  .om-page-btn:disabled { opacity: .28; cursor: not-allowed; }
  .om-page-btn.pg-active { background: var(--accent,#ff6b35) !important; border-color: var(--accent,#ff6b35) !important; color:#fff !important; }

  .om-status-btn { transition: all .14s ease; cursor: pointer; border: none; }
  .om-status-btn:hover { filter: brightness(1.15); transform: translateY(-1px); }

  .om-spinner {
    width: 18px; height: 18px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.1);
    border-top-color: var(--accent,#ff6b35);
    animation: omSpin .7s linear infinite;
  }
  .om-skeleton {
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
    background-size: 200% 100%;
    animation: omSkeleton 1.4s ease infinite;
    border-radius: 6px;
  }
  @keyframes omSkeleton { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
`

/* ════════ HELPERS ════════ */
const mono: React.CSSProperties = { fontFamily: "var(--font-mono,'DM Mono',monospace)" }
const glass = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: "var(--bg3,#18181f)", border: "1px solid var(--border,rgba(255,255,255,.07))", borderRadius: 14, ...extra,
})
const fmt = (n: number) => `$${Number(n ?? 0).toFixed(2)}`
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
const initials = (name: string) =>
    (name ?? "?").split(" ").filter(Boolean).slice(-2).map(w => w[0]).join("").toUpperCase()

const AVATAR_COLORS = ["#ff6b35", "#22c55e", "#60a5fa", "#f59e0b", "#a78bfa", "#34d399", "#fb7185", "#38bdf8"]
const avatarColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length]

/* ════════ COMPONENTS ════════ */
const Avatar = ({ name, id, size = 32 }: { name: string; id: number; size?: number }) => {
    const color = avatarColor(id)
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%", flexShrink: 0,
            background: color + "28", border: `2px solid ${color}50`,
            display: "flex", alignItems: "center", justifyContent: "center",
            ...mono, fontSize: size * 0.33, fontWeight: 700, color,
        }}>
            {initials(name)}
        </div>
    )
}

const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const cfg = STATUS_CFG[status] ?? STATUS_CFG.PENDING
    const isLive = status === "SHIPPING"
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            ...mono, fontSize: 10, fontWeight: 600,
            padding: "3px 9px", borderRadius: 99,
            background: cfg.bg, color: cfg.color, whiteSpace: "nowrap",
        }}>
            <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: cfg.dot, flexShrink: 0,
                ...(isLive ? { animation: "omPulse 2s ease infinite" } : {}),
            }} />
            {cfg.label}
        </span>
    )
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <p style={{ ...mono, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>
        {children}
    </p>
)

const Row = ({ label, value }: { label: React.ReactNode; value: React.ReactNode }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <span style={{ fontSize: 12, color: "var(--muted2,#9490a8)" }}>{label}</span>
        <span style={{ ...mono, fontSize: 11, fontWeight: 500, color: "var(--text)" }}>{value}</span>
    </div>
)

/* ════════ TIMELINE ════════ */
const OrderTimeline = ({ status }: { status: OrderStatus }) => {
    const steps: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED"]
    const isCancelled = status === "CANCELLED"
    const isRefunded = status === "REFUNDED"
    const isPendingPay = status === "PENDING_PAYMENT"

    if (isCancelled || isRefunded || isPendingPay) {
        const cfg = STATUS_CFG[status]
        return (
            <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: cfg.bg, border: `1px solid ${cfg.dot}30`,
                borderRadius: 10, padding: "12px 16px",
            }}>
                <span style={{ fontSize: 20 }}>{cfg.icon}</span>
                <div>
                    <p style={{ ...mono, fontSize: 12, fontWeight: 700, color: cfg.color }}>{cfg.label}</p>
                    <p style={{ ...mono, fontSize: 10, color: "var(--muted)", marginTop: 2 }}>
                        {isCancelled ? "This order was cancelled" : isRefunded ? "Refund has been processed" : "Waiting for payment confirmation"}
                    </p>
                </div>
            </div>
        )
    }

    const activeIdx = steps.indexOf(status)
    return (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
            {steps.map((step, i) => {
                const cfg = STATUS_CFG[step]
                const done = i <= activeIdx
                const active = i === activeIdx
                return (
                    <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                        {i < steps.length - 1 && (
                            <div style={{
                                position: "absolute", top: 14, left: "50%", width: "100%", height: 2,
                                background: i < activeIdx ? cfg.dot : "rgba(255,255,255,0.08)", transition: "background .3s ease",
                            }} />
                        )}
                        <div style={{
                            width: 28, height: 28, borderRadius: "50%", zIndex: 1, flexShrink: 0,
                            background: done ? cfg.bg : "rgba(255,255,255,0.04)",
                            border: `2px solid ${done ? cfg.dot : "rgba(255,255,255,0.1)"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: active ? `0 0 0 4px ${cfg.dot}20` : "none", transition: "all .3s ease",
                        }}>
                            {done
                                ? <span style={{ fontSize: 11 }}>{cfg.icon}</span>
                                : <span style={{ ...mono, fontSize: 9, color: "var(--muted)" }}>{i + 1}</span>}
                        </div>
                        <p style={{ ...mono, fontSize: 9, marginTop: 6, textAlign: "center", color: done ? cfg.color : "var(--muted)", fontWeight: active ? 700 : 400 }}>
                            {cfg.label}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}

/* ════════ ORDER DETAIL DRAWER ════════ */
function OrderDrawer({
    order,
    onClose,
    onStatusChange,
}: {
    order: OrderAdminResponse
    onClose: () => void
    onStatusChange: (id: number, status: OrderStatus) => void
}) {
    const [confirmStatus, setConfirmStatus] = useState<OrderStatus | null>(null)
    const [updating, setUpdating] = useState(false)
    const nextSteps = STATUS_NEXT[order.orderStatus] ?? []
    const pay = PAYMENT_CFG[order.paymentMethod]

    const handleConfirm = async () => {
        if (!confirmStatus) return
        setUpdating(true)
        try {
            // Call API if endpoint exists; fall back to optimistic update
            // await orderApi.updateOrderStatus(order.id, confirmStatus)
            onStatusChange(order.id, confirmStatus)
        } finally {
            setUpdating(false)
            setConfirmStatus(null)
            onClose()
        }
    }

    return (
        <div className="om-overlay"
            onClick={e => e.target === e.currentTarget && onClose()}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", justifyContent: "flex-end" }}
        >
            <div className="om-drawer" style={{
                width: "min(500px,100vw)", height: "100vh", overflowY: "auto",
                background: "var(--bg2,#111117)", borderLeft: "1px solid var(--border)",
                display: "flex", flexDirection: "column",
            }}>
                {/* Header */}
                <div style={{ padding: "22px 24px 20px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                        <div>
                            <p style={{ ...mono, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>
                                Order Detail
                            </p>
                            <h2 style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
                                {order.orderCode}
                            </h2>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <StatusBadge status={order.orderStatus} />
                                <span style={{ ...mono, fontSize: 10, color: "var(--muted)" }}>{fmtDate(order.orderDate)}</span>
                            </div>
                        </div>
                        <button className="om-icon-btn" onClick={onClose} style={{
                            background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
                            borderRadius: 8, width: 32, height: 32, fontSize: 14, color: "var(--muted2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>✕</button>
                    </div>
                    <OrderTimeline status={order.orderStatus} />
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* Customer */}
                    <section>
                        <SectionTitle>Customer</SectionTitle>
                        <div style={{ ...glass(), padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                            <Avatar name={order.customerName} id={order.id} size={42} />
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{order.customerName}</p>
                                <p style={{ ...mono, fontSize: 11, color: "var(--muted)" }}>{order.customerEmail}</p>
                            </div>
                            <span style={{ ...mono, fontSize: 10, color: "var(--muted)", marginLeft: "auto" }}>
                                #{String(order.id).padStart(5, "0")}
                            </span>
                        </div>
                    </section>

                    {/* Order Summary */}
                    <section>
                        <SectionTitle>Order Summary</SectionTitle>
                        <div style={{ ...glass(), padding: "14px 16px" }}>
                            <Row label="Order Code" value={<span style={{ color: "var(--accent,#ff6b35)" }}>{order.orderCode}</span>} />
                            <Row label="Books ordered" value={`${order.countItem} item${order.countItem !== 1 ? "s" : ""}`} />
                            <Row label="Order Date" value={fmtDate(order.orderDate)} />
                            <div style={{ borderTop: "1px solid var(--border)", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ ...mono, fontSize: 11, fontWeight: 700, color: "var(--muted2)" }}>Total</span>
                                <span style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 22, fontWeight: 700, color: "var(--accent,#ff6b35)" }}>
                                    {fmt(order.orderTotalAmount)}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Payment */}
                    <section>
                        <SectionTitle>Payment</SectionTitle>
                        <div style={{ ...glass(), padding: "14px 16px" }}>
                            <Row
                                label="Method"
                                value={<span style={{ color: pay.color }}>{pay.icon} {pay.label}</span>}
                            />
                            <Row
                                label="Status"
                                value={
                                    order.paymentMethod === "COD"
                                        ? <span style={{ color: order.orderStatus === "DELIVERED" ? "#22c55e" : "#f59e0b" }}>
                                            {order.orderStatus === "DELIVERED" ? "✓ Collected" : "⏳ Pending"}
                                        </span>
                                        : order.orderStatus === "PENDING_PAYMENT"
                                            ? <span style={{ color: "#fb7185" }}>⏳ Awaiting payment</span>
                                            : <span style={{ color: "#22c55e" }}>✓ Paid</span>
                                }
                            />
                        </div>
                    </section>

                    {/* Status Actions */}
                    {nextSteps.length > 0 && (
                        <section>
                            <SectionTitle>Update Status</SectionTitle>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {nextSteps.map(s => {
                                    const cfg = STATUS_CFG[s]
                                    return (
                                        <button key={s} className="om-status-btn" onClick={() => setConfirmStatus(s)} style={{
                                            ...mono, fontSize: 11, fontWeight: 600,
                                            padding: "8px 16px", borderRadius: 8,
                                            background: cfg.bg, color: cfg.color,
                                            border: `1px solid ${cfg.dot}40`,
                                        }}>
                                            {cfg.icon} Mark as {cfg.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* Confirm modal */}
            {confirmStatus && (
                <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                    <div className="om-modal" style={{ ...glass(), borderRadius: 16, padding: 24, maxWidth: 360, width: "100%" }}>
                        <p style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
                            Confirm Status Change
                        </p>
                        <p style={{ fontSize: 13, color: "var(--muted2)", lineHeight: 1.6, marginBottom: 20 }}>
                            Mark <strong style={{ color: "var(--text)" }}>{order.orderCode}</strong> as{" "}
                            <strong style={{ color: STATUS_CFG[confirmStatus].color }}>{STATUS_CFG[confirmStatus].label}</strong>?
                        </p>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button className="om-btn-ghost" onClick={() => setConfirmStatus(null)} style={{
                                flex: 1, ...mono, fontSize: 12, padding: "9px 0", borderRadius: 8,
                                background: "rgba(255,255,255,0.05)", color: "var(--muted2)",
                            }}>Cancel</button>
                            <button className="om-btn-primary" onClick={handleConfirm} disabled={updating} style={{
                                flex: 1, ...mono, fontSize: 12, fontWeight: 600, padding: "9px 0", borderRadius: 8,
                                background: STATUS_CFG[confirmStatus].dot, color: "#fff",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            }}>
                                {updating ? <span className="om-spinner" style={{ width: 14, height: 14 }} /> : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

/* ════════ SKELETON ROWS ════════ */
const SkeletonRow = () => (
    <tr style={{ borderBottom: "1px solid var(--border)" }}>
        {[48, 130, 160, 60, 80, 70, 90, 80, 60].map((w, i) => (
            <td key={i} style={{ padding: "16px 14px" }}>
                <div className="om-skeleton" style={{ height: 12, width: w }} />
            </td>
        ))}
    </tr>
)

/* ════════ MAIN PAGE ════════ */
export const OrderManagementPage = () => {
    const [stats, setStats] = useState<OrderDashboardStats | null>(null)
    const [orders, setOrders] = useState<OrderAdminResponse[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [totalElements, setTotalElements] = useState(0)
    const [loading, setLoading] = useState(false)
    const [statsLoading, setStatsLoading] = useState(true)

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState<OrderStatus | "ALL">("ALL")
    const [filterPayment, setFilterPayment] = useState<PaymentMethod | "ALL">("ALL")
    const [sortBy, setSortBy] = useState<"orderDate" | "orderTotalAmount" | "orderCode">("orderDate")
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
    const [page, setPage] = useState(1)
    const PAGE_SIZE = 10

    const [selected, setSelected] = useState<OrderAdminResponse | null>(null)
    const [toast, setToast] = useState<string | null>(null)

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    /* ── Debounce search ── */
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(1)
        }, 400)
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    }, [search])

    /* ── Fetch stats ── */
    useEffect(() => {
        const fetch = async () => {
            setStatsLoading(true)
            try {
                const res = await orderApi.getOrderDashboardStats()
                setStats(res)
            } catch (e) {
                console.error("Failed to fetch stats:", e)
            } finally {
                setStatsLoading(false)
            }
        }
        fetch()
    }, [])

    /* ── Fetch orders (server-side) ── */
    const fetchOrders = useCallback(async () => {
        setLoading(true)
        try {
            const res = await orderApi.getAllOrderAdmins({
                keyword: debouncedSearch || undefined,
                orderStatus: filterStatus !== "ALL" ? filterStatus : undefined,
                paymentMethod: filterPayment !== "ALL" ? filterPayment : undefined,
                page: page - 1,          // Spring is 0-indexed
                size: PAGE_SIZE,
                sort: `${sortBy},${sortDir}`,
            })
            setOrders(res.content)
            setTotalPages(res.totalPages)
            setTotalElements(res.totalElements)
        } catch (e) {
            console.error("Failed to fetch orders:", e)
        } finally {
            setLoading(false)
        }
    }, [debouncedSearch, filterStatus, filterPayment, page, sortBy, sortDir])

    useEffect(() => { fetchOrders() }, [fetchOrders])

    /* ── Helpers ── */
    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2800) }

    const toggleSort = (col: typeof sortBy) => {
        if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc")
        else { setSortBy(col); setSortDir("desc") }
        setPage(1)
    }

    const handleStatusChange = (id: number, status: OrderStatus) => {
        setOrders(os => os.map(o => o.id === id ? { ...o, orderStatus: status } : o))
        showToast(`Order updated → ${STATUS_CFG[status].label}`)
        // Re-fetch to get accurate data from server
        fetchOrders()
    }

    const clearFilters = () => {
        setSearch(""); setDebouncedSearch("")
        setFilterStatus("ALL"); setFilterPayment("ALL"); setPage(1)
    }
    const hasFilters = filterStatus !== "ALL" || filterPayment !== "ALL" || search !== ""

    const SortIcon = ({ col }: { col: typeof sortBy }) => (
        <span style={{ ...mono, fontSize: 9, marginLeft: 4, opacity: sortBy === col ? 1 : 0.3 }}>
            {sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
        </span>
    )

    const thSort = (col: typeof sortBy): React.CSSProperties => ({
        ...mono, fontSize: 10, fontWeight: 600, letterSpacing: 1,
        color: sortBy === col ? "var(--accent,#ff6b35)" : "var(--muted)",
        textTransform: "uppercase", padding: "10px 14px", textAlign: "left",
        cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
    })
    const thStatic: React.CSSProperties = {
        ...mono, fontSize: 10, fontWeight: 600, color: "var(--muted)",
        textTransform: "uppercase", padding: "10px 14px", textAlign: "left", whiteSpace: "nowrap", letterSpacing: 1,
    }

    /* ── Pagination pages array ── */
    const pageNums = (): (number | "…")[] => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
        const arr: (number | "…")[] = [1]
        if (page > 3) arr.push("…")
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) arr.push(i)
        if (page < totalPages - 2) arr.push("…")
        arr.push(totalPages)
        return arr
    }

    /* ════════ RENDER ════════ */
    return (
        <div className="om">
            <style>{CSS}</style>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: "fixed", bottom: 24, right: 24, zIndex: 100,
                    background: "var(--bg3)", border: "1px solid rgba(255,255,255,0.12)",
                    borderLeft: "3px solid var(--accent,#ff6b35)", borderRadius: 10,
                    padding: "12px 18px", ...mono, fontSize: 12, color: "var(--text)",
                    animation: "omUp .3s cubic-bezier(.22,1,.36,1) both",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}>✓ {toast}</div>
            )}

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 28px" }}>

                {/* ── Header ── */}
                <div className="om-up" style={{ marginBottom: 28 }}>
                    <p style={{ ...mono, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
                        Store Management
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h1 style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px" }}>
                            Orders
                        </h1>
                        {loading && (
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div className="om-spinner" />
                                <span style={{ ...mono, fontSize: 11, color: "var(--muted)" }}>Syncing…</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Stats ── */}
                <div className="om-up" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20, animationDelay: "40ms" }}>
                    {[
                        { label: "Total Revenue", value: stats ? fmt(stats.totalRevenue) : null, icon: "💰", color: "var(--accent,#ff6b35)", sub: "from delivered" },
                        { label: "Pending", value: stats ? String(stats.totalPending) : null, icon: "⏳", color: "#f59e0b", sub: "awaiting confirm" },
                        { label: "In Shipping", value: stats ? String(stats.totalShipping) : null, icon: "🚚", color: "#c4b5fd", sub: "on the way" },
                        { label: "Delivered", value: stats ? String(stats.totalDelivered) : null, icon: "📦", color: "#22c55e", sub: "completed" },
                    ].map((s, i) => (
                        <div key={i} style={{ ...glass(), padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                            <span style={{ fontSize: 24 }}>{s.icon}</span>
                            <div>
                                <p style={{ ...mono, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{s.label}</p>
                                {statsLoading || !s.value
                                    ? <div className="om-skeleton" style={{ height: 28, width: 70, marginBottom: 6 }} />
                                    : <p style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</p>
                                }
                                <p style={{ ...mono, fontSize: 9, color: "var(--muted)", marginTop: 3 }}>{s.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Status breakdown bar ── */}
                <div className="om-up" style={{ ...glass(), padding: "14px 18px", marginBottom: 16, animationDelay: "60ms" }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ ...mono, fontSize: 10, color: "var(--muted)", marginRight: 4 }}>BREAKDOWN</span>
                        {/* "ALL" chip */}
                        <div onClick={() => { setFilterStatus("ALL"); setPage(1) }}
                            style={{
                                display: "flex", alignItems: "center", gap: 6,
                                padding: "5px 10px", borderRadius: 8, cursor: "pointer",
                                background: filterStatus === "ALL" ? "rgba(255,107,53,0.12)" : "rgba(255,255,255,0.03)",
                                border: `1px solid ${filterStatus === "ALL" ? "#ff6b3550" : "var(--border)"}`,
                                transition: "all .15s ease",
                            }}>
                            <span style={{ ...mono, fontSize: 10, color: filterStatus === "ALL" ? "var(--accent,#ff6b35)" : "var(--muted2)" }}>All</span>
                            <span style={{ ...mono, fontSize: 11, fontWeight: 700, color: filterStatus === "ALL" ? "var(--accent,#ff6b35)" : "var(--text)" }}>{totalElements}</span>
                        </div>
                        {STATUS_ORDER.map(s => {
                            const cfg = STATUS_CFG[s]
                            const isActive = filterStatus === s
                            return (
                                <div key={s} onClick={() => { setFilterStatus(isActive ? "ALL" : s); setPage(1) }}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 6,
                                        padding: "5px 10px", borderRadius: 8, cursor: "pointer",
                                        background: isActive ? cfg.bg : "rgba(255,255,255,0.03)",
                                        border: `1px solid ${isActive ? cfg.dot + "50" : "var(--border)"}`,
                                        transition: "all .15s ease",
                                    }}>
                                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
                                    <span style={{ ...mono, fontSize: 10, color: isActive ? cfg.color : "var(--muted2)" }}>{cfg.label}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* ── Filters ── */}
                <div className="om-up" style={{
                    ...glass(), padding: "14px 16px", display: "flex", alignItems: "center",
                    gap: 12, flexWrap: "wrap", marginBottom: 16, animationDelay: "80ms",
                }}>
                    {/* Search */}
                    <div style={{
                        flex: 1, minWidth: 220, display: "flex", alignItems: "center", gap: 8,
                        background: "var(--bg2,#111117)", border: "1px solid var(--border)",
                        borderRadius: 8, padding: "8px 12px",
                    }}>
                        <span style={{ fontSize: 13, color: "var(--muted)" }}>🔍</span>
                        <input
                            className="om-input" value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search order code or customer name…"
                            style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: "var(--text)", width: "100%", ...mono }}
                        />
                        {search && (
                            <button onClick={() => { setSearch(""); setDebouncedSearch(""); setPage(1) }}
                                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 14 }}>✕</button>
                        )}
                    </div>

                    {/* Payment filter */}
                    <select className="om-input" value={filterPayment}
                        onChange={e => { setFilterPayment(e.target.value as any); setPage(1) }}
                        style={{ ...mono, fontSize: 11, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px", color: "var(--muted2)", cursor: "pointer" }}>
                        <option value="ALL">All Payments</option>
                        {(Object.keys(PAYMENT_CFG) as PaymentMethod[]).map(p => (
                            <option key={p} value={p}>{PAYMENT_CFG[p].icon} {PAYMENT_CFG[p].label}</option>
                        ))}
                    </select>

                    {hasFilters && (
                        <button className="om-btn-ghost" onClick={clearFilters}
                            style={{ ...mono, fontSize: 11, padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,0.05)", color: "var(--muted2)" }}>
                            Clear filters ✕
                        </button>
                    )}

                    <span style={{ ...mono, fontSize: 10, color: "var(--muted)", marginLeft: "auto" }}>
                        {totalElements} order{totalElements !== 1 ? "s" : ""} · {totalPages} page{totalPages !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* ── Table ── */}
                <div className="om-up" style={{ ...glass(), overflow: "hidden", animationDelay: "120ms" }}>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                                    <th style={thStatic}>#</th>
                                    <th onClick={() => toggleSort("orderCode")} style={thSort("orderCode")}>Order Code <SortIcon col="orderCode" /></th>
                                    <th style={thStatic}>Customer</th>
                                    <th style={thStatic}>Items</th>
                                    <th style={thStatic}>Payment</th>
                                    <th onClick={() => toggleSort("orderTotalAmount")} style={thSort("orderTotalAmount")}>Total <SortIcon col="orderTotalAmount" /></th>
                                    <th style={thStatic}>Status</th>
                                    <th onClick={() => toggleSort("orderDate")} style={thSort("orderDate")}>Date <SortIcon col="orderDate" /></th>
                                    <th style={{ ...thStatic, textAlign: "right" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonRow key={i} />)
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} style={{ textAlign: "center", padding: "52px 0", color: "var(--muted)" }}>
                                            <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
                                            <p style={{ ...mono, fontSize: 12 }}>No orders found</p>
                                        </td>
                                    </tr>
                                ) : orders.map((o, i) => {
                                    const pay = PAYMENT_CFG[o.paymentMethod]
                                    return (
                                        <tr key={o.id} className="om-row" onClick={() => setSelected(o)}
                                            style={{ borderBottom: "1px solid var(--border)" }}>

                                            {/* # */}
                                            <td style={{ ...mono, fontSize: 11, color: "var(--muted)", padding: "13px 14px" }}>
                                                {String((page - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}
                                            </td>

                                            {/* Order code */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <p style={{ ...mono, fontSize: 12, fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap" }}>
                                                    {o.orderCode}
                                                </p>
                                            </td>

                                            {/* Customer */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 160 }}>
                                                    <Avatar name={o.customerName} id={o.id} size={30} />
                                                    <div style={{ minWidth: 0 }}>
                                                        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}>
                                                            {o.customerName}
                                                        </p>
                                                        <p style={{ ...mono, fontSize: 10, color: "var(--muted)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}>
                                                            {o.customerEmail}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Items */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <p style={{ ...mono, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                                                    {o.countItem}
                                                </p>
                                                <p style={{ ...mono, fontSize: 10, color: "var(--muted)", marginTop: 1 }}>book{o.countItem !== 1 ? "s" : ""}</p>
                                            </td>

                                            {/* Payment */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <span style={{ ...mono, fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 99, background: "rgba(255,255,255,0.05)", color: pay.color, whiteSpace: "nowrap" }}>
                                                    {pay.icon} {pay.label}
                                                </span>
                                            </td>

                                            {/* Total */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <p style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 15, fontWeight: 700, color: "var(--accent,#ff6b35)" }}>
                                                    {fmt(o.orderTotalAmount)}
                                                </p>
                                            </td>

                                            {/* Status */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <StatusBadge status={o.orderStatus} />
                                            </td>

                                            {/* Date */}
                                            <td style={{ ...mono, fontSize: 11, color: "var(--muted2)", padding: "13px 14px", whiteSpace: "nowrap" }}>
                                                {fmtDate(o.orderDate)}
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: "13px 14px", textAlign: "right" }}>
                                                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }} onClick={e => e.stopPropagation()}>
                                                    <button className="om-icon-btn" title="View detail" onClick={() => setSelected(o)} style={{
                                                        background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
                                                        borderRadius: 7, width: 30, height: 30, fontSize: 13, cursor: "pointer", color: "var(--muted2)",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                    }}>👁</button>
                                                    {/* Quick next-status */}
                                                    {STATUS_NEXT[o.orderStatus]?.[0] && (() => {
                                                        const next = STATUS_NEXT[o.orderStatus]![0]
                                                        const cfg = STATUS_CFG[next]
                                                        return (
                                                            <button className="om-icon-btn" title={`Mark as ${cfg.label}`}
                                                                onClick={() => handleStatusChange(o.id, next)}
                                                                style={{
                                                                    background: cfg.bg, border: `1px solid ${cfg.dot}40`,
                                                                    borderRadius: 7, width: 30, height: 30, fontSize: 11, cursor: "pointer", color: cfg.color,
                                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                                }}>
                                                                {cfg.icon}
                                                            </button>
                                                        )
                                                    })()}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Pagination ── */}
                {totalPages > 0 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 4px", flexWrap: "wrap", gap: 12 }}>
                        <p style={{ ...mono, fontSize: 11, color: "var(--muted)" }}>
                            Showing{" "}
                            <span style={{ color: "var(--text)", fontWeight: 600 }}>
                                {Math.min((page - 1) * PAGE_SIZE + 1, totalElements)}–{Math.min(page * PAGE_SIZE, totalElements)}
                            </span>
                            {" "}of <span style={{ color: "var(--text)", fontWeight: 600 }}>{totalElements}</span> orders
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <button className="om-page-btn" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}
                                style={{ ...mono, fontSize: 12, background: "var(--bg3)", borderRadius: 8, color: "var(--muted2)", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                ←
                            </button>
                            {pageNums().map((p, idx) =>
                                p === "…"
                                    ? <span key={`e${idx}`} style={{ ...mono, fontSize: 11, color: "var(--muted)", width: 20, textAlign: "center" }}>…</span>
                                    : <button key={p} className={`om-page-btn${page === p ? " pg-active" : ""}`} onClick={() => setPage(p as number)}
                                        style={{ ...mono, fontSize: 12, fontWeight: page === p ? 700 : 400, background: "var(--bg3)", borderRadius: 8, color: "var(--muted2)", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {p}
                                    </button>
                            )}
                            <button className="om-page-btn" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                style={{ ...mono, fontSize: 12, background: "var(--bg3)", borderRadius: 8, color: "var(--muted2)", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail drawer */}
            {selected && (
                <OrderDrawer
                    order={selected}
                    onClose={() => setSelected(null)}
                    onStatusChange={(id, status) => {
                        handleStatusChange(id, status)
                        setSelected(o => o ? { ...o, orderStatus: status } : o)
                    }}
                />
            )}
        </div>
    )
}