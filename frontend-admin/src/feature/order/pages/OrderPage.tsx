import React, { useState, useEffect, useCallback, useRef } from "react"
import { 
  Search, 
  X, 
  Activity,
  DollarSign,
  ShoppingCart,
  Truck,
  PackageCheck,
  MoreHorizontal,
  Eye,
  CheckCircle2,
  Clock,
  CreditCard,
  Ban,
  RotateCcw,
  ArrowUpRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { orderApi } from "@/api/order.api"
import { exportApi } from "@/api/export.api"
import type { OrderAdminResponse, OrderDashboardStats, OrderStatus, PaymentMethod } from "../order.types"
import { OrderDetailModal } from "../components/OrderDetailModal"

/* ════════ CONFIG ════════ */
const STATUS_CFG: Record<string, { label: string; color: string; icon: React.ReactNode; bg: string }> = {
    PENDING: { label: "Đang chờ", color: "text-amber-500", icon: <Clock className="size-3" />, bg: "bg-amber-500/10" },
    PENDING_PAYMENT: { label: "Chờ thanh toán", color: "text-rose-500", icon: <CreditCard className="size-3" />, bg: "bg-rose-500/10" },
    PAID: { label: "Đã thanh toán", color: "text-emerald-500", icon: <CheckCircle2 className="size-3" />, bg: "bg-emerald-500/10" },
    CONFIRMED: { label: "Đã xác nhận", color: "text-sky-500", icon: <CheckCircle2 className="size-3" />, bg: "bg-sky-500/10" },
    SHIPPING: { label: "Đang giao", color: "text-indigo-500", icon: <Truck className="size-3" />, bg: "bg-indigo-500/10" },
    DELIVERED: { label: "Đã giao", color: "text-emerald-500", icon: <PackageCheck className="size-3" />, bg: "bg-emerald-500/10" },
    FAILED: { label: "Thất bại", color: "text-rose-600", icon: <X className="size-3" />, bg: "bg-rose-600/10" },
    CANCELLED: { label: "Đã hủy", color: "text-muted-foreground", icon: <Ban className="size-3" />, bg: "bg-muted/10" },
    REFUNDED: { label: "Đã hoàn tiền", color: "text-rose-600", icon: <RotateCcw className="size-3" />, bg: "bg-rose-600/10" },
}

const getStatus = (s: string) => STATUS_CFG[s] || { label: s, color: "text-muted-foreground", icon: <Activity className="size-3" />, bg: "bg-muted/10" }

const PAYMENT_CFG: Record<PaymentMethod, { label: string; icon: React.ReactNode; color: string }> = {
    COD: { label: "Tiền mặt", icon: <DollarSign className="size-3" />, color: "text-muted-foreground" },
    VNPAY: { label: "VNPay", icon: <Activity className="size-3" />, color: "text-blue-500" },
    BANK: { label: "Chuyển khoản", icon: <CreditCard className="size-3" />, color: "text-purple-500" },
}

/* ════════ HELPERS ════════ */
const fmt = (n: number) => `${Number(n ?? 0).toLocaleString()}₫`
const fmtDate = (d: string) => new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "short", year: "numeric" })

