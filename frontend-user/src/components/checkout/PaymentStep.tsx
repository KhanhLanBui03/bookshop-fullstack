import type { PaymentMethod } from "@/types/Order"
import { PAYMENT_METHOD } from "@/types/Order"
import { BanknoteIcon, TruckIcon, CreditCardIcon, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react"

interface Props {
    method: PaymentMethod | null
    setMethod: (val: PaymentMethod) => void
    onBack: () => void
    onNext: () => void
    total: number
}

export default function PaymentStep({ method, setMethod, onBack, onNext, total }: Props) {
    const methods = [
        {
            id: PAYMENT_METHOD.COD,
            label: "Thanh toán khi nhận hàng",
            short: "COD",
            desc: "Trả tiền mặt khi nhận được hàng tận nơi",
            icon: <TruckIcon className="size-6" />,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
        },
        {
            id: PAYMENT_METHOD.VNPAY,
            label: "Thanh toán VNPay",
            short: "VNPAY",
            desc: "Thẻ ATM, Visa, Mastercard hoặc QR Code",
            icon: <CreditCardIcon className="size-6" />,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            id: PAYMENT_METHOD.BANK,
            label: "Chuyển khoản ngân hàng",
            short: "BANK",
            desc: "Chuyển khoản trực tiếp qua ứng dụng ngân hàng",
            icon: <BanknoteIcon className="size-6" />,
            color: "text-green-500",
            bg: "bg-green-500/10",
        },
    ]

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <CreditCardIcon className="size-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Phương thức thanh toán</h2>
                    <p className="text-sm text-muted-foreground font-bold italic">Chọn cách thức thanh toán tiện lợi nhất cho bạn</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-8">
                {methods.map(opt => {
                    const isSelected = method === opt.id
                    return (
                        <button
                            key={opt.id}
                            onClick={() => setMethod(opt.id)}
                            className={`
                                relative flex items-center gap-6 p-6 rounded-[2.5rem] border-2 text-left transition-all duration-500 group
                                ${isSelected 
                                    ? "bg-primary/5 border-primary shadow-xl shadow-primary/10" 
                                    : "bg-background border-border hover:border-primary/40"
                                }
                            `}
                        >
                            <div className={`
                                size-16 rounded-2xl flex items-center justify-center transition-all duration-500
                                ${isSelected ? "bg-primary text-white" : `${opt.bg} ${opt.color}`}
                            `}>
                                {opt.icon}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{opt.short}</span>
                                    <h3 className="font-black text-foreground">{opt.label}</h3>
                                </div>
                                <p className="text-xs font-bold text-muted-foreground">{opt.desc}</p>
                            </div>

                            <div className={`
                                size-6 rounded-full border-2 flex items-center justify-center transition-all duration-500
                                ${isSelected ? "border-primary bg-primary" : "border-muted"}
                            `}>
                                {isSelected && <div className="size-2 rounded-full bg-white animate-in zoom-in duration-300" />}
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* VNPAY Detail */}
            {method === PAYMENT_METHOD.VNPAY && (
                <div className="glass border-blue-500/20 rounded-[2rem] p-6 mb-8 flex items-start gap-4 animate-in slide-in-from-top-2 duration-500 bg-blue-500/5">
                    <div className="p-3 bg-blue-500/10 rounded-2xl">
                        <ShieldCheck className="size-6 text-blue-500" />
                    </div>
                    <div className="space-y-1">
                        <p className="font-black text-blue-700 text-sm uppercase tracking-wider">Thanh toán an toàn</p>
                        <p className="text-xs font-bold text-blue-600/80 leading-relaxed">
                            Bạn sẽ được chuyển đến cổng thanh toán VNPay chính thức để thực hiện giao dịch một cách an toàn và bảo mật nhất.
                        </p>
                    </div>
                </div>
            )}

            {/* BANK Detail */}
            {method === PAYMENT_METHOD.BANK && (
                <div className="glass border-green-500/20 rounded-[3rem] p-8 mb-8 animate-in slide-in-from-top-2 duration-500 bg-green-500/5">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="size-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                            <BanknoteIcon className="size-5 text-green-500" />
                        </div>
                        <h3 className="text-sm font-black text-green-700 uppercase tracking-widest">Thông tin chuyển khoản</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-green-500/10 blur-3xl rounded-full scale-75 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl border border-green-500/10 text-center">
                                <img src="/QR_Code.png" alt="QR Code" className="w-56 mx-auto mb-4" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quét mã để thanh toán nhanh</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: "Ngân hàng", value: "MB Bank" },
                                { label: "Chủ tài khoản", value: "BUI KHANH LAN" },
                                { label: "Số tài khoản", value: "0357804429" },
                                { label: "Số tiền", value: `${total.toLocaleString()} ₫` },
                                { label: "Nội dung", value: "DH" + Math.floor(Math.random() * 900000 + 100000) },
                            ].map((item) => (
                                <div key={item.label} className="group">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{item.label}</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-black text-foreground">{item.value}</p>
                                        <button className="text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity uppercase">Sao chép</button>
                                    </div>
                                    <div className="h-[1px] w-full bg-border mt-2 group-last:hidden" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-4">
                <button 
                    onClick={onBack} 
                    className="flex-1 h-14 rounded-2xl font-black border-2 border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                    <ArrowLeft className="size-4" />
                    Quay lại
                </button>
                <button
                    disabled={!method}
                    onClick={onNext}
                    className="flex-[2] h-14 rounded-2xl font-black text-white bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground/40 transition-all duration-500 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                    Tiếp tục xác nhận
                    <ArrowRight className="size-4" />
                </button>
            </div>
        </div>
    )
}