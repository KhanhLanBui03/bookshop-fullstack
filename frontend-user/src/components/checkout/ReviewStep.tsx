import { PAYMENT_METHOD, type PaymentMethod } from "@/types/Order"
import type { AddressResponse } from "@/types/Address"
import type { CheckoutItemResponse } from "@/types/Checkout"
import { useState } from "react"
import { FileText, MapPin, CreditCard, ShoppingCart, Ticket, ArrowLeft, CheckCircle } from "lucide-react"

interface Props {
    shipping: AddressResponse
    method: PaymentMethod
    items: CheckoutItemResponse[]
    total: number
    discountAmount: number
    finalTotal: number
    onApplyDiscount: (code: string) => void
    onBack: () => void
    onPlaceOrder: () => void
}

export default function ReviewStep({
    shipping,
    method,
    items,
    total,
    discountAmount,
    finalTotal,
    onApplyDiscount,
    onBack,
    onPlaceOrder,
}: Props) {
    const [coupon, setCoupon] = useState("")

    const formatCurrency = (value: number) =>
        value.toLocaleString("vi-VN") + " ₫"

    const fullAddress = `${shipping.street}, ${shipping.city}, ${shipping.state}, ${shipping.zipCode}, ${shipping.country}`

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <FileText className="size-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Xác nhận đơn hàng</h2>
                    <p className="text-sm text-muted-foreground font-bold italic">Vui lòng kiểm tra lại lần cuối trước khi đặt mua</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
                {/* Left Side: Summary Cards */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Shipping Info */}
                    <div className="glass border-white/20 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-8 bg-primary/10 rounded-xl flex items-center justify-center">
                                <MapPin className="size-4 text-primary" />
                            </div>
                            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Địa chỉ nhận hàng</h3>
                        </div>
                        <p className="text-sm font-bold text-foreground/80 leading-relaxed pl-11">
                            {fullAddress}
                        </p>
                    </div>

                    {/* Payment Info */}
                    <div className="glass border-white/20 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-8 bg-primary/10 rounded-xl flex items-center justify-center">
                                <CreditCard className="size-4 text-primary" />
                            </div>
                            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Phương thức thanh toán</h3>
                        </div>
                        <div className="flex items-center gap-2 pl-11">
                            <div className="size-2 rounded-full bg-primary animate-pulse" />
                            <p className="text-sm font-black text-foreground">
                                {method === PAYMENT_METHOD.COD && "Thanh toán khi nhận hàng (COD)"}
                                {method === PAYMENT_METHOD.VNPAY && "Thanh toán qua cổng VNPay"}
                                {method === PAYMENT_METHOD.BANK && "Chuyển khoản ngân hàng trực tiếp"}
                            </p>
                        </div>
                    </div>

                    {/* Item List */}
                    <div className="glass border-white/20 rounded-[2.5rem] p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-8 bg-primary/10 rounded-xl flex items-center justify-center">
                                <ShoppingCart className="size-4 text-primary" />
                            </div>
                            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Sản phẩm ({items.length})</h3>
                        </div>
                        
                        <div className="space-y-4 pl-11">
                            {items.map(item => (
                                <div key={item.bookId} className="flex justify-between items-center group">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <p className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">
                                            {item.bookName}
                                        </p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                                            Số lượng: {item.quantity} × {item.price.toLocaleString()}đ
                                        </p>
                                    </div>
                                    <span className="text-sm font-black text-foreground shrink-0">
                                        {formatCurrency(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Invoice Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass border-white/20 rounded-[3rem] p-8 shadow-2xl bg-primary/[0.02] sticky top-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <FileText className="size-5 text-primary" />
                            </div>
                            <h3 className="text-sm font-black text-primary uppercase tracking-widest">Chi phí đơn hàng</h3>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tạm tính</span>
                                <span className="font-black text-foreground">{formatCurrency(total)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Phí vận chuyển</span>
                                <span className="font-black text-green-500 uppercase tracking-widest text-[10px]">Miễn phí</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-2xl animate-in zoom-in duration-500">
                                    <span className="text-xs font-black text-green-600 uppercase tracking-widest">Giảm giá</span>
                                    <span className="font-black text-green-600">-{formatCurrency(discountAmount)}</span>
                                </div>
                            )}
                            <div className="h-[1px] w-full bg-border my-2" />
                            <div className="flex justify-between items-end pt-2">
                                <span className="text-xs font-black text-foreground uppercase tracking-[0.2em] mb-1">Tổng thanh toán</span>
                                <span className="text-3xl font-black text-primary tracking-tighter">
                                    {formatCurrency(finalTotal)}
                                </span>
                            </div>
                        </div>

                        {/* Coupon Section */}
                        <div className="space-y-4 pt-6 border-t border-border border-dashed">
                            <div className="flex items-center gap-2 mb-3">
                                <Ticket className="size-3.5 text-primary" />
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Ưu đãi độc quyền</span>
                            </div>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Mã giảm giá..."
                                    className="w-full h-12 pl-4 pr-24 rounded-2xl bg-background border-2 border-border focus:border-primary focus:outline-none transition-all font-black uppercase text-sm tracking-widest"
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value)}
                                />
                                <button
                                    onClick={() => onApplyDiscount(coupon)}
                                    disabled={!coupon.trim()}
                                    className="absolute right-1 top-1 bottom-1 px-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground/40 transition-all"
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button 
                    onClick={onBack} 
                    className="flex-1 h-16 rounded-[2rem] font-black border-2 border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                    <ArrowLeft className="size-4" />
                    Thay đổi thông tin
                </button>
                <button
                    onClick={onPlaceOrder}
                    className="flex-[2] h-16 rounded-[2rem] font-black text-white bg-primary hover:bg-primary/90 transition-all duration-500 shadow-2xl shadow-primary/30 active:scale-[0.98] flex items-center justify-center gap-3 text-lg uppercase tracking-widest"
                >
                    Xác nhận đặt hàng
                    <CheckCircle className="size-5" />
                </button>
            </div>
        </div>
    )
}