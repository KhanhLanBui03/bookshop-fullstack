import React, { useState, useMemo } from "react"

/* ════════ TYPES ════════ */
type AuthProvider = "LOCAL" | "GOOGLE" | "FACEBOOK"
type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELLED" | "REFUNDED"
type PaymentMethod = "COD" | "VNPAY" | "MOMO" | "CREDIT_CARD"
type RoleName = "ROLE_ADMIN" | "ROLE_USER" | "ROLE_STAFF"

interface Role { id: number; name: RoleName }
interface BookSnap { id: number; title: string; salePrice: number; coverUrl?: string }
interface OrderItem { bookSnap: BookSnap; quantity: number; unitPrice: number }

interface Address {
    id: number; fullName: string; phone: string
    street: string; district: string; city: string
}

interface Order {
    id: number
    orderCode: string
    orderTotalAmount: number
    orderDate: string
    orderStatus: OrderStatus
    paymentMethod: PaymentMethod
    transactionId?: string
    shippingAddress: Address
    items: OrderItem[]       // joined for display
    discount?: { code: string; value: number }
}

interface Customer {
    id: number
    fullName: string
    email: string
    phoneNumber: string
    createAt: string
    authProvider: AuthProvider
    roles: Role[]
    orders: Order[]
    avatarColor: string    // generated
}

/* ════════ MOCK DATA ════════ */
const ROLES: Record<RoleName, Role> = {
    ROLE_ADMIN: { id: 1, name: "ROLE_ADMIN" },
    ROLE_USER: { id: 2, name: "ROLE_USER" },
    ROLE_STAFF: { id: 3, name: "ROLE_STAFF" },
}

const BOOKS: BookSnap[] = [
    { id: 1, title: "Atomic Habits", salePrice: 18.99 },
    { id: 2, title: "Deep Work", salePrice: 16.50 },
    { id: 3, title: "Clean Code", salePrice: 39.99 },
    { id: 4, title: "The Pragmatic Programmer", salePrice: 44.99 },
    { id: 5, title: "Sapiens", salePrice: 21.00 },
    { id: 6, title: "Zero to One", salePrice: 17.80 },
]

const AVATAR_COLORS = [
    "#ff6b35", "#22c55e", "#60a5fa", "#f59e0b", "#a78bfa", "#34d399", "#fb7185", "#38bdf8",
]

const makeAddr = (id: number, city: string): Address => ({
    id, fullName: "", phone: "", street: `${id * 12} Le Loi St`,
    district: "District 1", city,
})

const makeOrder = (
    id: number, code: string, amount: number, date: string,
    status: OrderStatus, payment: PaymentMethod, addrId: number, city: string,
    items: OrderItem[], discount?: { code: string; value: number },
    txId?: string
): Order => ({
    id, orderCode: code, orderTotalAmount: amount, orderDate: date,
    orderStatus: status, paymentMethod: payment,
    shippingAddress: makeAddr(addrId, city),
    items, discount, transactionId: txId,
})

const CUSTOMERS: Customer[] = [
    {
        id: 1, fullName: "Nguyen Van An", email: "an.nguyen@gmail.com",
        phoneNumber: "0901234567", createAt: "2024-01-15", authProvider: "GOOGLE",
        roles: [ROLES.ROLE_USER], avatarColor: AVATAR_COLORS[0],
        orders: [
            makeOrder(101, "ORD-2024-0101", 55.49, "2024-02-10", "DELIVERED", "MOMO", 1, "Ho Chi Minh",
                [{ bookSnap: BOOKS[0], quantity: 2, unitPrice: 18.99 },
                { bookSnap: BOOKS[1], quantity: 1, unitPrice: 16.50 }],
                { code: "SALE10", value: 10 }),
            makeOrder(102, "ORD-2024-0102", 39.99, "2024-03-05", "DELIVERED", "VNPAY", 1, "Ho Chi Minh",
                [{ bookSnap: BOOKS[2], quantity: 1, unitPrice: 39.99 }]),
            makeOrder(103, "ORD-2024-0103", 21.00, "2024-04-20", "CANCELLED", "COD", 1, "Ho Chi Minh",
                [{ bookSnap: BOOKS[4], quantity: 1, unitPrice: 21.00 }]),
        ],
    },
    {
        id: 2, fullName: "Tran Thi Bich", email: "bich.tran@company.vn",
        phoneNumber: "0912345678", createAt: "2024-01-28", authProvider: "LOCAL",
        roles: [ROLES.ROLE_STAFF], avatarColor: AVATAR_COLORS[1],
        orders: [
            makeOrder(104, "ORD-2024-0104", 61.99, "2024-02-18", "DELIVERED", "CREDIT_CARD", 2, "Da Nang",
                [{ bookSnap: BOOKS[2], quantity: 1, unitPrice: 39.99 },
                { bookSnap: BOOKS[5], quantity: 1, unitPrice: 17.80 }],
                undefined, "TXN-9928A1"),
            makeOrder(105, "ORD-2024-0105", 44.99, "2024-03-22", "SHIPPING", "VNPAY", 2, "Da Nang",
                [{ bookSnap: BOOKS[3], quantity: 1, unitPrice: 44.99 }]),
        ],
    },
    {
        id: 3, fullName: "Le Minh Cuong", email: "cuong.le@dev.io",
        phoneNumber: "0923456789", createAt: "2024-02-03", authProvider: "LOCAL",
        roles: [ROLES.ROLE_ADMIN, ROLES.ROLE_USER], avatarColor: AVATAR_COLORS[2],
        orders: [
            makeOrder(106, "ORD-2024-0106", 96.77, "2024-02-25", "DELIVERED", "MOMO", 3, "Hanoi",
                [{ bookSnap: BOOKS[3], quantity: 1, unitPrice: 44.99 },
                { bookSnap: BOOKS[0], quantity: 1, unitPrice: 18.99 },
                { bookSnap: BOOKS[4], quantity: 1, unitPrice: 21.00 }],
                { code: "BOOK20", value: 20 }, "TXN-CC1132"),
        ],
    },
    {
        id: 4, fullName: "Pham Thi Dung", email: "dung.pham@mail.com",
        phoneNumber: "0934567890", createAt: "2024-02-14", authProvider: "FACEBOOK",
        roles: [ROLES.ROLE_USER], avatarColor: AVATAR_COLORS[3],
        orders: [],
    },
    {
        id: 5, fullName: "Hoang Van Em", email: "em.hoang@outlook.com",
        phoneNumber: "0945678901", createAt: "2024-03-01", authProvider: "GOOGLE",
        roles: [ROLES.ROLE_USER], avatarColor: AVATAR_COLORS[4],
        orders: [
            makeOrder(107, "ORD-2024-0107", 35.29, "2024-03-15", "DELIVERED", "COD", 5, "Can Tho",
                [{ bookSnap: BOOKS[1], quantity: 1, unitPrice: 16.50 },
                { bookSnap: BOOKS[5], quantity: 1, unitPrice: 17.80 }]),
            makeOrder(108, "ORD-2024-0108", 18.99, "2024-04-02", "REFUNDED", "MOMO", 5, "Can Tho",
                [{ bookSnap: BOOKS[0], quantity: 1, unitPrice: 18.99 }]),
        ],
    },
    {
        id: 6, fullName: "Vu Thi Phuong", email: "phuong.vu@studio.com",
        phoneNumber: "0956789012", createAt: "2024-03-10", authProvider: "LOCAL",
        roles: [ROLES.ROLE_STAFF, ROLES.ROLE_USER], avatarColor: AVATAR_COLORS[5],
        orders: [
            makeOrder(109, "ORD-2024-0109", 122.77, "2024-04-05", "PENDING", "CREDIT_CARD", 6, "Ho Chi Minh",
                [{ bookSnap: BOOKS[2], quantity: 2, unitPrice: 39.99 },
                { bookSnap: BOOKS[3], quantity: 1, unitPrice: 44.99 }],
                undefined, "TXN-CC9901"),
        ],
    },
]

