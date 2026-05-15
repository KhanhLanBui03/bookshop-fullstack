import { useEffect, useState } from "react"
import type { SaleByCategoryResponse, StatsDashboardResponse, TopBookResponse, TopRecentOrder } from "../dashboard.type"
import { dashboardApi } from "@/api/dashboard.api"
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    BookOpen,
    Users,
    ArrowUpRight,
    Star,
    Activity,
    Calendar,
    Zap,
    Target,
    ArrowRight
} from "lucide-react"

import { Button } from "@/components/ui/button"

const WEEKLY = [
    { day: "T2", rev: 5200 },
    { day: "T3", rev: 7800 },
    { day: "T4", rev: 4600 },
    { day: "T5", rev: 9100 },
    { day: "T6", rev: 8300 },
    { day: "T7", rev: 11200 },
    { day: "CN", rev: 6700 },
]

const CATEGORY_COLORS = [
    "bg-primary",
    "bg-emerald-500",
    "bg-sky-500",
    "bg-amber-500",
    "bg-rose-500"
]

export const DashboardPage = () => {
    const maxRev = Math.max(...WEEKLY.map(w => w.rev))
    const [hover, setHover] = useState<number | null>(null)
    const [stats, setStats] = useState<StatsDashboardResponse | null>(null)
    const [orders, setOrders] = useState<TopRecentOrder[]>([])
    const [books, setBooks] = useState<TopBookResponse[]>([])
    const [categories, setCategories] = useState<SaleByCategoryResponse[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [booksData, ordersData, statsData, categoriesData] = await Promise.all([
                    dashboardApi.getTopBook(),
                    dashboardApi.getTopRecentOrder(),
                    dashboardApi.getDashboardStats(),
                    dashboardApi.getTopBookByCategory(),
                ])

                setBooks(booksData)
                setOrders(ordersData)
                setStats(statsData)
                setCategories(categoriesData)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboard()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-6 animate-pulse">
                <div className="relative">
                    <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-6 text-primary" />
                </div>
                <div className="space-y-2 text-center">
                    <p className="text-sm font-black text-foreground uppercase tracking-[0.3em]">Hệ thống Libraria</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Đang tải phân tích dữ liệu...</p>
                </div>
            </div>
        )
    }

    const statCards = [
        { label: "Doanh thu", value: `${stats?.revenue?.toLocaleString()}₫`, icon: <DollarSign className="size-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+12.5%", up: true, desc: "Tổng thu nhập ròng" },
        { label: "Đơn hàng", value: stats?.orders, icon: <ShoppingCart className="size-5" />, color: "text-primary", bg: "bg-primary/10", trend: "+5.2%", up: true, desc: "Giao dịch thành công" },
        { label: "Sách đã bán", value: stats?.bookSold, icon: <BookOpen className="size-5" />, color: "text-amber-500", bg: "bg-amber-500/10", trend: "+8.1%", up: true, desc: "Khối lượng sản phẩm" },
        { label: "Khách hàng", value: stats?.customers, icon: <Users className="size-5" />, color: "text-sky-500", bg: "bg-sky-500/10", trend: "+10.3%", up: true, desc: "Người dùng đăng ký" },
    ]

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">

            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-primary/20">
                        <Zap className="size-3 fill-current" /> Phân tích thời gian thực
                    </div>
                    <h1 className="text-5xl font-black text-foreground tracking-tight leading-none">
                        Chào buổi sáng, <br className="md:hidden" />
                        <span className="text-primary italic">Quản trị viên</span>
                    </h1>
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="size-6 rounded-full border-2 border-background bg-muted overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" />
                                </div>
                            ))}
                        </div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.1em]">
                            Cùng <span className="text-foreground">12 nhân viên</span> đang vận hành hệ thống
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass px-6 py-4 rounded-[2rem] flex items-center gap-6 border-white/20 shadow-xl">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Lịch trình</p>
                            <p className="text-sm font-black text-foreground flex items-center gap-2">
                                <Calendar className="size-4 text-primary" /> 12 Tháng 5, 2026
                            </p>
                        </div>
                        <div className="h-10 w-px bg-white/10 hidden sm:block" />
                        <div className="size-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25 group hover:scale-110 transition-transform cursor-pointer">
                            <TrendingUp className="size-6 group-hover:rotate-12 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stats Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="glass p-8 rounded-[3rem] border-white/20 hover:border-primary/40 hover:translate-y-[-4px] transition-all group relative overflow-hidden shadow-2xl shadow-black/5">
                        <div className="flex justify-between items-start mb-8">
                            <div className={`size-14 ${stat.bg} ${stat.color} rounded-[1.25rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <div className={`flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-xl ${stat.up ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
                                {stat.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                                {stat.trend}
                            </div>
                        </div>
                        <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                        <h3 className="text-4xl font-black text-foreground tracking-tighter mb-2">{stat.value}</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.desc}</p>

                        {/* Decorative glow */}
                        <div className="absolute -bottom-10 -right-10 size-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
                    </div>
                ))}
            </div>

            {/* ── Main Analytics Section ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Revenue Chart Section */}
                <div className="lg:col-span-2 glass rounded-[3.5rem] p-12 border-white/20 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-foreground tracking-tight">Xu hướng Doanh thu</h2>
                                <div className="flex items-center gap-2">
                                    <Target className="size-3 text-primary" />
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Mục tiêu quý: <span className="text-primary font-black">500.000.000₫</span></p>
                                </div>
                            </div>
                            <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5">
                                {["Tuần", "Tháng", "Năm"].map(t => (
                                    <button key={t} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${t === "Tuần" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-white/5 text-muted-foreground"}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-end gap-6 h-72 px-2">
                            {WEEKLY.map((w, i) => {
                                const h = (w.rev / maxRev) * 100
                                const active = hover === i
                                return (
                                    <div
                                        key={i}
                                        className="flex-1 flex flex-col items-center gap-6 group cursor-pointer"
                                        onMouseEnter={() => setHover(i)}
                                        onMouseLeave={() => setHover(null)}
                                    >
                                        <div className="relative w-full h-full flex flex-col justify-end">
                                            <div
                                                className={`w-full rounded-[1.5rem] transition-all duration-700 ease-out relative ${active ? "bg-primary shadow-[0_20px_40px_rgba(var(--primary),0.3)]" : "bg-primary/10 hover:bg-primary/25"}`}
                                                style={{ height: `${h}%` }}
                                            >
                                                {active && (
                                                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-2xl border-primary/30 animate-in fade-in zoom-in duration-300 z-20 shadow-2xl">
                                                        <p className="text-[12px] font-black text-primary whitespace-nowrap">{(w.rev * 10).toLocaleString()}₫</p>
                                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 bg-primary rotate-45" />
                                                    </div>
                                                )}
                                                {/* Inner glow for active bar */}
                                                {active && <div className="absolute inset-0 bg-white/10 rounded-[1.5rem]" />}
                                            </div>
                                        </div>
                                        <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>{w.day}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
                </div>

                {/* Category Performance */}
                <div className="glass rounded-[3.5rem] p-12 border-white/20 shadow-2xl flex flex-col">
                    <div className="flex flex-col items-center text-center mb-12">
                        <div className="size-16 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mb-6">
                            <Activity className="size-8" />
                        </div>
                        <h2 className="text-2xl font-black text-foreground tracking-tight">Ngành hàng</h2>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-2">Phân phối doanh thu</p>
                    </div>

                    <div className="flex-1 space-y-10">
                        {categories.map((c, i) => (
                            <div key={i} className="space-y-4 group">
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-black text-foreground uppercase tracking-widest group-hover:text-primary transition-colors">{c.categoryName}</span>
                                    <span className="text-[11px] font-black text-primary bg-primary/10 px-3 py-1 rounded-xl shadow-inner">{Math.floor(c.percent)}%</span>
                                </div>
                                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                    <div
                                        className={`h-full rounded-full transition-all duration-[1.5s] cubic-bezier(0.34, 1.56, 0.64, 1) ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} shadow-[0_0_15px_rgba(0,0,0,0.2)]`}
                                        style={{ width: `${c.percent}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <Button variant="outline" className="w-full mt-12 rounded-[1.5rem] h-14 font-black uppercase tracking-widest text-[10px] border-white/10 hover:bg-primary hover:text-white transition-all shadow-lg shadow-black/5">
                        Xem chi tiết danh mục
                    </Button>
                </div>
            </div>

            {/* ── Recent Activity ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                {/* Recent Orders List */}
                <div className="glass rounded-[3.5rem] p-12 border-white/20 shadow-2xl">
                    <div className="flex items-center justify-between mb-12">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-foreground tracking-tight">Giao dịch mới</h2>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Đang cập nhật...</p>
                        </div>
                        <Button variant="ghost" size="icon" className="size-12 rounded-[1.25rem] bg-white/5 hover:bg-primary/10 group">
                            <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary transition-all" />
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {orders.map((o) => (
                            <div key={o.id} className="flex items-center gap-6 p-5 rounded-[2rem] hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                                <div className="size-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-black text-primary border border-primary/10 group-hover:scale-110 transition-transform shadow-xl shadow-primary/5">
                                    {o.fullName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-base font-black text-foreground truncate group-hover:text-primary transition-colors">{o.fullName}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 flex items-center gap-2">
                                        <Calendar className="size-3" /> {o.orderDate}
                                    </p>
                                </div>
                                <div className="text-right space-y-2">
                                    <p className="text-lg font-black text-primary tracking-tighter">{o.orderTotalAmount.toLocaleString()}₫</p>
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-tighter ${o.orderStatus === "DELIVERED" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                                            o.orderStatus === "PENDING" ? "bg-amber-500/10 text-amber-600 border border-amber-500/20" :
                                                o.orderStatus === "SHIPPING" ? "bg-indigo-500/10 text-indigo-600 border border-indigo-500/20" :
                                                    "bg-muted/10 text-muted-foreground"
                                        }`}>
                                        <span className="size-1.5 rounded-full bg-current animate-pulse" />
                                        {o.orderStatus}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Books List */}
                <div className="glass rounded-[3.5rem] p-12 border-white/20 shadow-2xl">
                    <div className="flex items-center justify-between mb-12">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-foreground tracking-tight">Bộ sưu tập Best-seller</h2>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Dựa trên doanh số tuần</p>
                        </div>
                        <Button variant="ghost" size="icon" className="size-12 rounded-[1.25rem] bg-white/5 hover:bg-primary/10 group">
                            <ArrowUpRight className="size-5 text-muted-foreground group-hover:text-primary transition-all" />
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {books.map((b, i) => (
                            <div key={b.id} className="flex items-center gap-6 p-5 rounded-[2rem] hover:bg-white/5 transition-all group border border-transparent hover:border-white/5">
                                <div className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-lg font-black text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-inner">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-base font-black text-foreground truncate group-hover:text-primary transition-colors leading-tight">{b.title}</p>
                                    </div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{b.authorName}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1.5 justify-end text-amber-500 mb-2">
                                        <Star className="size-3.5 fill-current shadow-lg" />
                                        <span className="text-[12px] font-black tracking-tight text-foreground">4.9</span>
                                    </div>
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-primary/10 border border-primary/20">
                                        <span className="text-[12px] font-black text-primary tracking-tighter">{b.sold}</span>
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Đã bán</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    )
}