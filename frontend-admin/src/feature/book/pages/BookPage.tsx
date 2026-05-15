import { useCallback, useEffect, useState } from "react"
import { CSS } from "../book.config"
import { bookApi } from "@/api/book.api"
import { authorApi, categoryApi, publisherApi, type DropdownItem } from "@/api/metadata.api"
import type { BookAdminResponse, BookDashboardStats, BookForm, BookStatus, GetAdminBooksParams, BookRequestPayload } from "../book.type"

import { BookStatsGrid } from "../components/BookStatsGrid"
import { BookFilters } from "../components/BookFilters"
import { BookTable } from "../components/BookTable"
import { BookPagination } from "../components/BookPagination"
import { BookModal } from "../components/BookModal"
import { BookDeleteConfirm } from "../components/BookDeleteConfirm"
import { Button } from "@/components/ui/button"

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
            showToast("Không thể tải danh sách sách", "err")
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
            showToast("Cập nhật sách thành công")
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
            showToast("Đã thêm sách mới vào kho")
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
            showToast(`"${deleteBook.title}" đã được xóa`)
            setDeleteBook(null)
            if (books.length === 1 && page > 1) setPage(p => p - 1)
            else await fetchBooks()
            refreshStats()
        } catch (err) {
            console.error("Delete error", err)
            showToast("Xóa sách thất bại", "err")
        } finally {
            setDeleting(false)
        }
    }

    /* ════════ RENDER ════════ */
    /* ════════ RENDER ════════ */
    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            <style>{CSS}</style>

            {/* Toast */}
            {toast && (
                <div className={`fixed bottom-8 right-8 z-[100] glass px-6 py-4 rounded-2xl shadow-2xl border-l-4 ${toast.type === "err" ? "border-l-destructive" : "border-l-primary"} animate-in slide-in-from-right fade-in duration-300`}>
                    <div className="flex items-center gap-3">
                        <div className={`size-6 rounded-full flex items-center justify-center text-xs ${toast.type === "err" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                            {toast.type === "err" ? "✕" : "✓"}
                        </div>
                        <p className="text-xs font-black text-foreground uppercase tracking-widest">{toast.msg}</p>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4">
                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Quản lý kho hàng</p>
                        <h1 className="text-4xl font-black text-foreground tracking-tight">Thư viện <span className="text-primary">Sách</span></h1>
                    </div>
                    <Button
                        size="lg"
                        className="rounded-2xl font-black h-14 px-8 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        onClick={() => { setEditBook(null); setShowModal(true) }}
                    >
                        <span className="text-xl mr-2">+</span> Thêm sách mới
                    </Button>
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
                    onSearchChange={v => setSearch(v)}
                    onSearchClear={() => { setSearch(""); setPage(1) }}
                    onStatusChange={s => { setFilterStatus(s); setPage(1) }}
                    onCategoryChange={id => { setFilterCategory(id); setPage(1) }}
                />

                {/* ── Table & Pagination remain within their components ── */}
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