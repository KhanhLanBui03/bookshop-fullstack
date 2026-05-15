import { useEffect, useState, type CSSProperties, type ChangeEvent } from "react"
import { glass, mono, inputStyle, STATUS_CFG, EMPTY_FORM } from "../book.config"
import { Field, Spinner } from "./BookAtoms"
import { BookImageUploader } from "./BookImageUploader"
import { bookApi } from "@/api/book.api"
import type { DropdownItem } from "@/api/metadata.api"
import type { BookAdminResponse, BookForm, BookStatus, BookDetail } from "../book.type"

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
                    images: detail.images.map((img: any) => ({
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
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
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
                <div style={{ ...glass({ background: "#000" }), width: "100%", maxWidth: 620, borderRadius: 18, padding: 28 }}>
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
                style={modalStyle}
            >
                {/* Decorative Glow */}
                <div style={glowStyle} />

                {/* ── Header ── */}
                <div style={headerStyle}>
                    <div className="flex justify-between items-start">
                        <div>
                            <div style={subHeaderStyle}>
                                <span style={{ width: 12, height: 2, background: "currentColor" }} /> {isEdit ? "Update Inventory" : "New Acquisition"}
                            </div>
                            <h2 style={titleStyle}>
                                {isEdit ? book.title : "Add to Catalog"}
                            </h2>
                        </div>
                        <button
                            className="bm-icon-btn"
                            onClick={onClose}
                            disabled={saving}
                            style={closeBtnStyle}
                        >✕</button>
                    </div>
                </div>

                {/* ── Body ── */}
                <div style={{ padding: "0 40px 40px" }}>
                    <div style={{ display: "grid", gap: 24 }}>
                        {/* Title */}
                        <Field label="Book Title" required>
                            <input 
                                className="bm-input dark-placeholder" 
                                style={modalInputStyle} 
                                value={form.title} onChange={set("title")} 
                                placeholder="e.g. Atomic Habits" 
                            />
                            <ErrMsg field="title" />
                        </Field>

                        {/* Prices */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                            <Field label="Original Price" hint="Optional">
                                <input 
                                    className="bm-input dark-placeholder" 
                                    style={modalInputStyle} 
                                    type="number" min="0" step="0.01"
                                    value={form.originalPrice} onChange={set("originalPrice")} placeholder="0.00" 
                                />
                            </Field>
                            <Field label="Sale Price" required>
                                <input 
                                    className="bm-input dark-placeholder" 
                                    style={modalInputStyle} 
                                    type="number" min="0" step="0.01"
                                    value={form.salePrice} onChange={set("salePrice")} placeholder="0.00" 
                                />
                                <ErrMsg field="salePrice" />
                            </Field>
                        </div>

                        {/* Category / Author / Publisher */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                            <Field label="Category" required>
                                <select className="bm-input" style={modalSelectStyle} value={form.categoryId} onChange={set("categoryId")}>
                                    <option value="">Select…</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                <ErrMsg field="categoryId" />
                            </Field>
                            <Field label="Author" required>
                                <select className="bm-input" style={modalSelectStyle} value={form.authorId} onChange={set("authorId")}>
                                    <option value="">Select…</option>
                                    {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </select>
                                <ErrMsg field="authorId" />
                            </Field>
                            <Field label="Publisher" required>
                                <select className="bm-input" style={modalSelectStyle} value={form.publisherId} onChange={set("publisherId")}>
                                    <option value="">Select…</option>
                                    {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <ErrMsg field="publisherId" />
                            </Field>
                        </div>

                        {/* Stock + Status */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                            <Field label="Inventory Level" required>
                                <input 
                                    className="bm-input dark-placeholder" 
                                    style={modalInputStyle} 
                                    type="number" min="0"
                                    value={form.stock} onChange={set("stock")} placeholder="0" 
                                />
                                <ErrMsg field="stock" />
                            </Field>
                            <Field label="Visibility Status">
                                <select className="bm-input" style={modalSelectStyle} value={form.status} onChange={set("status")}>
                                    {(Object.keys(STATUS_CFG) as BookStatus[]).map(s => (
                                        <option key={s} value={s}>{STATUS_CFG[s].label}</option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        {/* Description */}
                        <Field label="Description">
                            <textarea
                                className="bm-input dark-placeholder"
                                style={{ ...modalInputStyle, borderRadius: "1.5rem", padding: "20px", resize: "vertical", minHeight: 120, lineHeight: 1.6, height: "auto" }}
                                value={form.description} onChange={set("description")}
                                placeholder="Write a compelling description for this title…"
                            />
                        </Field>

                        {/* Images */}
                        <Field label="Product Visuals" hint="First image is used as primary cover">
                            <BookImageUploader
                                images={form.images}
                                onChange={imgs => setForm(f => ({ ...f, images: imgs }))}
                            />
                        </Field>
                    </div>

                    {/* Footer */}
                    <div style={footerStyle}>
                        <button
                            className="bm-btn-ghost"
                            onClick={onClose}
                            disabled={saving}
                            style={cancelBtnStyle}
                        >
                            Cancel
                        </button>
                        <button
                            className="bm-btn-primary"
                            onClick={handleSubmit}
                            disabled={saving}
                            style={submitBtnStyle}
                        >
                            {saving ? <Spinner size={16} /> : <span style={{fontSize: 20}}>+</span>}
                            {isEdit ? "Update Title" : "Commit to Catalog"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ── STYLES ── */

const overlayStyle: CSSProperties = {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 100, padding: "24px 16px",
}

const modalStyle: React.CSSProperties = {
    background: "linear-gradient(165deg, rgba(10,10,15,0.95) 0%, rgba(0,0,0,1) 100%)", 
    width: "100%", maxWidth: 700, maxHeight: "92vh", overflowY: "auto", 
    borderRadius: "3rem", border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
    position: "relative"
}

const glowStyle: React.CSSProperties = { 
    position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", 
    width: "80%", height: 200, 
    background: "radial-gradient(circle, rgba(var(--primary-rgb),0.08) 0%, transparent 70%)", 
    pointerEvents: "none" 
}

const headerStyle: React.CSSProperties = { padding: "40px 40px 24px", position: "relative" }

const subHeaderStyle: React.CSSProperties = { 
    ...mono, fontSize: 10, color: "var(--primary)", textTransform: "uppercase", 
    letterSpacing: 3, fontWeight: 900, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 
}

const titleStyle: React.CSSProperties = { fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }

const closeBtnStyle: React.CSSProperties = {
    background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "1rem", width: 44, height: 44, fontSize: 18, color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s"
}

const modalInputStyle: React.CSSProperties = {
    ...inputStyle, 
    background: "#08080a", 
    height: 56, 
    borderRadius: "1.25rem", 
    padding: "0 24px", 
    fontSize: 14, 
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.08)",
    transition: "all 0.2s"
}

const modalSelectStyle: React.CSSProperties = { ...modalInputStyle, cursor: "pointer" }

const footerStyle: React.CSSProperties = { 
    display: "flex", gap: 16, justifyContent: "flex-end", marginTop: 40, 
    paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.05)" 
}

const cancelBtnStyle: React.CSSProperties = { 
    ...mono, fontSize: 12, fontWeight: 900, textTransform: "uppercase", 
    letterSpacing: 2, padding: "0 32px", height: 56, borderRadius: "1.25rem", 
    background: "rgba(255,255,255,.03)", color: "#fff", border: "1px solid rgba(255,255,255,0.08)" 
}

const submitBtnStyle: React.CSSProperties = {
    ...mono, fontSize: 12, fontWeight: 900, textTransform: "uppercase", 
    letterSpacing: 2, padding: "0 40px", height: 56, borderRadius: "1.25rem",
    background: "var(--primary)", color: "#fff",
    display: "flex", alignItems: "center", gap: 12,
    boxShadow: "0 10px 30px rgba(var(--primary-rgb), 0.3)"
}