import { useState } from "react";

import type { OrderStatus } from "../order.types";
import type { Order } from "../order.types";
import { Avatar } from "../components/Avatar";
import { Badge } from "../components/Badge";
const ORDERS: Order[] = [
    { id: "8821", name: "Nguyễn Văn An", avatar: "NA", items: 3, total: 47.97, date: "28 Feb", status: "Delivered" },
    { id: "8820", name: "Trần Thị Bình", avatar: "TB", items: 1, total: 16.99, date: "28 Feb", status: "Processing" },
    { id: "8819", name: "Lê Hoàng Cường", avatar: "LC", items: 5, total: 82.95, date: "27 Feb", status: "Shipped" },
    { id: "8818", name: "Phạm Thị Dung", avatar: "PD", items: 2, total: 31.98, date: "27 Feb", status: "Pending" },
    { id: "8817", name: "Hoàng Minh Đức", avatar: "HD", items: 4, total: 63.96, date: "26 Feb", status: "Delivered" },
    { id: "8816", name: "Vũ Thị Hoa", avatar: "VH", items: 1, total: 18.99, date: "26 Feb", status: "Cancelled" },
    { id: "8815", name: "Đặng Quốc Bảo", avatar: "DB", items: 2, total: 29.98, date: "25 Feb", status: "Delivered" },
    { id: "8814", name: "Nguyễn Thị Lan", avatar: "NL", items: 6, total: 98.94, date: "25 Feb", status: "Shipped" },
];
const ALL_STATUSES: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const AVATAR_COLORS = ["#ff6b35", "#60a5fa", "#a78bfa", "#34d399", "#f59e0b", "#f472b6", "#fb923c", "#38bdf8"];
export const OrdersPage = () => {
    const [filter, setFilter] = useState<OrderStatus | "All">("All");

    const shown = filter === "All" ? ORDERS : ORDERS.filter((o) => o.status === filter);

    return (
        <div className="page-enter">
            {/* Mini stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 18 }}>
                {([
                    { s: "Delivered" as OrderStatus, color: "#22c55e" },
                    { s: "Shipped" as OrderStatus, color: "#a78bfa" },
                    { s: "Processing" as OrderStatus, color: "#60a5fa" },
                    { s: "Pending" as OrderStatus, color: "#f59e0b" },
                    { s: "Cancelled" as OrderStatus, color: "#ef4444" },
                ]).map(({ s, color }) => {
                    const count = ORDERS.filter((o) => o.status === s).length;
                    const isActive = filter === s;
                    return (
                        <div key={s} onClick={() => setFilter(isActive ? "All" : s)} style={{
                            background: "var(--bg2)",
                            border: `1px solid ${isActive ? color + "44" : "var(--border)"}`,
                            borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all .15s",
                        }}>
                            <p style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, fontFamily: "var(--font-mono)", marginBottom: 6 }}>{s}</p>
                            <p style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: isActive ? color : "var(--text)", transition: "color .15s" }}>{count}</p>
                        </div>
                    );
                })}
            </div>

            {/* Filter chips */}
            <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                {(["All", ...ALL_STATUSES] as const).map((s) => (
                    <button key={s} className={`filter-chip ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)}
                        style={{ padding: "6px 14px", borderRadius: 99, border: "1px solid var(--border)", background: "var(--bg2)", color: "var(--muted2)", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>
                        {s}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,.02)" }}>
                            {["Order", "Customer", "Date", "Items", "Total", "Status", "Action"].map((h, i) => (
                                <th key={i} style={{
                                    padding: "12px 18px",
                                    textAlign: i >= 3 && i < 6 ? "right" : i === 6 ? "center" : "left",
                                    fontSize: 10, color: "var(--muted)", textTransform: "uppercase",
                                    letterSpacing: 1.2, fontWeight: 600, fontFamily: "var(--font-mono)",
                                }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {shown.map((order) => {
                            const col = AVATAR_COLORS[Number(order.id) % AVATAR_COLORS.length];
                            return (
                                <tr key={order.id} className="table-row" style={{ borderTop: "1px solid var(--border)" }}>
                                    <td style={{ padding: "13px 18px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>
                                        #{order.id}
                                    </td>
                                    <td style={{ padding: "13px 18px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <Avatar initials={order.avatar} size={28} color={col} />
                                            <span style={{ fontSize: 13, fontWeight: 500 }}>{order.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "13px 18px", fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                                        {order.date}
                                    </td>
                                    <td style={{ padding: "13px 18px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted2)" }}>
                                        {order.items}×
                                    </td>
                                    <td style={{ padding: "13px 18px", textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700 }}>
                                        ${order.total}
                                    </td>
                                    <td style={{ padding: "13px 18px", textAlign: "right" }}>
                                        <Badge label={order.status} />
                                    </td>
                                    <td style={{ padding: "13px 18px", textAlign: "center" }}>
                                        <button className="btn-ghost" style={{
                                            padding: "5px 12px", borderRadius: 7, border: "1px solid var(--border)",
                                            background: "var(--bg3)", fontSize: 11, color: "var(--muted2)", cursor: "pointer",
                                        }}>View</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {shown.length === 0 && (
                    <div style={{ padding: "48px 0", textAlign: "center" }}>
                        <p style={{ fontSize: 14, color: "var(--muted)" }}>No {filter} orders found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