/* ════════ CSS ════════ */
const CSS = `
  .cm * { box-sizing: border-box; margin: 0; padding: 0; }
  .cm {
    font-family: var(--font-body, 'DM Sans', sans-serif);
    background: var(--bg, #0c0c10);
    min-height: 100vh;
    color: var(--text, #e8e4f0);
  }

  @keyframes cmUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cmFadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes cmSlideIn {
    from { opacity: 0; transform: translateX(32px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .cm-up   { animation: cmUp .32s cubic-bezier(.22,1,.36,1) both; }

  .cm-row  { transition: background .1s ease; cursor: pointer; }
  .cm-row:hover { background: rgba(255,255,255,0.035) !important; }

  .cm-btn-primary { transition: all .15s ease; cursor: pointer; border: none; }
  .cm-btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(255,107,53,0.35); }
  .cm-btn-primary:active { transform: translateY(0); }

  .cm-btn-ghost { transition: background .15s ease; cursor: pointer; border: none; }
  .cm-btn-ghost:hover { background: rgba(255,255,255,0.07) !important; }

  .cm-input { transition: border-color .15s ease; outline: none; }
  .cm-input:focus { border-color: var(--accent, #ff6b35) !important; box-shadow: 0 0 0 3px rgba(255,107,53,0.12); }

  .cm-chip { cursor: pointer; transition: all .15s ease; }
  .cm-chip:hover  { border-color: var(--accent, #ff6b35) !important; color: var(--accent, #ff6b35) !important; }
  .cm-chip.active { background: var(--accent, #ff6b35) !important; border-color: var(--accent, #ff6b35) !important; color: #fff !important; }

  .cm-overlay { animation: cmFadeIn .2s ease both; }
  .cm-drawer  { animation: cmSlideIn .28s cubic-bezier(.22,1,.36,1) both; }
  .cm-modal   { animation: cmUp .22s cubic-bezier(.22,1,.36,1) both; }

  .cm-icon-btn { transition: background .12s ease; cursor: pointer; }
  .cm-icon-btn:hover { background: rgba(255,255,255,0.1) !important; }

  .cm-page-btn { transition: all .15s ease; cursor: pointer; border: 1px solid var(--border, rgba(255,255,255,0.07)); }
  .cm-page-btn:hover:not(:disabled) { border-color: var(--accent, #ff6b35) !important; color: var(--accent, #ff6b35) !important; background: rgba(255,107,53,0.06) !important; }
  .cm-page-btn:disabled { opacity: 0.28; cursor: not-allowed; }
  .cm-page-btn.pg-active { background: var(--accent, #ff6b35) !important; border-color: var(--accent, #ff6b35) !important; color: #fff !important; }

  .cm-order-row { transition: background .1s ease; }
  .cm-order-row:hover { background: rgba(255,255,255,0.02) !important; }

  .cm-tab { cursor: pointer; transition: all .15s ease; }
  .cm-tab.active { border-bottom: 2px solid var(--accent, #ff6b35) !important; color: var(--text) !important; }
  .cm-tab:not(.active):hover { color: var(--muted2, #9490a8) !important; }
`

/* ════════ HELPERS ════════ */
const mono: React.CSSProperties = { fontFamily: "var(--font-mono, 'DM Mono', monospace)" }

const glass = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: "var(--bg3, #18181f)",
    border: "1px solid var(--border, rgba(255,255,255,0.07))",
    borderRadius: 14,
    ...extra,
})

