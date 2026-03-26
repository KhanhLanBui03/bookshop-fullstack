import { ShieldCheck, Siren, TriangleAlert } from "lucide-react"
import React, { useCallback, useEffect, useRef, useState } from "react"
import type { BookAdminResponse, BookDashboardStats, BookStatus } from "../book.type"
import { bookApi, type GetAdminBooksParams, type PageResponse } from "@/api/book.api"

/* ════════ MOCK DATA (for modal dropdowns only) ════════ */
const MOCK_CATEGORIES = [
    { id: 1, name: "Fiction" },
    { id: 2, name: "Self-Help" },
    { id: 3, name: "Technology" },
    { id: 4, name: "Business" },
]
const MOCK_AUTHORS = [
    { id: 1, name: "James Clear" },
    { id: 2, name: "Cal Newport" },
    { id: 3, name: "Robert C. Martin" },
    { id: 4, name: "Andrew Hunt" },
]
const MOCK_PUBLISHERS = [
    { id: 1, name: "Penguin Books" },
    { id: 2, name: "O'Reilly Media" },
    { id: 3, name: "Addison-Wesley" },
]

/* ════════ CSS ════════ */
const CSS = `
  .bm * { box-sizing: border-box; margin: 0; padding: 0; }
  .bm {
    font-family: var(--font-body, 'DM Sans', sans-serif);
    background: var(--bg, #0c0c10);
    min-height: 100vh;
    color: var(--text, #e8e4f0);
  }
  @keyframes bmUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes bmFadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes bmScale  {
    from { opacity: 0; transform: scale(.96) translateY(8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes bmSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .bm-up   { animation: bmUp .32s cubic-bezier(.22,1,.36,1) both; }
  .bm-row  { transition: background .1s ease; cursor: default; }
  .bm-row:hover { background: rgba(255,255,255,0.03) !important; }
  .bm-btn-primary {
    transition: all .15s ease; cursor: pointer; border: none;
  }
  .bm-btn-primary:hover {
    filter: brightness(1.1); transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(255,107,53,0.35);
  }
  .bm-btn-primary:active { transform: translateY(0); }
  .bm-btn-ghost { transition: background .15s ease; cursor: pointer; border: none; }
  .bm-btn-ghost:hover { background: rgba(255,255,255,0.07) !important; }
  .bm-input { transition: border-color .15s ease; outline: none; }
  .bm-input:focus {
    border-color: var(--accent, #ff6b35) !important;
    box-shadow: 0 0 0 3px rgba(255,107,53,0.12);
  }
  .bm-chip { cursor: pointer; transition: all .15s ease; }
  .bm-chip:hover { border-color: var(--accent, #ff6b35) !important; color: var(--accent, #ff6b35) !important; }
  .bm-chip.active { background: var(--accent, #ff6b35) !important; border-color: var(--accent, #ff6b35) !important; color: #fff !important; }
  .bm-overlay { animation: bmFadeIn .2s ease both; }
  .bm-modal   { animation: bmScale .22s cubic-bezier(.22,1,.36,1) both; }
  .bm-icon-btn { transition: background .12s ease; cursor: pointer; }
  .bm-icon-btn:hover { background: rgba(255,255,255,0.1) !important; }
  .bm-search-wrap:focus-within .bm-search-icon { color: var(--accent, #ff6b35); }
  .bm-page-btn {
    transition: all .15s ease; cursor: pointer;
    border: 1px solid var(--border, rgba(255,255,255,0.07));
  }
  .bm-page-btn:hover:not(:disabled) {
    border-color: var(--accent, #ff6b35) !important;
    color: var(--accent, #ff6b35) !important;
    background: rgba(255,107,53,0.06) !important;
  }
  .bm-page-btn:disabled { opacity: 0.28; cursor: not-allowed; }
  .bm-page-btn.pg-active {
    background: var(--accent, #ff6b35) !important;
    border-color: var(--accent, #ff6b35) !important;
    color: #fff !important;
  }
  .bm-spinner {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2px solid rgba(255,107,53,0.2);
    border-top-color: var(--accent, #ff6b35);
    animation: bmSpin .7s linear infinite;
  }
`

/* ════════ HELPERS ════════ */
const mono: React.CSSProperties = { fontFamily: "var(--font-mono, 'DM Mono', monospace)" }

