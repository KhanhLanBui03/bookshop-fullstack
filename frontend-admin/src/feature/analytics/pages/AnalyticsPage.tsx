import { useEffect, useState } from "react"
import { analyticsApi } from "@/api/analytics.api"
import {
    BarChart3,
    TrendingUp,
    Activity,
    Target,
    Users,
    PieChart,
    ArrowUpRight,
    Globe,
    Zap,
    ShoppingCart,
    RefreshCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type {
    AnalyticsKpi,
    CategoryPerformance,
    FunnelStep,
    Period,
    RevenuePoint,
} from "../analytics.type"

/* ════════ TYPES ════════ */
interface LoadedData {
    kpi: AnalyticsKpi
    revenueWeekly: RevenuePoint[]
    revenueMonthly: RevenuePoint[]
    revenueYearly: RevenuePoint[]
    funnel: FunnelStep[]
    categories: CategoryPerformance[]
}

const CAT_COLORS = ["#a78bfa", "#60a5fa", "#34d399", "#f472b6", "#fb923c"]

export const AnalyticsPage = () => {
    const [period, setPeriod] = useState<Period>("weekly")
    const [data, setData] = useState<LoadedData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hoverBar, setHoverBar] = useState<number | null>(null)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await analyticsApi.loadAll(period)
                setData({
                    kpi: res.kpi,
                    revenueWeekly: res.revenueWeekly,
                    revenueMonthly: res.revenueMonthly,
                    revenueYearly: res.revenueYearly,
                    funnel: res.funnel,
                    categories: res.categories,
                })
            } catch (e) {
                console.error(e)
                setError("Không thể tải dữ liệu phân tích")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [period])

    const revenueData = data
        ? period === "weekly"
            ? (data.revenueWeekly.length > 0 ? data.revenueWeekly : [
                { label: "T2", value: 4500000 }, { label: "T3", value: 5200000 }, { label: "T4", value: 3800000 },
                { label: "T5", value: 6100000 }, { label: "T6", value: 4900000 }, { label: "T7", value: 7200000 }, { label: "CN", value: 8500000 }
            ])
            : period === "monthly"
                ? (data.revenueMonthly.length > 0 ? data.revenueMonthly : [
                    { label: "W1", value: 25000000 }, { label: "W2", value: 32000000 },
                    { label: "W3", value: 28000000 }, { label: "W4", value: 41000000 }
                ])
                : (data.revenueYearly.length > 0 ? data.revenueYearly : [
                    { label: "Th1", value: 120000000 }, { label: "Th2", value: 150000000 }, { label: "Th3", value: 110000000 },
                    { label: "Th4", value: 180000000 }, { label: "Th5", value: 140000000 }, { label: "Th6", value: 210000000 },
                    { label: "Th7", value: 190000000 }, { label: "Th8", value: 160000000 }, { label: "Th9", value: 230000000 },
                    { label: "Th10", value: 250000000 }, { label: "Th11", value: 280000000 }, { label: "Th12", value: 350000000 }
                ])
        : []

    const kpi = data?.kpi
    const funnel = data?.funnel ?? []
    const categories = data?.categories ?? []
    const totalRev = categories.reduce((s, c) => s + c.revenue, 0)
    const maxRev = Math.max(...revenueData.map(d => d.value), 1)

    if (error) return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="size-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center animate-bounce">
                <Zap className="size-8" />
            </div>
            <p className="text-sm font-black text-rose-500 uppercase tracking-widest">⚠ {error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="rounded-xl font-black uppercase text-[10px] tracking-widest border-rose-500/20 text-rose-500">Thử lại</Button>
        </div>
    )

    const kpiCards = [
        { label: "Tỷ lệ chuyển đổi", value: kpi ? `${kpi.conversionRate}%` : "—", desc: "Đơn hàng đã giao thành công", icon: <Target className="size-5" />, color: "text-primary", bg: "bg-primary/10" },
        { label: "Giá trị đơn hàng TB", value: kpi ? `${kpi.avgOrderValue.toLocaleString()}₫` : "—", desc: "Trên mỗi hóa đơn thanh toán", icon: <ShoppingCart className="size-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Tỷ lệ hoàn hàng", value: kpi ? `${kpi.returnRate}%` : "—", desc: "Yêu cầu trả hàng/hoàn tiền", icon: <RefreshCcw className="size-5" />, color: "text-rose-500", bg: "bg-rose-500/10" },
        { label: "Người dùng mới/cũ", value: kpi ? `${kpi.newUsers}/${kpi.returningUsers}` : "—", desc: "Thống kê trong tháng này", icon: <Users className="size-5" />, color: "text-sky-500", bg: "bg-sky-500/10" },
    ]

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">

            {/* ── Header ── */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-emerald-500/20">
                        <BarChart3 className="size-3" /> Trung tâm phân tích dữ liệu
                    </div>
                    <h1 className="text-4xl font-black text-foreground tracking-tight leading-none uppercase">Báo cáo <span className="text-primary italic">Chuyên sâu</span></h1>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">Khám phá các chỉ số tăng trưởng và hành vi người dùng</p>
                </div>

                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-[1.5rem] border border-white/5">
                    {[
                        { id: "weekly", label: "Tuần" },
                        { id: "monthly", label: "Tháng" },
                        { id: "yearly", label: "Năm" }
                    ].map(p => (
                        <button
                            key={p.id}
                            onClick={() => setPeriod(p.id as Period)}
                            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${period === p.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-white/5 text-muted-foreground"}`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── KPI Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((c, i) => (
                    <div key={i} className="glass p-8 rounded-[2.5rem] border-white/20 hover:border-primary/40 transition-all group relative overflow-hidden shadow-xl shadow-black/5">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`size-12 ${c.bg} ${c.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                                {c.icon}
                            </div>
                            <ArrowUpRight className="size-4 text-muted-foreground opacity-50 group-hover:opacity-100 group-hover:text-primary transition-all" />
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{c.label}</p>
                        {loading ? (
                            <div className="h-8 w-24 bg-muted/20 animate-pulse rounded-lg mb-2" />
                        ) : (
                            <h3 className="text-2xl font-black text-foreground tracking-tighter mb-2">{c.value}</h3>
                        )}
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">{c.desc}</p>
                    </div>
                ))}
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Revenue Chart */}
                <div className="lg:col-span-2 glass rounded-[3.5rem] p-12 border-white/20 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div className="space-y-1.5">
                            <h2 className="text-3xl font-black text-foreground tracking-tight">Xu hướng Doanh thu</h2>
                            <div className="flex items-center gap-2">
                                <div className="size-4 bg-primary/20 rounded-full flex items-center justify-center">
                                    <Globe className="size-2 text-primary" />
                                </div>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    MỤC TIÊU QUÝ: <span className="text-primary">500.000.000₫</span>
                                </p>
                            </div>
                        </div>
                        <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner border border-primary/10">
                            <TrendingUp className="size-7" />
                        </div>
                    </div>

                    <div className="flex items-end gap-6 h-64 px-2 relative z-10">
                        {loading ? (
                            Array.from({ length: 7 }).map((_, i) => (
                                <div key={i} className="flex-1 bg-muted/20 rounded-t-2xl animate-pulse" style={{ height: `${20 + i * 10}%` }} />
                            ))
                        ) : revenueData.map((d, i) => {
                            const h = (d.value / maxRev) * 100
                            const active = hoverBar === i
                            return (
                                <div
                                    key={i}
                                    className="flex-1 flex flex-col items-center gap-4 group cursor-pointer"
                                    onMouseEnter={() => setHoverBar(i)}
                                    onMouseLeave={() => setHoverBar(null)}
                                >
                                    <div className="relative w-full h-full flex flex-col justify-end">
                                        <div
                                            className={`w-full rounded-t-2xl transition-all duration-500 ease-out relative ${active ? "bg-primary shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)]" : "bg-primary/20 hover:bg-primary/35"}`}
                                            style={{ height: `${h}%` }}
                                        >
                                            {active && (
                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 glass px-3 py-1.5 rounded-xl border-primary/30 animate-in fade-in zoom-in duration-300 z-20 shadow-xl">
                                                    <p className="text-[10px] font-black text-primary whitespace-nowrap">{d.value.toLocaleString()}₫</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>{d.label}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
                </div>

                {/* Conversion Funnel */}
                <div className="glass rounded-[3.5rem] p-12 border-white/20 shadow-2xl">
                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="size-14 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                            <Activity className="size-7" />
                        </div>
                        <h2 className="text-xl font-black text-foreground tracking-tight uppercase">Phễu Chuyển đổi</h2>
                    </div>

                    <div className="space-y-8">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 w-1/2 bg-muted/20 animate-pulse rounded-lg" />
                                    <div className="h-2 w-full bg-muted/20 animate-pulse rounded-full" />
                                </div>
                            ))
                        ) : funnel.map((f, i) => {
                            const pct = ((f.value / (funnel[0]?.value || 1)) * 100).toFixed(1)
                            const color = CAT_COLORS[i % CAT_COLORS.length]
                            return (
                                <div key={i} className="space-y-3 group">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className="size-2 rounded-full" style={{ backgroundColor: color }} />
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">{f.label}</span>
                                        </div>
                                        <span className="text-[10px] font-black text-foreground">{f.value.toLocaleString()}</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${pct}%`, backgroundColor: color }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* ── Category Breakdown ── */}
            <div className="glass rounded-[3.5rem] p-12 border-white/20 shadow-2xl overflow-hidden relative">
                <div className="flex items-center justify-between mb-12">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black text-foreground tracking-tight">Hiệu suất Danh mục</h2>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Phân tích chuyên sâu ngành hàng</p>
                    </div>
                    <div className="size-12 bg-sky-500/10 text-sky-500 rounded-2xl flex items-center justify-center shadow-inner">
                        <PieChart className="size-6" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="pb-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Danh mục</th>
                                <th className="pb-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Doanh thu</th>
                                <th className="pb-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Số lượng bán</th>
                                <th className="pb-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Tỷ lệ đóng góp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="py-6"><div className="h-10 bg-muted/20 rounded-2xl" /></td>
                                    </tr>
                                ))
                            ) : categories.map((c, i) => {
                                const share = totalRev === 0 ? "0" : ((c.revenue / totalRev) * 100).toFixed(0)
                                const color = CAT_COLORS[i % CAT_COLORS.length]
                                return (
                                    <tr key={i} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-xl flex items-center justify-center font-black text-white group-hover:scale-110 transition-transform shadow-lg" style={{ backgroundColor: color }}>
                                                    {c.cat.charAt(0)}
                                                </div>
                                                <span className="text-sm font-black text-foreground uppercase tracking-tight">{c.cat}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 text-right">
                                            <span className="text-sm font-black text-primary">{Number(c.revenue).toLocaleString()}₫</span>
                                        </td>
                                        <td className="py-6 text-right text-sm font-bold text-muted-foreground">
                                            {c.units.toLocaleString()} <span className="text-[10px] uppercase">Sản phẩm</span>
                                        </td>
                                        <td className="py-6 text-right">
                                            <div className="flex items-center justify-end gap-6">
                                                <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${share}%`, backgroundColor: color }} />
                                                </div>
                                                <span className="text-xs font-black min-w-[32px]" style={{ color }}>{share}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
}