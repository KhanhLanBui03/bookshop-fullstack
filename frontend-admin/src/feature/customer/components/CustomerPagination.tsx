import React from "react"
import { mono } from "../customer.config"

interface Props {
    page: number
    totalPages: number
    totalElements: number
    pageSize: number
    onPageChange: (p: number) => void
}

export const CustomerPagination = ({
    page, totalPages, totalElements, pageSize, onPageChange,
}: Props) => {
    if (totalPages <= 0) return null

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
        borderRadius: 8, color: "var(--muted2)",
        width: 34, height: 34,
        display: "flex", alignItems: "center", justifyContent: "center",
    }

    return (
        <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 4px", flexWrap: "wrap", gap: 12,
        }}>
            <p style={{ ...mono, fontSize: 11, color: "var(--muted)" }}>
                Showing{" "}
                <span style={{ color: "var(--text)", fontWeight: 600 }}>
                    {Math.min((page - 1) * pageSize + 1, totalElements)}–{Math.min(page * pageSize, totalElements)}
                </span>
                {" "}of{" "}
                <span style={{ color: "var(--text)", fontWeight: 600 }}>{totalElements}</span>
                {" "}customers
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {/* Prev */}
                <button
                    className="cm-page-btn"
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
                            className={`cm-page-btn${page === p ? " pg-active" : ""}`}
                            onClick={() => onPageChange(p as number)}
                            style={{ ...btnBase, fontWeight: page === p ? 700 : 400 }}
                        >
                            {p}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    className="cm-page-btn"
                    disabled={page === totalPages}
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    style={btnBase}
                >→</button>
            </div>
        </div>
    )
}