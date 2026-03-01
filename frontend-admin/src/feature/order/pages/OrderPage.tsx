import React, { useState, useMemo } from "react"

/* ════════ TYPES ════════ */
type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELLED" | "REFUNDED"
type PaymentMethod = "COD" | "VNPAY" | "MOMO" | "CREDIT_CARD"

interface BookSnap { id: number; title: string; salePrice: number }
interface OrderItem { bookSnap: BookSnap; quantity: number; unitPrice: number }
interface Address { id: number; fullName: string; phone: string; street: string; district: string; city: string }
interface Discount { code: string; value: number }

interface Order {
    id: number
    orderCode: string
    orderTotalAmount: number
    orderDate: string          // LocalDate → ISO string
    orderStatus: OrderStatus
    paymentMethod: PaymentMethod
    transactionId?: string
    shippingAddress: Address
    discount?: Discount
    items: OrderItem[]
    orderUser: { id: number; fullName: string; email: string; avatarColor: string }
}

/* ════════ MOCK DATA ════════ */
const BOOKS: BookSnap[] = [
    { id: 1, title: "Atomic Habits", salePrice: 18.99 },
    { id: 2, title: "Deep Work", salePrice: 16.50 },
    { id: 3, title: "Clean Code", salePrice: 39.99 },
    { id: 4, title: "The Pragmatic Programmer", salePrice: 44.99 },
    { id: 5, title: "Sapiens", salePrice: 21.00 },
    { id: 6, title: "Zero to One", salePrice: 17.80 },
    { id: 7, title: "The Lean Startup", salePrice: 19.50 },
    { id: 8, title: "Thinking, Fast and Slow", salePrice: 23.99 },
]

const COLORS = ["#ff6b35", "#22c55e", "#60a5fa", "#f59e0b", "#a78bfa", "#34d399", "#fb7185", "#38bdf8"]
const mkUser = (id: number, name: string, email: string) => ({ id, fullName: name, email, avatarColor: COLORS[id % COLORS.length] })

const mkAddr = (id: number, name: string, phone: string, street: string, city: string): Address =>
    ({ id, fullName: name, phone, street, district: "District 1", city })

