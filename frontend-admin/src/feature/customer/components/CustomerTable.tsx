
import { type CSSProperties } from "react"
import { glass, mono, fmt, fmtDate, PROVIDER_CFG } from "../customer.config"
import { Avatar, RoleBadge } from "./CustomerAtoms"
import type { UserAdminResponse } from "../customer.type"

/* ── Skeleton row ── */
const SkeletonRow = () => (
    <tr style={{ borderBottom: "1px solid var(--border)" }}>
        {[36, 180, 90, 80, 50, 70, 80, 70].map((w, i) => (
            <td key={i} style={{ padding: "16px 14px" }}>
                <div className="cm-skeleton" style={{ height: 12, width: w }} />
            </td>
        ))}
    </tr>
)

type SortCol = "fullName" | "createAt" | "totalOrder" | "totalSpent"

interface Props {
    users: UserAdminResponse[]
    loading: boolean
    page: number
    pageSize: number
    sortBy: SortCol
    sortDir: "asc" | "desc"
    onSort: (col: SortCol) => void
    onView: (user: UserAdminResponse) => void
}

export const CustomerTable = ({
    users, loading, page, pageSize,
    sortBy, sortDir, onSort, onView,
}: Props) => {
    const SortIcon = ({ col }: { col: SortCol }) => (
        <span style={{ ...mono, fontSize: 9, marginLeft: 4, opacity: sortBy === col ? 1 : 0.3 }}>
            {sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
        </span>
    )

    const thSort = (col: SortCol): CSSProperties => ({
        ...mono, fontSize: 10, fontWeight: 600, letterSpacing: 1,
        color: sortBy === col ? "var(--accent,#ff6b35)" : "var(--muted)",
        textTransform: "uppercase", padding: "10px 14px", textAlign: "left",
        cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
    })
    const thStatic: CSSProperties = {
        ...mono, fontSize: 10, fontWeight: 600, letterSpacing: 1,
        color: "var(--muted)", textTransform: "uppercase",
        padding: "10px 14px", textAlign: "left", whiteSpace: "nowrap",
    }

    return (
        <div className="cm-up" style={{ ...glass(), overflow: "hidden", animationDelay: "120ms" }}>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)" }}>
                            <th style={thStatic}>#</th>
                            <th onClick={() => onSort("fullName")} style={thSort("fullName")}>Customer <SortIcon col="fullName" /></th>
                            <th style={thStatic}>Provider</th>
                            <th style={thStatic}>Roles</th>
                            <th onClick={() => onSort("totalOrder")} style={thSort("totalOrder")}>Orders <SortIcon col="totalOrder" /></th>
                            <th onClick={() => onSort("totalSpent")} style={thSort("totalSpent")}>Total Spent <SortIcon col="totalSpent" /></th>
                            <th onClick={() => onSort("createAt")} style={thSort("createAt")}>Joined <SortIcon col="createAt" /></th>
                            <th style={{ ...thStatic, textAlign: "right" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: pageSize }).map((_, i) => <SkeletonRow key={i} />)
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{ textAlign: "center", padding: "52px 0", color: "var(--muted)" }}>
                                    <div style={{ fontSize: 32, marginBottom: 10 }}>👤</div>
                                    <p style={{ ...mono, fontSize: 12 }}>No customers found</p>
                                </td>
                            </tr>
                        ) : users.map((u, i) => {
                            const provider = PROVIDER_CFG[u.authProvider] ?? PROVIDER_CFG.LOCAL
                            return (
                                <tr
                                    key={u.id}
                                    className="cm-row"
                                    onClick={() => onView(u)}
                                    style={{ borderBottom: "1px solid var(--border)" }}
                                >
                                    {/* # */}
                                    <td style={{ ...mono, fontSize: 11, color: "var(--muted)", padding: "13px 14px" }}>
                                        {String((page - 1) * pageSize + i + 1).padStart(2, "0")}
                                    </td>

                                    {/* Customer */}
                                    <td style={{ padding: "13px 14px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 180 }}>
                                            <Avatar name={u.fullName} id={u.id} size={36} />
                                            <div style={{ minWidth: 0 }}>
                                                <p style={{
                                                    fontSize: 13, fontWeight: 600, color: "var(--text)",
                                                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160,
                                                }}>
                                                    {u.fullName}
                                                </p>
                                                <p style={{
                                                    ...mono, fontSize: 10, color: "var(--muted)", marginTop: 1,
                                                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160,
                                                }}>
                                                    {u.email}
                                                </p>
                                                {u.phoneNumber && (
                                                    <p style={{ ...mono, fontSize: 10, color: "var(--muted)", marginTop: 1 }}>
                                                        {u.phoneNumber}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Provider */}
                                    <td style={{ padding: "13px 14px" }}>
                                        <span style={{
                                            ...mono, fontSize: 10, fontWeight: 600,
                                            padding: "3px 9px", borderRadius: 99,
                                            background: "rgba(255,255,255,0.06)",
                                            color: provider.color, whiteSpace: "nowrap",
                                        }}>
                                            {provider.icon} {provider.label}
                                        </span>
                                    </td>

                                    {/* Roles */}
                                    <td style={{ padding: "13px 14px" }}>
                                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                                            {u.roles.map(r => <RoleBadge key={r} role={r} />)}
                                        </div>
                                    </td>

                                    {/* Orders */}
                                    <td style={{ padding: "13px 14px" }}>
                                        <span style={{ ...mono, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                                            {u.totalOrder}
                                        </span>
                                    </td>

                                    {/* Spent */}
                                    <td style={{ padding: "13px 14px" }}>
                                        <span style={{
                                            ...mono, fontSize: 13, fontWeight: 600,
                                            color: u.totalSpent > 0 ? "var(--accent,#ff6b35)" : "var(--muted)",
                                        }}>
                                            {u.totalSpent > 0 ? fmt(u.totalSpent) : "—"}
                                        </span>
                                    </td>

                                    {/* Joined */}
                                    <td style={{ ...mono, fontSize: 11, color: "var(--muted2)", padding: "13px 14px", whiteSpace: "nowrap" }}>
                                        {fmtDate(u.createAt)}
                                    </td>

                                    {/* Action */}
                                    <td style={{ padding: "13px 14px", textAlign: "right" }}>
                                        <div
                                            style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <button
                                                className="cm-icon-btn"
                                                title="View detail"
                                                onClick={() => onView(u)}
                                                style={{
                                                    background: "rgba(255,255,255,0.05)",
                                                    border: "1px solid var(--border)",
                                                    borderRadius: 7, width: 30, height: 30,
                                                    fontSize: 13, cursor: "pointer", color: "var(--muted2)",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                }}
                                            >👁</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}