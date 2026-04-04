import React, { useCallback, useEffect, useMemo, useState } from "react"
import { CSS, mono } from "../category.config"
import { categoryApi } from "@/api/category.api"
import type { CategoryForm, CategoryResponse, CategoryStats } from "../category.type"

import { CategoryStatsGrid } from "../components/CategoryStatsGrid"
import { CategoryGrid } from "../components/CategoryGrid"
import { CategoryModal } from "../components/CategoryModal"
import { CategoryDeleteConfirm } from "../components/CategoryDeleteConfirm"

type SortCol = "name" | "bookCount"

export const CategoryPage = () => {
    /* ── Data ── */
    const [categories, setCategories] = useState<CategoryResponse[]>([])
    const [stats, setStats] = useState<CategoryStats | null>(null)
    const [loading, setLoading] = useState(false)
    const [statsLoading, setStatsLoading] = useState(true)

    /* ── Filters / sort ── */
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState<SortCol>("name")
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

    /* ── Modal state ── */
    const [showModal, setShowModal] = useState(false)
    const [editCat, setEditCat] = useState<CategoryResponse | null>(null)
    const [deleteCat, setDeleteCat] = useState<CategoryResponse | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null)

    /* ── Helpers ── */
    const showToast = (msg: string, type: "ok" | "err" = "ok") => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 2800)
    }

    const toggleSort = (col: SortCol) => {
        if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc")
        else { setSortBy(col); setSortDir("asc") }
    }

    /* ── Fetch ── */
    const fetchAll = useCallback(async () => {
        setLoading(true)
        try {
            const data = await categoryApi.getAll()
            setCategories(data)
        } catch (e) {
            console.error(e)
            showToast("Failed to load categories", "err")
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchStats = useCallback(async () => {
        setStatsLoading(true)
        try { setStats(await categoryApi.getStats()) }
        catch (e) { console.error(e) }
        finally { setStatsLoading(false) }
    }, [])

    useEffect(() => { fetchAll(); fetchStats() }, [fetchAll, fetchStats])

    /* ── Client-side filter + sort ── */
    const displayed = useMemo(() => {
        let list = categories.filter(c =>
            !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
            (c.description ?? "").toLowerCase().includes(search.toLowerCase())
        )
        list = [...list].sort((a, b) => {
            const dir = sortDir === "asc" ? 1 : -1
            if (sortBy === "name") return dir * a.name.localeCompare(b.name)
            return dir * (a.bookCount - b.bookCount)
        })
        return list
    }, [categories, search, sortBy, sortDir])

    /* ── Save (create / update) ── */
    const handleSave = async (form: CategoryForm, id?: number) => {
        try {
            if (id) {
                await categoryApi.update(id, form)
                showToast("Category updated")
            } else {
                await categoryApi.create(form)
                showToast("Category created")
            }
            setShowModal(false)
            setEditCat(null)
            await fetchAll()
            await fetchStats()
        } catch (e) {
            console.error(e)
            showToast("Failed to save category", "err")
            throw e   // re-throw so modal keeps its saving=false
        }
    }

    /* ── Delete ── */
    const handleDelete = async () => {
        if (!deleteCat) return
        setDeleting(true)
        try {
            await categoryApi.delete(deleteCat.id)
            showToast(`"${deleteCat.name}" removed`)
            setDeleteCat(null)
            await fetchAll()
            await fetchStats()
        } catch (e) {
            console.error(e)
            showToast("Failed to delete category", "err")
        } finally {
            setDeleting(false)
        }
    }

    /* ════════ RENDER ════════ */
    return (
        <div className="cat">
            <style>{CSS}</style>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: "fixed", bottom: 24, right: 24, zIndex: 100,
                    background: "var(--bg3,#18181f)", borderRadius: 10,
                    border: "1px solid rgba(255,255,255,.12)",
                    borderLeft: `3px solid ${toast.type === "err" ? "var(--red,#ef4444)" : "var(--accent,#ff6b35)"}`,
                    padding: "12px 18px", ...mono, fontSize: 12, color: "var(--text,#e8e4f0)",
                    animation: "catUp .3s cubic-bezier(.22,1,.36,1) both",
                    boxShadow: "0 8px 32px rgba(0,0,0,.4)",
                }}>
                    {toast.type === "err" ? "✕" : "✓"} {toast.msg}
                </div>
            )}

            <div style={{ maxWidth: 1140, margin: "0 auto", padding: "32px 28px" }}>

                {/* ── Header ── */}
                <div className="cat-up" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
                    <div>
                        <p style={{ ...mono, fontSize: 10, color: "var(--muted,#6b6880)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
                            Catalog Management
                        </p>
                        <h1 style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 28, fontWeight: 700, letterSpacing: "-.5px" }}>
                            Categories
                        </h1>
                    </div>
                    <button
                        className="cat-btn-primary"
                        onClick={() => { setEditCat(null); setShowModal(true) }}
                        style={{
                            display: "flex", alignItems: "center", gap: 8,
                            background: "var(--accent,#ff6b35)", color: "#fff",
                            padding: "10px 18px", borderRadius: 10,
                            ...mono, fontSize: 12, fontWeight: 600,
                        }}
                    >
                        <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Add Category
                    </button>
                </div>

                {/* ── Stats ── */}
                <CategoryStatsGrid stats={stats} loading={statsLoading} />

                {/* ── Card grid ── */}
                <CategoryGrid
                    categories={displayed}
                    loading={loading}
                    search={search}
                    sortBy={sortBy}
                    sortDir={sortDir}
                    onSearch={v => setSearch(v)}
                    onSearchClear={() => setSearch("")}
                    onSort={toggleSort}
                    onEdit={cat => { setEditCat(cat); setShowModal(true) }}
                    onDelete={cat => setDeleteCat(cat)}
                    onAdd={() => { setEditCat(null); setShowModal(true) }}
                />
            </div>

            {/* ── Modals ── */}
            {showModal && (
                <CategoryModal
                    category={editCat}
                    onClose={() => { setShowModal(false); setEditCat(null) }}
                    onSave={handleSave}
                />
            )}
            {deleteCat && (
                <CategoryDeleteConfirm
                    category={deleteCat}
                    deleting={deleting}
                    onClose={() => setDeleteCat(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    )
}