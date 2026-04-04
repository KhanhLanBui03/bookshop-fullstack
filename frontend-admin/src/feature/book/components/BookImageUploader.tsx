import React, { useRef, useState } from "react"
import { mono } from "../book.config"
import type { ImagePreview } from "../book.type"

interface Props {
    images: ImagePreview[]
    onChange: (images: ImagePreview[]) => void
}

export const BookImageUploader = ({ images, onChange }: Props) => {
    const [dragOver, setDragOver] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    const readFiles = (files: FileList | null) => {
        if (!files) return
        Array.from(files).forEach(file => {
            if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) return
            const reader = new FileReader()
            reader.onload = () => onChange([
                ...images,
                {
                    id: `new-${Date.now()}-${Math.random()}`,
                    url: reader.result as string,
                    name: file.name,
                    size: file.size,
                },
            ])
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (id: string) =>
        onChange(images.filter(img => img.id !== id))

    const moveImage = (from: number, to: number) => {
        const imgs = [...images]
        const [item] = imgs.splice(from, 1)
        imgs.splice(to, 0, item)
        onChange(imgs)
    }

    return (
        <div>
            <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                style={{ display: "none" }}
                onChange={e => readFiles(e.target.files)}
            />

            {/* Drop zone */}
            <div
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); readFiles(e.dataTransfer.files) }}
                style={{
                    border: `2px dashed ${dragOver ? "var(--accent,#ff6b35)" : "rgba(255,255,255,.12)"}`,
                    borderRadius: 10, padding: "18px 16px",
                    textAlign: "center", cursor: "pointer",
                    background: dragOver ? "rgba(255,107,53,.06)" : "var(--bg2,#111117)",
                    transition: "all .15s ease",
                    marginBottom: images.length ? 12 : 0,
                }}
            >
                <div style={{ fontSize: 24, marginBottom: 6 }}>🖼️</div>
                <p style={{ ...mono, fontSize: 12, color: dragOver ? "var(--accent,#ff6b35)" : "var(--muted2)" }}>
                    {dragOver ? "Drop to upload" : "Click or drag & drop images here"}
                </p>
            </div>

            {/* Preview grid */}
            {images.length > 0 && (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))", gap: 8 }}>
                        {images.map((img, idx) => (
                            <div
                                key={img.id}
                                style={{
                                    position: "relative", borderRadius: 8, overflow: "hidden",
                                    border: idx === 0 ? "2px solid var(--accent,#ff6b35)" : "1px solid var(--border)",
                                    background: "var(--bg2)", aspectRatio: "1",
                                }}
                            >
                                <img
                                    src={img.url} alt={img.name}
                                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                />
                                {idx === 0 && (
                                    <span style={{
                                        position: "absolute", top: 4, left: 4,
                                        ...mono, fontSize: 8, fontWeight: 700,
                                        background: "var(--accent,#ff6b35)", color: "#fff",
                                        padding: "2px 5px", borderRadius: 4,
                                    }}>
                                        COVER
                                    </span>
                                )}
                                {/* Hover controls */}
                                <div
                                    style={{
                                        position: "absolute", inset: 0,
                                        background: "rgba(0,0,0,0)",
                                        display: "flex", alignItems: "flex-end", justifyContent: "center",
                                        gap: 4, padding: 5, opacity: 0, transition: "all .15s ease",
                                    }}
                                    onMouseEnter={e => {
                                        const el = e.currentTarget as HTMLDivElement
                                        el.style.background = "rgba(0,0,0,.55)"
                                        el.style.opacity = "1"
                                    }}
                                    onMouseLeave={e => {
                                        const el = e.currentTarget as HTMLDivElement
                                        el.style.background = "rgba(0,0,0,0)"
                                        el.style.opacity = "0"
                                    }}
                                >
                                    {idx > 0 && (
                                        <button
                                            onClick={e => { e.stopPropagation(); moveImage(idx, idx - 1) }}
                                            style={ctrlBtn}
                                        >←</button>
                                    )}
                                    <button
                                        onClick={e => { e.stopPropagation(); removeImage(img.id) }}
                                        style={{ ...ctrlBtn, background: "rgba(239,68,68,.75)" }}
                                    >✕</button>
                                    {idx < images.length - 1 && (
                                        <button
                                            onClick={e => { e.stopPropagation(); moveImage(idx, idx + 1) }}
                                            style={ctrlBtn}
                                        >→</button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Add more */}
                        <div
                            onClick={() => fileRef.current?.click()}
                            style={{
                                borderRadius: 8, border: "2px dashed rgba(255,255,255,.1)",
                                background: "var(--bg2)", cursor: "pointer",
                                display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center",
                                gap: 4, aspectRatio: "1", transition: "border-color .15s ease",
                            }}
                            onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent,#ff6b35)")}
                            onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,.1)")}
                        >
                            <span style={{ fontSize: 18, color: "var(--muted)" }}>+</span>
                            <span style={{ ...mono, fontSize: 9, color: "var(--muted)" }}>Add more</span>
                        </div>
                    </div>
                    <p style={{ ...mono, fontSize: 10, color: "var(--muted)", marginTop: 8 }}>
                        {images.length} image{images.length !== 1 ? "s" : ""} · Hover to reorder or remove · First = cover
                    </p>
                </>
            )}
        </div>
    )
}

const ctrlBtn: React.CSSProperties = {
    fontFamily: "var(--font-mono,'DM Mono',monospace)",
    fontSize: 10, background: "rgba(255,255,255,.15)",
    border: "none", borderRadius: 4, color: "#fff",
    width: 22, height: 22, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
}