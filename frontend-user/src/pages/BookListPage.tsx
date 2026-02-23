import { useState, useMemo, useEffect } from "react"
import { Search, SlidersHorizontal, ChevronDown, X, LayoutGrid, LayoutList, ChevronLeft, ChevronRight, Badge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BookCard from "@/components/BookCard"
import type { BookCard as BookCardType } from "@/types/Book"
import { useFetch } from "@/hooks/useFetch"
import { bookService } from "@/services/book.service"
// ── Mock data ─────────────────────────────────────────────────────
// const MOCK_BOOKS: BookCardType[] = Array.from({ length: 24 }, (_, i) => ({
//     id: i + 1,
//     title: ["Atomic Habits", "Sapiens", "Clean Code", "The Alchemist", "Zero to One", "Deep Work"][i % 6],
//     authorName: ["James Clear", "Yuval Harari", "Robert Martin", "Paulo Coelho", "Peter Thiel", "Cal Newport"][i % 6],
//     salePrice: [85000, 120000, 199000, 75000, 110000, 95000][i % 6],
//     originalPrice: [100000, 150000, 230000, null, 130000, null][i % 6] as number | null,
//     rating: [4.9, 4.8, 4.7, 4.6, 4.5, 4.4][i % 6],
//     soldCount: [1200, 980, 750, 630, 540, 420][i % 6],
//     image: "/placeholder.png",
//     genre: ["Kỹ năng", "Lịch sử", "Công nghệ", "Văn học", "Kinh doanh", "Kỹ năng"][i % 6],
// }))

const GENRES = ["Tất cả", "Kỹ năng", "Lịch sử", "Công nghệ", "Văn học", "Kinh doanh"]
const SORT_OPTIONS = [
    { label: "Phổ biến nhất", value: "popular" },
    { label: "Mới nhất", value: "newest" },
    { label: "Giá tăng dần", value: "price_asc" },
    { label: "Giá giảm dần", value: "price_desc" },
    { label: "Đánh giá cao", value: "rating" },
]
const PRICE_RANGES = [
    { label: "Tất cả", min: 0, max: Infinity },
    { label: "Dưới 100.000đ", min: 0, max: 100000 },
    { label: "100k – 200k", min: 100000, max: 200000 },
    { label: "Trên 200.000đ", min: 200000, max: Infinity },
]


// ── Helpers ────────────────────────────────────────────────────────
function sortBooks(books: BookCardType[], sort: string) {
    return [...books].sort((a, b) => {
        if (sort === "price_asc") return a.salePrice - b.salePrice
        if (sort === "price_desc") return b.salePrice - a.salePrice
        if (sort === "rating") return b.rating - a.rating
        if (sort === "popular") return b.soldCount - a.soldCount
        return 0
    })
}
function mapSort(sort: string) {
    switch (sort) {
        case "price_asc":
            return "salePrice,asc"
        case "price_desc":
            return "salePrice,desc"
        case "rating":
            return "rating,desc"
        case "popular":
            return "soldCount,desc"
        case "newest":
            return "createdAt,desc"
        default:
            return undefined
    }
}

// ── Component ──────────────────────────────────────────────────────
export default function BookListPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [searchInput, setSearchInput] = useState("")
    const [search, setSearch] = useState("")
    const [genre, setGenre] = useState("Tất cả")
    const [priceIdx, setPriceIdx] = useState(0)
    const [sort, setSort] = useState("popular")
    const [page, setPage] = useState(1)
    const [grid, setGrid] = useState<"grid" | "list">("grid")
    const [sortOpen, setSortOpen] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    // const { data, loading } = useFetch(() =>
    //     bookService.getListBooks(page - 1)
    // )
    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true)
            try {
                const price = PRICE_RANGES[priceIdx]

                const res = await bookService.getListBooks({
                    page: page - 1,
                    size: 12,
                    search: search || undefined,
                    genre: genre !== "Tất cả" ? genre : undefined,
                    minPrice: price.min !== 0 ? price.min : undefined,
                    maxPrice: price.max !== Infinity ? price.max : undefined,
                    sort: mapSort(sort)
                })

                setData(res)
            } finally {
                setLoading(false)
            }
        }

        fetchBooks()
    }, [page, search, genre, priceIdx, sort])
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput)
            setPage(1)
        }, 400)

        return () => clearTimeout(timer)
    }, [searchInput])
    const books = data?.content ?? []
    const totalPages = data?.totalPages ?? 0
    
    // Active filter tags
    const activeFilters = [
        genre !== "Tất cả" && { key: "genre", label: genre },
        priceIdx !== 0 && { key: "price", label: PRICE_RANGES[priceIdx].label },
    ].filter(Boolean) as { key: string; label: string }[]

    const clearFilter = (key: string) => {
        if (key === "genre") setGenre("Tất cả")
        if (key === "price") setPriceIdx(0)
        setPage(1)
    }


    const handleFilter = (setter: () => void) => { setter(); setPage(1) }
    if (loading) {
        return <div>Loading...</div>
    }
    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── PAGE HEADER ── */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Tất cả sách</h1>
                    <p className="text-sm text-gray-400">{data?.totalElements ?? 0} kết quả</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">

                {/* ══ SIDEBAR ══════════════════════════════════════ */}
                <aside className={`
                    w-56 flex-shrink-0 space-y-6
                    ${sidebarOpen ? "block" : "hidden"} lg:block
                `}>

                    {/* Genre */}
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Thể loại</p>
                        <ul className="space-y-1">
                            {GENRES.map(g => (
                                <li key={g}>
                                    <button
                                        onClick={() => handleFilter(() => setGenre(g))}
                                        className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${genre === g
                                                ? "bg-blue-600 text-white font-semibold"
                                                : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {g}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price range */}
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Mức giá</p>
                        <ul className="space-y-1">
                            {PRICE_RANGES.map((p, i) => (
                                <li key={i}>
                                    <button
                                        onClick={() => handleFilter(() => setPriceIdx(i))}
                                        className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${priceIdx === i
                                                ? "bg-blue-600 text-white font-semibold"
                                                : "text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {p.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Rating filter */}
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Đánh giá</p>
                        <ul className="space-y-1">
                            {[5, 4, 3].map(r => (
                                <li key={r}>
                                    <button className="w-full text-left text-sm px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center gap-1.5 transition-colors">
                                        {"★".repeat(r)}{"☆".repeat(5 - r)}
                                        <span className="text-gray-400 text-xs">trở lên</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* ══ MAIN ════════════════════════════════════════ */}
                <div className="flex-1 min-w-0">

                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-3 mb-5">

                        {/* Search */}
                        <div className="relative flex-1 min-w-48">
                            
                            <Input
                                placeholder="Tìm sách, tác giả..."
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                            />
                        </div>

                        {/* Mobile filter toggle */}
                        <Button
                            variant="outline" size="sm"
                            className="lg:hidden gap-2"
                            onClick={() => setSidebarOpen(o => !o)}
                        >
                            <SlidersHorizontal className="w-4 h-4" /> Lọc
                        </Button>

                        {/* Sort dropdown */}
                        <div className="relative">
                            <Button
                                variant="outline" size="sm"
                                className="gap-2 min-w-40 justify-between"
                                onClick={() => setSortOpen(o => !o)}
                            >
                                <span className="text-sm">{SORT_OPTIONS.find(o => o.value === sort)?.label}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                            </Button>

                            {sortOpen && (
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden">
                                    {SORT_OPTIONS.map(o => (
                                        <button key={o.value}
                                            onClick={() => { setSort(o.value); setSortOpen(false); setPage(1) }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${sort === o.value ? "font-semibold text-blue-600" : "text-gray-700"}`}
                                        >
                                            {o.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Grid / List toggle */}
                        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                            {(["grid", "list"] as const).map(v => {
                                const Icon = v === "grid" ? LayoutGrid : LayoutList
                                return (
                                    <button key={v}
                                        onClick={() => setGrid(v)}
                                        className={`p-2 transition-colors ${grid === v ? "bg-blue-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Active filter tags */}
                    {activeFilters.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="text-xs text-gray-400">Đang lọc:</span>
                            {activeFilters.map(f => (
                                <Badge key={f.key} variant="secondary" className="gap-1.5 pr-1.5 text-xs">
                                    {f.label}
                                    <Button onClick={() => clearFilter(f.key)} className="hover:text-red-500 transition-colors">
                                        <X className="w-3 h-3" />
                                    </Button>
                                </Badge>
                            ))}
                            <button
                                onClick={() => { setGenre("Tất cả"); setPriceIdx(0); setPage(1) }}
                                className="text-xs text-blue-600 hover:underline"
                            >
                                Xóa tất cả
                            </button>
                        </div>
                    )}

                    {/* Book Grid / List */}
                    {books.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                            <Search className="w-12 h-12 mb-3 opacity-30" />
                            <p className="font-medium">Không tìm thấy sách nào</p>
                            <p className="text-sm mt-1">Thử thay đổi từ khóa hoặc bộ lọc</p>
                        </div>
                    ) : grid === "grid" ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                            {books.map(book => <BookCard key={book.id} book={book} />)}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {books.map(book => (
                                <div key={book.id} className="bg-white border border-gray-100 rounded-xl p-4 flex gap-4 hover:shadow-md transition-shadow">
                                    <BookCard book={book} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── PAGINATION ── */}
                    {totalPages >1 && (
                        <div className="flex items-center justify-center gap-1 mt-10">
                            <Button
                                variant="outline" size="icon"
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="w-9 h-9"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...")
                                    acc.push(p)
                                    return acc
                                }, [])
                                .map((p, i) =>
                                    p === "..." ? (
                                        <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
                                    ) : (
                                        <Button
                                            key={p}
                                            variant={page === p ? "default" : "outline"}
                                            size="icon"
                                            onClick={() => setPage(p as number)}
                                            className={`w-9 h-9 text-sm ${page === p ? "bg-blue-600 hover:bg-blue-700 border-blue-600" : ""}`}
                                        >
                                            {p}
                                        </Button>
                                    )
                                )
                            }

                            <Button
                                variant="outline" size="icon"
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="w-9 h-9"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}