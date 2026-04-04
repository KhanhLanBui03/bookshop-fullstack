import React from "react"
import { glass, mono, fmt } from "../book.config"
import { Stars, StatusBadge } from "./BookAtoms"
import type { BookAdminResponse } from "../book.type"

type SortCol = "title" | "salePrice" | "soldCount" | "stock"

interface Props {
    books: BookAdminResponse[]
    loading: boolean
    page: number
    pageSize: number
    sortBy: SortCol
    sortDir: "asc" | "desc"
    onSort: (col: SortCol) => void
    onEdit: (book: BookAdminResponse) => void
    onDelete: (book: BookAdminResponse) => void
}

export const BookTable = ({
    books, loading, page, pageSize,
    sortBy, sortDir, onSort, onEdit, onDelete,
}: Props) => {
    const SortIcon = ({ col }: { col: SortCol }) => (
        <span style={{ ...mono, fontSize: 9, marginLeft: 4, opacity: sortBy === col ? 1 : 0.3 }}>
            {sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
        </span>
    )

    const thSort = (col: SortCol): React.CSSProperties => ({
        ...mono, fontSize: 10, fontWeight: 600, letterSpacing: 1,
        color: sortBy === col ? "var(--accent,#ff6b35)" : "var(--muted)",
        textTransform: "uppercase", padding: "10px 14px", textAlign: "left",
        cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
    })
    const thStatic: React.CSSProperties = {
        ...mono, fontSize: 10, fontWeight: 600, color: "var(--muted)",
        textTransform: "uppercase", letterSpacing: 1,
        padding: "10px 14px", textAlign: "left", whiteSpace: "nowrap",
    }

    return (
        <div className="bm-up" style={{ ...glass(), overflow: "hidden", animationDelay: "120ms" }}>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid var(--border)" }}>
                            <th style={thStatic}>#</th>
                            <th onClick={() => onSort("title")} style={thSort("title")}>Title <SortIcon col="title" /></th>
                            <th style={thStatic}>Category</th>
                            <th style={thStatic}>Author</th>
                            <th onClick={() => onSort("salePrice")} style={thSort("salePrice")}>Price <SortIcon col="salePrice" /></th>
                            <th onClick={() => onSort("stock")} style={thSort("stock")}>Stock <SortIcon col="stock" /></th>
                            <th onClick={() => onSort("soldCount")} style={thSort("soldCount")}>Sold <SortIcon col="soldCount" /></th>
                            <th style={thStatic}>Rating</th>
                            <th style={thStatic}>Status</th>
                            <th style={{ ...thStatic, textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Loading & empty states */}
                        {loading && books.length === 0 ? (
                            <tr>
                                <td colSpan={10} style={{ textAlign: "center", padding: "52px 0" }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                                        <div className="bm-spinner" style={{ width: 28, height: 28 }} />
                                        <p style={{ ...mono, fontSize: 12, color: "var(--muted)" }}>Loading books…</p>
                                    </div>
                                </td>
                            </tr>
                        ) : books.length === 0 ? (
                            <tr>
                                <td colSpan={10} style={{ textAlign: "center", padding: "52px 0" }}>
                                    <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
                                    <p style={{ ...mono, fontSize: 12, color: "var(--muted)" }}>No books found</p>
                                </td>
                            </tr>
                        ) : books.map((b, i) => {
                            const isLow = b.stock > 0 && b.stock <= 10
                            const isOut = b.stock === 0

                            return (
                                <tr
                                    key={b.id}
                                    className="bm-row"
                                    style={{
                                        borderBottom: "1px solid var(--border)",
                                        opacity: loading ? 0.5 : 1,
                                        transition: "opacity .2s",
                                    }}
                                >
                                    {/* # */}
                                    <td style={{ ...mono, fontSize: 11, color: "var(--muted)", padding: "13px 14px" }}>
                                        {String((page - 1) * pageSize + i + 1).padStart(2, "0")}
                                    </td>

                                    {/* Title + cover */}
                                    <td style={{ padding: "13px 14px", maxWidth: 240 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 6, flexShrink: 0,
                                                background: "var(--bg2)", border: "1px solid var(--border)",
                                                overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                                            }}>
                                                {b.images
                                                    ? <img src={b.images} alt={b.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                    : <span style={{ fontSize: 16 }}>📚</span>
                                                }
                                            </div>
                                            <div style={{ minWidth: 0 }}>
                                                <p style={{
                                                    fontSize: 13, fontWeight: 600, color: "var(--text)",
                                                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                                }}>
                                                    {b.title}
                                                </p>
                                                <p style={{ ...mono, fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{b.publisher}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td style={{ padding: "13px 14px" }}>
                                        <span style={{
                                            ...mono, fontSize: 10, padding: "3px 8px", borderRadius: 99,
                                            background: "rgba(255,255,255,.06)", color: "var(--muted2)",
                                        }}>
                                            {b.category}
                                        </span>
                                    </td>

                                    {/* Author */}
                                    <td style={{ ...mono, fontSize: 11, color: "var(--muted2)", padding: "13px 14px", whiteSpace: "nowrap" }}>
                                        {b.author}
                                    </td>

                                    {/* Price */}
                                    <td style={{ padding: "13px 14px" }}>
                                        <p style={{ ...mono, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                                            {fmt(b.salePrice)}
                                        </p>
                                    </td>

                                    {/* Stock */}
                                    <td style={{ padding: "13px 14px" }}>
                                        <span style={{
                                            ...mono, fontSize: 12, fontWeight: 600,
                                            color: isOut ? "var(--red,#ef4444)" : isLow ? "var(--amber,#f59e0b)" : "var(--text)",
                                        }}>
                                            {b.stock}
                                        </span>
                                        {isLow && !isOut && (
                                            <span style={{ ...mono, fontSize: 9, color: "var(--amber,#f59e0b)", display: "block", marginTop: 1 }}>
                                                Low
                                            </span>
                                        )}
                                    </td>

                                    {/* Sold */}
                                    <td style={{ ...mono, fontSize: 12, color: "var(--muted2)", padding: "13px 14px" }}>
                                        {b.soldCount}
                                    </td>

                                    {/* Rating */}
                                    <td style={{ padding: "13px 14px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                            <Stars rating={b.rating} />
                                            <span style={{ ...mono, fontSize: 10, color: "var(--muted)" }}>{b.rating || "—"}</span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td style={{ padding: "13px 14px" }}>
                                        <StatusBadge status={b.status} />
                                    </td>

                                    {/* Actions */}
                                    <td style={{ padding: "13px 14px", textAlign: "right" }}>
                                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                            <button
                                                className="bm-icon-btn"
                                                title="Edit"
                                                onClick={() => onEdit(b)}
                                                style={{
                                                    background: "rgba(255,255,255,.05)", border: "1px solid var(--border)",
                                                    borderRadius: 7, width: 30, height: 30, fontSize: 13,
                                                    cursor: "pointer", color: "var(--muted2)",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                }}
                                            >✏️</button>
                                            <button
                                                className="bm-icon-btn"
                                                title="Delete"
                                                onClick={() => onDelete(b)}
                                                style={{
                                                    background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)",
                                                    borderRadius: 7, width: 30, height: 30, fontSize: 13,
                                                    cursor: "pointer", color: "var(--red,#ef4444)",
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                }}
                                            >🗑️</button>
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