const glass = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: "var(--bg3, #18181f)",
    border: "1px solid var(--border, rgba(255,255,255,0.07))",
    borderRadius: 14,
    ...extra,
})

const STATUS_CONFIG: Record<BookStatus, { label: string; bg: string; color: string }> = {
    ACTIVE: { label: "Active", bg: "rgba(34,197,94,0.12)", color: "var(--green,  #22c55e)" },
    INACTIVE: { label: "Inactive", bg: "rgba(255,255,255,0.06)", color: "var(--muted2, #9490a8)" },
    OUT_OF_STOCK: { label: "Out of Stock", bg: "rgba(239,68,68,0.12)", color: "var(--red,    #ef4444)" },
}

const Star = ({ filled }: { filled: boolean }) => (
    <span style={{ color: filled ? "var(--amber, #f59e0b)" : "rgba(255,255,255,0.15)", fontSize: 11 }}>★</span>
)
const Stars = ({ rating }: { rating: number }) => (
    <span>{[1, 2, 3, 4, 5].map(i => <Star key={i} filled={i <= Math.round(rating)} />)}</span>
)
const fmt = (n: number) => `$${n.toFixed(2)}`

/* ════════ FORM STATE (for add/edit modal) ════════ */
interface ImagePreview {
    id: string
    url: string
    name: string
    size: number
}
interface BookForm {
    title: string
    originalPrice: string
    salePrice: string
    description: string
    status: BookStatus
    stock: string
    categoryId: string
    authorId: string
    publisherId: string
    images: ImagePreview[]
}
const EMPTY_FORM: BookForm = {
    title: "", originalPrice: "", salePrice: "",
    description: "", status: "ACTIVE", stock: "",
    categoryId: "", authorId: "", publisherId: "",
    images: [],
}

/* ════════ COMPONENTS ════════ */
function Field({ label, children, required, hint }: {
    label: string; children: React.ReactNode; required?: boolean; hint?: string
}) {
    return (
        <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--muted2)", marginBottom: 6 }}>
                {label} {required && <span style={{ color: "var(--accent)" }}>*</span>}
            </label>
            {children}
            {hint && <p style={{ ...mono, fontSize: 10, color: "var(--muted)", marginTop: 4 }}>{hint}</p>}
        </div>
    )
}

const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--bg2, #111117)",
    border: "1px solid var(--border, rgba(255,255,255,0.07))",
    borderRadius: 8, padding: "9px 12px",
    fontSize: 13, color: "var(--text)", ...mono,
}

