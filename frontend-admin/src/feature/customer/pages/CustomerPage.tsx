import React, { useState, useEffect, useCallback, useRef } from "react"
import {
    Search,
    Activity,
    Users,
    UserPlus,
    ShoppingBag,
    TrendingUp,
    Eye,
    Shield,
    ArrowUpRight,
    MoreHorizontal,
    Globe,
    MailQuestion,
    Calendar
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
import { customerApi } from "@/api/customer.api"
import type { AuthProvider, RoleName, UserAdminResponse, UserDashboardStats } from "../customer.type"

/* ════════ CONFIG ════════ */
const ROLE_CFG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    ADMIN: { label: "Quản trị viên", color: "text-rose-500", bg: "bg-rose-500/10", icon: <Shield className="size-3" /> },
    USER: { label: "Khách hàng", color: "text-primary", bg: "bg-primary/10", icon: <Users className="size-3" /> },
    STAFF: { label: "Nhân viên", color: "text-amber-500", bg: "bg-amber-500/10", icon: <Activity className="size-3" /> },
}

const PROVIDER_CFG: Record<AuthProvider, { label: string; icon: React.ReactNode; color: string }> = {
    LOCAL: { label: "Hệ thống", icon: <Shield className="size-3" />, color: "text-muted-foreground" },
    GOOGLE: { label: "Google", icon: <Globe className="size-3" />, color: "text-blue-500" },
    FACEBOOK: { label: "Facebook", icon: <Globe className="size-3" />, color: "text-indigo-600" },
    GITHUB: { label: "Github", icon: <Globe className="size-3" />, color: "text-slate-800" },
}

/* ════════ HELPERS ════════ */
const fmt = (n: number) => `${Number(n ?? 0).toLocaleString()}₫`
const fmtDate = (d: string) => new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "short", year: "numeric" })

