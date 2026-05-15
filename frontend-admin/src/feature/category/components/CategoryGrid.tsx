import { glass, mono } from "../category.config"
import type { CategoryResponse } from "../category.type"

interface Props {
    categories: CategoryResponse[]
    loading: boolean
    search: string
    sortBy: "name" | "bookCount"
    sortDir: "asc" | "desc"
    onSearch: (v: string) => void
    onSearchClear: () => void
    onSort: (col: "name" | "bookCount") => void
    onEdit: (cat: CategoryResponse) => void
    onDelete: (cat: CategoryResponse) => void
    onAdd: () => void
}

/* ── Skeleton card ── */
const SkeletonCard = () => (
    <div style={{ ...glass(), borderRadius: 16, overflow: "hidden" }}>
        <div className="cat-skeleton" style={{ height: 140 }} />
        <div style={{ padding: "16px 18px" }}>
            <div className="cat-skeleton" style={{ height: 14, width: "60%", marginBottom: 10 }} />
            <div className="cat-skeleton" style={{ height: 10, width: "90%", marginBottom: 6 }} />
            <div className="cat-skeleton" style={{ height: 10, width: "70%" }} />
        </div>
    </div>
)

export const CategoryGrid = ({
    categories, loading, search, sortBy, sortDir,
    onSearch, onSearchClear, onSort, onEdit, onDelete, onAdd,
}: Props) => {
    const SortChip = ({ col, label }: { col: "name" | "bookCount"; label: string }) => (
        <button
            className={`cat-chip ${sortBy === col ? "active" : ""}`}
            onClick={() => onSort(col)}
            style={{
                ...mono, fontSize: 10, padding: "6px 11px", borderRadius: 99,
                background: "transparent",
                border: "1px solid var(--border,rgba(255,255,255,.07))",
                color: "var(--muted2,#9490a8)",
                display: "flex", alignItems: "center", gap: 4,
            }}
        >
            {label}
            <span style={{ opacity: sortBy === col ? 1 : 0.3, fontSize: 9 }}>
                {sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
            </span>
        </button>
    )

    return (
        <>
            {/* ── Toolbar ── */}
            <div className="cat-up" style={{
                ...glass(), padding: "13px 16px",
                display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
                marginBottom: 20, animationDelay: "80ms",
            }}>
                {/* Search */}
                <div className="cat-search-wrap" style={{
                    flex: 1, minWidth: 200,
                    display: "flex", alignItems: "center", gap: 8,
                    background: "var(--bg2,#111117)",
                    border: "1px solid var(--border,rgba(255,255,255,.07))",
                    borderRadius: 8, padding: "8px 12px",
                }}>
                    <span className="cat-search-icon" style={{ fontSize: 13, color: "var(--muted,#6b6880)" }}>🔍</span>
                    <input
                        className="cat-input"
                        value={search}
                        onChange={e => onSearch(e.target.value)}
                        placeholder="Search categories…"
                        style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: "var(--text,#e8e4f0)", width: "100%", ...mono }}
                    />
                    {search && (
                        <button onClick={onSearchClear} style={{ background: "none", border: "none", color: "var(--muted,#6b6880)", cursor: "pointer", fontSize: 14 }}>
                            ✕
                        </button>
                    )}
                </div>

                {/* Sort chips */}
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ ...mono, fontSize: 10, color: "var(--muted,#6b6880)" }}>Sort:</span>
                    <SortChip col="name" label="Name" />
                    <SortChip col="bookCount" label="Books" />
                </div>

                {/* Count */}
                <span style={{ ...mono, fontSize: 10, color: "var(--muted,#6b6880)", marginLeft: "auto" }}>
                    {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
                </span>
            </div>

            {/* ── Grid ── */}
            {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
                    {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : categories.length === 0 ? (
                <div style={{
                    ...glass(), borderRadius: 16,
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", padding: "64px 0", gap: 14,
                }}>
                    <span style={{ fontSize: 40 }}>🗂️</span>
                    <p style={{ ...mono, fontSize: 13, color: "var(--muted,#6b6880)" }}>
                        {search ? "No categories match your search" : "No categories yet"}
                    </p>
                    {!search && (
                        <button
                            className="cat-btn-primary"
                            onClick={onAdd}
                            style={{
                                ...mono, fontSize: 12, fontWeight: 600,
                                padding: "9px 18px", borderRadius: 9,
                                background: "var(--accent,#ff6b35)", color: "#fff",
                            }}
                        >
                            + Create first category
                        </button>
                    )}
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
                    {categories.map((cat, idx) => (
                        <CategoryCard
                            key={cat.id}
                            cat={cat}
                            idx={idx}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </>
    )
}

/* ── Category Card ── */
const GRADIENT_FALLBACKS = [
    "linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)",
    "linear-gradient(135deg,#1c1c1e 0%,#2c2c2e 50%,#3a3a3c 100%)",
    "linear-gradient(135deg,#0d1117 0%,#161b22 50%,#21262d 100%)",
    "linear-gradient(135deg,#1a0a00 0%,#2d1600 50%,#3d1f00 100%)",
    "linear-gradient(135deg,#000d1a 0%,#001a33 50%,#002647 100%)",
]

const CategoryCard = ({
    cat, idx, onEdit, onDelete,
}: {
    cat: CategoryResponse
    idx: number
    onEdit: (cat: CategoryResponse) => void
    onDelete: (cat: CategoryResponse) => void
}) => {
    const fallback = GRADIENT_FALLBACKS[idx % GRADIENT_FALLBACKS.length]
    const isEmpty = cat.bookCount === 0

    return (
        <div
            className="cat-card cat-up"
            style={{
                ...glass(), borderRadius: 16, overflow: "hidden",
                animationDelay: `${80 + idx * 30}ms`,
                display: "flex", flexDirection: "column",
            }}
        >
            {/* Cover image */}
            <div style={{ position: "relative", height: 140, flexShrink: 0 }}>
                {cat.url ? (
                    <img
                        src={cat.url} alt={cat.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                ) : (
                    <div style={{ width: "100%", height: "100%", background: fallback, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 36, opacity: 0.35 }}>📂</span>
                    </div>
                )}
                {/* Gradient overlay */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to top,rgba(12,12,16,.85) 0%,transparent 60%)",
                }} />

                {/* Book count badge */}
                <div style={{
                    position: "absolute", top: 10, right: 10,
                    background: isEmpty ? "rgba(245,158,11,.15)" : "rgba(255,107,53,.15)",
                    border: `1px solid ${isEmpty ? "rgba(245,158,11,.3)" : "rgba(255,107,53,.3)"}`,
                    borderRadius: 99, padding: "3px 9px",
                    display: "flex", alignItems: "center", gap: 5,
                }}>
                    <span style={{ fontSize: 10 }}>📚</span>
                    <span style={{
                        ...mono, fontSize: 10, fontWeight: 700,
                        color: isEmpty ? "#f59e0b" : "var(--accent,#ff6b35)",
                    }}>
                        {cat.bookCount}
                    </span>
                </div>

                {/* Actions overlay */}
                <div style={{
                    position: "absolute", top: 10, left: 10,
                    display: "flex", gap: 6,
                }}>
                    <button
                        className="cat-icon-btn"
                        title="Edit"
                        onClick={() => onEdit(cat)}
                        style={{
                            background: "rgba(255,255,255,.1)", backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255,255,255,.15)",
                            borderRadius: 7, width: 28, height: 28, fontSize: 12,
                            color: "var(--text,#e8e4f0)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                    >✏️</button>
                    <button
                        className="cat-icon-btn"
                        title="Delete"
                        onClick={() => onDelete(cat)}
                        style={{
                            background: "rgba(239,68,68,.15)", backdropFilter: "blur(8px)",
                            border: "1px solid rgba(239,68,68,.25)",
                            borderRadius: 7, width: 28, height: 28, fontSize: 12,
                            color: "var(--red,#ef4444)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                    >🗑️</button>
                </div>
            </div>

            {/* Body */}
            <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <h3 style={{
                        fontFamily: "var(--font-display,'Fraunces',serif)",
                        fontSize: 15, fontWeight: 700, color: "var(--text,#e8e4f0)",
                        lineHeight: 1.3,
                    }}>
                        {cat.name}
                    </h3>
                    <span style={{ ...mono, fontSize: 9, color: "var(--muted,#6b6880)", flexShrink: 0, marginTop: 3 }}>
                        #{String(cat.id).padStart(3, "0")}
                    </span>
                </div>

                {cat.description ? (
                    <p style={{
                        fontSize: 12, color: "var(--muted2,#9490a8)", lineHeight: 1.6,
                        display: "-webkit-box", WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                        {cat.description}
                    </p>
                ) : (
                    <p style={{ ...mono, fontSize: 11, color: "var(--muted,#6b6880)", fontStyle: "italic" }}>
                        No description
                    </p>
                )}

                {/* Footer */}
                <div style={{
                    marginTop: "auto", paddingTop: 10,
                    borderTop: "1px solid var(--border,rgba(255,255,255,.07))",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                    <span style={{
                        ...mono, fontSize: 10,
                        color: isEmpty ? "#f59e0b" : "var(--muted2,#9490a8)",
                    }}>
                        {cat.bookCount === 0 ? "Empty" : `${cat.bookCount} book${cat.bookCount !== 1 ? "s" : ""}`}
                    </span>
                    <button
                        className="cat-btn-ghost"
                        onClick={() => onEdit(cat)}
                        style={{
                            ...mono, fontSize: 10, padding: "4px 10px", borderRadius: 6,
                            background: "rgba(255,255,255,.05)",
                            color: "var(--muted2,#9490a8)",
                        }}
                    >
                        Edit →
                    </button>
                </div>
            </div>
        </div>
    )
}