const PROVIDER_CFG: Record<AuthProvider, { icon: string; label: string; color: string }> = {
    LOCAL: { icon: "🔑", label: "Local", color: "var(--muted2)" },
    GOOGLE: { icon: "G", label: "Google", color: "#ea4335" },
    FACEBOOK: { icon: "f", label: "Facebook", color: "#1877f2" },
}

const ROLE_CFG: Record<RoleName, { label: string; bg: string; color: string }> = {
    ROLE_ADMIN: { label: "Admin", bg: "rgba(255,107,53,0.15)", color: "var(--accent, #ff6b35)" },
    ROLE_STAFF: { label: "Staff", bg: "rgba(96,165,250,0.15)", color: "var(--blue, #60a5fa)" },
    ROLE_USER: { label: "User", bg: "rgba(255,255,255,0.07)", color: "var(--muted2, #9490a8)" },
}

const ORDER_STATUS_CFG: Record<OrderStatus, { label: string; bg: string; color: string; icon: string }> = {
    PENDING: { label: "Pending", bg: "rgba(245,158,11,0.12)", color: "var(--amber, #f59e0b)", icon: "⏳" },
    CONFIRMED: { label: "Confirmed", bg: "rgba(96,165,250,0.12)", color: "var(--blue,  #60a5fa)", icon: "✅" },
    SHIPPING: { label: "Shipping", bg: "rgba(167,139,250,0.12)", color: "#c4b5fd", icon: "🚚" },
    DELIVERED: { label: "Delivered", bg: "rgba(34,197,94,0.12)", color: "var(--green, #22c55e)", icon: "📦" },
    CANCELLED: { label: "Cancelled", bg: "rgba(255,255,255,0.06)", color: "var(--muted2)", icon: "✕" },
    REFUNDED: { label: "Refunded", bg: "rgba(239,68,68,0.12)", color: "var(--red,   #ef4444)", icon: "↩" },
}

const PAYMENT_CFG: Record<PaymentMethod, { label: string; icon: string }> = {
    COD: { label: "COD", icon: "💵" },
    VNPAY: { label: "VNPay", icon: "🏦" },
    MOMO: { label: "MoMo", icon: "💜" },
    CREDIT_CARD: { label: "Credit Card", icon: "💳" },
}

const fmt = (n: number) => `$${n.toFixed(2)}`
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })

const initials = (name: string) =>
    name.split(" ").filter(Boolean).slice(-2).map(w => w[0]).join("").toUpperCase()

/* ════════ AVATAR ════════ */
const Avatar = ({ customer, size = 36 }: { customer: Customer; size?: number }) => (
    <div style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        background: customer.avatarColor + "28",
        border: `2px solid ${customer.avatarColor}50`,
        display: "flex", alignItems: "center", justifyContent: "center",
        ...mono, fontSize: size * 0.33, fontWeight: 700,
        color: customer.avatarColor,
    }}>
        {initials(customer.fullName)}
    </div>
)

