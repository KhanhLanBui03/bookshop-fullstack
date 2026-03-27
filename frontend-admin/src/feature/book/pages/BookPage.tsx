import { ShieldCheck, Siren, TriangleAlert } from "lucide-react"
import React, { useCallback, useEffect, useRef, useState } from "react"
import type {
    BookAdminResponse,
    BookDashboardStats,
    BookForm,
    BookStatus,
    GetAdminBooksParams,
    ImagePreview,
} from "../book.type"
import { bookApi, type BookDetail, type BookRequestPayload } from "@/api/book.api"
import { authorApi, categoryApi, publisherApi, type DropdownItem } from "@/api/metadata.api"

/* ════════ CSS ════════ */
const CSS = `
  .bm * { box-sizing: border-box; margin: 0; padding: 0; }
  .bm { font-family: var(--font-body,'DM Sans',sans-serif); background: var(--bg,#0c0c10); min-height:100vh; color:var(--text,#e8e4f0); }
  @keyframes bmUp    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes bmFadeIn{ from{opacity:0} to{opacity:1} }
  @keyframes bmScale { from{opacity:0;transform:scale(.96) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes bmSpin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .bm-up   { animation: bmUp .32s cubic-bezier(.22,1,.36,1) both; }
  .bm-row  { transition: background .1s ease; cursor: default; }
  .bm-row:hover { background: rgba(255,255,255,0.03) !important; }
  .bm-btn-primary { transition:all .15s ease; cursor:pointer; border:none; }
  .bm-btn-primary:hover { filter:brightness(1.1); transform:translateY(-1px); box-shadow:0 4px 20px rgba(255,107,53,.35); }
  .bm-btn-primary:active { transform:translateY(0); }
  .bm-btn-primary:disabled { opacity:.45; cursor:not-allowed; transform:none; filter:none; box-shadow:none; }
  .bm-btn-ghost { transition:background .15s ease; cursor:pointer; border:none; }
  .bm-btn-ghost:hover { background:rgba(255,255,255,0.07) !important; }
  .bm-btn-ghost:disabled { opacity:.4; cursor:not-allowed; }
  .bm-input { transition:border-color .15s ease; outline:none; }
  .bm-input:focus { border-color:var(--accent,#ff6b35)!important; box-shadow:0 0 0 3px rgba(255,107,53,.12); }
  .bm-chip { cursor:pointer; transition:all .15s ease; }
  .bm-chip:hover { border-color:var(--accent,#ff6b35)!important; color:var(--accent,#ff6b35)!important; }
  .bm-chip.active { background:var(--accent,#ff6b35)!important; border-color:var(--accent,#ff6b35)!important; color:#fff!important; }
  .bm-overlay { animation:bmFadeIn .2s ease both; }
  .bm-modal   { animation:bmScale .22s cubic-bezier(.22,1,.36,1) both; }
  .bm-icon-btn { transition:background .12s ease; cursor:pointer; }
  .bm-icon-btn:hover { background:rgba(255,255,255,0.1)!important; }
  .bm-search-wrap:focus-within .bm-search-icon { color:var(--accent,#ff6b35); }
  .bm-page-btn { transition:all .15s ease; cursor:pointer; border:1px solid var(--border,rgba(255,255,255,.07)); }
  .bm-page-btn:hover:not(:disabled) { border-color:var(--accent,#ff6b35)!important; color:var(--accent,#ff6b35)!important; background:rgba(255,107,53,.06)!important; }
  .bm-page-btn:disabled { opacity:.28; cursor:not-allowed; }
  .bm-page-btn.pg-active { background:var(--accent,#ff6b35)!important; border-color:var(--accent,#ff6b35)!important; color:#fff!important; }
  .bm-spinner { width:20px; height:20px; border-radius:50%; border:2px solid rgba(255,107,53,.2); border-top-color:var(--accent,#ff6b35); animation:bmSpin .7s linear infinite; }
  .bm-err { color:var(--red,#ef4444); font-size:10px; margin-top:4px; font-family:var(--font-mono,'DM Mono',monospace); }
  /* Modal loading skeleton */
  @keyframes bmShimmer { from{background-position:-400px 0} to{background-position:400px 0} }
  .bm-skeleton { border-radius:6px; background:linear-gradient(90deg,var(--bg2,#111117) 25%,rgba(255,255,255,.04) 50%,var(--bg2,#111117) 75%); background-size:800px 100%; animation:bmShimmer 1.4s ease infinite; }
`

