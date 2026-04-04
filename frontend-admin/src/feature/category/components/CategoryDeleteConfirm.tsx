import React from "react"
import { glass, mono } from "../category.config"
import type { CategoryResponse } from "../category.type"

interface Props {
    category: CategoryResponse
    deleting: boolean
    onClose: () => void
    onConfirm: () => Promise<void>
}

export const CategoryDeleteConfirm = ({ category, deleting, onClose, onConfirm }: Props) => (
    <div
        className="cat-overlay"
        onClick={e => !deleting && e.target === e.currentTarget && onClose()}
        style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,.68)", backdropFilter: "blur(5px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 50, padding: 24,
        }}
    >
        <div className="cat-modal" style={{ ...glass(), borderRadius: 18, padding: 28, maxWidth: 400, width: "100%" }}>

            {/* Icon */}
            <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: "rgba(239,68,68,.12)", border: "1px solid rgba(239,68,68,.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, marginBottom: 18,
            }}>🗑️</div>

            <h3 style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                Delete Category
            </h3>

            <p style={{ fontSize: 13, color: "var(--muted2,#9490a8)", lineHeight: 1.65, marginBottom: 10 }}>
                Remove <strong style={{ color: "var(--text,#e8e4f0)" }}>"{category.name}"</strong> from the catalog?
            </p>

            {/* Warning if has books */}
            {category.bookCount > 0 && (
                <div style={{
                    background: "rgba(245,158,11,.1)", border: "1px solid rgba(245,158,11,.25)",
                    borderRadius: 10, padding: "10px 14px", marginBottom: 18,
                    display: "flex", alignItems: "flex-start", gap: 8,
                }}>
                    <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>⚠️</span>
                    <p style={{ ...mono, fontSize: 11, color: "#f59e0b", lineHeight: 1.55 }}>
                        This category contains <strong>{category.bookCount}</strong> book{category.bookCount !== 1 ? "s" : ""}. Deleting it may affect those books.
                    </p>
                </div>
            )}

            {!category.bookCount && (
                <p style={{ ...mono, fontSize: 11, color: "var(--muted,#6b6880)", marginBottom: 18 }}>
                    This action cannot be undone.
                </p>
            )}

            <div style={{ display: "flex", gap: 10 }}>
                <button
                    className="cat-btn-ghost"
                    onClick={onClose}
                    disabled={deleting}
                    style={{ flex: 1, ...mono, fontSize: 12, padding: "10px 0", borderRadius: 9, background: "rgba(255,255,255,.05)", color: "var(--muted2,#9490a8)" }}
                >
                    Cancel
                </button>
                <button
                    className="cat-btn-primary"
                    onClick={onConfirm}
                    disabled={deleting}
                    style={{
                        flex: 1, ...mono, fontSize: 12, fontWeight: 600, padding: "10px 0", borderRadius: 9,
                        background: "var(--red,#ef4444)", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                >
                    {deleting && <div className="cat-spinner" style={{ width: 13, height: 13 }} />}
                    Delete
                </button>
            </div>
        </div>
    </div>
)