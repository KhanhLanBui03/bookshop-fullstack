import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { paymentApi } from "@/api/payment.api"  // ✅ dùng paymentApi thay vì axios trực tiếp

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
                const res = await paymentApi.verifyVnpay(params)  // ✅ gọi qua api layer
                const data = res.data.data as VerifyResult

                setResult(data)
                setStatus(data.success ? 'success' : 'failed')
            } catch {
                setStatus('failed')
            }
        }

        verify()
    }, []) // ✅ không cần searchParams trong deps vì chỉ cần đọc 1 lần khi mount

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                <p className="text-gray-600 text-lg">Đang xác nhận thanh toán...</p>
            </div>
        )
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
                    <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công! 🎉</h1>
                    <p className="text-gray-500 text-sm mb-6">
                        Đơn hàng{" "}
                        <span className="font-semibold text-blue-600">
                            #{result?.orderCode}
                        </span>{" "}
                        của bạn đã được xác nhận.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate("/")}
                            className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm"
                        >
                            Về trang chủ
                        </button>
                        <button
                            onClick={() => navigate("/orders")}
                            className="flex-1 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition text-sm"
                        >
                            Xem đơn hàng
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // status === 'failed'
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
                <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thất bại</h1>
                <p className="text-gray-500 text-sm mb-6">
                    Giao dịch không thành công hoặc đã bị huỷ. Vui lòng thử lại.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate("/")}
                        className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm"
                    >
                        Về trang chủ
                    </button>
                    <button
                        onClick={() => navigate("/checkout")}
                        className="flex-1 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition text-sm"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        </div>
    )
}