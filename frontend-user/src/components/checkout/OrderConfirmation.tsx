import { CheckCircle2, Package, Home, ListOrdered, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Props {
    orderId: number
}

export default function OrderConfirmation({
    orderId,
}: Props) {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
            {/* Decorative background blobs */}
            <div className="absolute top-1/4 left-1/4 size-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 size-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
            
            <div className="glass rounded-[3.5rem] shadow-2xl p-12 max-w-lg w-full text-center relative z-10 border-white/20 animate-in zoom-in duration-700">
                <div className="relative size-32 mx-auto mb-8">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-ping" />
                    <div className="relative size-full bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40">
                        <CheckCircle2 className="size-16 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-2xl shadow-lg animate-bounce">
                        <Sparkles className="size-5 text-white" />
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full mb-6 border border-green-500/20">
                    Đặt hàng thành công
                </div>

                <h1 className="text-4xl font-black text-foreground mb-4 tracking-tighter">Tuyệt vời! 🎉</h1>
                <p className="text-muted-foreground font-bold text-lg mb-10 leading-relaxed italic">
                    Cảm ơn bạn đã tin tưởng Antigravity Books. Đơn hàng của bạn đã sẵn sàng để xử lý.
                </p>

                <div className="glass bg-card/40 rounded-[2.5rem] p-8 mb-10 text-left space-y-4 border-white/10 shadow-inner">
                    <div className="flex justify-between items-center group">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Mã đơn hàng</span>
                        <span className="text-lg font-black text-primary">#{orderId}</span>
                    </div>
                    <div className="h-[1px] w-full bg-black/5" />
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Trạng thái</span>
                        <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-black uppercase rounded-lg">Đang xử lý</span>
                    </div>
                    <div className="h-[1px] w-full bg-black/5" />
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Giao hàng dự kiến</span>
                        <span className="text-sm font-black text-foreground/80">3 – 5 ngày làm việc</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => navigate("/")}
                        className="flex-1 h-14 rounded-2xl font-black border-2 border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                    >
                        <Home className="size-4" />
                        Trang chủ
                    </button>
                    <button 
                        onClick={() => navigate("/profile?tab=orders")}
                        className="flex-1 h-14 rounded-2xl font-black text-white bg-primary hover:bg-primary/90 transition-all duration-500 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                    >
                        <ListOrdered className="size-4" />
                        Đơn hàng của tôi
                    </button>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50">
                    <Package className="size-3" />
                    Giao hàng an toàn và nhanh chóng
                </div>
            </div>
        </div>
    )
}