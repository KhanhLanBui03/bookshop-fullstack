import React, { useEffect, useState } from "react"
import {
    X,
    Package,
    Truck,
    CreditCard,
    MapPin,
    User,
    Phone,
    Mail,
    Calendar,
    Clock,
    CheckCircle2,
    Ban,
    RotateCcw,
    Activity,
    ShoppingCart
} from "lucide-react"
import { orderApi } from "@/api/order.api"
import type { OrderDetailResponse } from "../order.types"
import { Button } from "@/components/ui/button"

interface Props {
    orderId: number
    onClose: () => void
}

const fmt = (n: number) => `${Number(n ?? 0).toLocaleString()}₫`
const fmtDate = (d: string) => new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
})

const STATUS_CFG: Record<string, { label: string; color: string; icon: React.ReactNode; bg: string }> = {
    PENDING: { label: "Đang chờ xử lý", color: "text-amber-500", icon: <Clock className="size-4" />, bg: "bg-amber-500/10" },
    PENDING_PAYMENT: { label: "Chờ thanh toán", color: "text-rose-500", icon: <CreditCard className="size-4" />, bg: "bg-rose-500/10" },
    PAID: { label: "Đã thanh toán", color: "text-emerald-500", icon: <CheckCircle2 className="size-4" />, bg: "bg-emerald-500/10" },
    CONFIRMED: { label: "Đã xác nhận", color: "text-sky-500", icon: <CheckCircle2 className="size-4" />, bg: "bg-sky-500/10" },
    SHIPPING: { label: "Đang giao hàng", color: "text-indigo-500", icon: <Truck className="size-4" />, bg: "bg-indigo-500/10" },
    DELIVERED: { label: "Giao hàng thành công", color: "text-emerald-500", icon: <Package className="size-4" />, bg: "bg-emerald-500/10" },
    FAILED: { label: "Giao hàng thất bại", color: "text-rose-600", icon: <X className="size-4" />, bg: "bg-rose-600/10" },
    CANCELLED: { label: "Đã hủy đơn", color: "text-muted-foreground", icon: <Ban className="size-4" />, bg: "bg-muted/10" },
    REFUNDED: { label: "Đã hoàn tiền", color: "text-rose-600", icon: <RotateCcw className="size-4" />, bg: "bg-rose-600/10" },
}

export const OrderDetailModal = ({ orderId, onClose }: Props) => {
    const [order, setOrder] = useState<OrderDetailResponse | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const res = await orderApi.getOrderDetail(orderId)
                setOrder(res)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [orderId])

    if (loading) return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
            <div className="glass p-10 rounded-[3rem] border-white/20 flex flex-col items-center gap-4">
                <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Đang tải chi tiết...</p>
            </div>
        </div>
    )

    if (!order) return null

    const status = STATUS_CFG[order.status] || { label: order.status, color: "text-muted-foreground", icon: <Activity className="size-4" />, bg: "bg-muted/10" }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="glass w-full max-w-4xl rounded-[3rem] border-white/20 overflow-hidden animate-in zoom-in-95 fade-in duration-300 my-8">

                {/* ── Header ── */}
                <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                <ShoppingCart className="size-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-foreground tracking-tight">Chi tiết đơn hàng</h2>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Mã đơn: <span className="text-primary">#{order.orderCode}</span></p>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="size-10 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                        <X className="size-5 text-muted-foreground" />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {/* ── Top Info Grid ── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Status Card */}
                        <div className="glass-light p-6 rounded-[2rem] border-white/10 space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                <Activity className="size-3" /> Trạng thái
                            </div>
                            <div className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl ${status.bg} ${status.color} w-full`}>
                                {status.icon}
                                <span className="text-xs font-black uppercase tracking-widest">{status.label}</span>
                            </div>
                        </div>

                        {/* Customer Card */}
                        <div className="glass-light p-6 rounded-[2rem] border-white/10 space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                <User className="size-3" /> Khách hàng
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-black text-foreground">{order.customerName}</p>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                    <Mail className="size-3" /> {order.customerEmail}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                    <Phone className="size-3" /> {order.customerPhone}
                                </div>
                            </div>
                        </div>

                        {/* Date & Payment */}
                        <div className="glass-light p-6 rounded-[2rem] border-white/10 space-y-3">
                            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                <Calendar className="size-3" /> Thời gian & Thanh toán
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-foreground flex items-center gap-2">
                                    <Clock className="size-3 text-muted-foreground" /> {fmtDate(order.orderDate)}
                                </p>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary">
                                    <CreditCard className="size-3" /> {order.paymentMethod}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Shipping Address ── */}
                    <div className="glass-light p-6 rounded-[2.5rem] border-white/10">
                        <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">
                            <MapPin className="size-3" /> Địa chỉ giao hàng
                        </div>
                        <p className="text-sm font-bold text-foreground leading-relaxed">
                            {order.shippingAddress}
                        </p>
                    </div>

                    {/* ── Order Items ── */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                                <Package className="size-4" /> Danh sách sản phẩm ({order.items.length})
                            </h3>
                        </div>

                        <div className="glass rounded-[2.5rem] overflow-hidden border-white/10">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5">
                                        <th className="p-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sản phẩm</th>
                                        <th className="p-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Số lượng</th>
                                        <th className="p-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Đơn giá</th>
                                        <th className="p-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {order.items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                            <td className="p-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-xl bg-background border border-border/50 overflow-hidden flex-shrink-0 shadow-sm">
                                                        <img src={item.bookImage} alt={item.bookTitle} className="size-full object-cover" />
                                                    </div>
                                                    <span className="text-xs font-black text-foreground max-w-[250px] line-clamp-2">{item.bookTitle}</span>
                                                </div>
                                            </td>
                                            <td className="p-5 text-center">
                                                <span className="text-xs font-black text-muted-foreground">x{item.quantity}</span>
                                            </td>
                                            <td className="p-5 text-right">
                                                <span className="text-xs font-bold text-muted-foreground">{fmt(item.price)}</span>
                                            </td>
                                            <td className="p-5 text-right">
                                                <span className="text-sm font-black text-primary">{fmt(item.price * item.quantity)}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── Summary Footer ── */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4">
                        <div className="flex items-center gap-3">
                            <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                <CheckCircle2 className="size-6" />
                            </div>
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest max-w-[200px]">
                                Đơn hàng đã được ghi nhận và xử lý theo quy trình vận hành.
                            </div>
                        </div>

                        <div className="glass px-8 py-6 rounded-[2.5rem] border-white/20 min-w-[300px]">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    <span>Tạm tính ({order.items.length} món)</span>
                                    <span>{fmt(order.totalAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                    <span>Phí vận chuyển</span>
                                    <span className="text-emerald-500">Miễn phí</span>
                                </div>
                                <div className="h-px bg-white/10 my-2" />
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-black text-foreground uppercase tracking-widest pb-1">Tổng cộng</span>
                                    <span className="text-3xl font-black text-primary tracking-tighter">{fmt(order.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white/5 border-t border-white/10 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-8 border-white/10 bg-background/50">
                        Đóng
                    </Button>
                    <Button className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-8 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        In hóa đơn
                    </Button>
                </div>
            </div>

            <style>{`
                .glass-light {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(4px);
                    transition: all 0.3s ease;
                }
                .glass-light:hover {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: rgba(59, 130, 246, 0.2);
                }
            `}</style>
        </div>
    )
}
