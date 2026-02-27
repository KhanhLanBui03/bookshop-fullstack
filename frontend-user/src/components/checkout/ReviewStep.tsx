import { PAYMENT_METHOD, type PaymentMethod } from "@/types/Order"
import type { AddressResponse } from "@/types/Address"
import type { CheckoutItemResponse } from "@/types/Checkout"



interface Props {
    shipping: AddressResponse
    method: PaymentMethod
    items: CheckoutItemResponse[]
    total: number
    onBack: () => void
    onPlaceOrder: () => void
}

export default function ReviewStep({
    shipping,
    method,
    items,
    total,
    onBack,
    onPlaceOrder,
}: Props) {

    const formatCurrency = (value: number) =>
        value.toLocaleString("vi-VN") + " ₫"

    const fullAddress = `${shipping.street}, ${shipping.city}, ${shipping.state}, ${shipping.zipCode}, ${shipping.country}`

    return (
        <div className="animate-fadeIn">

            <h2 className="text-xl font-bold mb-6 text-gray-800">
                🧾 Xác nhận đơn hàng
            </h2>

            <div className="space-y-4 mb-6">

                {/* SHIPPING */}
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <p className="font-semibold text-sm text-gray-700 mb-3">
                        📦 Địa chỉ giao hàng
                    </p>

                    <p className="text-sm text-gray-700">
                        {fullAddress}
                    </p>
                </div>

                {/* PAYMENT */}
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <p className="font-semibold text-sm text-gray-700 mb-3">
                        💳 Phương thức thanh toán
                    </p>

                    <p className="text-sm text-gray-700">
                        {method === PAYMENT_METHOD.COD
                            ? "💵 Thanh toán khi nhận hàng (COD)"
                            : "🏦 Chuyển khoản ngân hàng"}
                    </p>
                </div>

                {/* ITEMS */}
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <p className="font-semibold text-sm text-gray-700 mb-3">
                        📚 Sản phẩm ({items.length})
                    </p>

                    <div className="space-y-3">
                        {items.map(item => (
                            <div
                                key={item.bookId}
                                className="flex justify-between text-sm"
                            >
                                <span className="text-gray-700 flex-1">
                                    {item.bookName}
                                    <span className="text-gray-400 ml-1">
                                        x{item.quantity}
                                    </span>
                                </span>

                                <span className="font-medium text-gray-800 ml-4">
                                    {formatCurrency(item.price * item.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                        <span>Tổng cộng</span>
                        <span className="text-blue-600 text-lg">
                            {formatCurrency(total)}
                        </span>
                    </div>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
                <button
                    onClick={onBack}
                    className="flex-1 py-3.5 rounded-xl font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                >
                    ← Quay lại
                </button>

                <button
                    onClick={onPlaceOrder}
                    className="flex-1 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                    🛍️ Đặt hàng ngay
                </button>
            </div>
        </div>
    )
}