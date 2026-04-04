import React from "react"
import { glass, mono, STATUS_CFG } from "../book.config"
import type { BookStatus } from "../book.type"
import type { DropdownItem } from "@/api/metadata.api"

interface Props {
    search: string
    filterStatus: BookStatus | "ALL"
    filterCategory: string
    categories: DropdownItem[]
    totalElements: number
    totalPages: number
    loading: boolean
    onSearchChange: (v: string) => void
    onSearchClear: () => void
    onStatusChange: (s: BookStatus | "ALL") => void
    onCategoryChange: (id: string) => void
}

export const BookFilters = ({
    search, filterStatus, filterCategory,
    categories, totalElements, totalPages, loading,
    onSearchChange, onSearchClear, onStatusChange, onCategoryChange,
}: Props) => (
    <div
        className="bm-up"
        style={{
            ...glass(),
            padding: "14px 16px",
            display: "flex", alignItems: "center",
            gap: 12, flexWrap: "wrap",
            marginBottom: 16, animationDelay: "80ms",
        }}
    >
        {/* Search */}
        <div
            className="bm-search-wrap"
            style={{
                flex: 1, minWidth: 200,
                display: "flex", alignItems: "center", gap: 8,
                background: "var(--bg2,#111117)",
                border: "1px solid var(--border)",
                borderRadius: 8, padding: "8px 12px",
            }}
        >
            <span className="bm-search-icon" style={{ fontSize: 13, color: "var(--muted)", transition: "color .15s" }}>
                🔍
            </span>
            <input
                className="bm-input"
                value={search}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Search title or author…"
                style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: "var(--text)", width: "100%", ...mono }}
            />
            {search && (
                <button
                    onClick={onSearchClear}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 14 }}
                >✕</button>
            )}
        </div>

        {/* Status chips */}
        <div style={{ display: "flex", gap: 6 }}>
            {(["ALL", "ACTIVE", "INACTIVE", "OUT_OF_STOCK"] as const).map(s => (
                <button
                    key={s}
                    className={`bm-chip ${filterStatus === s ? "active" : ""}`}
                    onClick={() => onStatusChange(s)}
                    style={{
                        ...mono, fontSize: 10, padding: "6px 12px", borderRadius: 99,
                        background: "transparent", border: "1px solid var(--border)", color: "var(--muted2)",
                    }}
                >
                    {s === "ALL" ? "All" : STATUS_CFG[s].label}
                </button>
            ))}
        </div>

        {/* Category select */}
        <select
            className="bm-input"
            value={filterCategory}
            onChange={e => onCategoryChange(e.target.value)}
            style={{
                ...mono, fontSize: 11,
                background: "var(--bg2,#111117)",
                border: "1px solid var(--border)",
                borderRadius: 8, padding: "7px 12px",
                color: "var(--muted2)", cursor: "pointer",
            }}
        >
            <option value="ALL">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        {loading && <div className="bm-spinner" />}

        <span style={{ ...mono, fontSize: 10, color: "var(--muted)", marginLeft: "auto" }}>
            {totalElements} result{totalElements !== 1 ? "s" : ""} · {totalPages} page{totalPages !== 1 ? "s" : ""}
        </span>
    </div>
)