/* ════════ HELPERS ════════ */
const mono: React.CSSProperties = { fontFamily: "var(--font-mono,'DM Mono',monospace)" }

const glass = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: "var(--bg3,#18181f)",
    border: "1px solid var(--border,rgba(255,255,255,.07))",
    borderRadius: 14,
    ...extra,
})

const STATUS_CFG: Record<BookStatus, { label: string; bg: string; color: string }> = {
    ACTIVE: { label: "Active", bg: "rgba(34,197,94,.12)", color: "var(--green,#22c55e)" },
    INACTIVE: { label: "Inactive", bg: "rgba(255,255,255,.06)", color: "var(--muted2,#9490a8)" },
    OUT_OF_STOCK: { label: "Out of Stock", bg: "rgba(239,68,68,.12)", color: "var(--red,#ef4444)" },
}

const Star = ({ filled }: { filled: boolean }) => (
    <span style={{ color: filled ? "var(--amber,#f59e0b)" : "rgba(255,255,255,.15)", fontSize: 11 }}>★</span>
)
const Stars = ({ rating }: { rating: number }) => (
    <span>{[1, 2, 3, 4, 5].map(i => <Star key={i} filled={i <= Math.round(rating)} />)}</span>
)
const fmt = (n: number) => `$${n.toFixed(2)}`

const EMPTY_FORM: BookForm = {
    title: "", originalPrice: "", salePrice: "",
    description: "", status: "ACTIVE", stock: "",
    categoryId: "", authorId: "", publisherId: "", images: [],
}

const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--bg2,#111117)",
    border: "1px solid var(--border,rgba(255,255,255,.07))",
    borderRadius: 8, padding: "9px 12px",
    fontSize: 13, color: "var(--text)", ...mono,
}

/* ════════ FIELD ════════ */
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

/* ════════ BOOK MODAL ════════ */
interface BookModalProps {
    /** null = Add mode | BookAdminResponse = trigger Edit (will fetch full detail) */
    book: BookAdminResponse | null
    categories: DropdownItem[]
    authors: DropdownItem[]
    publishers: DropdownItem[]
    onClose: () => void
    onSave: (form: BookForm, bookId?: number) => Promise<void>
}

