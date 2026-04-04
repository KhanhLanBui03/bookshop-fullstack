import React, { useEffect, useState } from "react"
import { glass, mono, inputStyle, STATUS_CFG, EMPTY_FORM } from "../book.config"
import { Field, Spinner } from "./BookAtoms"
import { BookImageUploader } from "./BookImageUploader"
import { bookApi, type BookDetail, type BookRequestPayload } from "@/api/book.api"
import type { DropdownItem } from "@/api/metadata.api"
import type { BookAdminResponse, BookForm, BookStatus } from "../book.type"

interface Props {
    /** null = Add mode; defined = Edit mode (fetches full detail) */
    book: BookAdminResponse | null
    categories: DropdownItem[]
    authors: DropdownItem[]
    publishers: DropdownItem[]
    onClose: () => void
    onSave: (form: BookForm, bookId?: number) => Promise<void>
}

export const BookModal = ({
    book, categories, authors, publishers, onClose, onSave,
}: Props) => {
    const [form, setForm] = useState<BookForm>({ ...EMPTY_FORM })
    const [errors, setErrors] = useState<Partial<Record<keyof BookForm, string>>>({})
    const [saving, setSaving] = useState(false)
    const [fetching, setFetching] = useState(false)

    const isEdit = !!book
    const sel: React.CSSProperties = { ...inputStyle, cursor: "pointer" }

    /* ── Edit mode: fetch full book detail ── */
    useEffect(() => {
        if (!book) { setForm({ ...EMPTY_FORM }); return }

        const load = async () => {
            setFetching(true)
            try {
                const detail: BookDetail = await bookApi.getBookById(book.id)
                const matchedCategory = categories.find(c => c.name === detail.categoryName)
                const matchedAuthor = authors.find(a => a.name === detail.authorName)
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
                        id: String(img.id), url: img.url, name: img.name, size: 0,
                    })),
                })
            } catch (e) {
                console.error("Failed to load book detail", e)
            } finally {
                setFetching(false)
            }
        }
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [book?.id])

    const set = (k: keyof BookForm) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setForm(f => ({ ...f, [k]: e.target.value }))

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
        try { await onSave(form, book?.id) }
        finally { setSaving(false) }
    }

    const ErrMsg = ({ field }: { field: keyof BookForm }) =>
        errors[field] ? <p className="bm-err">{errors[field]}</p> : null

    /* ── Skeleton while fetching ── */
    if (fetching) {
        return (
            <div className="bm-overlay" style={overlayStyle}>
                <div style={{ ...glass(), width: "100%", maxWidth: 620, borderRadius: 18, padding: 28 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
                        <Spinner size={20} />
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
            style={overlayStyle}
        >
            <div
                className="bm-modal"
                style={{ ...glass(), width: "100%", maxWidth: 620, maxHeight: "90vh", overflowY: "auto", borderRadius: 18 }}
            >
                {/* ── Header ── */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "20px 24px 16px", borderBottom: "1px solid var(--border)",
                }}>
                    <div>
                        <p style={{ ...mono, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>
                            {isEdit ? "Edit Book" : "New Book"}
                        </p>
                        <h2 style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 20, fontWeight: 700 }}>
                            {isEdit ? book.title : "Add to Catalog"}
                        </h2>
                    </div>
                    <button
                        className="bm-icon-btn"
                        onClick={onClose}
                        disabled={saving}
                        style={{
                            background: "rgba(255,255,255,.05)", border: "1px solid var(--border)",
                            borderRadius: 8, width: 32, height: 32, fontSize: 16, color: "var(--muted2)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                    >✕</button>
                </div>

                {/* ── Body ── */}
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
                                <option value="">Select…</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <ErrMsg field="categoryId" />
                        </Field>
                        <Field label="Author" required>
                            <select className="bm-input" style={sel} value={form.authorId} onChange={set("authorId")}>
                                <option value="">Select…</option>
                                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                            <ErrMsg field="authorId" />
                        </Field>
                        <Field label="Publisher" required>
                            <select className="bm-input" style={sel} value={form.publisherId} onChange={set("publisherId")}>
                                <option value="">Select…</option>
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
                        <textarea
                            className="bm-input"
                            style={{ ...inputStyle, resize: "vertical", minHeight: 80, lineHeight: 1.6 }}
                            value={form.description} onChange={set("description")}
                            placeholder="Book description…"
                        />
                    </Field>

                    {/* Images */}
                    <Field label="Images" hint="JPG · PNG · WEBP · GIF · First image = cover">
                        <BookImageUploader
                            images={form.images}
                            onChange={imgs => setForm(f => ({ ...f, images: imgs }))}
                        />
                    </Field>

                    {/* Footer */}
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                        <button
                            className="bm-btn-ghost"
                            onClick={onClose}
                            disabled={saving}
                            style={{ ...mono, fontSize: 12, padding: "9px 18px", borderRadius: 8, background: "rgba(255,255,255,.05)", color: "var(--muted2)" }}
                        >
                            Cancel
                        </button>
                        <button
                            className="bm-btn-primary"
                            onClick={handleSubmit}
                            disabled={saving}
                            style={{
                                ...mono, fontSize: 12, fontWeight: 600, padding: "9px 22px", borderRadius: 8,
                                background: "var(--accent,#ff6b35)", color: "#fff",
                                display: "flex", alignItems: "center", gap: 8,
                            }}
                        >
                            {saving && <Spinner size={14} />}
                            {isEdit ? "Save Changes" : "Add Book"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const overlayStyle: React.CSSProperties = {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,.65)", backdropFilter: "blur(4px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 50, padding: "24px 16px",
}