import { CheckIcon, PackageIcon } from "lucide-react"

interface Props {
    orderId: number
    onBackHome: () => void
}

export default function OrderConfirmation({
    orderId,
    onBackHome,
}: Props) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center animate-popIn">
                <div className="flex justify-center text-blue-500 mb-6">
                    <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center">
                        <PackageIcon />
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                    <CheckIcon /> Đặt hàng thành công!
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-2">Cảm ơn bạn đã đặt hàng 🎉</h1>
                <p className="text-gray-500 text-sm mb-6">
                    Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ liên hệ sớm nhất có thể.
                </p>

                <div className="bg-blue-50 rounded-2xl p-5 mb-6 text-left space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Mã đơn hàng</span>
                        <span className="font-bold text-blue-600">#{orderId}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Trạng thái</span>
                        <span className="font-medium text-orange-500">Đang xử lý</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Thời gian giao dự kiến</span>
                        <span className="font-medium text-gray-700">3–5 ngày làm việc</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onBackHome}
                        className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-sm"
                    >
                        Về trang chủ
                    </button>
                    <button className="flex-1 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition text-sm">
                        Xem đơn hàng
                    </button>
                </div>
            </div>
        </div>
    )
}