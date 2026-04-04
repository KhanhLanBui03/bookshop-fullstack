import React from "react"
import { glass, mono } from "../book.config"
import { Spinner } from "./BookAtoms"
import type { BookAdminResponse } from "../book.type"

interface Props {
    book: BookAdminResponse
    deleting: boolean
    onClose: () => void
    onConfirm: () => Promise<void>
}

export const BookDeleteConfirm = ({ book, deleting, onClose, onConfirm }: Props) => (
    <div
        className="bm-overlay"
        onClick={e => !deleting && e.target === e.currentTarget && onClose()}
        style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,.65)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
        }}
    >
        <div
            className="bm-modal"
            style={{ ...glass(), borderRadius: 16, padding: 28, maxWidth: 380, width: "100%", margin: 16 }}
        >
            {/* Icon */}
            <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "rgba(239,68,68,.12)", border: "1px solid rgba(239,68,68,.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, marginBottom: 16,
            }}>🗑️</div>

            <h3 style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
                Delete Book
            </h3>
            <p style={{ fontSize: 13, color: "var(--muted2)", lineHeight: 1.6, marginBottom: 22 }}>
                Are you sure you want to remove{" "}
                <strong style={{ color: "var(--text)" }}>"{book.title}"</strong> from the catalog?
                This action cannot be undone.
            </p>

            <div style={{ display: "flex", gap: 10 }}>
                <button
                    className="bm-btn-ghost"
                    onClick={onClose}
                    disabled={deleting}
                    style={{
                        flex: 1, ...mono, fontSize: 12, padding: "9px 0", borderRadius: 8,
                        background: "rgba(255,255,255,.05)", color: "var(--muted2)",
                    }}
                >
                    Cancel
                </button>
                <button
                    className="bm-btn-primary"
                    onClick={onConfirm}
                    disabled={deleting}
                    style={{
                        flex: 1, ...mono, fontSize: 12, fontWeight: 600, padding: "9px 0", borderRadius: 8,
                        background: "var(--red,#ef4444)", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                >
                    {deleting && <Spinner size={13} />}
                    Delete
                </button>
            </div>
        </div>
    </div>
)