/* ════════ ADD/EDIT MODAL ════════ */
function BookModal({ book, onClose, onSave }: {
    book: BookAdminResponse | null
    onClose: () => void
    onSave: (form: BookForm) => void
}) {
    const [form, setForm] = useState<BookForm>(
        book
            ? {
                title: book.title,
                originalPrice: "",
                salePrice: String(book.salePrice),
                description: "",
                status: book.status,
                stock: String(book.stock),
                categoryId: "",
                authorId: "",
                publisherId: "",
                images: book.images
                    ? [{ id: "0", url: book.images, name: "existing", size: 0 }]
                    : [],
            }
            : EMPTY_FORM
    )
    const [errors, setErrors] = useState<Partial<Record<keyof BookForm, string>>>({})
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const readFiles = (files: FileList | null) => {
        if (!files) return
        Array.from(files).forEach(file => {
            if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) return
            const reader = new FileReader()
            reader.onload = () => {
                setForm(f => ({
                    ...f,
                    images: [...f.images, {
                        id: `${Date.now()}-${Math.random()}`,
                        url: reader.result as string,
                        name: file.name,
                        size: file.size,
                    }],
                }))
            }
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (id: string) =>
        setForm(f => ({ ...f, images: f.images.filter(img => img.id !== id) }))

    const moveImage = (from: number, to: number) => {
        setForm(f => {
            const imgs = [...f.images]
            const [item] = imgs.splice(from, 1)
            imgs.splice(to, 0, item)
            return { ...f, images: imgs }
        })
    }

    const set = (k: keyof BookForm) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setForm(f => ({ ...f, [k]: e.target.value }))

    const validate = () => {
        const e: Partial<Record<keyof BookForm, string>> = {}
        if (!form.title.trim()) e.title = "Title is required"
        if (!form.salePrice) e.salePrice = "Sale price is required"
        if (!form.stock) e.stock = "Stock is required"
        if (!form.categoryId) e.categoryId = "Category is required"
        if (!form.authorId) e.authorId = "Author is required"
        if (!form.publisherId) e.publisherId = "Publisher is required"
        if (Number(form.salePrice) < 0) e.salePrice = "Price must be positive"
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = () => { if (validate()) onSave(form) }
    const ErrMsg = ({ field }: { field: keyof BookForm }) =>
        errors[field] ? <p style={{ ...mono, fontSize: 10, color: "var(--red)", marginTop: 4 }}>{errors[field]}</p> : null

    const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" }

    return (
        <div
            className="bm-overlay"
            onClick={e => e.target === e.currentTarget && onClose()}
            style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 50, padding: "24px 16px",
            }}
        >
            <div className="bm-modal" style={{
                ...glass(), width: "100%", maxWidth: 600,
                maxHeight: "90vh", overflowY: "auto", borderRadius: 18,
            }}>
                {/* Header */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "20px 24px 16px",
                    borderBottom: "1px solid var(--border)",
                }}>
                    <div>
                        <p style={{ ...mono, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>
                            {book ? "Edit Book" : "New Book"}
                        </p>
                        <h2 style={{ fontFamily: "var(--font-display, 'Fraunces', serif)", fontSize: 20, fontWeight: 700 }}>
                            {book ? book.title : "Add to Catalog"}
                        </h2>
                    </div>
                    <button className="bm-icon-btn" onClick={onClose} style={{
                        background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
                        borderRadius: 8, width: 32, height: 32, fontSize: 16,
                        color: "var(--muted2)", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>✕</button>
                </div>

                {/* Body */}
                <div style={{ padding: "20px 24px" }}>
                    <Field label="Book Title" required>
                        <input className="bm-input" style={inputStyle} value={form.title}
                            onChange={set("title")} placeholder="e.g. Atomic Habits" />
                        <ErrMsg field="title" />
                    </Field>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <Field label="Original Price" hint="Leave blank if no discount">
                            <input className="bm-input" style={inputStyle} type="number" min="0" step="0.01"
                                value={form.originalPrice} onChange={set("originalPrice")} placeholder="0.00" />
                        </Field>
                        <Field label="Sale Price" required>
                            <input className="bm-input" style={inputStyle} type="number" min="0" step="0.01"
                                value={form.salePrice} onChange={set("salePrice")} placeholder="0.00" />
                            <ErrMsg field="salePrice" />
                        </Field>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                        <Field label="Category" required>
                            <select className="bm-input" style={selectStyle} value={form.categoryId} onChange={set("categoryId")}>
                                <option value="">Select...</option>
                                {MOCK_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <ErrMsg field="categoryId" />
                        </Field>
                        <Field label="Author" required>
                            <select className="bm-input" style={selectStyle} value={form.authorId} onChange={set("authorId")}>
                                <option value="">Select...</option>
                                {MOCK_AUTHORS.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                            <ErrMsg field="authorId" />
                        </Field>
                        <Field label="Publisher" required>
                            <select className="bm-input" style={selectStyle} value={form.publisherId} onChange={set("publisherId")}>
                                <option value="">Select...</option>
                                {MOCK_PUBLISHERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <ErrMsg field="publisherId" />
                        </Field>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <Field label="Stock" required>
                            <input className="bm-input" style={inputStyle} type="number" min="0"
                                value={form.stock} onChange={set("stock")} placeholder="0" />
                            <ErrMsg field="stock" />
                        </Field>
                        <Field label="Status">
                            <select className="bm-input" style={selectStyle} value={form.status} onChange={set("status")}>
                                {(Object.keys(STATUS_CONFIG) as BookStatus[]).map(s => (
                                    <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    <Field label="Description">
                        <textarea
                            className="bm-input"
                            style={{ ...inputStyle, resize: "vertical", minHeight: 88, lineHeight: 1.6 }}
                            value={form.description}
                            onChange={set("description")}
                            placeholder="Book description..."
                        />
                    </Field>

                    {/* Images */}
                    <Field label="Images" hint="JPG, PNG, WEBP, GIF · First image = cover">
                        <input
                            ref={fileInputRef} type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            multiple style={{ display: "none" }}
                            onChange={e => readFiles(e.target.files)}
                        />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={e => { e.preventDefault(); setDragOver(false); readFiles(e.dataTransfer.files) }}
                            style={{
                                border: `2px dashed ${dragOver ? "var(--accent)" : "rgba(255,255,255,0.12)"}`,
                                borderRadius: 10, padding: "20px 16px", textAlign: "center", cursor: "pointer",
                                background: dragOver ? "rgba(255,107,53,0.06)" : "var(--bg2, #111117)",
                                transition: "all .15s ease",
                                marginBottom: form.images.length ? 12 : 0,
                            }}
                        >
                            <div style={{ fontSize: 26, marginBottom: 8 }}>🖼️</div>
                            <p style={{ ...mono, fontSize: 12, color: dragOver ? "var(--accent)" : "var(--muted2)" }}>
                                {dragOver ? "Drop to upload" : "Click or drag & drop images here"}
                            </p>
                        </div>

                        {form.images.length > 0 && (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 8 }}>
                                {form.images.map((img, idx) => (
                                    <div key={img.id} style={{
                                        position: "relative", borderRadius: 8, overflow: "hidden",
                                        border: idx === 0 ? "2px solid var(--accent)" : "1px solid var(--border)",
                                        background: "var(--bg2)", aspectRatio: "1",
                                    }}>
                                        <img src={img.url} alt={img.name}
                                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                        {idx === 0 && (
                                            <span style={{
                                                position: "absolute", top: 4, left: 4,
                                                ...mono, fontSize: 8, fontWeight: 700,
                                                background: "var(--accent)", color: "#fff",
                                                padding: "2px 5px", borderRadius: 4,
                                            }}>COVER</span>
                                        )}
                                        <div
                                            style={{
                                                position: "absolute", inset: 0, background: "rgba(0,0,0,0)",
                                                display: "flex", alignItems: "flex-end", justifyContent: "center",
                                                gap: 4, padding: 5, opacity: 0, transition: "all .15s ease",
                                            }}
                                            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0.55)"; (e.currentTarget as HTMLDivElement).style.opacity = "1" }}
                                            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0)"; (e.currentTarget as HTMLDivElement).style.opacity = "0" }}
                                        >
                                            {idx > 0 && (
                                                <button onClick={e => { e.stopPropagation(); moveImage(idx, idx - 1) }}
                                                    style={{ ...mono, fontSize: 10, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 4, color: "#fff", width: 22, height: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
                                            )}
                                            <button onClick={e => { e.stopPropagation(); removeImage(img.id) }}
                                                style={{ ...mono, fontSize: 10, background: "rgba(239,68,68,0.75)", border: "none", borderRadius: 4, color: "#fff", width: 22, height: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                                            {idx < form.images.length - 1 && (
                                                <button onClick={e => { e.stopPropagation(); moveImage(idx, idx + 1) }}
                                                    style={{ ...mono, fontSize: 10, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 4, color: "#fff", width: 22, height: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        borderRadius: 8, border: "2px dashed rgba(255,255,255,0.1)",
                                        background: "var(--bg2)", cursor: "pointer",
                                        display: "flex", flexDirection: "column",
                                        alignItems: "center", justifyContent: "center",
                                        gap: 4, aspectRatio: "1", transition: "border-color .15s ease",
                                    }}
                                    onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)")}
                                    onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.1)")}
                                >
                                    <span style={{ fontSize: 18, color: "var(--muted)" }}>+</span>
                                    <span style={{ ...mono, fontSize: 9, color: "var(--muted)" }}>Add more</span>
                                </div>
                            </div>
                        )}
                    </Field>

                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                        <button className="bm-btn-ghost" onClick={onClose} style={{
                            ...mono, fontSize: 12, padding: "9px 18px", borderRadius: 8,
                            background: "rgba(255,255,255,0.05)", color: "var(--muted2)",
                        }}>Cancel</button>
                        <button className="bm-btn-primary" onClick={handleSubmit} style={{
                            ...mono, fontSize: 12, fontWeight: 600, padding: "9px 22px", borderRadius: 8,
                            background: "var(--accent, #ff6b35)", color: "#fff",
                        }}>{book ? "Save Changes" : "Add Book"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ════════ DELETE CONFIRM ════════ */
function ConfirmDelete({ book, onClose, onConfirm }: {
    book: BookAdminResponse; onClose: () => void; onConfirm: () => void
}) {
    return (
        <div
            className="bm-overlay"
            onClick={e => e.target === e.currentTarget && onClose()}
            style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 50,
            }}
        >
            <div className="bm-modal" style={{ ...glass(), borderRadius: 16, padding: 28, maxWidth: 380, width: "100%", margin: 16 }}>
                <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, marginBottom: 16,
                }}>🗑️</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Delete Book</h3>
                <p style={{ fontSize: 13, color: "var(--muted2)", lineHeight: 1.6, marginBottom: 22 }}>
                    Are you sure you want to remove <strong style={{ color: "var(--text)" }}>"{book.title}"</strong> from the catalog? This action cannot be undone.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                    <button className="bm-btn-ghost" onClick={onClose} style={{
                        flex: 1, ...mono, fontSize: 12, padding: "9px 0", borderRadius: 8,
                        background: "rgba(255,255,255,0.05)", color: "var(--muted2)",
                    }}>Cancel</button>
                    <button className="bm-btn-primary" onClick={onConfirm} style={{
                        flex: 1, ...mono, fontSize: 12, fontWeight: 600, padding: "9px 0", borderRadius: 8,
                        background: "var(--red, #ef4444)", color: "#fff",
                    }}>Delete</button>
                </div>
            </div>
        </div>
    )
}

/* ════════ MAIN PAGE ════════ */
export const BookManagementPage = () => {
    /* ── Server data ── */
    const [books, setBooks] = useState<BookAdminResponse[]>([])
    const [totalElements, setTotalElements] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [stats, setStats] = useState<BookDashboardStats | null>(null)

    /* ── Filters (local state → triggers fetch) ── */
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState<BookStatus | "ALL">("ALL")
    const [filterCategory, setFilterCategory] = useState<string>("ALL")
    const [sortBy, setSortBy] = useState<"title" | "salePrice" | "soldCount" | "stock">("soldCount")
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
    const [page, setPage] = useState(1)          // 1-indexed (UI)
    const [pageSize, setPageSize] = useState(10)

    /* ── Modal ── */
    const [showModal, setShowModal] = useState(false)
    const [editBook, setEditBook] = useState<BookAdminResponse | null>(null)
    const [deleteBook, setDeleteBook] = useState<BookAdminResponse | null>(null)
    const [toast, setToast] = useState<string | null>(null)

    /* ─────────────────── Debounce search ─────────────────── */
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(1)
        }, 400)
        return () => clearTimeout(t)
    }, [search])

    /* ─────────────────── Fetch stats ─────────────────── */
    useEffect(() => {
        bookApi.getBookDashboardStats()
            .then(setStats)
            .catch(err => console.error("Failed to fetch stats", err))
    }, [])

    /* ─────────────────── Fetch book list ─────────────────── */
    const fetchBooks = useCallback(async () => {
        setLoading(true)
        try {
            const params: GetAdminBooksParams = {
                page: page - 1,          // Spring is 0-indexed
                size: pageSize,
                sortBy,
                sortDir,
            }
            if (debouncedSearch) params.keyword = debouncedSearch
            if (filterStatus !== "ALL") params.status = filterStatus
            if (filterCategory !== "ALL") params.categoryId = Number(filterCategory)

            const res = await bookApi.getAdminBooks(params)
            setBooks(res.content)
            setTotalElements(res.totalElements)
            setTotalPages(res.totalPages || 1)
        } catch (err) {
            console.error("Failed to fetch books", err)
            showToast("Failed to load books")
        } finally {
            setLoading(false)
        }
    }, [page, pageSize, sortBy, sortDir, debouncedSearch, filterStatus, filterCategory])

    useEffect(() => { fetchBooks() }, [fetchBooks])

    /* ─────────────────── Helpers ─────────────────── */
    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(null), 2800)
    }

    const toggleSort = (col: typeof sortBy) => {
        if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc")
        else { setSortBy(col); setSortDir("desc") }
        setPage(1)
    }

    /* ─────────────────── CRUD handlers ─────────────────── */
    const handleSave = async (_form: BookForm) => {
        // TODO: call bookApi.createBook / bookApi.updateBook
        // After API call, refresh list and stats
        setShowModal(false)
        setEditBook(null)
        showToast(editBook ? "Book updated successfully" : "Book added to catalog")
        await fetchBooks()
    }

    const handleDelete = async () => {
        if (!deleteBook) return
        // TODO: call bookApi.deleteBook(deleteBook.id)
        setDeleteBook(null)
        showToast(`"${deleteBook.title}" removed`)
        await fetchBooks()
    }

    /* ─────────────────── Render helpers ─────────────────── */
    const SortIcon = ({ col }: { col: typeof sortBy }) => (
        <span style={{ ...mono, fontSize: 9, marginLeft: 4, opacity: sortBy === col ? 1 : 0.3 }}>
            {sortBy === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
        </span>
    )

    const thStyle = (col: typeof sortBy): React.CSSProperties => ({
        ...mono, fontSize: 10, fontWeight: 600,
        color: sortBy === col ? "var(--accent)" : "var(--muted)",
        textTransform: "uppercase", letterSpacing: 1,
        padding: "10px 14px", textAlign: "left",
        cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
    })
    const thStaticStyle: React.CSSProperties = {
        ...mono, fontSize: 10, fontWeight: 600, color: "var(--muted)",
        textTransform: "uppercase", letterSpacing: 1,
        padding: "10px 14px", textAlign: "left", whiteSpace: "nowrap",
    }

    /* ═══════════════════ JSX ═══════════════════ */
    return (
        <div className="bm">
            <style>{CSS}</style>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: "fixed", bottom: 24, right: 24, zIndex: 100,
                    background: "var(--bg3)", border: "1px solid var(--border2, rgba(255,255,255,0.12))",
                    borderLeft: "3px solid var(--accent)", borderRadius: 10,
                    padding: "12px 18px", ...mono, fontSize: 12, color: "var(--text)",
                    animation: "bmUp .3s cubic-bezier(.22,1,.36,1) both",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}>
                    ✓ {toast}
                </div>
            )}

            <div style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 28px" }}>

                {/* ── Header ── */}
                <div className="bm-up" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
                    <div>
                        <p style={{ ...mono, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
                            Catalog Management
                        </p>
                        <h1 style={{ fontFamily: "var(--font-display, 'Fraunces', serif)", fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px" }}>
                            Books
                        </h1>
                    </div>
                    <button
                        className="bm-btn-primary"
                        onClick={() => { setEditBook(null); setShowModal(true) }}
                        style={{
                            display: "flex", alignItems: "center", gap: 8,
                            background: "var(--accent, #ff6b35)", color: "#fff",
                            padding: "10px 18px", borderRadius: 10,
                            ...mono, fontSize: 12, fontWeight: 600,
                        }}
                    >
                        <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Add Book
                    </button>
                </div>

                {/* ── Stats row ── */}
                <div className="bm-up" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20, animationDelay: "40ms" }}>
                    {[
                        { label: "Total Books", value: stats?.totalBooks ?? "—", icon: "📚" },
                        { label: "Active", value: stats?.countActive ?? "—", icon: <ShieldCheck size={20} /> },
                        { label: "Low Stock", value: stats?.countLowStock ?? "—", icon: <TriangleAlert size={20} /> },
                        { label: "Out of Stock", value: stats?.countOutOfStock ?? "—", icon: <Siren size={20} /> },
                    ].map((s, i) => (
                        <div key={i} style={{ ...glass(), padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                            <span style={{ fontSize: 22, color: "var(--muted2)" }}>{s.icon}</span>
                            <div>
                                <p style={{ ...mono, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{s.label}</p>
                                <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Filters ── */}
                <div className="bm-up" style={{
                    ...glass(), padding: "14px 16px",
                    display: "flex", alignItems: "center", gap: 12,
                    flexWrap: "wrap", marginBottom: 16, animationDelay: "80ms",
                }}>
                    {/* Search */}
                    <div className="bm-search-wrap" style={{
                        flex: 1, minWidth: 200,
                        display: "flex", alignItems: "center", gap: 8,
                        background: "var(--bg2, #111117)",
                        border: "1px solid var(--border)",
                        borderRadius: 8, padding: "8px 12px",
                    }}>
                        <span className="bm-search-icon" style={{ fontSize: 13, color: "var(--muted)", transition: "color .15s" }}>🔍</span>
                        <input
                            className="bm-input" value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search title or author..."
                            style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: "var(--text)", width: "100%", ...mono }}
                        />
                        {search && (
                            <button onClick={() => { setSearch(""); setPage(1) }} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 14 }}>✕</button>
                        )}
                    </div>

                    {/* Status chips */}
                    <div style={{ display: "flex", gap: 6 }}>
                        {(["ALL", "ACTIVE", "INACTIVE", "OUT_OF_STOCK"] as const).map(s => (
                            <button
                                key={s} className={`bm-chip ${filterStatus === s ? "active" : ""}`}
                                onClick={() => { setFilterStatus(s); setPage(1) }}
                                style={{ ...mono, fontSize: 10, padding: "6px 12px", borderRadius: 99, background: "transparent", border: "1px solid var(--border)", color: "var(--muted2)" }}
                            >
                                {s === "ALL" ? "All" : STATUS_CONFIG[s].label}
                            </button>
                        ))}
                    </div>

                    {/* Category filter */}
                    <select
                        className="bm-input"
                        value={filterCategory}
                        onChange={e => { setFilterCategory(e.target.value); setPage(1) }}
                        style={{ ...mono, fontSize: 11, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px", color: "var(--muted2)", cursor: "pointer" }}
                    >
                        <option value="ALL">All Categories</option>
                        {MOCK_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>

                    {/* Loading indicator */}
                    {loading && <div className="bm-spinner" />}

                    <span style={{ ...mono, fontSize: 10, color: "var(--muted)", marginLeft: "auto" }}>
                        {totalElements} result{totalElements !== 1 ? "s" : ""} · {totalPages} page{totalPages !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* ── Table ── */}
                <div className="bm-up" style={{ ...glass(), overflow: "hidden", animationDelay: "120ms" }}>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                                    <th style={thStaticStyle}>#</th>
                                    <th onClick={() => toggleSort("title")} style={thStyle("title")}>Title <SortIcon col="title" /></th>
                                    <th style={thStaticStyle}>Category</th>
                                    <th style={thStaticStyle}>Author</th>
                                    <th onClick={() => toggleSort("salePrice")} style={thStyle("salePrice")}>Price <SortIcon col="salePrice" /></th>
                                    <th onClick={() => toggleSort("stock")} style={thStyle("stock")}>Stock <SortIcon col="stock" /></th>
                                    <th onClick={() => toggleSort("soldCount")} style={thStyle("soldCount")}>Sold <SortIcon col="soldCount" /></th>
                                    <th style={thStaticStyle}>Rating</th>
                                    <th style={thStaticStyle}>Status</th>
                                    <th style={{ ...thStaticStyle, textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && books.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} style={{ textAlign: "center", padding: "52px 0" }}>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                                                <div className="bm-spinner" style={{ width: 28, height: 28 }} />
                                                <p style={{ ...mono, fontSize: 12, color: "var(--muted)" }}>Loading books...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : books.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} style={{ textAlign: "center", padding: "52px 0", color: "var(--muted)" }}>
                                            <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
                                            <p style={{ ...mono, fontSize: 12 }}>No books found</p>
                                        </td>
                                    </tr>
                                ) : books.map((b, i) => {
                                    const st = STATUS_CONFIG[b.status]
                                    const isLow = b.stock > 0 && b.stock <= 10
                                    const isOut = b.stock === 0

                                    return (
                                        <tr key={b.id} className="bm-row" style={{ borderBottom: "1px solid var(--border)", opacity: loading ? 0.5 : 1, transition: "opacity .2s" }}>
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
                                                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                            {b.title}
                                                        </p>
                                                        <p style={{ ...mono, fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{b.publisher}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <span style={{ ...mono, fontSize: 10, padding: "3px 8px", borderRadius: 99, background: "rgba(255,255,255,0.06)", color: "var(--muted2)" }}>
                                                    {b.category}
                                                </span>
                                            </td>

                                            {/* Author */}
                                            <td style={{ ...mono, fontSize: 11, color: "var(--muted2)", padding: "13px 14px", whiteSpace: "nowrap" }}>
                                                {b.author}
                                            </td>

                                            {/* Price */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <p style={{ ...mono, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{fmt(b.salePrice)}</p>
                                            </td>

                                            {/* Stock */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <span style={{ ...mono, fontSize: 12, fontWeight: 600, color: isOut ? "var(--red)" : isLow ? "var(--amber)" : "var(--text)" }}>
                                                    {b.stock}
                                                </span>
                                                {isLow && !isOut && (
                                                    <span style={{ ...mono, fontSize: 9, color: "var(--amber)", display: "block", marginTop: 1 }}>Low</span>
                                                )}
                                            </td>

                                            {/* Sold */}
                                            <td style={{ ...mono, fontSize: 12, color: "var(--muted2)", padding: "13px 14px" }}>{b.soldCount}</td>

                                            {/* Rating */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                    <Stars rating={b.rating} />
                                                    <span style={{ ...mono, fontSize: 10, color: "var(--muted)" }}>{b.rating || "—"}</span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td style={{ padding: "13px 14px" }}>
                                                <span style={{
                                                    ...mono, fontSize: 10, fontWeight: 600,
                                                    padding: "3px 9px", borderRadius: 99,
                                                    background: st.bg, color: st.color, whiteSpace: "nowrap",
                                                }}>{st.label}</span>
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: "13px 14px", textAlign: "right" }}>
                                                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                                    <button
                                                        className="bm-icon-btn" title="Edit"
                                                        onClick={() => { setEditBook(b); setShowModal(true) }}
                                                        style={{
                                                            background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
                                                            borderRadius: 7, width: 30, height: 30, fontSize: 13,
                                                            cursor: "pointer", color: "var(--muted2)",
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                        }}
                                                    >✏️</button>
                                                    <button
                                                        className="bm-icon-btn" title="Delete"
                                                        onClick={() => setDeleteBook(b)}
                                                        style={{
                                                            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                                                            borderRadius: 7, width: 30, height: 30, fontSize: 13,
                                                            cursor: "pointer", color: "var(--red)",
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

                {/* ── Pagination ── */}
                {totalElements > 0 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 4px", flexWrap: "wrap", gap: 12 }}>
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
                            {/* Page size */}
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 10 }}>
                                <span style={{ ...mono, fontSize: 10, color: "var(--muted)" }}>Per page</span>
                                <select
                                    className="bm-input" value={pageSize}
                                    onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
                                    style={{ ...mono, fontSize: 11, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 7, padding: "5px 8px", color: "var(--muted2)", cursor: "pointer" }}
                                >
                                    {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>

                            {/* Prev */}
                            <button className="bm-page-btn" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}
                                style={{ ...mono, fontSize: 12, background: "var(--bg3)", borderRadius: 8, color: "var(--muted2)", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>

                            {/* Page numbers */}
                            {(() => {
                                const pages: (number | "…")[] = []
                                if (totalPages <= 7) {
                                    for (let i = 1; i <= totalPages; i++) pages.push(i)
                                } else {
                                    pages.push(1)
                                    if (page > 3) pages.push("…")
                                    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
                                    if (page < totalPages - 2) pages.push("…")
                                    pages.push(totalPages)
                                }
                                return pages.map((p, i) =>
                                    p === "…" ? (
                                        <span key={`e${i}`} style={{ ...mono, fontSize: 11, color: "var(--muted)", width: 20, textAlign: "center" }}>…</span>
                                    ) : (
                                        <button key={p} className={`bm-page-btn${page === p ? " pg-active" : ""}`}
                                            onClick={() => setPage(p as number)}
                                            style={{ ...mono, fontSize: 12, fontWeight: page === p ? 700 : 400, background: "var(--bg3)", borderRadius: 8, color: "var(--muted2)", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {p}
                                        </button>
                                    )
                                )
                            })()}

                            {/* Next */}
                            <button className="bm-page-btn" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                style={{ ...mono, fontSize: 12, background: "var(--bg3)", borderRadius: 8, color: "var(--muted2)", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Modals ── */}
            {showModal && (
                <BookModal
                    book={editBook}
                    onClose={() => { setShowModal(false); setEditBook(null) }}
                    onSave={handleSave}
                />
            )}
            {deleteBook && (
                <ConfirmDelete
                    book={deleteBook}
                    onClose={() => setDeleteBook(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    )
}