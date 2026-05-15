import { glass, mono, PROVIDER_CFG, ROLE_CFG } from "../customer.config"
import type { AuthProvider, RoleName } from "../customer.type"

interface Props {
    search: string
    filterRole: RoleName | "ALL"
    filterProvider: AuthProvider | "ALL"
    totalElements: number
    totalPages: number
    onSearchChange: (v: string) => void
    onSearchClear: () => void
    onRoleChange: (r: RoleName | "ALL") => void
    onProviderChange: (p: AuthProvider | "ALL") => void
    onClearAll: () => void
}

export const CustomerFilters = ({
    search, filterRole, filterProvider,
    totalElements, totalPages,
    onSearchChange, onSearchClear,
    onRoleChange, onProviderChange, onClearAll,
}: Props) => {
    const hasFilters = filterRole !== "ALL" || filterProvider !== "ALL" || search !== ""

    return (
        <div
            className="cm-up"
            style={{
                ...glass(),
                padding: "14px 16px",
                display: "flex", alignItems: "center",
                gap: 12, flexWrap: "wrap",
                marginBottom: 16, animationDelay: "80ms",
            }}
        >
            {/* Search */}
            <div style={{
                flex: 1, minWidth: 200,
                display: "flex", alignItems: "center", gap: 8,
                background: "var(--bg2,#111117)",
                border: "1px solid var(--border)",
                borderRadius: 8, padding: "8px 12px",
            }}>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>🔍</span>
                <input
                    className="cm-input"
                    value={search}
                    onChange={e => onSearchChange(e.target.value)}
                    placeholder="Search name, email or phone…"
                    style={{
                        background: "transparent", border: "none", outline: "none",
                        fontSize: 13, color: "var(--text)", width: "100%", ...mono,
                    }}
                />
                {search && (
                    <button
                        onClick={onSearchClear}
                        style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 14 }}
                    >✕</button>
                )}
            </div>

            {/* Role chips */}
            <div style={{ display: "flex", gap: 6 }}>
                {(["ALL", "USER", "STAFF", "ADMIN"] as const).map(r => (
                    <button
                        key={r}
                        className={`cm-chip ${filterRole === r ? "active" : ""}`}
                        onClick={() => onRoleChange(r as RoleName | "ALL")}
                        style={{
                            ...mono, fontSize: 10, padding: "6px 12px", borderRadius: 99,
                            background: "transparent",
                            border: "1px solid var(--border)",
                            color: "var(--muted2)",
                        }}
                    >
                        {r === "ALL" ? "All Roles" : ROLE_CFG[r].label}
                    </button>
                ))}
            </div>

            {/* Provider select */}
            <select
                className="cm-input"
                value={filterProvider}
                onChange={e => onProviderChange(e.target.value as AuthProvider | "ALL")}
                style={{
                    ...mono, fontSize: 11,
                    background: "var(--bg2,#111117)",
                    border: "1px solid var(--border)",
                    borderRadius: 8, padding: "7px 12px",
                    color: "var(--muted2)", cursor: "pointer",
                }}
            >
                <option value="ALL">All Providers</option>
                {(["LOCAL", "GOOGLE"] as AuthProvider[]).map(p => (
                    <option key={p} value={p}>{PROVIDER_CFG[p].icon} {PROVIDER_CFG[p].label}</option>
                ))}
            </select>

            {/* Clear button */}
            {hasFilters && (
                <button
                    className="cm-btn-ghost"
                    onClick={onClearAll}
                    style={{
                        ...mono, fontSize: 11, padding: "7px 14px", borderRadius: 8,
                        background: "rgba(255,255,255,0.05)", color: "var(--muted2)",
                    }}
                >
                    Clear filters ✕
                </button>
            )}

            {/* Count */}
            <span style={{ ...mono, fontSize: 10, color: "var(--muted)", marginLeft: "auto" }}>
                {totalElements} customer{totalElements !== 1 ? "s" : ""} · {totalPages} page{totalPages !== 1 ? "s" : ""}
            </span>
        </div>
    )
}