export const CustomerPage = () => {
    const [stats, setStats] = useState<UserDashboardStats | null>(null)
    const [users, setUsers] = useState<UserAdminResponse[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [totalElements, setTotalElements] = useState(0)
    const [loading, setLoading] = useState(false)
    const [statsLoading, setStatsLoading] = useState(true)

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [filterRole, setFilterRole] = useState<RoleName | "ALL">("ALL")
    const [filterProvider, setFilterProvider] = useState<AuthProvider | "ALL">("ALL")
    const [page, setPage] = useState(1)
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
        const loadStats = async () => {
            setStatsLoading(true)
            try {
                const res = await customerApi.getDashboardStats()
                setStats(res)
            } catch (e) {
                console.error(e)
            } finally {
                setStatsLoading(false)
            }
        }
        loadStats()
    }, [])

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const res = await customerApi.getAllAdminUsers({
                keyword: debouncedSearch || undefined,
                role: filterRole !== "ALL" ? filterRole : undefined,
                authProvider: filterProvider !== "ALL" ? filterProvider : undefined,
                page: page - 1,
                size: PAGE_SIZE,
                sort: `createAt,desc`,
            })
            setUsers(res.content)
            setTotalPages(res.totalPages)
            setTotalElements(res.totalElements)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [debouncedSearch, filterRole, filterProvider, page])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    const statCards = [
        { label: "Tổng khách hàng", value: stats?.totalCustomers?.toLocaleString(), icon: <Users className="size-5" />, color: "text-primary", bg: "bg-primary/10" },
        { label: "Doanh thu trung bình", value: fmt(stats?.totalRevenue ?? 0), icon: <TrendingUp className="size-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Đơn hàng hệ thống", value: stats?.totalOrders?.toLocaleString(), icon: <ShoppingBag className="size-5" />, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Mới trong tháng", value: stats?.newThisMonth?.toLocaleString(), icon: <UserPlus className="size-5" />, color: "text-sky-500", bg: "bg-sky-500/10" },
    ]

    return (
        <div className="space-y-10 animate-in fade-in duration-700">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <Shield className="size-3" /> Quản lý người dùng
                    </div>
                    <h1 className="text-4xl font-black text-foreground tracking-tight">Khách hàng <span className="text-primary">& Thành viên</span></h1>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em]">Danh sách và thông tin chi tiết khách hàng</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl font-bold h-12 px-6 border-border/50 bg-background/50">
                        Xuất danh sách
                    </Button>
                    <div className="size-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <UserPlus className="size-5" />
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
                        placeholder="Tìm theo tên, email, số điện thoại..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-11 h-12 bg-background/50 border-border/50 rounded-2xl focus-visible:ring-primary/20"
                    />
                </div>

                {/* Role Filter */}
                <Select value={filterRole} onValueChange={(v) => setFilterRole(v as any)}>
                    <SelectTrigger className="w-full md:w-48 h-12 bg-background/50 border-border/50 rounded-2xl font-bold">
                        <SelectValue placeholder="Vai trò" />
                    </SelectTrigger>
                    <SelectContent className="glass border-border/50 rounded-2xl">
                        <SelectItem value="ALL" className="text-xs font-black uppercase m-1 rounded-xl">Tất cả vai trò</SelectItem>
                        {(Object.keys(ROLE_CFG) as RoleName[]).map(r => (
                            <SelectItem key={r} value={r} className="text-xs font-black uppercase m-1 rounded-xl">
                                {ROLE_CFG[r].label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Provider Filter */}
                <Select value={filterProvider} onValueChange={(v) => setFilterProvider(v as any)}>
                    <SelectTrigger className="w-full md:w-48 h-12 bg-background/50 border-border/50 rounded-2xl font-bold">
                        <SelectValue placeholder="Nền tảng" />
                    </SelectTrigger>
                    <SelectContent className="glass border-border/50 rounded-2xl">
                        <SelectItem value="ALL" className="text-xs font-black uppercase m-1 rounded-xl">Tất cả nền tảng</SelectItem>
                        {(Object.keys(PROVIDER_CFG) as AuthProvider[]).map(p => (
                            <SelectItem key={p} value={p} className="text-xs font-black uppercase m-1 rounded-xl">
                                {PROVIDER_CFG[p].label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button
                    variant="ghost"
                    onClick={() => { setSearch(""); setFilterRole("ALL"); setFilterProvider("ALL"); setPage(1) }}
                    className="h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5"
                >
                    Đặt lại
                </Button>
            </div>

            {/* ── Customers Table ── */}
            <div className="glass rounded-[3rem] overflow-hidden border-white/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Khách hàng</th>
                                <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Nền tảng</th>
                                <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Vai trò</th>
                                <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Đơn hàng</th>
                                <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Tổng chi tiêu</th>
                                <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ngày tham gia</th>
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
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-20 text-center">
                                        <div className="size-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <MailQuestion className="size-10 text-muted-foreground/30" />
                                        </div>
                                        <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Không tìm thấy khách hàng nào</p>
                                    </td>
                                </tr>
                            ) : users.map((u) => {
                                const roleKey = (u.roles?.length ? u.roles[0] : "USER") as RoleName
                                const role = ROLE_CFG[roleKey] || ROLE_CFG.USER
                                const provider = PROVIDER_CFG[u.authProvider] || PROVIDER_CFG.LOCAL
                                return (
                                    <tr key={u.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                                                    {u.fullName.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-foreground group-hover:text-primary transition-colors">{u.fullName}</span>
                                                    <span className="text-[10px] text-muted-foreground truncate max-w-[150px]">{u.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/50 text-[10px] font-black uppercase tracking-widest ${provider.color} bg-background/50`}>
                                                {provider.icon} {provider.label}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${role.bg} ${role.color} text-[10px] font-black uppercase tracking-widest`}>
                                                {role.icon} {role.label}
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className="text-xs font-black">{u.totalOrder} <span className="text-muted-foreground text-[10px] uppercase ml-1">Đơn</span></span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <span className="text-sm font-black text-primary">{fmt(u.totalSpent)}</span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="size-3" />
                                                <span className="text-[10px] font-bold uppercase tracking-tighter">{fmtDate(u.createAt)}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button size="icon" variant="ghost" className="size-9 rounded-xl hover:bg-primary/10 hover:text-primary">
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
            <div className="flex items-center justify-between px-2 py-4 flex-wrap gap-4 mt-4">
                <div className="glass px-6 py-2.5 rounded-2xl border-white/20">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        Trang <span className="text-primary">{page}</span> / <span className="text-primary">{totalPages}</span> · <span className="text-primary">{totalElements}</span> người dùng
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="glass rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-6 border-white/20 hover:bg-white/40 active:scale-95 transition-all disabled:opacity-30"
                    >
                        ← Trước
                    </Button>
                    <Button
                        variant="ghost"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="glass rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-6 border-white/20 hover:bg-white/40 active:scale-95 transition-all disabled:opacity-30"
                    >
                        Sau →
                    </Button>
                </div>
            </div>
        </div>
    )
}