export const OrderManagementPage = () => {
    const [stats, setStats] = useState<OrderDashboardStats | null>(null)
    const [orders, setOrders] = useState<OrderAdminResponse[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [totalElements, setTotalElements] = useState(0)
    const [loading, setLoading] = useState(false)
    const [statsLoading, setStatsLoading] = useState(true)
    const [exporting, setExporting] = useState(false)

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState<OrderStatus | "ALL">("ALL")
    const [filterPayment, setFilterPayment] = useState<PaymentMethod | "ALL">("ALL")
    const [page, setPage] = useState(1)
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
    const PAGE_SIZE = 10

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(1)
        }, 400)
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    }, [search])

    useEffect(() => {
        const fetchStats = async () => {
            setStatsLoading(true)
            try {
                const res = await orderApi.getOrderDashboardStats()
                setStats(res)
            } catch (e) {
                console.error(e)
            } finally {
                setStatsLoading(false)
            }
        }
        fetchStats()
    }, [])

    const fetchOrders = useCallback(async () => {
        setLoading(true)
        try {
            const res = await orderApi.getAllOrderAdmins({
                keyword: debouncedSearch || undefined,
                orderStatus: filterStatus !== "ALL" ? filterStatus : undefined,
                paymentMethod: filterPayment !== "ALL" ? filterPayment : undefined,
                page: page - 1,
                size: PAGE_SIZE,
                sort: `orderDate,desc`,
            })
            setOrders(res.content)
            setTotalPages(res.totalPages)
            setTotalElements(res.totalElements)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [debouncedSearch, filterStatus, filterPayment, page])

    useEffect(() => { fetchOrders() }, [fetchOrders])

    const statCards = [
        { label: "Tổng doanh thu", value: fmt(stats?.totalRevenue ?? 0), icon: <DollarSign className="size-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Đang chờ", value: stats?.totalPending, icon: <Clock className="size-5" />, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Đang giao", value: stats?.totalShipping, icon: <Truck className="size-5" />, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        { label: "Đã hoàn tất", value: stats?.totalDelivered, icon: <PackageCheck className="size-5" />, color: "text-primary", bg: "bg-primary/10" },
    ]

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <ShoppingCart className="size-3" /> Quản lý vận hành
                    </div>
                    <h1 className="text-4xl font-black text-foreground tracking-tight">Quản lý <span className="text-primary">Đơn hàng</span></h1>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">Vận hành và theo dõi tình trạng đơn hàng</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        className="rounded-2xl font-bold h-12 px-6 border-border/50 bg-background/50"
                        onClick={async () => {
                            setExporting(true);
                            try { await exportApi.exportOrders(); } finally { setExporting(false); }
                        }}
                        disabled={exporting}
                    >
                        {exporting ? "Đang xuất..." : "Xuất báo cáo"}
                    </Button>
                    <div className="size-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <Activity className="size-5" />
                    </div>
                </div>
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

            {/* ── Filters Toolbar ── */}
            <div className="glass p-4 rounded-3xl flex flex-wrap items-center gap-4 relative z-40 border-white/20">
                {/* Search */}
                <div className="relative flex-1 min-w-[300px] group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Tìm theo mã đơn, khách hàng, email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-11 h-12 bg-background/50 border-border/50 rounded-2xl focus-visible:ring-primary/20"
                    />
                </div>

                {/* Status Filter */}
                <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                    <SelectTrigger className="w-full md:w-48 h-12 bg-background/50 border-border/50 rounded-2xl font-bold">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent className="glass border-border/50 rounded-2xl">
                        <SelectItem value="ALL" className="text-xs font-black uppercase m-1 rounded-xl">Tất cả trạng thái</SelectItem>
                        {Object.keys(STATUS_CFG).map(s => (
                            <SelectItem key={s} value={s} className="text-xs font-black uppercase m-1 rounded-xl">
                                {STATUS_CFG[s].label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Payment Filter */}
                <Select value={filterPayment} onValueChange={(v) => setFilterPayment(v as any)}>
                    <SelectTrigger className="w-full md:w-48 h-12 bg-background/50 border-border/50 rounded-2xl font-bold">
                        <SelectValue placeholder="Thanh toán" />
                    </SelectTrigger>
                    <SelectContent className="glass border-border/50 rounded-2xl">
                        <SelectItem value="ALL" className="text-xs font-black uppercase m-1 rounded-xl">Tất cả thanh toán</SelectItem>
                        {(Object.keys(PAYMENT_CFG) as PaymentMethod[]).map(p => (
                            <SelectItem key={p} value={p} className="text-xs font-black uppercase m-1 rounded-xl">
                                {PAYMENT_CFG[p].label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button 
                    variant="ghost" 
                    onClick={() => { setSearch(""); setFilterStatus("ALL"); setFilterPayment("ALL"); setPage(1) }}
                    className="h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5"
                >
                    Đặt lại
                </Button>
            </div>

            {/* ── Orders Table ── */}
            <div className="glass rounded-[3rem] overflow-hidden border-white/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Đơn hàng</th>
                                <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Khách hàng</th>
                                <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sản phẩm</th>
                                <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Thanh toán</th>
                                <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Tổng tiền</th>
                                <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Trạng thái</th>
                                <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={7} className="p-6"><div className="h-12 bg-muted/20 rounded-2xl" /></td>
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-20 text-center">
                                        <div className="size-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ShoppingCart className="size-10 text-muted-foreground/30" />
                                        </div>
                                        <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Không có đơn hàng nào</p>
                                    </td>
                                </tr>
                            ) : orders.map((order) => {
                                const status = getStatus(order.orderStatus)
                                const payment = PAYMENT_CFG[order.paymentMethod] || PAYMENT_CFG.COD
                                return (
                                    <tr key={order.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="p-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">#{order.orderCode}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mt-1">{fmtDate(order.orderDate)}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                                                    {order.customerName.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-foreground">{order.customerName}</span>
                                                    <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">{order.customerEmail}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-muted/50 p-1.5 rounded-lg">
                                                    <PackageCheck className="size-4 text-muted-foreground" />
                                                </div>
                                                <span className="text-xs font-black">{order.countItem} <span className="text-muted-foreground text-[10px] uppercase ml-1">Sách</span></span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/50 text-[10px] font-black uppercase tracking-widest ${payment.color} bg-background/50`}>
                                                {payment.icon} {payment.label}
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <span className="text-sm font-black text-primary">{fmt(order.orderTotalAmount)}</span>
                                        </td>
                                        <td className="p-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${status.bg} ${status.color} text-[10px] font-black uppercase tracking-widest`}>
                                                {status.icon} {status.label}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    onClick={() => setSelectedOrderId(order.id)}
                                                    className="size-9 rounded-xl hover:bg-primary/10 hover:text-primary"
                                                >
                                                    <Eye className="size-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="size-9 rounded-xl hover:bg-muted/20">
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Trang {page} / {totalPages} · {totalElements} kết quả
                    </p>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="rounded-xl font-black text-xs uppercase tracking-widest h-10 px-4"
                        >
                            Trước
                        </Button>
                        <Button 
                            variant="outline" 
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="rounded-xl font-black text-xs uppercase tracking-widest h-10 px-4"
                        >
                            Sau
                        </Button>
                    </div>
                </div>
            )}

            {/* ── Detail Modal ── */}
            {selectedOrderId && (
                <OrderDetailModal 
                    orderId={selectedOrderId} 
                    onClose={() => setSelectedOrderId(null)} 
                />
            )}
        </div>
    )
}