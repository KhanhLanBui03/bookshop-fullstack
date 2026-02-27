import type { CheckoutResponse } from "@/types/Checkout"

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
    console.log("checkout data:", data)
    const selectedAddress =
        data.customerAddresses.find(a => a.id === selectedAddrId) ||
        data.customerAddresses[0];

    return (
        <div className="animate-fadeIn">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
                📦 Thông tin giao hàng
            </h2>

            {/* Thông tin khách hàng */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mb-8 transition-all hover:shadow-md">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Thông tin khách hàng</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Họ tên */}
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Họ tên</p>
                            <p className="text-gray-800 font-semibold text-lg">{data.customerName}</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Email liên hệ</p>
                            <p className="text-gray-800 font-medium">{data.customerEmail}</p>
                        </div>
                    </div>

                    {/* Số điện thoại */}
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Số điện thoại</p>
                            <p className={`font-medium ${data.customerPhone ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                                {data.customerPhone ?? "Chưa cập nhật"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách địa chỉ */}
            <div className="space-y-3 mb-6">
                <h3 className="font-semibold">Chọn địa chỉ giao hàng</h3>

                {data.customerAddresses.map(addr => (
                    <div
                        key={addr.id}
                        onClick={() => onSelectAddr(addr.id)}
                        className={`p-4 border rounded-xl cursor-pointer transition 
                        ${selectedAddress?.id === addr.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 bg-white"
                            }`}
                    >
                        <p className="font-medium">{addr.street}</p>
                        <p className="text-sm text-gray-600">
                            {addr.city}, {addr.state}
                        </p>
                        <p className="text-sm text-gray-600">
                            {addr.zipCode}, {addr.country}
                        </p>
                    </div>
                ))}
            </div>
            {/* Danh sách sản phẩm */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                        <span className="p-2 bg-orange-50 rounded-lg">🛒</span>
                        Sản phẩm đặt mua
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {data.items.length} sản phẩm
                    </span>
                </div>

                <div className="divide-y divide-gray-100">
                    {data.items.map((item) => (
                        <div
                            key={item.bookId}
                            className="flex items-center gap-4 py-5 first:pt-0 last:pb-0 group"
                        >
                            {/* Ảnh sản phẩm với hiệu ứng zoom nhẹ */}
                            <div className="relative overflow-hidden rounded-xl border border-gray-100 flex-shrink-0">
                                <img
                                    src={item.image}
                                    alt={item.bookName}
                                    className="w-20 h-28 object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            {/* Thông tin sản phẩm */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate mb-1 text-lg">
                                    {item.bookName}
                                </h4>
                                <div className="flex flex-col gap-1">
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <span className="w-20">Đơn giá:</span>
                                        <span className="font-medium text-gray-700">{item.price.toLocaleString()}đ</span>
                                    </p>
                                    <p className="text-sm text-gray-500 flex items-center">
                                        <span className="w-20">Số lượng:</span>
                                        <span className="inline-flex items-center justify-center px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-bold text-xs">
                                            x{item.quantity}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Thành tiền */}
                            <div className="text-right ml-4">
                                <p className="text-xs text-gray-400 uppercase tracking-tighter">Thành tiền</p>
                                <p className="font-bold text-blue-600 text-lg">
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
                className="w-full py-3.5 rounded-xl font-semibold text-white 
                bg-blue-600 hover:bg-blue-700 
                disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
                Xác nhận →
            </button>
        </div>
    )
}