import type { PaymentMethod } from "@/types/Checkout"
import { PAYMENT_METHOD } from "@/types/Order"
import { BanknoteIcon, TruckIcon } from "lucide-react"


interface Props {
    method: PaymentMethod
    setMethod: (val: PaymentMethod) => void
    onBack: () => void
    onNext: () => void
    total: number
}

export default function PaymentStep({
    method,
    setMethod,
    onBack,
    onNext,
    total,
}: Props) {
    return (
        <div className="animate-fadeIn">
            <h2 className="text-xl font-bold mb-6 text-gray-800">💳 Phương thức thanh toán</h2>

            <div className="space-y-3 mb-6">
                {[
                    {
                        id: PAYMENT_METHOD.COD,
                        label: "Thanh toán khi nhận hàng (COD)",
                        desc: "Trả tiền mặt khi nhận được hàng",
                        icon: <TruckIcon />,
                        color: "text-orange-500",
                    },
                    {
                        id: PAYMENT_METHOD.BANK,
                        label: "Chuyển khoản ngân hàng",
                        desc: "Chuyển khoản theo thông tin bên dưới",
                        icon: <BanknoteIcon />,
                        color: "text-blue-500",
                    },
                ].map(opt => (
                    <button
                        key={opt.id}
                        onClick={() => setMethod(opt.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${method === opt.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 bg-gray-50 hover:border-gray-300"
                            }`}
                    >
                        <span className={opt.color}>{opt.icon}</span>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm">{opt.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${method === opt.id ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}>
                            {method === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                    </button>
                ))}
            </div>

            {method === "BANK" && (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-6">

                    <p className="font-semibold text-blue-700 mb-5 text-base">
                        🏦 Thông tin chuyển khoản
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 items-start">

                        {/* LEFT: QR */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border text-center">
                            <img
                                src="/QR_Code.png"
                                alt="QR Code"
                                className="w-64 mx-auto"
                            />
                            <p className="text-sm text-gray-500 mt-3">
                                Quét mã để thanh toán
                            </p>
                        </div>

                        {/* RIGHT: Thông tin */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">

                            {[
                                ["Ngân hàng", "MB Bank"],
                                ["Chủ tài khoản", "BUI KHANH LAN"],
                                ["Số tài khoản", "0357804429"],
                                ["Số tiền", `${total.toLocaleString()} ₫`],
                                ["Nội dung", "DH" + Math.floor(Math.random() * 900000 + 100000)],
                            ].map(([label, value]) => (
                                <div key={label} className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">{label}</span>
                                    <span className="font-semibold text-gray-800">{value}</span>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>
            )}
            <div className="flex gap-3">
                <button onClick={onBack} className="flex-1 py-3.5 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition">
                    ← Quay lại
                </button>
                <button
                    disabled={!method}
                    onClick={onNext}
                    className="flex-1 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition"
                >
                    Xác nhận đặt hàng
                </button>
            </div>
        </div>
    )
}