const ORDERS: Order[] = [
    {
        id: 101, orderCode: "ORD-2024-0101", orderTotalAmount: 55.49, orderDate: "2024-02-10",
        orderStatus: "DELIVERED", paymentMethod: "MOMO", transactionId: undefined,
        shippingAddress: mkAddr(1, "Nguyen Van An", "0901234567", "12 Le Loi St", "Ho Chi Minh"),
        discount: { code: "SALE10", value: 10 },
        items: [{ bookSnap: BOOKS[0], quantity: 2, unitPrice: 18.99 }, { bookSnap: BOOKS[1], quantity: 1, unitPrice: 16.50 }],
        orderUser: mkUser(1, "Nguyen Van An", "an.nguyen@gmail.com"),
    },
    {
        id: 102, orderCode: "ORD-2024-0102", orderTotalAmount: 39.99, orderDate: "2024-03-05",
        orderStatus: "DELIVERED", paymentMethod: "VNPAY", transactionId: "TXN-VNP-8821",
        shippingAddress: mkAddr(1, "Nguyen Van An", "0901234567", "12 Le Loi St", "Ho Chi Minh"),
        discount: undefined,
        items: [{ bookSnap: BOOKS[2], quantity: 1, unitPrice: 39.99 }],
        orderUser: mkUser(1, "Nguyen Van An", "an.nguyen@gmail.com"),
    },
    {
        id: 103, orderCode: "ORD-2024-0103", orderTotalAmount: 21.00, orderDate: "2024-04-20",
        orderStatus: "CANCELLED", paymentMethod: "COD", transactionId: undefined,
        shippingAddress: mkAddr(1, "Nguyen Van An", "0901234567", "12 Le Loi St", "Ho Chi Minh"),
        discount: undefined,
        items: [{ bookSnap: BOOKS[4], quantity: 1, unitPrice: 21.00 }],
        orderUser: mkUser(1, "Nguyen Van An", "an.nguyen@gmail.com"),
    },
    {
        id: 104, orderCode: "ORD-2024-0104", orderTotalAmount: 61.99, orderDate: "2024-02-18",
        orderStatus: "DELIVERED", paymentMethod: "CREDIT_CARD", transactionId: "TXN-9928A1",
        shippingAddress: mkAddr(2, "Tran Thi Bich", "0912345678", "24 Tran Phu St", "Da Nang"),
        discount: undefined,
        items: [{ bookSnap: BOOKS[2], quantity: 1, unitPrice: 39.99 }, { bookSnap: BOOKS[5], quantity: 1, unitPrice: 17.80 }],
        orderUser: mkUser(2, "Tran Thi Bich", "bich.tran@company.vn"),
    },
    {
        id: 105, orderCode: "ORD-2024-0105", orderTotalAmount: 44.99, orderDate: "2024-03-22",
        orderStatus: "SHIPPING", paymentMethod: "VNPAY", transactionId: "TXN-VNP-9934",
        shippingAddress: mkAddr(2, "Tran Thi Bich", "0912345678", "24 Tran Phu St", "Da Nang"),
        discount: undefined,
        items: [{ bookSnap: BOOKS[3], quantity: 1, unitPrice: 44.99 }],
        orderUser: mkUser(2, "Tran Thi Bich", "bich.tran@company.vn"),
    },
    {
        id: 106, orderCode: "ORD-2024-0106", orderTotalAmount: 96.77, orderDate: "2024-02-25",
        orderStatus: "DELIVERED", paymentMethod: "MOMO", transactionId: "TXN-CC1132",
        shippingAddress: mkAddr(3, "Le Minh Cuong", "0923456789", "36 Hoang Dieu St", "Hanoi"),
        discount: { code: "BOOK20", value: 20 },
        items: [
            { bookSnap: BOOKS[3], quantity: 1, unitPrice: 44.99 },
            { bookSnap: BOOKS[0], quantity: 1, unitPrice: 18.99 },
            { bookSnap: BOOKS[4], quantity: 1, unitPrice: 21.00 },
        ],
        orderUser: mkUser(3, "Le Minh Cuong", "cuong.le@dev.io"),
    },
    {
        id: 107, orderCode: "ORD-2024-0107", orderTotalAmount: 35.29, orderDate: "2024-03-15",
        orderStatus: "DELIVERED", paymentMethod: "COD", transactionId: undefined,
        shippingAddress: mkAddr(5, "Hoang Van Em", "0945678901", "60 Nguyen Hue St", "Can Tho"),
        discount: undefined,
        items: [{ bookSnap: BOOKS[1], quantity: 1, unitPrice: 16.50 }, { bookSnap: BOOKS[5], quantity: 1, unitPrice: 17.80 }],
        orderUser: mkUser(5, "Hoang Van Em", "em.hoang@outlook.com"),
    },
    {
        id: 108, orderCode: "ORD-2024-0108", orderTotalAmount: 18.99, orderDate: "2024-04-02",
        orderStatus: "REFUNDED", paymentMethod: "MOMO", transactionId: "TXN-MO-7741",
        shippingAddress: mkAddr(5, "Hoang Van Em", "0945678901", "60 Nguyen Hue St", "Can Tho"),
        discount: undefined,
        items: [{ bookSnap: BOOKS[0], quantity: 1, unitPrice: 18.99 }],
        orderUser: mkUser(5, "Hoang Van Em", "em.hoang@outlook.com"),
    },
    {
        id: 109, orderCode: "ORD-2024-0109", orderTotalAmount: 122.77, orderDate: "2024-04-05",
        orderStatus: "PENDING", paymentMethod: "CREDIT_CARD", transactionId: "TXN-CC9901",
        shippingAddress: mkAddr(6, "Vu Thi Phuong", "0956789012", "72 Nam Ky St", "Ho Chi Minh"),
        discount: undefined,
        items: [{ bookSnap: BOOKS[2], quantity: 2, unitPrice: 39.99 }, { bookSnap: BOOKS[3], quantity: 1, unitPrice: 44.99 }],
        orderUser: mkUser(6, "Vu Thi Phuong", "phuong.vu@studio.com"),
    },
    {
        id: 110, orderCode: "ORD-2024-0110", orderTotalAmount: 43.49, orderDate: "2024-04-10",
        orderStatus: "CONFIRMED", paymentMethod: "MOMO", transactionId: "TXN-MO-8812",
        shippingAddress: mkAddr(7, "Dinh Van Hung", "0967890123", "84 Pham Ngu Lao", "Ho Chi Minh"),
        discount: { code: "NEWUSER", value: 5 },
        items: [{ bookSnap: BOOKS[6], quantity: 1, unitPrice: 19.50 }, { bookSnap: BOOKS[7], quantity: 1, unitPrice: 23.99 }],
        orderUser: mkUser(7, "Dinh Van Hung", "hung.dinh@gmail.com"),
    },
    {
        id: 111, orderCode: "ORD-2024-0111", orderTotalAmount: 79.98, orderDate: "2024-04-12",
        orderStatus: "SHIPPING", paymentMethod: "VNPAY", transactionId: "TXN-VNP-1123",
        shippingAddress: mkAddr(8, "Nguyen Thi Lan", "0978901234", "96 Bui Vien St", "Ho Chi Minh"),
        discount: undefined,
        items: [{ bookSnap: BOOKS[7], quantity: 2, unitPrice: 23.99 }, { bookSnap: BOOKS[4], quantity: 1, unitPrice: 21.00 }],
        orderUser: mkUser(8, "Nguyen Thi Lan", "lan.nguyen@yahoo.com"),
    },
    {
        id: 112, orderCode: "ORD-2024-0112", orderTotalAmount: 17.80, orderDate: "2024-04-18",
        orderStatus: "PENDING", paymentMethod: "COD", transactionId: undefined,
        shippingAddress: mkAddr(9, "Pham Van Khanh", "0989012345", "108 Le Duan St", "Hanoi"),
        discount: undefined,
        items: [{ bookSnap: BOOKS[5], quantity: 1, unitPrice: 17.80 }],
        orderUser: mkUser(9, "Pham Van Khanh", "khanh.pham@hotmail.com"),
    },
]

