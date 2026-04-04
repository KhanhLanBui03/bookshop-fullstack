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
        ...mono, fontSize: 12,
        background: "var(--bg3,#18181f)",
        borderRadius: 8, color: "var(--muted2,#9490a8)",
        width: 34, height: 34,
        display: "flex", alignItems: "center", justifyContent: "center",
    }

    return (
        <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 4px", flexWrap: "wrap", gap: 12,
        }}>
            {/* Info */}
            <p style={{ ...mono, fontSize: 11, color: "var(--muted)" }}>
                Showing{" "}
                <span style={{ color: "var(--text)", fontWeight: 600 }}>
                    {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalElements)}
                </span>
                {" "}of{" "}
                <span style={{ color: "var(--text)", fontWeight: 600 }}>{totalElements}</span>
                {" "}books
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {/* Per-page */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 10 }}>
                    <span style={{ ...mono, fontSize: 10, color: "var(--muted)" }}>Per page</span>
                    <select
                        className="bm-input"
                        value={pageSize}
                        onChange={e => onPageSizeChange(Number(e.target.value))}
                        style={{
                            ...mono, fontSize: 11,
                            background: "var(--bg3)", border: "1px solid var(--border)",
                            borderRadius: 7, padding: "5px 8px",
                            color: "var(--muted2)", cursor: "pointer",
                        }}
                    >
                        {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                </div>

                {/* Prev */}
                <button
                    className="bm-page-btn"
                    disabled={page === 1}
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    style={btnBase}
                >←</button>

                {/* Page numbers */}
                {pageNums().map((p, idx) =>
                    p === "…" ? (
                        <span key={`e${idx}`} style={{ ...mono, fontSize: 11, color: "var(--muted)", width: 20, textAlign: "center" }}>…</span>
                    ) : (
                        <button
                            key={p}
                            className={`bm-page-btn${page === p ? " pg-active" : ""}`}
                            onClick={() => onPageChange(p as number)}
                            style={{ ...btnBase, fontWeight: page === p ? 700 : 400 }}
                        >
                            {p}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    className="bm-page-btn"
                    disabled={page === totalPages}
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    style={btnBase}
                >→</button>
            </div>
        </div>
    )
}