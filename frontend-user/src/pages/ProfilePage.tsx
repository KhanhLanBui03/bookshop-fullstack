import AddressFormModal from "@/components/AddressFormModal"
import { useFetch } from "@/hooks/useFetch"
import { userService } from "@/services/user.service"
import { orderService } from "@/services/order.service"
import type { ProfileResponse } from "@/types/User"
import { useState } from "react"
import { toast } from "sonner"




export default function ProfilePage() {

    
    const { data: profile, loading } = useFetch<ProfileResponse>(() => userService.getProfile())
    const [isAddAddressOpen, setIsAddAddressOpen] = useState(false)

    const handleCancelOrder = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) return
        try {
            await orderService.cancelOrder(id)
            toast.success("Hủy đơn hàng thành công")
            window.location.reload()
        } catch (error) {
            toast.error("Không thể hủy đơn hàng")
            console.error(error)
        }
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100 text-amber-700'
            case 'PENDING_PAYMENT': return 'bg-orange-100 text-orange-700'
            case 'CONFIRMED': return 'bg-blue-100 text-blue-700'
            case 'SHIPPING': return 'bg-purple-100 text-purple-700'
            case 'DELIVERED': return 'bg-emerald-100 text-emerald-700'
            case 'CANCELLED': return 'bg-rose-100 text-rose-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Chờ duyệt'
            case 'PENDING_PAYMENT': return 'Chờ thanh toán'
            case 'CONFIRMED': return 'Đã xác nhận'
            case 'SHIPPING': return 'Đang giao'
            case 'DELIVERED': return 'Đã giao'
            case 'CANCELLED': return 'Đã hủy'
            default: return status
        }
    }
    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6 space-y-8">
                <div>
                    <div className="h-6 w-40 bg-gray-300 rounded-full mb-4"></div>
                    <div className="h-10 w-64 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 w-96 bg-gray-300 rounded"></div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                    <div className="h-5 w-1/4 bg-gray-300 rounded mb-2"></div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <div className="h-4 w-full bg-gray-300 rounded mb-1"></div>
                            <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
                        </div>
                        <div>
                            <div className="h-4 w-full bg-gray-300 rounded mb-1"></div>
                            <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
                        </div>
                        <div>
                            <div className="h-4 w-full bg-gray-300 rounded mb-1"></div>
                            <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
                        </div>
                        <div>
                            <div className="h-4 w-full bg-gray-300 rounded mb-1"></div>
                            <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                    <div className="h-8 w-32 bg-blue-600 rounded-lg mt-4"></div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="h-5 w-1/4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-8 w-32 bg-green-600 rounded-lg"></div>
                    </div>
                    <div className="space-y-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="border rounded-xl p-4">
                                <div className="h-4 w-full bg-gray-300 rounded mb-1"></div>
                                <div className="h-4 w-5/6 bg-gray-300 rounded mb-1"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
            
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">

            {/* HEADER */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">
                    👤 Hồ sơ cá nhân
                </h1>
                <p className="text-gray-500 mt-1">
                    Quản lý thông tin tài khoản và địa chỉ của bạn
                </p>
            </div>

            {/* PROFILE INFO */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">
                    Thông tin cá nhân
                </h2>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Email</p>
                        <p className="font-medium text-gray-800">
                            {profile?.email}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Họ tên</p>
                        <p className="font-medium text-gray-800">
                            {profile?.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Số điện thoại</p>
                        <p className="font-medium text-gray-800">
                            {profile?.phone}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500">Ngày tạo tài khoản</p>
                        <p className="font-medium text-gray-800">
                            {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN') : 'Không có dữ liệu'}
                        </p>
                    </div>
                </div>

                <button className="mt-4 px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                    ✏️ Chỉnh sửa thông tin
                </button>
            </div>

            {/* ADDRESS SECTION */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">
                        📦 Địa chỉ giao hàng
                    </h2>

                    <button
                        onClick={() => setIsAddAddressOpen(true)}
                        className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                    >
                        + Thêm địa chỉ
                    </button>
                </div>

                <div className="space-y-4">
                    {profile?.addresses.map(addr => (
                        <div
                            key={addr.id}
                            className="border rounded-xl p-4 hover:shadow-sm transition"
                        >
                            <p className="text-gray-800 font-medium">
                                {addr.street}
                            </p>

                            <p className="text-gray-500 text-sm mt-1">
                                {addr.city}, {addr.state}
                            </p>

                            <p className="text-gray-400 text-sm">
                                {addr.zipCode}, {addr.country}
                            </p>

                            <div className="flex gap-3 mt-3">
                                <button className="text-sm text-blue-600 hover:underline">
                                    Sửa
                                </button>

                                <button className="text-sm text-red-500 hover:underline">
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* ORDER HISTORY */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    🧾 Lịch sử đơn hàng
                </h2>

                {profile?.orders && profile?.orders.length === 0 && (
                    <p className="text-gray-500 text-sm">
                        Bạn chưa có đơn hàng nào
                    </p>
                )}

                <div className="space-y-4">
                    {profile?.orders?.map(order => (
                        <div
                            key={order.id}
                            className="border rounded-xl p-4 hover:shadow-sm transition"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        Mã đơn: {order.orderCode}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="font-medium text-gray-800">
                                        {order.totalAmount.toLocaleString()} đ
                                    </p>
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${getStatusStyle(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-3">
                                <button className="text-sm text-blue-600 hover:underline">
                                    Xem chi tiết
                                </button>

                                {(order.status === 'PENDING' || order.status === 'PENDING_PAYMENT') && (
                                    <button
                                        onClick={() => handleCancelOrder(order.id)}
                                        className="text-sm text-red-500 hover:underline"
                                    >
                                        Hủy đơn
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isAddAddressOpen && (
                <AddressFormModal
                    onClose={() => setIsAddAddressOpen(false)}
                    onSuccess={() => window.location.reload()}
                />
            )}
        </div>
    )
}