/* ════════ STATUS FLOW ════════ */
const STATUS_NEXT: Partial<Record<OrderStatus, OrderStatus[]>> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["SHIPPING", "CANCELLED"],
    SHIPPING: ["DELIVERED", "REFUNDED"],
    DELIVERED: ["REFUNDED"],
}

/* ════════ CONFIG ════════ */
const STATUS_CFG: Record<OrderStatus, { label: string; bg: string; color: string; dot: string; icon: string }> = {
    PENDING: { label: "Pending", bg: "rgba(245,158,11,0.12)", color: "var(--amber,#f59e0b)", dot: "#f59e0b", icon: "⏳" },
    CONFIRMED: { label: "Confirmed", bg: "rgba(96,165,250,0.12)", color: "var(--blue,#60a5fa)", dot: "#60a5fa", icon: "✅" },
    SHIPPING: { label: "Shipping", bg: "rgba(167,139,250,0.12)", color: "#c4b5fd", dot: "#c4b5fd", icon: "🚚" },
    DELIVERED: { label: "Delivered", bg: "rgba(34,197,94,0.12)", color: "var(--green,#22c55e)", dot: "#22c55e", icon: "📦" },
    CANCELLED: { label: "Cancelled", bg: "rgba(255,255,255,0.06)", color: "var(--muted2)", dot: "#6b6880", icon: "✕" },
    REFUNDED: { label: "Refunded", bg: "rgba(239,68,68,0.12)", color: "var(--red,#ef4444)", dot: "#ef4444", icon: "↩" },
}

const PAYMENT_CFG: Record<PaymentMethod, { label: string; icon: string; color: string }> = {
    COD: { label: "COD", icon: "💵", color: "var(--muted2)" },
    VNPAY: { label: "VNPay", icon: "🏦", color: "#1a94ff" },
    MOMO: { label: "MoMo", icon: "💜", color: "#ae2070" },
    CREDIT_CARD: { label: "Credit Card", icon: "💳", color: "var(--blue)" },
}

/* ════════ CSS ════════ */
const CSS = `
  .om * { box-sizing: border-box; margin: 0; padding: 0; }
  .om {
    font-family: var(--font-body, 'DM Sans', sans-serif);
    background: var(--bg, #0c0c10);
    min-height: 100vh;
    color: var(--text, #e8e4f0);
  }

  @keyframes omUp {
    from { opacity:0; transform:translateY(12px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes omFade { from { opacity:0; } to { opacity:1; } }
  @keyframes omSlide {
    from { opacity:0; transform:translateX(32px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes omPulse {
    0%,100% { opacity:1; } 50% { opacity:.4; }
  }

  .om-up     { animation: omUp .32s cubic-bezier(.22,1,.36,1) both; }
  .om-row    { transition: background .1s ease; cursor: pointer; }
  .om-row:hover { background: rgba(255,255,255,0.03) !important; }

  .om-overlay { animation: omFade .2s ease both; }
  .om-drawer  { animation: omSlide .28s cubic-bezier(.22,1,.36,1) both; }
  .om-modal   { animation: omUp .22s cubic-bezier(.22,1,.36,1) both; }

  .om-btn-primary { transition: all .15s ease; cursor: pointer; border: none; }
  .om-btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(255,107,53,.35); }
  .om-btn-primary:active { transform: translateY(0); }

  .om-btn-ghost { transition: background .15s ease; cursor: pointer; border: none; }
  .om-btn-ghost:hover { background: rgba(255,255,255,.07) !important; }

  .om-input { transition: border-color .15s ease; outline: none; }
  .om-input:focus { border-color: var(--accent,#ff6b35) !important; box-shadow: 0 0 0 3px rgba(255,107,53,.12); }

  .om-chip { cursor: pointer; transition: all .15s ease; }
  .om-chip:hover  { border-color: var(--accent,#ff6b35) !important; color: var(--accent,#ff6b35) !important; }
  .om-chip.active { background: var(--accent,#ff6b35) !important; border-color: var(--accent,#ff6b35) !important; color:#fff !important; }

  .om-icon-btn { transition: background .12s ease; cursor: pointer; }
  .om-icon-btn:hover { background: rgba(255,255,255,.1) !important; }

  .om-page-btn { transition: all .15s ease; cursor: pointer; border: 1px solid var(--border,rgba(255,255,255,.07)); }
  .om-page-btn:hover:not(:disabled) { border-color: var(--accent,#ff6b35) !important; color: var(--accent,#ff6b35) !important; background: rgba(255,107,53,.06) !important; }
  .om-page-btn:disabled { opacity: .28; cursor: not-allowed; }
  .om-page-btn.pg-active { background: var(--accent,#ff6b35) !important; border-color: var(--accent,#ff6b35) !important; color:#fff !important; }

  .om-status-btn { transition: all .14s ease; cursor: pointer; border: none; }
  .om-status-btn:hover { filter: brightness(1.15); transform: translateY(-1px); }

  .om-step-line { transition: background .3s ease; }
  .om-tab { cursor: pointer; transition: all .15s ease; border: none; background: none; }
  .om-tab.active { border-bottom: 2px solid var(--accent,#ff6b35) !important; color: var(--text) !important; }
  .om-tab:not(.active):hover { color: var(--muted2,#9490a8) !important; }

  .om-live { animation: omPulse 2s ease infinite; }
`

