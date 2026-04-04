import React, { useCallback, useEffect, useRef, useState } from "react"
import { CSS, mono } from "../book.config"
import { bookApi, type BookRequestPayload } from "@/api/book.api"
import { authorApi, categoryApi, publisherApi, type DropdownItem } from "@/api/metadata.api"
import type { BookAdminResponse, BookDashboardStats, BookForm, BookStatus, GetAdminBooksParams } from "../book.type"

import { BookStatsGrid } from "../components/BookStatsGrid"
import { BookFilters } from "../components/BookFilters"
import { BookTable } from "../components/BookTable"
import { BookPagination } from "../components/BookPagination"
import { BookModal } from "../components/BookModal"
import { BookDeleteConfirm } from "../components/BookDeleteConfirm"

type SortCol = "title" | "salePrice" | "soldCount" | "stock"

export const BookManagementPage = () => {
    /* ── Server data ── */
    const [books, setBooks] = useState<BookAdminResponse[]>([])
    const [totalElements, setTotalElements] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [stats, setStats] = useState<BookDashboardStats | null>(null)

    /* ── Dropdown options ── */
    const [categories, setCategories] = useState<DropdownItem[]>([])
    const [authors, setAuthors] = useState<DropdownItem[]>([])
    const [publishers, setPublishers] = useState<DropdownItem[]>([])

    /* ── Filters ── */
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState<BookStatus | "ALL">("ALL")
    const [filterCategory, setFilterCategory] = useState("ALL")
    const [sortBy, setSortBy] = useState<SortCol>("soldCount")
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    /* ── Modal state ── */
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

    const toggleSort = (col: SortCol) => {
        if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc")
        else { setSortBy(col); setSortDir("desc") }
        setPage(1)
    }

    /* ── Save (create / update) ── */
    const handleSave = async (form: BookForm, bookId?: number) => {
        if (bookId) {
            const payload: any = {}
            if (form.title) payload.title = form.title
            if (form.description) payload.description = form.description
            if (form.salePrice) payload.salePrice = Number(form.salePrice)
            payload.originalPrice = form.originalPrice ? Number(form.originalPrice) : null
            if (form.stock) payload.stock = Number(form.stock)
            if (form.status) payload.status = form.status
            if (form.categoryId) payload.categoryId = Number(form.categoryId)
            if (form.authorId) payload.authorId = Number(form.authorId)
            if (form.publisherId) payload.publisherId = Number(form.publisherId)
            if (form.images.length > 0)
                payload.images = form.images.map(img => ({ name: img.name, url: img.url }))

            await bookApi.updateBook(bookId, payload)
            showToast("Book updated successfully")
        } else {
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

    /* ════════ RENDER ════════ */
    return (
        <div className="bm">
            <style>{CSS}</style>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: "fixed", bottom: 24, right: 24, zIndex: 100,
                    background: "var(--bg3,#18181f)", borderRadius: 10,
                    border: "1px solid rgba(255,255,255,.12)",
                    borderLeft: `3px solid ${toast.type === "err" ? "var(--red,#ef4444)" : "var(--accent,#ff6b35)"}`,
                    padding: "12px 18px", ...mono, fontSize: 12, color: "var(--text)",
                    animation: "bmUp .3s cubic-bezier(.22,1,.36,1) both",
                    boxShadow: "0 8px 32px rgba(0,0,0,.4)",
                }}>
                    {toast.type === "err" ? "✕" : "✓"} {toast.msg}
                </div>
            )}

            <div style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 28px" }}>

                {/* ── Header ── */}
                <div className="bm-up" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
                    <div>
                        <p style={{ ...mono, fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>
                            Catalog Management
                        </p>
                        <h1 style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 28, fontWeight: 700, letterSpacing: "-.5px" }}>
                            Books
                        </h1>
                    </div>
                    <button
                        className="bm-btn-primary"
                        onClick={() => { setEditBook(null); setShowModal(true) }}
                        style={{
                            display: "flex", alignItems: "center", gap: 8,
                            background: "var(--accent,#ff6b35)", color: "#fff",
                            padding: "10px 18px", borderRadius: 10,
                            ...mono, fontSize: 12, fontWeight: 600,
                        }}
                    >
                        <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Add Book
                    </button>
                </div>

                {/* ── Stats ── */}
                <BookStatsGrid stats={stats} />

                {/* ── Filters ── */}
                <BookFilters
                    search={search}
                    filterStatus={filterStatus}
                    filterCategory={filterCategory}
                    categories={categories}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    loading={loading}
                    onSearchChange={v => setSearch(v)}
                    onSearchClear={() => { setSearch(""); setPage(1) }}
                    onStatusChange={s => { setFilterStatus(s); setPage(1) }}
                    onCategoryChange={id => { setFilterCategory(id); setPage(1) }}
                />

                {/* ── Table ── */}
                <BookTable
                    books={books}
                    loading={loading}
                    page={page}
                    pageSize={pageSize}
                    sortBy={sortBy}
                    sortDir={sortDir}
                    onSort={toggleSort}
                    onEdit={b => { setEditBook(b); setShowModal(true) }}
                    onDelete={b => setDeleteBook(b)}
                />

                {/* ── Pagination ── */}
                <BookPagination
                    page={page}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={n => { setPageSize(n); setPage(1) }}
                />
            </div>

            {/* ── Modals ── */}
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
                <BookDeleteConfirm
                    book={deleteBook}
                    deleting={deleting}
                    onClose={() => setDeleteBook(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    )
}