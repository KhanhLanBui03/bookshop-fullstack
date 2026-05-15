import { useCallback, useEffect, useMemo, useState } from "react"
import {
    Search,
    ChevronRight,
    Tag,
    Plus,
    BookOpen,
    LayoutGrid,
    TrendingUp,
    Trash2,
    Edit3,
    ArrowUpRight,
    Package,
    Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { categoryApi } from "@/api/category.api"
import type { CategoryForm, CategoryResponse, CategoryStats } from "../category.type"
import { CategoryModal } from "../components/CategoryModal"
import { CategoryDeleteConfirm } from "../components/CategoryDeleteConfirm"
import { CheckCircle2, AlertCircle } from "lucide-react"

/* ════════ HELPERS ════════ */

export const CategoryPage = () => {
    /* ── Data ── */
    const [categories, setCategories] = useState<CategoryResponse[]>([])
    const [stats, setStats] = useState<CategoryStats | null>(null)
    const [loading, setLoading] = useState(false)
    const [statsLoading, setStatsLoading] = useState(true)

    /* ── Filters / sort ── */
    const [search, setSearch] = useState("")
    const [sortBy] = useState<"name" | "bookCount">("name")
    const [sortDir] = useState<"asc" | "desc">("asc")

    /* ── Modal state ── */
    const [showModal, setShowModal] = useState(false)
    const [editCat, setEditCat] = useState<CategoryResponse | null>(null)
    const [deleteCat, setDeleteCat] = useState<CategoryResponse | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null)

    /* ── Fetch ── */
    const fetchAll = useCallback(async () => {
        setLoading(true)
        try {
            const data = await categoryApi.getAll()
            setCategories(data)
        } catch (e) {
            console.error(e)
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

    /* ── Handlers ── */
    const handleSave = async (form: CategoryForm, id?: number) => {
        try {
            if (id) await categoryApi.update(id, form)
            else await categoryApi.create(form)
            
            showToast(id ? "Cập nhật danh mục thành công" : "Thêm danh mục mới thành công", "ok")
            fetchAll()
            fetchStats()
        } catch (e) {
            console.error(e)
            showToast("Có lỗi xảy ra, vui lòng thử lại", "err")
        }
    }

    const handleDelete = async () => {
        if (!deleteCat) return
        setDeleting(true)
        try {
            await categoryApi.delete(deleteCat.id)
            showToast(`Đã xóa danh mục ${deleteCat.name}`, "ok")
            setDeleteCat(null)
            fetchAll()
            fetchStats()
        } catch (e) {
            console.error(e)
            showToast("Không thể xóa danh mục này", "err")
        } finally {
            setDeleting(false)
        }
    }

    const showToast = (msg: string, type: "ok" | "err") => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

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

    const statCards = [
        { label: "Tổng danh mục", value: stats?.totalCategories ?? 0, icon: <Layers className="size-5" />, color: "text-primary", bg: "bg-primary/10" },
        { label: "Tổng số sách", value: stats?.totalBooks ?? 0, icon: <BookOpen className="size-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Danh mục phổ biến", value: stats?.mostPopularCategory || "None", icon: <TrendingUp className="size-5" />, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Sách/Danh mục", value: stats?.totalCategories ? Math.round(stats.totalBooks / stats.totalCategories) : 0, icon: <LayoutGrid className="size-5" />, color: "text-sky-500", bg: "bg-sky-500/10" },
    ]

    return (
        <div className="space-y-10 animate-in fade-in duration-700">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <Tag className="size-3" /> Quản lý danh mục
                    </div>
                    <h1 className="text-4xl font-black text-foreground tracking-tight">Danh mục <span className="text-primary">Sản phẩm</span></h1>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">Phân loại và tổ chức kho sách của bạn</p>
                </div>
                <Button
                    size="lg"
                    className="rounded-2xl font-black h-14 px-8 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => { setEditCat(null); setShowModal(true) }}
                >
                    <Plus className="size-5 mr-2" /> Thêm danh mục
                </Button>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="glass p-6 rounded-[2.5rem] border-white/20 hover:border-primary/30 transition-all group relative overflow-hidden">
                        <div className={`size-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform`}>
                            {stat.icon}
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                        {statsLoading ? (
                            <div className="h-8 w-24 bg-muted animate-pulse rounded-lg mb-4" />
                        ) : (
                            <h3 className="text-2xl font-black text-foreground tracking-tighter mb-4">{stat.value}</h3>
                        )}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowUpRight className="size-4 text-muted-foreground" />
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Search & Actions ── */}
            <div className="glass p-4 rounded-3xl flex flex-wrap items-center gap-4 border-white/20">
                <div className="relative flex-1 min-w-[300px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Tìm danh mục theo tên hoặc mô tả..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-11 h-12 bg-background/50 border-border/50 rounded-2xl focus-visible:ring-primary/20"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-4">
                        {displayed.length} Danh mục
                    </span>
                </div>
            </div>

            {/* ── Categories Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-48 glass rounded-[2.5rem] animate-pulse" />
                    ))
                ) : displayed.length === 0 ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="size-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="size-10 text-muted-foreground/30" />
                        </div>
                        <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Không tìm thấy danh mục nào</p>
                    </div>
                ) : displayed.map((cat) => (
                    <div key={cat.id} className="glass p-8 rounded-[2.5rem] border-white/20 hover:border-primary/30 transition-all group relative overflow-hidden min-h-[280px] flex flex-col">
                        {/* Background Image Overlay */}
                        {cat.url && (
                            <div className="absolute inset-0 z-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                <img src={cat.url} alt="" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-background" />
                            </div>
                        )}

                        <div className="relative z-10 flex-1">
                            <div className="flex justify-between items-start mb-6">
                                <div className="size-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform shadow-inner border border-primary/10">
                                    {cat.name.charAt(0)}
                                </div>
                                <div className="flex gap-2">
                                    <Button size="icon" variant="ghost" className="size-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => { setEditCat(cat); setShowModal(true) }}>
                                        <Edit3 className="size-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="size-9 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-colors" onClick={() => setDeleteCat(cat)}>
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </div>
                            
                            <h3 className="text-2xl font-black text-foreground mb-3 group-hover:text-primary transition-colors tracking-tight">{cat.name}</h3>
                            <p className="text-sm font-medium text-muted-foreground line-clamp-3 leading-relaxed mb-6">
                                {cat.description || "Không có mô tả chi tiết cho danh mục này."}
                            </p>
                        </div>

                        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                            <div className="flex items-center gap-2">
                                <div className="size-7 bg-white/5 rounded-lg flex items-center justify-center">
                                    <Package className="size-3.5 text-primary" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{cat.bookCount} Sản phẩm</span>
                            </div>
                            <Button 
                                variant="ghost" 
                                onClick={() => { setEditCat(cat); setShowModal(true) }}
                                className="text-[10px] font-black uppercase tracking-widest p-0 h-auto hover:bg-transparent hover:text-primary group-hover:translate-x-1 transition-all"
                            >
                                Xem chi tiết <ChevronRight className="size-3 ml-1" />
                            </Button>
                        </div>
                    </div>
                ))}
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

            {/* ── Toast ── */}
            {toast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 duration-300">
                    <div className={`glass px-6 py-4 rounded-[2rem] border-white/20 shadow-2xl flex items-center gap-3 ${toast.type === "ok" ? "text-emerald-500" : "text-rose-500"}`}>
                        {toast.type === "ok" ? <CheckCircle2 className="size-5" /> : <AlertCircle className="size-5" />}
                        <span className="text-xs font-black uppercase tracking-widest text-foreground">{toast.msg}</span>
                    </div>
                </div>
            )}
        </div>
    )
}