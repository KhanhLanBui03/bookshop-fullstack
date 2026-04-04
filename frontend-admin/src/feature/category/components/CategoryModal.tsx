import React, { useEffect, useRef, useState } from "react"
import { glass, mono, inputStyle, EMPTY_FORM } from "../category.config"
import type { CategoryForm, CategoryResponse } from "../category.type"

interface Props {
    category: CategoryResponse | null   // null = Add mode
    onClose: () => void
    onSave: (form: CategoryForm, id?: number) => Promise<void>
}

const Field = ({ label, required, hint, children }: {
    label: string; required?: boolean; hint?: string; children: React.ReactNode
}) => (
    <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--muted2,#9490a8)", marginBottom: 6 }}>
            {label}{required && <span style={{ color: "var(--accent,#ff6b35)" }}> *</span>}
        </label>
        {children}
        {hint && <p style={{ ...mono, fontSize: 10, color: "var(--muted,#6b6880)", marginTop: 4 }}>{hint}</p>}
    </div>
)

export const CategoryModal = ({ category, onClose, onSave }: Props) => {
    const isEdit = !!category
    const [form, setForm]     = useState<CategoryForm>({ ...EMPTY_FORM })
    const [errors, setErrors] = useState<Partial<CategoryForm>>({})
    const [saving, setSaving] = useState(false)
    const [urlTab, setUrlTab] = useState<"url" | "upload">("url")
    const [dragOver, setDragOver] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    /* Pre-fill on edit */
    useEffect(() => {
        if (category) {
            setForm({
                name: category.name,
                description: category.description ?? "",
                url: category.url ?? "",
            })
        } else {
            setForm({ ...EMPTY_FORM })
        }
        setErrors({})
    }, [category])

    const set = (k: keyof CategoryForm) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm(f => ({ ...f, [k]: e.target.value }))

    /* Image upload via FileReader → base64 */
    const readFile = (file: File) => {
        if (!file.type.startsWith("image/")) return
        const reader = new FileReader()
        reader.onload = () => setForm(f => ({ ...f, url: reader.result as string }))
        reader.readAsDataURL(file)
    }

    const validate = () => {
        const e: Partial<CategoryForm> = {}
        if (!form.name.trim()) e.name = "Name is required"
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async () => {
        if (!validate() || saving) return
        setSaving(true)
        try { await onSave(form, category?.id) }
        finally { setSaving(false) }
    }

    return (
        <div
            className="cat-overlay"
            onClick={e => !saving && e.target === e.currentTarget && onClose()}
            style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,.68)", backdropFilter: "blur(5px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 50, padding: "24px 16px",
            }}
        >
            <div className="cat-modal" style={{ ...glass(), width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", borderRadius: 18 }}>

                {/* ── Header ── */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "20px 24px 16px", borderBottom: "1px solid var(--border,rgba(255,255,255,.07))",
                }}>
                    <div>
                        <p style={{ ...mono, fontSize: 10, color: "var(--muted,#6b6880)", textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>
                            {isEdit ? "Edit Category" : "New Category"}
                        </p>
                        <h2 style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 20, fontWeight: 700 }}>
                            {isEdit ? category.name : "Add Category"}
                        </h2>
                    </div>
                    <button
                        className="cat-icon-btn"
                        onClick={onClose}
                        disabled={saving}
                        style={{
                            background: "rgba(255,255,255,.05)", border: "1px solid var(--border,rgba(255,255,255,.07))",
                            borderRadius: 8, width: 32, height: 32, fontSize: 15, color: "var(--muted2,#9490a8)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                    >✕</button>
                </div>

                {/* ── Body ── */}
                <div style={{ padding: "20px 24px" }}>

                    {/* Name */}
                    <Field label="Category Name" required>
                        <input
                            className="cat-input"
                            style={inputStyle}
                            value={form.name}
                            onChange={set("name")}
                            placeholder="e.g. Science Fiction"
                        />
                        {errors.name && <p className="cat-err">{errors.name}</p>}
                    </Field>

                    {/* Description */}
                    <Field label="Description" hint="Short summary shown on category card">
                        <textarea
                            className="cat-input"
                            style={{ ...inputStyle, resize: "vertical", minHeight: 88, lineHeight: 1.6 }}
                            value={form.description}
                            onChange={set("description")}
                            placeholder="What kinds of books are in this category?"
                        />
                    </Field>

                    {/* Image */}
                    <Field label="Cover Image" hint="Displayed as card background · Recommended 800×500">
                        {/* Tab toggle */}
                        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                            {(["url", "upload"] as const).map(t => (
                                <button
                                    key={t}
                                    onClick={() => setUrlTab(t)}
                                    style={{
                                        ...mono, fontSize: 10, padding: "5px 12px", borderRadius: 7,
                                        background: urlTab === t ? "rgba(255,107,53,.15)" : "rgba(255,255,255,.05)",
                                        border: `1px solid ${urlTab === t ? "rgba(255,107,53,.4)" : "var(--border,rgba(255,255,255,.07))"}`,
                                        color: urlTab === t ? "var(--accent,#ff6b35)" : "var(--muted2,#9490a8)",
                                        cursor: "pointer",
                                    }}
                                >
                                    {t === "url" ? "🔗 URL" : "📁 Upload"}
                                </button>
                            ))}
                        </div>

                        {urlTab === "url" ? (
                            <input
                                className="cat-input"
                                style={inputStyle}
                                value={form.url}
                                onChange={set("url")}
                                placeholder="https://example.com/image.jpg"
                            />
                        ) : (
                            <>
                                <input
                                    ref={fileRef} type="file"
                                    accept="image/*" style={{ display: "none" }}
                                    onChange={e => e.target.files?.[0] && readFile(e.target.files[0])}
                                />
                                <div
                                    className="cat-img-zone"
                                    onClick={() => fileRef.current?.click()}
                                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={e => { e.preventDefault(); setDragOver(false); e.dataTransfer.files?.[0] && readFile(e.dataTransfer.files[0]) }}
                                    style={{
                                        border: `2px dashed ${dragOver ? "var(--accent,#ff6b35)" : "rgba(255,255,255,.12)"}`,
                                        borderRadius: 10, padding: "22px 16px",
                                        textAlign: "center", cursor: "pointer",
                                        background: dragOver ? "rgba(255,107,53,.06)" : "var(--bg2,#111117)",
                                    }}
                                >
                                    <div style={{ fontSize: 28, marginBottom: 6 }}>🖼️</div>
                                    <p style={{ ...mono, fontSize: 12, color: dragOver ? "var(--accent,#ff6b35)" : "var(--muted2,#9490a8)" }}>
                                        {dragOver ? "Drop to upload" : "Click or drag image here"}
                                    </p>
                                </div>
                            </>
                        )}

                        {/* Preview */}
                        {form.url && (
                            <div style={{ marginTop: 12, position: "relative", borderRadius: 10, overflow: "hidden", height: 120, border: "1px solid var(--border,rgba(255,255,255,.07))" }}>
                                <img
                                    src={form.url} alt="preview"
                                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none" }}
                                />
                                <button
                                    onClick={() => setForm(f => ({ ...f, url: "" }))}
                                    style={{
                                        position: "absolute", top: 8, right: 8,
                                        background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)",
                                        border: "none", borderRadius: 6, color: "#fff",
                                        width: 26, height: 26, cursor: "pointer", fontSize: 11,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}
                                >✕</button>
                                <div style={{
                                    position: "absolute", bottom: 8, left: 8,
                                    ...mono, fontSize: 9, background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)",
                                    color: "#fff", padding: "2px 7px", borderRadius: 5,
                                }}>
                                    Preview
                                </div>
                            </div>
                        )}
                    </Field>

                    {/* Footer */}
                    <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                        <button
                            className="cat-btn-ghost"
                            onClick={onClose}
                            disabled={saving}
                            style={{ ...mono, fontSize: 12, padding: "9px 18px", borderRadius: 8, background: "rgba(255,255,255,.05)", color: "var(--muted2,#9490a8)" }}
                        >
                            Cancel
                        </button>
                        <button
                            className="cat-btn-primary"
                            onClick={handleSubmit}
                            disabled={saving}
                            style={{
                                ...mono, fontSize: 12, fontWeight: 600, padding: "9px 24px", borderRadius: 8,
                                background: "var(--accent,#ff6b35)", color: "#fff",
                                display: "flex", alignItems: "center", gap: 8,
                            }}
                        >
                            {saving && <div className="cat-spinner" style={{ width: 13, height: 13 }} />}
                            {isEdit ? "Save Changes" : "Create Category"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}