/* ════════ HELPERS ════════ */
const mono: React.CSSProperties = { fontFamily: "var(--font-mono,'DM Mono',monospace)" }
const glass = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: "var(--bg3,#18181f)", border: "1px solid var(--border,rgba(255,255,255,.07))", borderRadius: 14, ...extra,
})
const fmt = (n: number) => `$${n.toFixed(2)}`
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
const initials = (name: string) => name.split(" ").filter(Boolean).slice(-2).map(w => w[0]).join("").toUpperCase()

const STATUS_ORDER: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED", "REFUNDED"]

/* ════════ MINI AVATAR ════════ */
const Avatar = ({ user, size = 32 }: { user: Order["orderUser"]; size?: number }) => (
    <div style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        background: user.avatarColor + "28", border: `2px solid ${user.avatarColor}50`,
        display: "flex", alignItems: "center", justifyContent: "center",
        ...mono, fontSize: size * 0.33, fontWeight: 700, color: user.avatarColor,
    }}>
        {initials(user.fullName)}
    </div>
)

/* ════════ STATUS BADGE ════════ */
const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const cfg = STATUS_CFG[status]
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

/* ════════ TIMELINE STEPPER ════════ */
const OrderTimeline = ({ status }: { status: OrderStatus }) => {
    const steps: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED"]
    const isCancelled = status === "CANCELLED"
    const isRefunded = status === "REFUNDED"

    if (isCancelled || isRefunded) {
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
                        {isCancelled ? "This order was cancelled" : "Refund has been processed"}
                    </p>
                </div>
            </div>
        )
    }

    const activeIdx = steps.indexOf(status)

    return (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 0, position: "relative" }}>
            {steps.map((step, i) => {
                const cfg = STATUS_CFG[step]
                const done = i <= activeIdx
                const active = i === activeIdx
                return (
                    <div key={step} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                        {/* Connector line */}
                        {i < steps.length - 1 && (
                            <div style={{
                                position: "absolute", top: 14, left: "50%", width: "100%", height: 2,
                                background: i < activeIdx ? cfg.dot : "rgba(255,255,255,0.08)",
                                transition: "background .3s ease",
                            }} />
                        )}
                        {/* Circle */}
                        <div style={{
                            width: 28, height: 28, borderRadius: "50%", zIndex: 1, flexShrink: 0,
                            background: done ? cfg.bg : "rgba(255,255,255,0.04)",
                            border: `2px solid ${done ? cfg.dot : "rgba(255,255,255,0.1)"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12,
                            boxShadow: active ? `0 0 0 4px ${cfg.dot}20` : "none",
                            transition: "all .3s ease",
                        }}>
                            {done ? <span style={{ fontSize: 11 }}>{cfg.icon}</span> : <span style={{ ...mono, fontSize: 9, color: "var(--muted)" }}>{i + 1}</span>}
                        </div>
                        {/* Label */}
                        <p style={{
                            ...mono, fontSize: 9, marginTop: 6, textAlign: "center",
                            color: done ? cfg.color : "var(--muted)",
                            fontWeight: active ? 700 : 400,
                        }}>{cfg.label}</p>
                    </div>
                )
            })}
        </div>
    )
}

/* ════════ ORDER DETAIL DRAWER ════════ */
function OrderDrawer({
    order, onClose, onStatusChange,
}: {
    order: Order
    onClose: () => void
    onStatusChange: (id: number, status: OrderStatus) => void
}) {
    const [confirmStatus, setConfirmStatus] = useState<OrderStatus | null>(null)
    const nextSteps = STATUS_NEXT[order.orderStatus] ?? []
    const subtotal = order.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0)
    const discountAmt = order.discount ? subtotal * (order.discount.value / 100) : 0

    return (
        <div className="om-overlay" onClick={e => e.target === e.currentTarget && onClose()}
            style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
                zIndex: 50, display: "flex", justifyContent: "flex-end",
            }}
        >
            <div className="om-drawer" style={{
                width: "min(540px,100vw)", height: "100vh", overflowY: "auto",
                background: "var(--bg2,#111117)", borderLeft: "1px solid var(--border)",
                display: "flex", flexDirection: "column",
            }}>

                {/* ── Drawer header ── */}
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

                    {/* Timeline */}
                    <OrderTimeline status={order.orderStatus} />
                </div>

                {/* ── Body ── */}
                <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* Customer */}
                    <section>
                        <SectionTitle>Customer</SectionTitle>
                        <div style={{ ...glass(), padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                            <Avatar user={order.orderUser} size={42} />
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{order.orderUser.fullName}</p>
                                <p style={{ ...mono, fontSize: 11, color: "var(--muted)" }}>{order.orderUser.email}</p>
                            </div>
                            <span style={{ ...mono, fontSize: 10, color: "var(--muted)", marginLeft: "auto" }}>
                                #{String(order.orderUser.id).padStart(4, "0")}
                            </span>
                        </div>
                    </section>

                    {/* Items */}
                    <section>
                        <SectionTitle>{order.items.length} Item{order.items.length !== 1 ? "s" : ""}</SectionTitle>
                        <div style={{ ...glass(), overflow: "hidden" }}>
                            {order.items.map((item, i) => (
                                <div key={i} style={{
                                    display: "flex", alignItems: "center", gap: 12,
                                    padding: "12px 16px",
                                    borderBottom: i < order.items.length - 1 ? "1px solid var(--border)" : "none",
                                }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                                        background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.15)",
                                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                                    }}>📚</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {item.bookSnap.title}
                                        </p>
                                        <p style={{ ...mono, fontSize: 10, color: "var(--muted)", marginTop: 2 }}>
                                            {fmt(item.unitPrice)} × {item.quantity}
                                        </p>
                                    </div>
                                    <span style={{ ...mono, fontSize: 13, fontWeight: 700, color: "var(--text)", flexShrink: 0 }}>
                                        {fmt(item.unitPrice * item.quantity)}
                                    </span>
                                </div>
                            ))}

                            {/* Subtotal / discount / total */}
                            <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid var(--border)" }}>
                                <Row label="Subtotal" value={fmt(subtotal)} />
                                {order.discount && (
                                    <Row
                                        label={<span>Discount <span style={{ ...mono, fontSize: 9, background: "rgba(34,197,94,0.12)", color: "var(--green)", padding: "1px 6px", borderRadius: 99 }}>{order.discount.code} −{order.discount.value}%</span></span>}
                                        value={<span style={{ color: "var(--green)" }}>−{fmt(discountAmt)}</span>}
                                    />
                                )}
                                <div style={{ borderTop: "1px solid var(--border)", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ ...mono, fontSize: 11, fontWeight: 700, color: "var(--muted2)" }}>Total</span>
                                    <span style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>
                                        {fmt(order.orderTotalAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Payment */}
                    <section>
                        <SectionTitle>Payment</SectionTitle>
                        <div style={{ ...glass(), padding: "14px 16px" }}>
                            <Row
                                label="Method"
                                value={<span style={{ color: PAYMENT_CFG[order.paymentMethod].color }}>
                                    {PAYMENT_CFG[order.paymentMethod].icon} {PAYMENT_CFG[order.paymentMethod].label}
                                </span>}
                            />
                            {order.transactionId && (
                                <Row label="Transaction ID" value={<span style={{ color: "var(--blue)" }}>{order.transactionId}</span>} />
                            )}
                            <Row
                                label="Status"
                                value={order.paymentMethod === "COD"
                                    ? <span style={{ color: order.orderStatus === "DELIVERED" ? "var(--green)" : "var(--amber)" }}>
                                        {order.orderStatus === "DELIVERED" ? "✓ Collected" : "⏳ Pending"}
                                    </span>
                                    : <span style={{ color: "var(--green)" }}>✓ Paid</span>
                                }
                            />
                        </div>
                    </section>

                    {/* Shipping address */}
                    <section>
                        <SectionTitle>Shipping Address</SectionTitle>
                        <div style={{ ...glass(), padding: "14px 16px" }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
                                {order.shippingAddress.fullName || order.orderUser.fullName}
                            </p>
                            <p style={{ ...mono, fontSize: 11, color: "var(--muted2)", lineHeight: 1.8 }}>
                                {order.shippingAddress.street}<br />
                                {order.shippingAddress.district}, {order.shippingAddress.city}
                            </p>
                            {order.shippingAddress.phone && (
                                <p style={{ ...mono, fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
                                    📞 {order.shippingAddress.phone}
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Status actions */}
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

            {/* Status confirm mini-modal */}
            {confirmStatus && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 60,
                    display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
                }}>
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
                            <button className="om-btn-primary" onClick={() => { onStatusChange(order.id, confirmStatus); setConfirmStatus(null); onClose() }} style={{
                                flex: 1, ...mono, fontSize: 12, fontWeight: 600, padding: "9px 0", borderRadius: 8,
                                background: STATUS_CFG[confirmStatus].dot, color: "#fff",
                            }}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

/* ════════ TINY HELPERS ════════ */
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <p style={{ ...mono, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>
        {children}
    </p>
)

const Row = ({ label, value }: { label: React.ReactNode; value: React.ReactNode }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <span style={{ fontSize: 12, color: "var(--muted2)" }}>{label}</span>
        <span style={{ ...mono, fontSize: 11, fontWeight: 500, color: "var(--text)" }}>{value}</span>
    </div>
)

/* ════════ MAIN PAGE ════════ */
export const OrderManagementPage = () => {
    const [orders, setOrders] = useState<Order[]>(ORDERS)
    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState<OrderStatus | "ALL">("ALL")
    const [filterPayment, setFilterPayment] = useState<PaymentMethod | "ALL">("ALL")
    const [sortBy, setSortBy] = useState<"orderDate" | "orderTotalAmount" | "orderCode">("orderDate")
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
    const [page, setPage] = useState(1)
    const PAGE_SIZE = 7
    const [selected, setSelected] = useState<Order | null>(null)
    const [toast, setToast] = useState<string | null>(null)

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2800) }

    const toggleSort = (col: typeof sortBy) => {
        if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc")
        else { setSortBy(col); setSortDir("desc") }
        setPage(1)
    }

    const handleStatusChange = (id: number, status: OrderStatus) => {
        setOrders(os => os.map(o => o.id === id ? { ...o, orderStatus: status } : o))
        showToast(`Order updated → ${STATUS_CFG[status].label}`)
    }

    /* Derived */
    const filtered = useMemo(() => orders
        .filter(o => {
            const q = search.toLowerCase()
            const matchQ = !q || o.orderCode.toLowerCase().includes(q) || o.orderUser.fullName.toLowerCase().includes(q) || o.orderUser.email.toLowerCase().includes(q)
            const matchS = filterStatus === "ALL" || o.orderStatus === filterStatus
            const matchP = filterPayment === "ALL" || o.paymentMethod === filterPayment
            return matchQ && matchS && matchP
        })
        .sort((a, b) => {
            const dir = sortDir === "asc" ? 1 : -1
            if (sortBy === "orderDate") return dir * a.orderDate.localeCompare(b.orderDate)
            if (sortBy === "orderTotalAmount") return dir * (a.orderTotalAmount - b.orderTotalAmount)
            if (sortBy === "orderCode") return dir * a.orderCode.localeCompare(b.orderCode)
            return 0
        }), [orders, search, filterStatus, filterPayment, sortBy, sortDir])

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const safePage = Math.min(page, totalPages)
    const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

    /* Summary stats */
    const totalRevenue = orders.filter(o => o.orderStatus === "DELIVERED").reduce((s, o) => s + o.orderTotalAmount, 0)
    const pendingCount = orders.filter(o => o.orderStatus === "PENDING").length
    const shippingCount = orders.filter(o => o.orderStatus === "SHIPPING").length
    const deliveredCount = orders.filter(o => o.orderStatus === "DELIVERED").length

    const SortIcon = ({ col }: { col: typeof sortBy }) => (
        <span style={{ ...mono, fontSize: 9, marginLeft: 4, opacity: sortBy === col ? 1 : 0.3 }}>
            {sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
        </span>
    )

    const thSort = (col: typeof sortBy): React.CSSProperties => ({
        ...mono, fontSize: 10, fontWeight: 600, letterSpacing: 1,
        color: sortBy === col ? "var(--accent)" : "var(--muted)",
        textTransform: "uppercase", padding: "10px 14px", textAlign: "left",
        cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
    })
    const thStatic: React.CSSProperties = {
        ...mono, fontSize: 10, fontWeight: 600, color: "var(--muted)",
        textTransform: "uppercase", padding: "10px 14px", textAlign: "left", whiteSpace: "nowrap", letterSpacing: 1,
    }

    return (
        <div className="om">
            <style>{CSS}</style>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: "fixed", bottom: 24, right: 24, zIndex: 100,
                    background: "var(--bg3)", border: "1px solid rgba(255,255,255,0.12)",
                    borderLeft: "3px solid var(--accent)", borderRadius: 10,
                    padding: "12px 18px", ...mono, fontSize: 12, color: "var(--text)",
                    animation: "omUp .3s cubic-bezier(.22,1,.36,1) both",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}>✓ {toast}</div>
            )}

            <div style={{ maxWidth: 1140, margin: "0 auto", padding: "32px 28px" }}>

                {/* ── Header ── */}
                <div className="om-up" style={{ marginBottom: 28 }}>
                    <p style={{ ...mono, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
                        Store Management
                    </p>
                    <h1 style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px" }}>
                        Orders
                    </h1>
                </div>

                {/* ── Stats ── */}
                <div className="om-up" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20, animationDelay: "40ms" }}>
                    {[
                        { label: "Total Revenue", value: fmt(totalRevenue), icon: "💰", color: "var(--accent)", sub: "from delivered" },
                        { label: "Pending", value: pendingCount, icon: "⏳", color: "var(--amber)", sub: "awaiting confirm" },
                        { label: "In Shipping", value: shippingCount, icon: "🚚", color: "#c4b5fd", sub: "on the way" },
                        { label: "Delivered", value: deliveredCount, icon: "📦", color: "var(--green)", sub: "completed" },
                    ].map((s, i) => (
                        <div key={i} style={{ ...glass(), padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                            <span style={{ fontSize: 24 }}>{s.icon}</span>
                            <div>
                                <p style={{ ...mono, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{s.label}</p>
                                <p style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</p>
                                <p style={{ ...mono, fontSize: 9, color: "var(--muted)", marginTop: 3 }}>{s.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Status overview bar ── */}
                <div className="om-up" style={{ ...glass(), padding: "14px 18px", marginBottom: 16, animationDelay: "60ms" }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ ...mono, fontSize: 10, color: "var(--muted)", marginRight: 4 }}>BREAKDOWN</span>
                        {(Object.keys(STATUS_CFG) as OrderStatus[]).map(s => {
                            const count = orders.filter(o => o.orderStatus === s).length
                            const cfg = STATUS_CFG[s]
                            return (
                                <div key={s} onClick={() => { setFilterStatus(filterStatus === s ? "ALL" : s); setPage(1) }}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 6,
                                        padding: "5px 10px", borderRadius: 8, cursor: "pointer",
                                        background: filterStatus === s ? cfg.bg : "rgba(255,255,255,0.03)",
                                        border: `1px solid ${filterStatus === s ? cfg.dot + "50" : "var(--border)"}`,
                                        transition: "all .15s ease",
                                    }}>
                                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
                                    <span style={{ ...mono, fontSize: 10, color: filterStatus === s ? cfg.color : "var(--muted2)" }}>{cfg.label}</span>
                                    <span style={{ ...mono, fontSize: 11, fontWeight: 700, color: filterStatus === s ? cfg.color : "var(--text)" }}>{count}</span>
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
                        <input className="om-input" value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1) }}
                            placeholder="Search order code or customer..."
                            style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: "var(--text)", width: "100%", ...mono }}
                        />
                        {search && <button onClick={() => { setSearch(""); setPage(1) }} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 14 }}>✕</button>}
                    </div>

                    {/* Payment filter */}
                    <select className="om-input" value={filterPayment} onChange={e => { setFilterPayment(e.target.value as any); setPage(1) }}
                        style={{
                            ...mono, fontSize: 11, background: "var(--bg2)", border: "1px solid var(--border)",
                            borderRadius: 8, padding: "7px 12px", color: "var(--muted2)", cursor: "pointer",
                        }}>
                        <option value="ALL">All Payments</option>
                        {(Object.keys(PAYMENT_CFG) as PaymentMethod[]).map(p => (
                            <option key={p} value={p}>{PAYMENT_CFG[p].icon} {PAYMENT_CFG[p].label}</option>
                        ))}
                    </select>

                    {(filterStatus !== "ALL" || filterPayment !== "ALL" || search) && (
                        <button className="om-btn-ghost" onClick={() => { setFilterStatus("ALL"); setFilterPayment("ALL"); setSearch(""); setPage(1) }}
                            style={{
                                ...mono, fontSize: 11, padding: "7px 14px", borderRadius: 8,
                                background: "rgba(255,255,255,0.05)", color: "var(--muted2)",
                            }}>
                            Clear filters ✕
                        </button>
                    )}

                    <span style={{ ...mono, fontSize: 10, color: "var(--muted)", marginLeft: "auto" }}>
                        {filtered.length} order{filtered.length !== 1 ? "s" : ""} · {totalPages} page{totalPages !== 1 ? "s" : ""}
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
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} style={{ textAlign: "center", padding: "52px 0", color: "var(--muted)" }}>
                                            <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
                                            <p style={{ ...mono, fontSize: 12 }}>No orders found</p>
                                        </td>
                                    </tr>
                                ) : paginated.map((o, i) => {
                                    const pay = PAYMENT_CFG[o.paymentMethod]
                                    const totalQty = o.items.reduce((s, it) => s + it.quantity, 0)

                                    return (
                                        <tr key={o.id} className="om-row" onClick={() => setSelected(o)}
                                            style={{ borderBottom: "1px solid var(--border)" }}>

                                            {/* # */}
                                            <td style={{ ...mono, fontSize: 11, color: "var(--muted)", padding: "13px 14px" }}>
                                                {String((safePage - 1) * PAGE_SIZE + i + 1).padStart(2, "0")}
                                            </td>

                                            {/* Order code */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <p style={{ ...mono, fontSize: 12, fontWeight: 700, color: "var(--text)", whiteSpace: "nowrap" }}>
                                                    {o.orderCode}
                                                </p>
                                                {o.discount && (
                                                    <span style={{ ...mono, fontSize: 9, color: "var(--green)" }}>🏷 {o.discount.code}</span>
                                                )}
                                            </td>

                                            {/* Customer */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 160 }}>
                                                    <Avatar user={o.orderUser} size={30} />
                                                    <div style={{ minWidth: 0 }}>
                                                        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 140 }}>
                                                            {o.orderUser.fullName}
                                                        </p>
                                                        <p style={{ ...mono, fontSize: 10, color: "var(--muted)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 140 }}>
                                                            {o.orderUser.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Items */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <p style={{ ...mono, fontSize: 12, fontWeight: 600, color: "var(--text)" }}>
                                                    {o.items.length} title{o.items.length !== 1 ? "s" : ""}
                                                </p>
                                                <p style={{ ...mono, fontSize: 10, color: "var(--muted)", marginTop: 1 }}>
                                                    {totalQty} book{totalQty !== 1 ? "s" : ""}
                                                </p>
                                            </td>

                                            {/* Payment */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <span style={{
                                                    ...mono, fontSize: 10, fontWeight: 600,
                                                    padding: "3px 9px", borderRadius: 99,
                                                    background: "rgba(255,255,255,0.05)", color: pay.color,
                                                    whiteSpace: "nowrap",
                                                }}>
                                                    {pay.icon} {pay.label}
                                                </span>
                                                {o.transactionId && (
                                                    <p style={{ ...mono, fontSize: 9, color: "var(--muted)", marginTop: 3 }}>
                                                        {o.transactionId}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Total */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <p style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 15, fontWeight: 700, color: "var(--accent)" }}>
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

                                            {/* Action */}
                                            <td style={{ padding: "13px 14px", textAlign: "right" }}>
                                                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }} onClick={e => e.stopPropagation()}>
                                                    <button className="om-icon-btn" title="View detail" onClick={() => setSelected(o)} style={{
                                                        background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
                                                        borderRadius: 7, width: 30, height: 30, fontSize: 13, cursor: "pointer", color: "var(--muted2)",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                    }}>👁</button>

                                                    {/* Quick next-status button */}
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
                {filtered.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 4px", flexWrap: "wrap", gap: 12 }}>
                        <p style={{ ...mono, fontSize: 11, color: "var(--muted)" }}>
                            Showing{" "}
                            <span style={{ color: "var(--text)", fontWeight: 600 }}>{(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}</span>
                            {" "}of <span style={{ color: "var(--text)", fontWeight: 600 }}>{filtered.length}</span> orders
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <button className="om-page-btn" disabled={safePage === 1} onClick={() => setPage(p => Math.max(1, p - 1))}
                                style={{ ...mono, fontSize: 12, background: "var(--bg3)", borderRadius: 8, color: "var(--muted2)", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                ←
                            </button>
                            {(() => {
                                const pages: (number | "…")[] = []
                                if (totalPages <= 7) for (let i = 1; i <= totalPages; i++) pages.push(i)
                                else {
                                    pages.push(1)
                                    if (safePage > 3) pages.push("…")
                                    for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i)
                                    if (safePage < totalPages - 2) pages.push("…")
                                    pages.push(totalPages)
                                }
                                return pages.map((p, idx) => p === "…"
                                    ? <span key={`e${idx}`} style={{ ...mono, fontSize: 11, color: "var(--muted)", width: 20, textAlign: "center" }}>…</span>
                                    : <button key={p} className={`om-page-btn${safePage === p ? " pg-active" : ""}`} onClick={() => setPage(p as number)}
                                        style={{ ...mono, fontSize: 12, fontWeight: safePage === p ? 700 : 400, background: "var(--bg3)", borderRadius: 8, color: "var(--muted2)", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {p}
                                    </button>
                                )
                            })()}
                            <button className="om-page-btn" disabled={safePage === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}
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