function BookModal({ book, categories, authors, publishers, onClose, onSave }: BookModalProps) {
    const [form, setForm] = useState<BookForm>(EMPTY_FORM)
    const [errors, setErrors] = useState<Partial<Record<keyof BookForm, string>>>({})
    const [saving, setSaving] = useState(false)
    const [fetching, setFetching] = useState(false)   // loading full book detail for edit
    const [dragOver, setDragOver] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    /* ── When edit mode: fetch full BookDetail and pre-fill form ── */
    useEffect(() => {
        if (!book) {
            setForm(EMPTY_FORM)
            return
        }

        const loadDetail = async () => {
            setFetching(true)
            try {
                const detail: BookDetail = await bookApi.getBookById(book.id)

                // Match names → ids using dropdown lists
                const matchedCategory = categories.find(c => c.name === detail.categoryName)
                const matchedAuthor = authors.find(a => a.name === detail.authorName)
                // publisher comes with id from BookResponse directly
                const matchedPublisher = detail.publisher

                setForm({
                    title: detail.title,
                    originalPrice: detail.originalPrice ? String(detail.originalPrice) : "",
                    salePrice: String(detail.salePrice),
                    description: detail.description ?? "",
                    status: detail.status ?? book.status,
                    stock: String(detail.stock),
                    categoryId: matchedCategory ? String(matchedCategory.id) : "",
                    authorId: matchedAuthor ? String(matchedAuthor.id) : "",
                    publisherId: matchedPublisher ? String(matchedPublisher.id) : "",
                    images: detail.images.map(img => ({
                        id: String(img.id),
                        url: img.url,
                        name: img.name,
                        size: 0,
                    })),
                })
            } catch (err) {
                console.error("Failed to load book detail", err)
            } finally {
                setFetching(false)
            }
        }

        loadDetail()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [book?.id])

    /* ── Field setter ── */
    const set = (k: keyof BookForm) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setForm(f => ({ ...f, [k]: e.target.value }))

    /* ── Image helpers ── */
    const readFiles = (files: FileList | null) => {
        if (!files) return
        Array.from(files).forEach(file => {
            if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) return
            const reader = new FileReader()
            reader.onload = () => setForm(f => ({
                ...f,
                images: [...f.images, {
                    id: `new-${Date.now()}-${Math.random()}`,
                    url: reader.result as string,
                    name: file.name,
                    size: file.size,
                }],
            }))
            reader.readAsDataURL(file)
        })
    }
    const removeImage = (id: string) => setForm(f => ({ ...f, images: f.images.filter(img => img.id !== id) }))
    const moveImage = (from: number, to: number) => setForm(f => {
        const imgs = [...f.images]
        const [item] = imgs.splice(from, 1)
        imgs.splice(to, 0, item)
        return { ...f, images: imgs }
    })

    /* ── Validation ── */
    const validate = () => {
        const e: Partial<Record<keyof BookForm, string>> = {}
        if (!form.title.trim()) e.title = "Title is required"
        if (!form.salePrice) e.salePrice = "Sale price is required"
        else if (Number(form.salePrice) < 0) e.salePrice = "Price must be positive"
        if (!form.stock) e.stock = "Stock is required"
        if (!form.categoryId) e.categoryId = "Category is required"
        if (!form.authorId) e.authorId = "Author is required"
        if (!form.publisherId) e.publisherId = "Publisher is required"
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async () => {
        if (!validate() || saving || fetching) return
        setSaving(true)
        try {
            await onSave(form, book?.id)
        } finally {
            setSaving(false)
        }
    }

    const ErrMsg = ({ field }: { field: keyof BookForm }) =>
        errors[field] ? <p className="bm-err">{errors[field]}</p> : null

    const sel: React.CSSProperties = { ...inputStyle, cursor: "pointer" }
    const isEdit = !!book

    /* ── Skeleton shown while fetching full detail ── */
    if (fetching) {
        return (
            <div className="bm-overlay" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "24px 16px" }}>
                <div style={{ ...glass(), width: "100%", maxWidth: 620, borderRadius: 18, padding: 28 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                        <div className="bm-spinner" />
                        <p style={{ ...mono, fontSize: 12, color: "var(--muted2)" }}>Loading book details…</p>
                    </div>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{ marginBottom: 16 }}>
                            <div className="bm-skeleton" style={{ height: 12, width: "30%", marginBottom: 8 }} />
                            <div className="bm-skeleton" style={{ height: 38, width: "100%" }} />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div
            className="bm-overlay"
            onClick={e => !saving && e.target === e.currentTarget && onClose()}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "24px 16px" }}
        >
            <div className="bm-modal" style={{ ...glass(), width: "100%", maxWidth: 620, maxHeight: "90vh", overflowY: "auto", borderRadius: 18 }}>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px", borderBottom: "1px solid var(--border)" }}>
                    <div>
                        <p style={{ ...mono, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>
                            {isEdit ? "Edit Book" : "New Book"}
                        </p>
                        <h2 style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 20, fontWeight: 700 }}>
                            {isEdit ? book.title : "Add to Catalog"}
                        </h2>
                    </div>
                    <button className="bm-icon-btn" onClick={onClose} disabled={saving}
                        style={{ background: "rgba(255,255,255,.05)", border: "1px solid var(--border)", borderRadius: 8, width: 32, height: 32, fontSize: 16, color: "var(--muted2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: "20px 24px" }}>

                    {/* Title */}
                    <Field label="Book Title" required>
                        <input className="bm-input" style={inputStyle} value={form.title} onChange={set("title")} placeholder="e.g. Atomic Habits" />
                        <ErrMsg field="title" />
                    </Field>

                    {/* Prices */}
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

                    {/* Category / Author / Publisher */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                        <Field label="Category" required>
                            <select className="bm-input" style={sel} value={form.categoryId} onChange={set("categoryId")}>
                                <option value="">Select...</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <ErrMsg field="categoryId" />
                        </Field>
                        <Field label="Author" required>
                            <select className="bm-input" style={sel} value={form.authorId} onChange={set("authorId")}>
                                <option value="">Select...</option>
                                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                            <ErrMsg field="authorId" />
                        </Field>
                        <Field label="Publisher" required>
                            <select className="bm-input" style={sel} value={form.publisherId} onChange={set("publisherId")}>
                                <option value="">Select...</option>
                                {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <ErrMsg field="publisherId" />
                        </Field>
                    </div>

                    {/* Stock + Status */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <Field label="Stock" required>
                            <input className="bm-input" style={inputStyle} type="number" min="0"
                                value={form.stock} onChange={set("stock")} placeholder="0" />
                            <ErrMsg field="stock" />
                        </Field>
                        <Field label="Status">
                            <select className="bm-input" style={sel} value={form.status} onChange={set("status")}>
                                {(Object.keys(STATUS_CFG) as BookStatus[]).map(s => (
                                    <option key={s} value={s}>{STATUS_CFG[s].label}</option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    {/* Description */}
                    <Field label="Description">
                        <textarea className="bm-input"
                            style={{ ...inputStyle, resize: "vertical", minHeight: 80, lineHeight: 1.6 }}
                            value={form.description} onChange={set("description")}
                            placeholder="Book description..." />
                    </Field>

                    {/* Images */}
                    <Field label="Images" hint="JPG · PNG · WEBP · GIF · First image = cover">
                        <input ref={fileRef} type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            multiple style={{ display: "none" }}
                            onChange={e => readFiles(e.target.files)} />

                        {/* Drop zone */}
                        <div
                            onClick={() => fileRef.current?.click()}
                            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={e => { e.preventDefault(); setDragOver(false); readFiles(e.dataTransfer.files) }}
                            style={{
                                border: `2px dashed ${dragOver ? "var(--accent)" : "rgba(255,255,255,.12)"}`,
                                borderRadius: 10, padding: "18px 16px", textAlign: "center", cursor: "pointer",
                                background: dragOver ? "rgba(255,107,53,.06)" : "var(--bg2,#111117)",
                                transition: "all .15s ease",
                                marginBottom: form.images.length ? 12 : 0,
                            }}
                        >
                            <div style={{ fontSize: 24, marginBottom: 6 }}>🖼️</div>
                            <p style={{ ...mono, fontSize: 12, color: dragOver ? "var(--accent)" : "var(--muted2)" }}>
                                {dragOver ? "Drop to upload" : "Click or drag & drop images here"}
                            </p>
                        </div>

                        {/* Preview grid */}
                        {form.images.length > 0 && (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))", gap: 8 }}>
                                {form.images.map((img, idx) => (
                                    <div key={img.id} style={{
                                        position: "relative", borderRadius: 8, overflow: "hidden",
                                        border: idx === 0 ? "2px solid var(--accent)" : "1px solid var(--border)",
                                        background: "var(--bg2)", aspectRatio: "1",
                                    }}>
                                        <img src={img.url} alt={img.name}
                                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                                        {idx === 0 && (
                                            <span style={{ position: "absolute", top: 4, left: 4, ...mono, fontSize: 8, fontWeight: 700, background: "var(--accent)", color: "#fff", padding: "2px 5px", borderRadius: 4 }}>COVER</span>
                                        )}
                                        <div
                                            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 4, padding: 5, opacity: 0, transition: "all .15s ease" }}
                                            onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = "rgba(0,0,0,.55)"; el.style.opacity = "1" }}
                                            onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.background = "rgba(0,0,0,0)"; el.style.opacity = "0" }}
                                        >
                                            {idx > 0 && (
                                                <button onClick={e => { e.stopPropagation(); moveImage(idx, idx - 1) }}
                                                    style={{ ...mono, fontSize: 10, background: "rgba(255,255,255,.15)", border: "none", borderRadius: 4, color: "#fff", width: 22, height: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
                                            )}
                                            <button onClick={e => { e.stopPropagation(); removeImage(img.id) }}
                                                style={{ ...mono, fontSize: 10, background: "rgba(239,68,68,.75)", border: "none", borderRadius: 4, color: "#fff", width: 22, height: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                                            {idx < form.images.length - 1 && (
                                                <button onClick={e => { e.stopPropagation(); moveImage(idx, idx + 1) }}
                                                    style={{ ...mono, fontSize: 10, background: "rgba(255,255,255,.15)", border: "none", borderRadius: 4, color: "#fff", width: 22, height: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {/* Add more slot */}
                                <div onClick={() => fileRef.current?.click()}
                                    style={{ borderRadius: 8, border: "2px dashed rgba(255,255,255,.1)", background: "var(--bg2)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, aspectRatio: "1", transition: "border-color .15s ease" }}
                                    onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)")}
                                    onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,.1)")}>
                                    <span style={{ fontSize: 18, color: "var(--muted)" }}>+</span>
                                    <span style={{ ...mono, fontSize: 9, color: "var(--muted)" }}>Add more</span>
                                </div>
                            </div>
                        )}
                        {form.images.length > 0 && (
                            <p style={{ ...mono, fontSize: 10, color: "var(--muted)", marginTop: 8 }}>
                                {form.images.length} image{form.images.length !== 1 ? "s" : ""} · Hover to reorder or remove · First = cover
                            </p>
                        )}
                    </Field>

                    {/* Footer */}
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                        <button className="bm-btn-ghost" onClick={onClose} disabled={saving}
                            style={{ ...mono, fontSize: 12, padding: "9px 18px", borderRadius: 8, background: "rgba(255,255,255,.05)", color: "var(--muted2)" }}>
                            Cancel
                        </button>
                        <button className="bm-btn-primary" onClick={handleSubmit} disabled={saving}
                            style={{ ...mono, fontSize: 12, fontWeight: 600, padding: "9px 22px", borderRadius: 8, background: "var(--accent,#ff6b35)", color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                            {saving && <div className="bm-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />}
                            {isEdit ? "Save Changes" : "Add Book"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ════════ DELETE CONFIRM ════════ */
function ConfirmDelete({ book, deleting, onClose, onConfirm }: {
    book: BookAdminResponse; deleting: boolean; onClose: () => void; onConfirm: () => Promise<void>
}) {
    return (
        <div className="bm-overlay" onClick={e => !deleting && e.target === e.currentTarget && onClose()}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
            <div className="bm-modal" style={{ ...glass(), borderRadius: 16, padding: 28, maxWidth: 380, width: "100%", margin: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(239,68,68,.12)", border: "1px solid rgba(239,68,68,.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 16 }}>🗑️</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Delete Book</h3>
                <p style={{ fontSize: 13, color: "var(--muted2)", lineHeight: 1.6, marginBottom: 22 }}>
                    Are you sure you want to remove <strong style={{ color: "var(--text)" }}>"{book.title}"</strong> from the catalog? This action cannot be undone.
                </p>
                <div style={{ display: "flex", gap: 10 }}>
                    <button className="bm-btn-ghost" onClick={onClose} disabled={deleting}
                        style={{ flex: 1, ...mono, fontSize: 12, padding: "9px 0", borderRadius: 8, background: "rgba(255,255,255,.05)", color: "var(--muted2)" }}>
                        Cancel
                    </button>
                    <button className="bm-btn-primary" onClick={onConfirm} disabled={deleting}
                        style={{ flex: 1, ...mono, fontSize: 12, fontWeight: 600, padding: "9px 0", borderRadius: 8, background: "var(--red,#ef4444)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        {deleting && <div className="bm-spinner" style={{ width: 13, height: 13, borderWidth: 2 }} />}
                        Delete
                    </button>
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

    /* ── Dropdown options (loaded once) ── */
    const [categories, setCategories] = useState<DropdownItem[]>([])
    const [authors, setAuthors] = useState<DropdownItem[]>([])
    const [publishers, setPublishers] = useState<DropdownItem[]>([])

    /* ── Filters ── */
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState<BookStatus | "ALL">("ALL")
    const [filterCategory, setFilterCategory] = useState<string>("ALL")
    const [sortBy, setSortBy] = useState<"title" | "salePrice" | "soldCount" | "stock">("soldCount")
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    /* ── Modals ── */
    const [showModal, setShowModal] = useState(false)
    const [editBook, setEditBook] = useState<BookAdminResponse | null>(null)
    const [deleteBook, setDeleteBook] = useState<BookAdminResponse | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null)

    /* ── Debounce search ── */
    useEffect(() => {
        const t = setTimeout(() => { setDebouncedSearch(search); setPage(1) }, 400)
        return () => clearTimeout(t)
    }, [search])

    /* ── Load dropdowns once ── */
    useEffect(() => {
        Promise.all([categoryApi.findAll(), authorApi.findAll(), publisherApi.findAll()])
            .then(([cats, auths, pubs]) => { setCategories(cats); setAuthors(auths); setPublishers(pubs) })
            .catch(err => console.error("Dropdown load error", err))
    }, [])

    /* ── Stats ── */
    const refreshStats = useCallback(() => {
        bookApi.getBookDashboardStats().then(setStats).catch(console.error)
    }, [])
    useEffect(() => { refreshStats() }, [refreshStats])

    /* ── Book list ── */
    const fetchBooks = useCallback(async () => {
        setLoading(true)
        try {
            const params: GetAdminBooksParams = { page: page - 1, size: pageSize, sortBy, sortDir }
            if (debouncedSearch) params.keyword = debouncedSearch
            if (filterStatus !== "ALL") params.status = filterStatus
            if (filterCategory !== "ALL") params.categoryId = Number(filterCategory)
            const res = await bookApi.getAdminBooks(params)
            setBooks(res.content)
            setTotalElements(res.totalElements)
            setTotalPages(res.totalPages || 1)
        } catch (err) {
            console.error("Fetch books error", err)
            showToast("Failed to load books", "err")
        } finally {
            setLoading(false)
        }
    }, [page, pageSize, sortBy, sortDir, debouncedSearch, filterStatus, filterCategory])
    useEffect(() => { fetchBooks() }, [fetchBooks])

    /* ── Helpers ── */
    const showToast = (msg: string, type: "ok" | "err" = "ok") => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 2800)
    }
    const toggleSort = (col: typeof sortBy) => {
        if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc")
        else { setSortBy(col); setSortDir("desc") }
        setPage(1)
    }

    /* ── Create / Update ── */
    const handleSave = async (form: BookForm, bookId?: number) => {
        const payload: BookRequestPayload = {
            title: form.title,
            salePrice: Number(form.salePrice),
            originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
            description: form.description || undefined,
            stock: Number(form.stock),
            categoryId: Number(form.categoryId),
            authorId: Number(form.authorId),
            publisherId: Number(form.publisherId),
            images: form.images.map(img => ({ name: img.name, url: img.url })),
        }

        if (bookId) {
            await bookApi.updateBook(bookId, payload)
            showToast("Book updated successfully")
        } else {
            await bookApi.createBook(payload)
            showToast("Book added to catalog")
        }

        setShowModal(false)
        setEditBook(null)
        await fetchBooks()
        refreshStats()
    }

    /* ── Delete ── */
    const handleDelete = async () => {
        if (!deleteBook) return
        setDeleting(true)
        try {
            await bookApi.deleteBook(deleteBook.id)
            showToast(`"${deleteBook.title}" removed`)
            setDeleteBook(null)
            if (books.length === 1 && page > 1) setPage(p => p - 1)
            else await fetchBooks()
            refreshStats()
        } catch (err) {
            console.error("Delete error", err)
            showToast("Failed to delete book", "err")
        } finally {
            setDeleting(false)
        }
    }

    /* ── Render helpers ── */
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
    const thStatic: React.CSSProperties = {
        ...mono, fontSize: 10, fontWeight: 600, color: "var(--muted)",
        textTransform: "uppercase", letterSpacing: 1,
        padding: "10px 14px", textAlign: "left", whiteSpace: "nowrap",
    }

    /* ═══════════ JSX ═══════════ */
    return (
        <div className="bm">
            <style>{CSS}</style>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: "fixed", bottom: 24, right: 24, zIndex: 100,
                    background: "var(--bg3)", borderRadius: 10,
                    border: "1px solid var(--border2,rgba(255,255,255,.12))",
                    borderLeft: `3px solid ${toast.type === "err" ? "var(--red,#ef4444)" : "var(--accent,#ff6b35)"}`,
                    padding: "12px 18px", ...mono, fontSize: 12, color: "var(--text)",
                    animation: "bmUp .3s cubic-bezier(.22,1,.36,1) both",
                    boxShadow: "0 8px 32px rgba(0,0,0,.4)",
                }}>
                    {toast.type === "err" ? "✕" : "✓"} {toast.msg}
                </div>
            )}

            <div style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 28px" }}>

                {/* Header */}
                <div className="bm-up" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
                    <div>
                        <p style={{ ...mono, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Catalog Management</p>
                        <h1 style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 28, fontWeight: 700, letterSpacing: "-.5px" }}>Books</h1>
                    </div>
                    <button className="bm-btn-primary"
                        onClick={() => { setEditBook(null); setShowModal(true) }}
                        style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--accent,#ff6b35)", color: "#fff", padding: "10px 18px", borderRadius: 10, ...mono, fontSize: 12, fontWeight: 600 }}>
                        <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Add Book
                    </button>
                </div>

                {/* Stats */}
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

                {/* Filters */}
                <div className="bm-up" style={{ ...glass(), padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 16, animationDelay: "80ms" }}>
                    <div className="bm-search-wrap" style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center", gap: 8, background: "var(--bg2,#111117)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px" }}>
                        <span className="bm-search-icon" style={{ fontSize: 13, color: "var(--muted)", transition: "color .15s" }}>🔍</span>
                        <input className="bm-input" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search title or author..."
                            style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: "var(--text)", width: "100%", ...mono }} />
                        {search && <button onClick={() => { setSearch(""); setPage(1) }} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 14 }}>✕</button>}
                    </div>

                    <div style={{ display: "flex", gap: 6 }}>
                        {(["ALL", "ACTIVE", "INACTIVE", "OUT_OF_STOCK"] as const).map(s => (
                            <button key={s} className={`bm-chip ${filterStatus === s ? "active" : ""}`}
                                onClick={() => { setFilterStatus(s); setPage(1) }}
                                style={{ ...mono, fontSize: 10, padding: "6px 12px", borderRadius: 99, background: "transparent", border: "1px solid var(--border)", color: "var(--muted2)" }}>
                                {s === "ALL" ? "All" : STATUS_CFG[s].label}
                            </button>
                        ))}
                    </div>

                    <select className="bm-input" value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1) }}
                        style={{ ...mono, fontSize: 11, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px", color: "var(--muted2)", cursor: "pointer" }}>
                        <option value="ALL">All Categories</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>

                    {loading && <div className="bm-spinner" />}
                    <span style={{ ...mono, fontSize: 10, color: "var(--muted)", marginLeft: "auto" }}>
                        {totalElements} result{totalElements !== 1 ? "s" : ""} · {totalPages} page{totalPages !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Table */}
                <div className="bm-up" style={{ ...glass(), overflow: "hidden", animationDelay: "120ms" }}>
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                                    <th style={thStatic}>#</th>
                                    <th onClick={() => toggleSort("title")} style={thStyle("title")}>Title <SortIcon col="title" /></th>
                                    <th style={thStatic}>Category</th>
                                    <th style={thStatic}>Author</th>
                                    <th onClick={() => toggleSort("salePrice")} style={thStyle("salePrice")}>Price <SortIcon col="salePrice" /></th>
                                    <th onClick={() => toggleSort("stock")} style={thStyle("stock")}>Stock <SortIcon col="stock" /></th>
                                    <th onClick={() => toggleSort("soldCount")} style={thStyle("soldCount")}>Sold <SortIcon col="soldCount" /></th>
                                    <th style={thStatic}>Rating</th>
                                    <th style={thStatic}>Status</th>
                                    <th style={{ ...thStatic, textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
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
                                    const st = STATUS_CFG[b.status]
                                    const isLow = b.stock > 0 && b.stock <= 10
                                    const isOut = b.stock === 0
                                    return (
                                        <tr key={b.id} className="bm-row"
                                            style={{ borderBottom: "1px solid var(--border)", opacity: loading ? 0.5 : 1, transition: "opacity .2s" }}>

                                            <td style={{ ...mono, fontSize: 11, color: "var(--muted)", padding: "13px 14px" }}>
                                                {String((page - 1) * pageSize + i + 1).padStart(2, "0")}
                                            </td>

                                            <td style={{ padding: "13px 14px", maxWidth: 240 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <div style={{ width: 36, height: 36, borderRadius: 6, flexShrink: 0, background: "var(--bg2)", border: "1px solid var(--border)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        {b.images
                                                            ? <img src={b.images} alt={b.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                                            : <span style={{ fontSize: 16 }}>📚</span>
                                                        }
                                                    </div>
                                                    <div style={{ minWidth: 0 }}>
                                                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.title}</p>
                                                        <p style={{ ...mono, fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{b.publisher}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td style={{ padding: "13px 14px" }}>
                                                <span style={{ ...mono, fontSize: 10, padding: "3px 8px", borderRadius: 99, background: "rgba(255,255,255,.06)", color: "var(--muted2)" }}>{b.category}</span>
                                            </td>
                                            <td style={{ ...mono, fontSize: 11, color: "var(--muted2)", padding: "13px 14px", whiteSpace: "nowrap" }}>{b.author}</td>
                                            <td style={{ padding: "13px 14px" }}>
                                                <p style={{ ...mono, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{fmt(b.salePrice)}</p>
                                            </td>
                                            <td style={{ padding: "13px 14px" }}>
                                                <span style={{ ...mono, fontSize: 12, fontWeight: 600, color: isOut ? "var(--red)" : isLow ? "var(--amber)" : "var(--text)" }}>{b.stock}</span>
                                                {isLow && !isOut && <span style={{ ...mono, fontSize: 9, color: "var(--amber)", display: "block", marginTop: 1 }}>Low</span>}
                                            </td>
                                            <td style={{ ...mono, fontSize: 12, color: "var(--muted2)", padding: "13px 14px" }}>{b.soldCount}</td>
                                            <td style={{ padding: "13px 14px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                    <Stars rating={b.rating} />
                                                    <span style={{ ...mono, fontSize: 10, color: "var(--muted)" }}>{b.rating || "—"}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: "13px 14px" }}>
                                                <span style={{ ...mono, fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 99, background: st.bg, color: st.color, whiteSpace: "nowrap" }}>{st.label}</span>
                                            </td>
                                            <td style={{ padding: "13px 14px", textAlign: "right" }}>
                                                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                                    <button className="bm-icon-btn" title="Edit"
                                                        onClick={() => { setEditBook(b); setShowModal(true) }}
                                                        style={{ background: "rgba(255,255,255,.05)", border: "1px solid var(--border)", borderRadius: 7, width: 30, height: 30, fontSize: 13, cursor: "pointer", color: "var(--muted2)", display: "flex", alignItems: "center", justifyContent: "center" }}>✏️</button>
                                                    <button className="bm-icon-btn" title="Delete"
                                                        onClick={() => setDeleteBook(b)}
                                                        style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", borderRadius: 7, width: 30, height: 30, fontSize: 13, cursor: "pointer", color: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center" }}>🗑️</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {totalElements > 0 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 4px", flexWrap: "wrap", gap: 12 }}>
                        <p style={{ ...mono, fontSize: 11, color: "var(--muted)" }}>
                            Showing{" "}
                            <span style={{ color: "var(--text)", fontWeight: 600 }}>{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalElements)}</span>
                            {" "}of{" "}
                            <span style={{ color: "var(--text)", fontWeight: 600 }}>{totalElements}</span>
                            {" "}books
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginRight: 10 }}>
                                <span style={{ ...mono, fontSize: 10, color: "var(--muted)" }}>Per page</span>
                                <select className="bm-input" value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
                                    style={{ ...mono, fontSize: 11, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 7, padding: "5px 8px", color: "var(--muted2)", cursor: "pointer" }}>
                                    {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                                </select>
                            </div>
                            <button className="bm-page-btn" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}
                                style={{ ...mono, fontSize: 12, background: "var(--bg3)", borderRadius: 8, color: "var(--muted2)", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
                            {(() => {
                                const pages: (number | "…")[] = []
                                if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i) }
                                else {
                                    pages.push(1)
                                    if (page > 3) pages.push("…")
                                    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
                                    if (page < totalPages - 2) pages.push("…")
                                    pages.push(totalPages)
                                }
                                return pages.map((p, i) =>
                                    p === "…"
                                        ? <span key={`e${i}`} style={{ ...mono, fontSize: 11, color: "var(--muted)", width: 20, textAlign: "center" }}>…</span>
                                        : <button key={p} className={`bm-page-btn${page === p ? " pg-active" : ""}`}
                                            onClick={() => setPage(p as number)}
                                            style={{ ...mono, fontSize: 12, fontWeight: page === p ? 700 : 400, background: "var(--bg3)", borderRadius: 8, color: "var(--muted2)", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            {p}
                                        </button>
                                )
                            })()}
                            <button className="bm-page-btn" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                style={{ ...mono, fontSize: 12, background: "var(--bg3)", borderRadius: 8, color: "var(--muted2)", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showModal && (
                <BookModal
                    book={editBook}
                    categories={categories}
                    authors={authors}
                    publishers={publishers}
                    onClose={() => { setShowModal(false); setEditBook(null) }}
                    onSave={handleSave}
                />
            )}
            {deleteBook && (
                <ConfirmDelete
                    book={deleteBook}
                    deleting={deleting}
                    onClose={() => setDeleteBook(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    )
}