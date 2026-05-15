import type { CheckoutResponse } from "@/types/Checkout"
import { User, Mail, Phone, MapPin, ShoppingBag, ArrowRight } from "lucide-react"

interface Props {
    data: CheckoutResponse;
    selectedAddrId: number | null;
    onSelectAddr: (id: number) => void;
    onNext: () => void;
}

export default function ShippingStep({
    data,
    selectedAddrId,
    onSelectAddr,
    onNext
}: Props) {
    const selectedAddress =
        data.customerAddresses.find(a => a.id === selectedAddrId) ||
        data.customerAddresses[0];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <MapPin className="size-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Thông tin giao hàng</h2>
                    <p className="text-sm text-muted-foreground font-bold italic">Vui lòng kiểm tra kỹ thông tin nhận hàng</p>
                </div>
            </div>

            {/* Thông tin khách hàng */}
            <div className="glass border-white/20 rounded-[2.5rem] p-8 mb-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <User className="size-32" />
                </div>
                
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-8">Người nhận</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <User className="size-3.5" />
                            <span className="text-[10px] font-black uppercase">Họ và tên</span>
                        </div>
                        <p className="text-lg font-black text-foreground">{data.customerName}</p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Mail className="size-3.5" />
                            <span className="text-[10px] font-black uppercase">Email</span>
                        </div>
                        <p className="text-lg font-bold text-foreground/80">{data.customerEmail}</p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Phone className="size-3.5" />
                            <span className="text-[10px] font-black uppercase">Điện thoại</span>
                        </div>
                        <p className={`text-lg font-black ${data.customerPhone ? 'text-foreground' : 'text-muted-foreground/40 italic'}`}>
                            {data.customerPhone ?? "Chưa cập nhật"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Danh sách địa chỉ */}
            <div className="space-y-6 mb-12">
                <div className="flex items-center justify-between px-4">
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Chọn địa chỉ nhận hàng</h3>
                    <button className="text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors">
                        + Thêm địa chỉ mới
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.customerAddresses.map(addr => {
                        const isSelected = selectedAddrId === addr.id
                        return (
                            <div
                                key={addr.id}
                                onClick={() => onSelectAddr(addr.id)}
                                className={`
                                    relative p-6 rounded-[2rem] cursor-pointer transition-all duration-500 border-2 overflow-hidden
                                    ${isSelected 
                                        ? "bg-primary/5 border-primary shadow-lg shadow-primary/10" 
                                        : "bg-background/50 border-border hover:border-primary/40 hover:bg-background/80"
                                    }
                                `}
                            >
                                {isSelected && (
                                    <div className="absolute top-0 right-0 bg-primary text-white p-2 rounded-bl-2xl">
                                        <ArrowRight className="size-4" />
                                    </div>
                                )}
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-2xl ${isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                                        <MapPin className="size-5" />
                                    </div>
                                    <div>
                                        <p className="font-black text-foreground mb-1">{addr.street}</p>
                                        <p className="text-xs font-bold text-muted-foreground leading-relaxed">
                                            {addr.city}, {addr.state}<br />
                                            {addr.zipCode}, {addr.country}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="glass border-white/20 rounded-[2.5rem] p-8 mb-12 shadow-xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="size-5 text-primary" />
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Tóm tắt sản phẩm</h3>
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground bg-muted/50 px-3 py-1 rounded-full uppercase tracking-widest">
                        {data.items.length} món
                    </span>
                </div>

                <div className="space-y-6">
                    {data.items.map((item) => (
                        <div
                            key={item.bookId}
                            className="flex items-center gap-6 p-4 rounded-3xl hover:bg-primary/5 transition-colors group"
                        >
                            <div className="relative size-20 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                                <img
                                    src={item.image}
                                    alt={item.bookName}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-1 right-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-1.5 py-0.5 rounded-lg">
                                    x{item.quantity}
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-black text-foreground truncate mb-1">
                                    {item.bookName}
                                </h4>
                                <p className="text-xs font-bold text-muted-foreground">
                                    {item.price.toLocaleString()}đ
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-lg font-black text-primary">
                                    {item.subtotal.toLocaleString()}đ
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                onClick={onNext}
                disabled={!selectedAddress}
                className="w-full h-16 rounded-[2rem] font-black text-white 
                bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground/40
                transition-all duration-500 shadow-2xl shadow-primary/30 active:scale-[0.98]
                flex items-center justify-center gap-3 text-lg uppercase tracking-widest"
            >
                Tiếp tục thanh toán
                <ArrowRight className="size-5" />
            </button>
        </div>
    )
}