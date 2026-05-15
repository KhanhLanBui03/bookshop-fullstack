import { useState, useMemo, useEffect } from "react"
import { Search, SlidersHorizontal, ChevronDown, X, LayoutGrid, LayoutList, ChevronLeft, ChevronRight, Badge, Star } from "lucide-react"
import { useSearchParams } from "react-router-dom"
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
    const [searchParams, setSearchParams] = useSearchParams()
    const initialGenre = searchParams.get("genre") || "Tất cả"
    
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [searchInput, setSearchInput] = useState("")
    const [search, setSearch] = useState("")
    const [genre, setGenre] = useState(initialGenre)
    const [priceIdx, setPriceIdx] = useState(0)
    const [minRating, setMinRating] = useState<number | null>(null)
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
                    minRating: minRating || undefined,
                    sort: mapSort(sort)
                })

                setData(res)
            } finally {
                setLoading(false)
            }
        }

        fetchBooks()
    }, [page, search, genre, priceIdx, sort, minRating])
    useEffect(() => {
        if (genre !== "Tất cả") {
            setSearchParams({ genre })
        } else {
            searchParams.delete("genre")
            setSearchParams(searchParams)
        }
    }, [genre])

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
        minRating !== null && { key: "rating", label: `${minRating} sao trở lên` },
    ].filter(Boolean) as { key: string; label: string }[]

    const clearFilter = (key: string) => {
        if (key === "genre") setGenre("Tất cả")
        if (key === "price") setPriceIdx(0)
        if (key === "rating") setMinRating(null)
        setPage(1)
    }


    const handleFilter = (setter: () => void) => { setter(); setPage(1) }
    if (loading) {
        return (
            <div className="w-full bg-background min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Đang tìm kiếm sách...</div>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-background pb-20">

            {/* ── PAGE HEADER ── */}
            <div className="glass border-b">
                <div className="max-w-7xl mx-auto px-4 py-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-black text-foreground mb-2">Thư viện <span className="text-primary">sách</span></h1>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">{data?.totalElements ?? 0} Tác phẩm tìm thấy</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                            <span>Trang chủ</span>
                            <ChevronRight className="size-3" />
                            <span className="text-primary">Thư viện</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-10">

                {/* ══ SIDEBAR ══════════════════════════════════════ */}
                <aside className={`
                    w-full lg:w-64 flex-shrink-0 space-y-10
                    ${sidebarOpen ? "block" : "hidden"} lg:block
                `}>

                    {/* Genre */}
                    <div className="glass p-6 rounded-3xl">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6">Thể loại</p>
                        <ul className="space-y-2">
                            {GENRES.map(g => (
                                <li key={g}>
                                    <button
                                        onClick={() => handleFilter(() => setGenre(g))}
                                        className={`w-full text-left text-sm px-4 py-2.5 rounded-xl transition-all duration-300 font-bold ${genre === g
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                                            : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                            }`}
                                    >
                                        {g}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price range */}
                    <div className="glass p-6 rounded-3xl">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6">Mức giá</p>
                        <ul className="space-y-2">
                            {PRICE_RANGES.map((p, i) => (
                                <li key={i}>
                                    <button
                                        onClick={() => handleFilter(() => setPriceIdx(i))}
                                        className={`w-full text-left text-sm px-4 py-2.5 rounded-xl transition-all duration-300 font-bold ${priceIdx === i
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                                            : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                            }`}
                                    >
                                        {p.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Rating filter */}
                    <div className="glass p-6 rounded-3xl">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6">Đánh giá</p>
                        <ul className="space-y-2">
                            {[5, 4, 3].map(r => (
                                <li key={r}>
                                    <button 
                                        onClick={() => handleFilter(() => setMinRating(r))}
                                        className={`w-full text-left text-sm px-4 py-2.5 rounded-xl transition-all duration-300 font-bold group flex items-center gap-2 ${minRating === r
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                                            : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                        }`}
                                    >
                                        <div className="flex gap-0.5">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className={`size-3 ${i < r ? (minRating === r ? "fill-white text-white" : "fill-primary text-primary") : "text-muted/30"}`} />
                                            ))}
                                        </div>
                                        <span className={`text-[10px] uppercase tracking-tighter ${minRating === r ? "text-white/80" : "opacity-60 group-hover:opacity-100"}`}>trở lên</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* ══ MAIN ════════════════════════════════════════ */}
                <div className="flex-1 min-w-0 space-y-8">

                    {/* Toolbar */}
                    <div className="glass p-4 rounded-3xl flex flex-wrap items-center gap-4 relative z-[100]">

                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px] group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Tìm kiếm tựa sách, tác giả..."
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                className="pl-11 h-12 bg-background/50 border-border/50 rounded-2xl focus-visible:ring-primary/20"
                            />
                        </div>

                        {/* Mobile filter toggle */}
                        <Button
                            variant="outline" size="lg"
                            className="lg:hidden gap-2 rounded-2xl font-bold h-12"
                            onClick={() => setSidebarOpen(o => !o)}
                        >
                            <SlidersHorizontal className="size-4" /> Lọc
                        </Button>

                        {/* Sort dropdown */}
                        <div className="relative">
                            <Button
                                variant="outline" size="lg"
                                className="gap-3 min-w-[180px] justify-between rounded-2xl font-bold h-12 bg-background/50 border-border/50 hover:border-primary/30"
                                onClick={() => setSortOpen(o => !o)}
                            >
                                <span className="text-sm">{SORT_OPTIONS.find(o => o.value === sort)?.label}</span>
                                <ChevronDown className={`size-4 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                            </Button>

                            {sortOpen && (
                                <div className="absolute right-0 top-full mt-3 w-56 glass rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[110] overflow-hidden border border-border/50 py-2 animate-in fade-in zoom-in duration-200">
                                    {SORT_OPTIONS.map(o => (
                                        <button key={o.value}
                                            onClick={() => { setSort(o.value); setSortOpen(false); setPage(1) }}
                                            className={`w-full text-left px-5 py-3 text-sm transition-all hover:bg-primary/10 ${sort === o.value ? "font-black text-primary" : "text-muted-foreground font-bold"}`}
                                        >
                                            {o.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Grid / List toggle */}
                        <div className="flex glass p-1 rounded-2xl overflow-hidden border-border/50">
                            {(["grid", "list"] as const).map(v => {
                                const Icon = v === "grid" ? LayoutGrid : LayoutList
                                return (
                                    <button key={v}
                                        onClick={() => setGrid(v)}
                                        className={`p-2.5 rounded-xl transition-all duration-300 ${grid === v ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-primary/10"}`}
                                    >
                                        <Icon className="size-5" />
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Active filter tags */}
                    {activeFilters.length > 0 && (
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Đang lọc:</span>
                            {activeFilters.map(f => (
                                <div key={f.key} className="glass pl-4 pr-1.5 py-1.5 rounded-xl flex items-center gap-2 border-primary/20">
                                    <span className="text-xs font-black text-foreground">{f.label}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => clearFilter(f.key)}
                                        className="size-6 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <X className="size-3" />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => { setGenre("Tất cả"); setPriceIdx(0); setMinRating(null); setPage(1) }}
                                className="text-xs font-black text-primary hover:bg-primary/10 rounded-xl"
                            >
                                Xóa tất cả
                            </Button>
                        </div>
                    )}

                    {/* Book Grid / List */}
                    {books.length === 0 ? (
                        <div className="glass p-20 rounded-[3rem] flex flex-col items-center justify-center text-center">
                            <div className="size-20 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                                <Search className="size-10 text-primary opacity-30" />
                            </div>
                            <h3 className="text-xl font-black text-foreground">Không tìm thấy sách nào</h3>
                            <p className="text-muted-foreground mt-2 font-medium">Thử thay đổi từ khóa hoặc bộ lọc để tìm kiếm lại.</p>
                        </div>
                    ) : grid === "grid" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {books.map(book => <BookCard key={book.id} book={book} />)}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {books.map(book => (
                                <div key={book.id} className="glass p-2 rounded-[2rem] hover:border-primary/30 transition-all group overflow-hidden">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="w-full md:w-48 aspect-[3/4] rounded-2xl overflow-hidden flex-shrink-0">
                                            <img src={book.image || "/placeholder.png"} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex-1 p-4 flex flex-col justify-between">
                                            <div className="space-y-4">
                                                <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{book.title}</h3>
                                                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{book.authorName}</p>
                                                <div className="flex items-center gap-1.5">
                                                    <Star className="size-4 fill-primary text-primary" />
                                                    <span className="text-sm font-black text-foreground">{book.rating.toFixed(1)}</span>
                                                    <span className="text-xs text-muted-foreground">({book.soldCount} lượt bán)</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-6">
                                                <div className="text-3xl font-black text-primary">{book.salePrice.toLocaleString()}₫</div>
                                                <Button size="lg" className="rounded-2xl font-black px-8">Xem chi tiết</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── PAGINATION ── */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 mt-16">
                            <Button
                                variant="outline" size="icon"
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="size-12 rounded-2xl glass hover:bg-primary hover:text-primary-foreground transition-all"
                            >
                                <ChevronLeft className="size-5" />
                            </Button>

                            <div className="flex items-center gap-2 glass p-1 rounded-[1.5rem]">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                    .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                                        if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...")
                                        acc.push(p)
                                        return acc
                                    }, [])
                                    .map((p, i) =>
                                        p === "..." ? (
                                            <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-muted-foreground font-black">…</span>
                                        ) : (
                                            <Button
                                                key={p}
                                                variant={page === p ? "default" : "ghost"}
                                                onClick={() => setPage(p as number)}
                                                className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${page === p ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110" : "text-muted-foreground hover:bg-primary/10"}`}
                                            >
                                                {p}
                                            </Button>
                                        )
                                    )
                                }
                            </div>

                            <Button
                                variant="outline" size="icon"
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="size-12 rounded-2xl glass hover:bg-primary hover:text-primary-foreground transition-all"
                            >
                                <ChevronRight className="size-5" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