/* ════════ CUSTOMER DRAWER ════════ */
function CustomerDrawer({
    customer, onClose, onEdit, onDelete,
}: {
    customer: Customer
    onClose: () => void
    onEdit: () => void
    onDelete: () => void
}) {
    const [tab, setTab] = useState<"overview" | "orders">("overview")

    const totalSpent = customer.orders.filter(o => o.orderStatus === "DELIVERED").reduce((s, o) => s + o.orderTotalAmount, 0)
    const totalOrders = customer.orders.length
    const delivered = customer.orders.filter(o => o.orderStatus === "DELIVERED").length
    const pending = customer.orders.filter(o => ["PENDING", "CONFIRMED", "SHIPPING"].includes(o.orderStatus)).length

    const TabBtn = ({ id, label }: { id: typeof tab; label: string }) => (
        <button
            className={`cm-tab ${tab === id ? "active" : ""}`}
            onClick={() => setTab(id)}
            style={{
                background: "none", border: "none", borderBottom: "2px solid transparent",
                padding: "10px 16px", ...mono, fontSize: 12,
                color: tab === id ? "var(--text)" : "var(--muted)",
                fontWeight: tab === id ? 600 : 400,
            }}
        >
            {label}
        </button>
    )

    return (
        <div
            className="cm-overlay"
            onClick={e => e.target === e.currentTarget && onClose()}
            style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
                zIndex: 50, display: "flex", justifyContent: "flex-end",
            }}
        >
            <div
                className="cm-drawer"
                style={{
                    width: "min(520px, 100vw)",
                    height: "100vh", overflowY: "auto",
                    background: "var(--bg2, #111117)",
                    borderLeft: "1px solid var(--border)",
                    display: "flex", flexDirection: "column",
                }}
            >
                {/* Drawer header */}
                <div style={{
                    padding: "22px 24px 0",
                    borderBottom: "1px solid var(--border)",
                    flexShrink: 0,
                }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <Avatar customer={customer} size={52} />
                            <div>
                                <h2 style={{ fontFamily: "var(--font-display, 'Fraunces',serif)", fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                                    {customer.fullName}
                                </h2>
                                <p style={{ ...mono, fontSize: 11, color: "var(--muted)" }}>{customer.email}</p>
                                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                                    {customer.roles.map(r => {
                                        const cfg = ROLE_CFG[r.name]
                                        return (
                                            <span key={r.id} style={{
                                                ...mono, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 99,
                                                background: cfg.bg, color: cfg.color,
                                            }}>{cfg.label}</span>
                                        )
                                    })}
                                    <span style={{
                                        ...mono, fontSize: 9, padding: "2px 7px", borderRadius: 99,
                                        background: "rgba(255,255,255,0.06)", color: "var(--muted2)",
                                    }}>
                                        {PROVIDER_CFG[customer.authProvider].icon} {PROVIDER_CFG[customer.authProvider].label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 6 }}>
                            <button className="cm-icon-btn" onClick={onEdit} title="Edit" style={{
                                background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)",
                                borderRadius: 8, width: 32, height: 32, fontSize: 14, color: "var(--muted2)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>✏️</button>
                            <button className="cm-icon-btn" onClick={onDelete} title="Delete" style={{
                                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                                borderRadius: 8, width: 32, height: 32, fontSize: 14, color: "var(--red, #ef4444)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>🗑️</button>
                            <button className="cm-icon-btn" onClick={onClose} style={{
                                background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
                                borderRadius: 8, width: 32, height: 32, fontSize: 14, color: "var(--muted2)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>✕</button>
                        </div>
                    </div>

                    {/* Stats mini row */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
                        {[
                            { label: "Total Spent", value: fmt(totalSpent), color: "var(--accent)" },
                            { label: "Orders", value: String(totalOrders), color: "var(--text)" },
                            { label: "Delivered", value: `${delivered}/${totalOrders}`, color: "var(--green)" },
                        ].map((s, i) => (
                            <div key={i} style={{
                                background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)",
                                borderRadius: 10, padding: "12px 14px",
                            }}>
                                <p style={{ ...mono, fontSize: 9, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>{s.label}</p>
                                <p style={{ fontFamily: "var(--font-display, 'Fraunces',serif)", fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div style={{ display: "flex", gap: 2 }}>
                        <TabBtn id="overview" label="Overview" />
                        <TabBtn id="orders" label={`Orders (${totalOrders})`} />
                    </div>
                </div>

                {/* Drawer body */}
                <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
                    {tab === "overview" ? (
                        <div>
                            {/* Profile info */}
                            <p style={{ ...mono, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 }}>
                                Profile
                            </p>
                            <div style={{ ...glass(), padding: "16px 18px", marginBottom: 20 }}>
                                {[
                                    { label: "Full Name", value: customer.fullName },
                                    { label: "Email", value: customer.email },
                                    { label: "Phone", value: customer.phoneNumber || "—" },
                                    { label: "Member Since", value: fmtDate(customer.createAt) },
                                    { label: "Auth Provider", value: `${PROVIDER_CFG[customer.authProvider].icon} ${PROVIDER_CFG[customer.authProvider].label}` },
                                    { label: "Customer ID", value: `#${String(customer.id).padStart(4, "0")}` },
                                ].map((row, i, arr) => (
                                    <div key={i} style={{
                                        display: "flex", justifyContent: "space-between", alignItems: "center",
                                        padding: "10px 0",
                                        borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                                    }}>
                                        <span style={{ fontSize: 12, color: "var(--muted2)" }}>{row.label}</span>
                                        <span style={{ ...mono, fontSize: 12, color: "var(--text)", fontWeight: 500 }}>{row.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Order summary */}
                            <p style={{ ...mono, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 }}>
                                Order Summary
                            </p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                                {(["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED", "CANCELLED", "REFUNDED"] as OrderStatus[]).map(s => {
                                    const count = customer.orders.filter(o => o.orderStatus === s).length
                                    const cfg = ORDER_STATUS_CFG[s]
                                    return (
                                        <div key={s} style={{
                                            display: "flex", alignItems: "center", gap: 10,
                                            background: count > 0 ? cfg.bg : "rgba(255,255,255,0.02)",
                                            border: `1px solid ${count > 0 ? cfg.color + "30" : "var(--border)"}`,
                                            borderRadius: 10, padding: "10px 14px",
                                        }}>
                                            <span style={{ fontSize: 16 }}>{cfg.icon}</span>
                                            <div>
                                                <p style={{ ...mono, fontSize: 9, color: "var(--muted)", marginBottom: 2 }}>{cfg.label}</p>
                                                <p style={{ ...mono, fontSize: 16, fontWeight: 700, color: count > 0 ? cfg.color : "var(--muted)" }}>{count}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Latest order */}
                            {customer.orders.length > 0 && (() => {
                                const latest = [...customer.orders].sort((a, b) => b.orderDate.localeCompare(a.orderDate))[0]
                                const cfg = ORDER_STATUS_CFG[latest.orderStatus]
                                return (
                                    <div>
                                        <p style={{ ...mono, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 12 }}>
                                            Latest Order
                                        </p>
                                        <div style={{ ...glass(), padding: "16px 18px" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                                <span style={{ ...mono, fontSize: 12, fontWeight: 700 }}>{latest.orderCode}</span>
                                                <span style={{ ...mono, fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 99, background: cfg.bg, color: cfg.color }}>
                                                    {cfg.icon} {cfg.label}
                                                </span>
                                            </div>
                                            {latest.items.map((item, i) => (
                                                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                                    <span style={{ fontSize: 12, color: "var(--muted2)" }}>
                                                        {item.bookSnap.title} ×{item.quantity}
                                                    </span>
                                                    <span style={{ ...mono, fontSize: 11 }}>{fmt(item.unitPrice * item.quantity)}</span>
                                                </div>
                                            ))}
                                            <div style={{ borderTop: "1px solid var(--border)", marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between" }}>
                                                <span style={{ ...mono, fontSize: 11, color: "var(--muted)" }}>{fmtDate(latest.orderDate)}</span>
                                                <span style={{ ...mono, fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>{fmt(latest.orderTotalAmount)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })()}

                            {customer.orders.length === 0 && (
                                <div style={{ textAlign: "center", padding: "32px 0", color: "var(--muted)" }}>
                                    <div style={{ fontSize: 36, marginBottom: 10 }}>🛍️</div>
                                    <p style={{ ...mono, fontSize: 12 }}>No orders yet</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Orders tab */
                        <div>
                            {customer.orders.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "52px 0", color: "var(--muted)" }}>
                                    <div style={{ fontSize: 36, marginBottom: 10 }}>🛒</div>
                                    <p style={{ ...mono, fontSize: 12 }}>No orders yet</p>
                                </div>
                            ) : [...customer.orders].sort((a, b) => b.orderDate.localeCompare(a.orderDate)).map(order => {
                                const cfg = ORDER_STATUS_CFG[order.orderStatus]
                                const pay = PAYMENT_CFG[order.paymentMethod]
                                return (
                                    <div key={order.id} style={{ ...glass(), padding: "16px 18px", marginBottom: 12 }}>
                                        {/* Order header */}
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                            <div>
                                                <p style={{ ...mono, fontSize: 12, fontWeight: 700, marginBottom: 3 }}>{order.orderCode}</p>
                                                <p style={{ ...mono, fontSize: 10, color: "var(--muted)" }}>{fmtDate(order.orderDate)}</p>
                                            </div>
                                            <span style={{
                                                ...mono, fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 99,
                                                background: cfg.bg, color: cfg.color, whiteSpace: "nowrap",
                                            }}>
                                                {cfg.icon} {cfg.label}
                                            </span>
                                        </div>

                                        {/* Books */}
                                        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, marginBottom: 10 }}>
                                            {order.items.map((item, i) => (
                                                <div key={i} style={{
                                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                                    padding: "5px 0",
                                                    borderBottom: i < order.items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                                                }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                        <span style={{ fontSize: 14 }}>📚</span>
                                                        <div>
                                                            <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{item.bookSnap.title}</p>
                                                            <p style={{ ...mono, fontSize: 10, color: "var(--muted)" }}>×{item.quantity} @ {fmt(item.unitPrice)}</p>
                                                        </div>
                                                    </div>
                                                    <span style={{ ...mono, fontSize: 12, fontWeight: 600 }}>{fmt(item.unitPrice * item.quantity)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Payment + shipping + total */}
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                                <span style={{ ...mono, fontSize: 10, color: "var(--muted2)" }}>
                                                    {pay.icon} {pay.label}
                                                </span>
                                                <span style={{ ...mono, fontSize: 10, color: "var(--muted)" }}>
                                                    📍 {order.shippingAddress.city}
                                                </span>
                                                {order.transactionId && (
                                                    <span style={{ ...mono, fontSize: 9, color: "var(--muted)" }}>
                                                        TX: {order.transactionId}
                                                    </span>
                                                )}
                                                {order.discount && (
                                                    <span style={{ ...mono, fontSize: 9, color: "var(--green)" }}>
                                                        🏷 {order.discount.code} −{order.discount.value}%
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ textAlign: "right" }}>
                                                <p style={{ ...mono, fontSize: 10, color: "var(--muted)", marginBottom: 3 }}>Total</p>
                                                <p style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 18, fontWeight: 700, color: "var(--accent)" }}>
                                                    {fmt(order.orderTotalAmount)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

/* ════════ EDIT MODAL ════════ */
interface EditForm { fullName: string; email: string; phoneNumber: string; role: RoleName }

function EditModal({ customer, onClose, onSave }: {
    customer: Customer
    onClose: () => void
    onSave: (f: EditForm) => void
}) {
    const primaryRole = customer.roles.find(r => r.name !== "ROLE_USER")?.name ?? "ROLE_USER"
    const [form, setForm] = useState<EditForm>({
        fullName: customer.fullName, email: customer.email,
        phoneNumber: customer.phoneNumber, role: primaryRole,
    })
    const [errors, setErrors] = useState<Partial<EditForm>>({})

    const set = (k: keyof EditForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value }))

    const validate = () => {
        const er: Partial<EditForm> = {}
        if (!form.fullName.trim()) er.fullName = "Name is required"
        if (!form.email.trim()) er.email = "Email is required"
        setErrors(er)
        return Object.keys(er).length === 0
    }

    const inputStyle: React.CSSProperties = {
        width: "100%", background: "var(--bg2, #111117)",
        border: "1px solid var(--border)", borderRadius: 8,
        padding: "9px 12px", fontSize: 13, color: "var(--text)", ...mono,
    }

    const ErrMsg = ({ f }: { f: keyof EditForm }) =>
        errors[f] ? <p style={{ ...mono, fontSize: 10, color: "var(--red)", marginTop: 4 }}>{errors[f]}</p> : null

    return (
        <div
            className="cm-overlay"
            onClick={e => e.target === e.currentTarget && onClose()}
            style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
                display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 24,
            }}
        >
            <div className="cm-modal" style={{ ...glass(), borderRadius: 18, width: "100%", maxWidth: 460 }}>
                <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 2 }}>
                        <Avatar customer={customer} size={40} />
                        <div>
                            <p style={{ ...mono, fontSize: 10, color: "var(--muted)", letterSpacing: 1.2, textTransform: "uppercase" }}>Edit Customer</p>
                            <h2 style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 18, fontWeight: 700 }}>{customer.fullName}</h2>
                        </div>
                    </div>
                </div>

                <div style={{ padding: "20px 24px" }}>
                    {[
                        { label: "Full Name", key: "fullName" as const, placeholder: "John Doe" },
                        { label: "Email", key: "email" as const, placeholder: "user@email.com" },
                        { label: "Phone", key: "phoneNumber" as const, placeholder: "0901234567" },
                    ].map(f => (
                        <div key={f.key} style={{ marginBottom: 14 }}>
                            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--muted2)", marginBottom: 6 }}>{f.label}</label>
                            <input className="cm-input" style={inputStyle} value={(form as any)[f.key]} onChange={set(f.key)} placeholder={f.placeholder} />
                            <ErrMsg f={f.key} />
                        </div>
                    ))}

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--muted2)", marginBottom: 6 }}>Role</label>
                        <select className="cm-input" style={{ ...inputStyle, cursor: "pointer" }} value={form.role} onChange={set("role")}>
                            {(Object.keys(ROLE_CFG) as RoleName[]).map(r => (
                                <option key={r} value={r}>{ROLE_CFG[r].label}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                        <button className="cm-btn-ghost" onClick={onClose} style={{
                            ...mono, fontSize: 12, padding: "9px 18px", borderRadius: 8,
                            background: "rgba(255,255,255,0.05)", color: "var(--muted2)",
                        }}>Cancel</button>
                        <button className="cm-btn-primary" onClick={() => { if (validate()) onSave(form) }} style={{
                            ...mono, fontSize: 12, fontWeight: 600, padding: "9px 22px", borderRadius: 8,
                            background: "var(--accent, #ff6b35)", color: "#fff",
                        }}>Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ════════ DELETE CONFIRM ════════ */
function ConfirmDelete({ customer, onClose, onConfirm }: { customer: Customer; onClose: () => void; onConfirm: () => void }) {
    return (
        <div className="cm-overlay" onClick={e => e.target === e.currentTarget && onClose()}
            style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
                display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 24,
            }}
        >
            <div className="cm-modal" style={{ ...glass(), borderRadius: 16, padding: 28, maxWidth: 380, width: "100%" }}>
                <div style={{
                    width: 44, height: 44, borderRadius: 12, background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: 20, marginBottom: 16,
                }}>🗑️</div>
                <h3 style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Delete Customer</h3>
                <p style={{ fontSize: 13, color: "var(--muted2)", lineHeight: 1.6, marginBottom: 22 }}>
                    Remove <strong style={{ color: "var(--text)" }}>"{customer.fullName}"</strong> and all their data?
                    This action cannot be undone.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                    <button className="cm-btn-ghost" onClick={onClose} style={{
                        flex: 1, ...mono, fontSize: 12, padding: "9px 0", borderRadius: 8,
                        background: "rgba(255,255,255,0.05)", color: "var(--muted2)",
                    }}>Cancel</button>
                    <button className="cm-btn-primary" onClick={onConfirm} style={{
                        flex: 1, ...mono, fontSize: 12, fontWeight: 600, padding: "9px 0", borderRadius: 8,
                        background: "var(--red, #ef4444)", color: "#fff",
                    }}>Delete</button>
                </div>
            </div>
        </div>
    )
}

/* ════════ MAIN PAGE ════════ */
export const CustomerPage = () => {
    const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS)
    const [search, setSearch] = useState("")
    const [filterRole, setFilterRole] = useState<RoleName | "ALL">("ALL")
    const [filterProvider, setFilterProvider] = useState<AuthProvider | "ALL">("ALL")
    const [sortBy, setSortBy] = useState<"fullName" | "createAt" | "orders" | "spent">("createAt")
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
    const [page, setPage] = useState(1)
    const [pageSize] = useState(5)
    const [selected, setSelected] = useState<Customer | null>(null)
    const [editTarget, setEditTarget] = useState<Customer | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null)
    const [toast, setToast] = useState<string | null>(null)

    const showToast = (msg: string) => {
        setToast(msg); setTimeout(() => setToast(null), 2800)
    }

    const toggleSort = (col: typeof sortBy) => {
        if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc")
        else { setSortBy(col); setSortDir("desc") }
        setPage(1)
    }

    /* Derived */
    const filtered = useMemo(() => customers
        .filter(c => {
            const q = search.toLowerCase()
            const matchQ = !q || c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phoneNumber?.includes(q)
            const matchR = filterRole === "ALL" || c.roles.some(r => r.name === filterRole)
            const matchP = filterProvider === "ALL" || c.authProvider === filterProvider
            return matchQ && matchR && matchP
        })
        .sort((a, b) => {
            const dir = sortDir === "asc" ? 1 : -1
            if (sortBy === "fullName") return dir * a.fullName.localeCompare(b.fullName)
            if (sortBy === "createAt") return dir * a.createAt.localeCompare(b.createAt)
            if (sortBy === "orders") return dir * (a.orders.length - b.orders.length)
            if (sortBy === "spent") {
                const spentA = a.orders.filter(o => o.orderStatus === "DELIVERED").reduce((s, o) => s + o.orderTotalAmount, 0)
                const spentB = b.orders.filter(o => o.orderStatus === "DELIVERED").reduce((s, o) => s + o.orderTotalAmount, 0)
                return dir * (spentA - spentB)
            }
            return 0
        }), [customers, search, filterRole, filterProvider, sortBy, sortDir])

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const safePage = Math.min(page, totalPages)
    const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

    const handleSaveEdit = (form: EditForm) => {
        if (!editTarget) return
        const role = ROLES[form.role]
        setCustomers(cs => cs.map(c => c.id === editTarget.id
            ? { ...c, fullName: form.fullName, email: form.email, phoneNumber: form.phoneNumber, roles: [role] }
            : c
        ))
        if (selected?.id === editTarget.id) {
            setSelected(c => c ? { ...c, fullName: form.fullName, email: form.email, phoneNumber: form.phoneNumber, roles: [role] } : c)
        }
        setEditTarget(null); showToast("Customer updated")
    }

    const handleDelete = () => {
        if (!deleteTarget) return
        setCustomers(cs => cs.filter(c => c.id !== deleteTarget.id))
        if (selected?.id === deleteTarget.id) setSelected(null)
        showToast(`"${deleteTarget.fullName}" removed`)
        setDeleteTarget(null)
    }

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
        ...mono, fontSize: 10, fontWeight: 600, letterSpacing: 1, color: "var(--muted)",
        textTransform: "uppercase", padding: "10px 14px", textAlign: "left", whiteSpace: "nowrap",
    }

    /* Summary stats */
    const totalSpent = customers.reduce((s, c) => s + c.orders.filter(o => o.orderStatus === "DELIVERED").reduce((a, o) => a + o.orderTotalAmount, 0), 0)
    const totalOrders = customers.reduce((s, c) => s + c.orders.length, 0)
    const newThisMonth = customers.filter(c => c.createAt >= "2024-03-01").length

    return (
        <div className="cm">
            <style>{CSS}</style>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: "fixed", bottom: 24, right: 24, zIndex: 100,
                    background: "var(--bg3)", border: "1px solid rgba(255,255,255,0.12)",
                    borderLeft: "3px solid var(--accent)", borderRadius: 10,
                    padding: "12px 18px", ...mono, fontSize: 12, color: "var(--text)",
                    animation: "cmUp .3s cubic-bezier(.22,1,.36,1) both",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}>✓ {toast}</div>
            )}

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px" }}>

                {/* Header */}
                <div className="cm-up" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
                    <div>
                        <p style={{ ...mono, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
                            User Management
                        </p>
                        <h1 style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px" }}>
                            Customers
                        </h1>
                    </div>
                </div>

                {/* Stats */}
                <div className="cm-up" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20, animationDelay: "40ms" }}>
                    {[
                        { label: "Total Customers", value: customers.length, icon: "👥", color: "var(--text)" },
                        { label: "Total Revenue", value: fmt(totalSpent), icon: "💰", color: "var(--accent)" },
                        { label: "Total Orders", value: totalOrders, icon: "📦", color: "var(--blue)" },
                        { label: "New This Month", value: newThisMonth, icon: "✨", color: "var(--green)" },
                    ].map((s, i) => (
                        <div key={i} style={{ ...glass(), padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                            <span style={{ fontSize: 24 }}>{s.icon}</span>
                            <div>
                                <p style={{ ...mono, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{s.label}</p>
                                <p style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="cm-up" style={{
                    ...glass(), padding: "14px 16px", display: "flex", alignItems: "center",
                    gap: 12, flexWrap: "wrap", marginBottom: 16, animationDelay: "80ms",
                }}>
                    {/* Search */}
                    <div style={{
                        flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8,
                        background: "var(--bg2)", border: "1px solid var(--border)",
                        borderRadius: 8, padding: "8px 12px",
                    }}>
                        <span style={{ fontSize: 13, color: "var(--muted)" }}>🔍</span>
                        <input
                            className="cm-input"
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1) }}
                            placeholder="Search name, email or phone..."
                            style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: "var(--text)", width: "100%", ...mono }}
                        />
                        {search && <button onClick={() => { setSearch(""); setPage(1) }} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 14 }}>✕</button>}
                    </div>

                    {/* Role chips */}
                    <div style={{ display: "flex", gap: 6 }}>
                        {(["ALL", ...Object.keys(ROLE_CFG)] as const).map(r => (
                            <button key={r} className={`cm-chip ${filterRole === r ? "active" : ""}`}
                                onClick={() => { setFilterRole(r as any); setPage(1) }}
                                style={{
                                    ...mono, fontSize: 10, padding: "6px 12px", borderRadius: 99,
                                    background: "transparent", border: "1px solid var(--border)", color: "var(--muted2)",
                                }}>
                                {r === "ALL" ? "All Roles" : ROLE_CFG[r as RoleName].label}
                            </button>
                        ))}
                    </div>

                    {/* Provider filter */}
                    <select className="cm-input" value={filterProvider} onChange={e => { setFilterProvider(e.target.value as any); setPage(1) }}
                        style={{
                            ...mono, fontSize: 11, background: "var(--bg2)", border: "1px solid var(--border)",
                            borderRadius: 8, padding: "7px 12px", color: "var(--muted2)", cursor: "pointer",
                        }}>
                        <option value="ALL">All Providers</option>
                        {(["LOCAL", "GOOGLE", "FACEBOOK"] as AuthProvider[]).map(p => (
                            <option key={p} value={p}>{PROVIDER_CFG[p].icon} {PROVIDER_CFG[p].label}</option>
                        ))}
                    </select>

                    <span style={{ ...mono, fontSize: 10, color: "var(--muted)", marginLeft: "auto" }}>
                        {filtered.length} customer{filtered.length !== 1 ? "s" : ""} · {totalPages} page{totalPages !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Table */}
                <div className="cm-up" style={{ ...glass(), overflow: "hidden", animationDelay: "120ms" }}>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                                    <th style={thStatic}>#</th>
                                    <th onClick={() => toggleSort("fullName")} style={thSort("fullName")}>Customer <SortIcon col="fullName" /></th>
                                    <th style={thStatic}>Provider</th>
                                    <th style={thStatic}>Roles</th>
                                    <th onClick={() => toggleSort("orders")} style={thSort("orders")}>Orders <SortIcon col="orders" /></th>
                                    <th onClick={() => toggleSort("spent")} style={thSort("spent")}>Total Spent <SortIcon col="spent" /></th>
                                    <th onClick={() => toggleSort("createAt")} style={thSort("createAt")}>Joined <SortIcon col="createAt" /></th>
                                    <th style={{ ...thStatic, textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginated.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} style={{ textAlign: "center", padding: "52px 0", color: "var(--muted)" }}>
                                            <div style={{ fontSize: 32, marginBottom: 10 }}>👤</div>
                                            <p style={{ ...mono, fontSize: 12 }}>No customers found</p>
                                        </td>
                                    </tr>
                                ) : paginated.map((c, i) => {
                                    const spent = c.orders.filter(o => o.orderStatus === "DELIVERED").reduce((s, o) => s + o.orderTotalAmount, 0)
                                    const hasActive = c.orders.some(o => ["PENDING", "CONFIRMED", "SHIPPING"].includes(o.orderStatus))
                                    const provider = PROVIDER_CFG[c.authProvider]

                                    return (
                                        <tr key={c.id} className="cm-row" onClick={() => setSelected(c)} style={{ borderBottom: "1px solid var(--border)" }}>

                                            {/* # */}
                                            <td style={{ ...mono, fontSize: 11, color: "var(--muted)", padding: "13px 14px" }}>
                                                {String((safePage - 1) * pageSize + i + 1).padStart(2, "0")}
                                            </td>

                                            {/* Customer */}
                                            <td style={{ padding: "13px 14px", maxWidth: 240 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <Avatar customer={c} size={36} />
                                                    <div style={{ minWidth: 0 }}>
                                                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                            {c.fullName}
                                                        </p>
                                                        <p style={{ ...mono, fontSize: 10, color: "var(--muted)", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                            {c.email}
                                                        </p>
                                                        {c.phoneNumber && (
                                                            <p style={{ ...mono, fontSize: 10, color: "var(--muted)", marginTop: 1 }}>{c.phoneNumber}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Provider */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <span style={{
                                                    ...mono, fontSize: 10, fontWeight: 600,
                                                    padding: "3px 9px", borderRadius: 99,
                                                    background: "rgba(255,255,255,0.06)", color: "var(--muted2)",
                                                }}>
                                                    {provider.icon} {provider.label}
                                                </span>
                                            </td>

                                            {/* Roles */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                                                    {c.roles.map(r => {
                                                        const rc = ROLE_CFG[r.name]
                                                        return (
                                                            <span key={r.id} style={{
                                                                ...mono, fontSize: 9, fontWeight: 700,
                                                                padding: "2px 7px", borderRadius: 99,
                                                                background: rc.bg, color: rc.color,
                                                            }}>{rc.label}</span>
                                                        )
                                                    })}
                                                </div>
                                            </td>

                                            {/* Orders */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                    <span style={{ ...mono, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                                                        {c.orders.length}
                                                    </span>
                                                    {hasActive && (
                                                        <span style={{
                                                            ...mono, fontSize: 9, padding: "2px 6px", borderRadius: 99,
                                                            background: "rgba(245,158,11,0.15)", color: "var(--amber)",
                                                        }}>active</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Spent */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <span style={{ ...mono, fontSize: 13, fontWeight: 600, color: spent > 0 ? "var(--accent)" : "var(--muted)" }}>
                                                    {spent > 0 ? fmt(spent) : "—"}
                                                </span>
                                            </td>

                                            {/* Joined */}
                                            <td style={{ ...mono, fontSize: 11, color: "var(--muted2)", padding: "13px 14px", whiteSpace: "nowrap" }}>
                                                {fmtDate(c.createAt)}
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: "13px 14px", textAlign: "right" }}>
                                                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }} onClick={e => e.stopPropagation()}>
                                                    <button className="cm-icon-btn" title="View" onClick={() => setSelected(c)} style={{
                                                        background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
                                                        borderRadius: 7, width: 30, height: 30, fontSize: 13, cursor: "pointer", color: "var(--muted2)",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                    }}>👁</button>
                                                    <button className="cm-icon-btn" title="Edit" onClick={() => setEditTarget(c)} style={{
                                                        background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
                                                        borderRadius: 7, width: 30, height: 30, fontSize: 13, cursor: "pointer", color: "var(--muted2)",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                    }}>✏️</button>
                                                    <button className="cm-icon-btn" title="Delete" onClick={() => setDeleteTarget(c)} style={{
                                                        background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                                                        borderRadius: 7, width: 30, height: 30, fontSize: 13, cursor: "pointer", color: "var(--red)",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                    }}>🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {filtered.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 4px", flexWrap: "wrap", gap: 12 }}>
                        <p style={{ ...mono, fontSize: 11, color: "var(--muted)" }}>
                            Showing{" "}
                            <span style={{ color: "var(--text)", fontWeight: 600 }}>{(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)}</span>
                            {" "}of <span style={{ color: "var(--text)", fontWeight: 600 }}>{filtered.length}</span> customers
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <button className="cm-page-btn" disabled={safePage === 1} onClick={() => setPage(p => Math.max(1, p - 1))}
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
                                return pages.map((p, i) => p === "…"
                                    ? <span key={`e${i}`} style={{ ...mono, fontSize: 11, color: "var(--muted)", width: 20, textAlign: "center" }}>…</span>
                                    : <button key={p} className={`cm-page-btn${safePage === p ? " pg-active" : ""}`} onClick={() => setPage(p as number)}
                                        style={{ ...mono, fontSize: 12, fontWeight: safePage === p ? 700 : 400, background: "var(--bg3)", borderRadius: 8, color: "var(--muted2)", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        {p}
                                    </button>
                                )
                            })()}
                            <button className="cm-page-btn" disabled={safePage === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                style={{ ...mono, fontSize: 12, background: "var(--bg3)", borderRadius: 8, color: "var(--muted2)", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Drawers & Modals */}
            {selected && (
                <CustomerDrawer
                    customer={selected}
                    onClose={() => setSelected(null)}
                    onEdit={() => { setEditTarget(selected); setSelected(null) }}
                    onDelete={() => { setDeleteTarget(selected); setSelected(null) }}
                />
            )}
            {editTarget && (
                <EditModal customer={editTarget} onClose={() => setEditTarget(null)} onSave={handleSaveEdit} />
            )}
            {deleteTarget && (
                <ConfirmDelete customer={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} />
            )}
        </div>
    )
}