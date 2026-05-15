import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { CheckCircle2, XCircle, Loader2, Home, ListOrdered, RefreshCw } from "lucide-react"
import { paymentApi } from "@/api/payment.api"
import { Button } from "@/components/ui/button"

interface VerifyResult {
    success: boolean
    orderId: number
    orderCode: string
}

export default function VnpayReturnPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
    const [result, setResult] = useState<VerifyResult | null>(null)

    useEffect(() => {
        const verify = async () => {
            try {
                const params = Object.fromEntries(searchParams.entries())
                const res = await paymentApi.verifyVnpay(params)
                const data = res.data.data as VerifyResult

                if (data.success) {
                    const { useCartStore } = await import("@/store/cart.store")
                    useCartStore.getState().fetchCart()
                }

                setResult(data)
                setStatus(data.success ? 'success' : 'failed')
            } catch {
                setStatus('failed')
            }
        }

        verify()
    }, [])

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full scale-150 animate-pulse" />
                <div className="relative">
                    <div className="size-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <Loader2 className="absolute inset-0 m-auto size-10 text-primary animate-pulse" />
                </div>
                <div className="space-y-3 text-center relative z-10">
                    <p className="text-2xl font-black text-foreground uppercase tracking-[0.4em] animate-pulse">Đang xác nhận</p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest italic opacity-60">Vui lòng không tắt trình duyệt...</p>
                </div>
            </div>
        )
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4 overflow-hidden relative">
                <div className="absolute top-1/4 left-1/4 size-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 size-96 bg-cyan-400/10 rounded-full blur-[120px] animate-pulse delay-700" />
                
                <div className="glass rounded-[3.5rem] shadow-2xl p-12 max-w-lg w-full text-center relative z-10 border-white/20 animate-in zoom-in duration-700">
                    <div className="relative size-32 mx-auto mb-8">
                        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-ping" />
                        <div className="relative size-full bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40">
                            <CheckCircle2 className="size-16 text-white" />
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full mb-6 border border-green-500/20">
                        Thanh toán thành công
                    </div>

                    <h1 className="text-4xl font-black text-foreground mb-4 tracking-tighter">Cảm ơn bạn! 🎉</h1>
                    <p className="text-muted-foreground font-bold text-lg mb-10 leading-relaxed italic">
                        Đơn hàng <span className="text-primary font-black">#{result?.orderCode}</span> đã được xác nhận. Chúng tôi sẽ sớm chuyển sách đến bạn!
                    </p>

                    <div className="flex flex-col gap-4">
                        <Button
                            size="lg"
                            onClick={() => navigate("/profile?tab=orders")}
                            className="w-full h-16 rounded-[2rem] font-black bg-primary hover:bg-primary/90 transition-all duration-500 shadow-xl shadow-primary/20 flex items-center justify-center gap-3 text-lg uppercase tracking-widest"
                        >
                            <ListOrdered className="size-5" />
                            Chi tiết đơn hàng
                        </Button>
                        <Button
                            variant="ghost"
                            size="lg"
                            onClick={() => navigate("/")}
                            className="w-full h-14 rounded-2xl font-black text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                        >
                            <Home className="size-4" />
                            Tiếp tục mua sắm
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
             <div className="absolute top-1/4 right-1/4 size-96 bg-destructive/10 rounded-full blur-[120px] animate-pulse" />
             
            <div className="glass rounded-[3.5rem] shadow-2xl p-12 max-w-lg w-full text-center relative z-10 border-white/20 animate-in zoom-in duration-700">
                <div className="relative size-32 mx-auto mb-8">
                    <div className="absolute inset-0 bg-destructive/20 rounded-full blur-2xl animate-ping" />
                    <div className="relative size-full bg-destructive rounded-full flex items-center justify-center shadow-2xl shadow-destructive/40">
                        <XCircle className="size-16 text-white" />
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full mb-6 border border-destructive/20">
                    Giao dịch thất bại
                </div>

                <h1 className="text-4xl font-black text-foreground mb-4 tracking-tighter">Rất tiếc! ⚠️</h1>
                <p className="text-muted-foreground font-bold text-lg mb-10 leading-relaxed italic">
                    Giao dịch của bạn đã bị từ chối hoặc bị huỷ. Đừng lo lắng, tiền của bạn vẫn an toàn.
                </p>

                <div className="flex flex-col gap-4">
                    <Button
                        size="lg"
                        onClick={() => navigate("/checkout")}
                        className="w-full h-16 rounded-[2rem] font-black bg-destructive hover:bg-destructive/90 transition-all duration-500 shadow-xl shadow-destructive/20 flex items-center justify-center gap-3 text-lg uppercase tracking-widest"
                    >
                        <RefreshCw className="size-5" />
                        Thanh toán lại
                    </Button>
                    <Button
                        variant="ghost"
                        size="lg"
                        onClick={() => navigate("/")}
                        className="w-full h-14 rounded-2xl font-black text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                    >
                        <Home className="size-4" />
                        Quay lại trang chủ
                    </Button>
                </div>
            </div>
        </div>
    )
}