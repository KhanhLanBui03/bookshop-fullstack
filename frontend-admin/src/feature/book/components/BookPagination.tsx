import React from "react"
import { mono } from "../book.config"

interface Props {
    page: number
    totalPages: number
    totalElements: number
    pageSize: number
    onPageChange: (p: number) => void
    onPageSizeChange: (n: number) => void
}

export const BookPagination = ({
    page, totalPages, totalElements, pageSize,
    onPageChange, onPageSizeChange,
}: Props) => {
    if (totalElements === 0) return null

    const pageNums = (): (number | "…")[] => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
        const arr: (number | "…")[] = [1]
        if (page > 3) arr.push("…")
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) arr.push(i)
        if (page < totalPages - 2) arr.push("…")
        arr.push(totalPages)
        return arr
    }

    const btnBase: React.CSSProperties = {
        ...mono, fontSize: 11, fontWeight: 900,
        background: "rgba(255,255,255,0.4)",
        border: "1px solid rgba(255,255,255,0.3)",
        borderRadius: "0.85rem", color: "#6b6b7b",
        width: 38, height: 38,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        backdropFilter: "blur(8px)"
    }

    const activeBtn: React.CSSProperties = {
        ...btnBase,
        background: "var(--primary)",
        color: "#fff",
        borderColor: "transparent",
        boxShadow: "0 8px 16px -4px rgba(var(--primary-rgb), 0.3)",
        transform: "scale(1.05)"
    }

    const disabledBtn: React.CSSProperties = {
        ...btnBase,
        opacity: 0.3,
        cursor: "not-allowed",
        background: "rgba(0,0,0,0.05)"
    }

    return (
        <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            padding: "24px 0", flexWrap: "wrap", gap: 16,
            marginTop: 10,
        }}>
            {/* Info */}
            <div className="glass px-6 py-2.5 rounded-2xl border-white/20">
                <p style={{ ...mono, fontSize: 10, color: "#6b6b7b", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                    Showing{" "}
                    <span style={{ color: "var(--primary)", fontWeight: 900 }}>
                        {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalElements)}
                    </span>
                    {" "}of{" "}
                    <span style={{ color: "var(--primary)", fontWeight: 900 }}>{totalElements}</span>
                    {" "}books
                </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Per-page */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 8 }}>
                    <span style={{ ...mono, fontSize: 10, fontWeight: 900, color: "#6b6b7b", textTransform: "uppercase" }}>Size</span>
                    <select
                        className="glass"
                        value={pageSize}
                        onChange={e => onPageSizeChange(Number(e.target.value))}
                        style={{
                            ...mono, fontSize: 11, fontWeight: 900,
                            background: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.3)",
                            borderRadius: "0.75rem", padding: "6px 12px",
                            color: "#4a4a5a", cursor: "pointer", outline: "none"
                        }}
                    >
                        {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {/* Prev */}
                    <button
                        className="hover:bg-white/60 active:scale-95 transition-all"
                        disabled={page === 1}
                        onClick={() => onPageChange(Math.max(1, page - 1))}
                        style={page === 1 ? disabledBtn : btnBase}
                    >
                        <span style={{fontSize: 18}}>←</span>
                    </button>

                    {/* Page numbers */}
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {pageNums().map((p, idx) =>
                            p === "…" ? (
                                <span key={`e${idx}`} style={{ ...mono, fontSize: 11, color: "#6b6b7b", width: 20, textAlign: "center", fontWeight: 900 }}>…</span>
                            ) : (
                                <button
                                    key={p}
                                    className="active:scale-95 transition-all"
                                    onClick={() => onPageChange(p as number)}
                                    style={page === p ? activeBtn : btnBase}
                                >
                                    {p}
                                </button>
                            )
                        )}
                    </div>

                    {/* Next */}
                    <button
                        className="hover:bg-white/60 active:scale-95 transition-all"
                        disabled={page === totalPages}
                        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                        style={page === totalPages ? disabledBtn : btnBase}
                    >
                        <span style={{fontSize: 18}}>→</span>
                    </button>
                </div>
            </div>
        </div>
    )
}