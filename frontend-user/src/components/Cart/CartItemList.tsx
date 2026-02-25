import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useCartStore } from "@/store/cart.store"
import type { CartItem } from "@/types/Cart"
import { Trash2, Minus, Plus } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "sonner"



interface Props {
    items: CartItem[]
    selectedIds: number[]
    setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>
}

const CartItemList = ({ items, selectedIds, setSelectedIds }: Props) => {
    const updateQuantity = useCartStore(state => state.updateQuantity)
    const deleteCartItem = useCartStore(state => state.deleteCartItem)
    const handleIncrease = async (bookId: number, currentQty: number) => {
        await updateQuantity({
            bookId,
            quantity: currentQty + 1
        })
    }
   

    const handleDelete = async (cartItemId: number) => {
        await toast.promise(
            deleteCartItem(cartItemId),
            {
                loading: "Đang xóa sản phẩm...",
                success: "Đã xóa sản phẩm khỏi giỏ hàng",
                error: (err) => err?.message || "Xóa sản phẩm thất bại"
            },
            
        )
    }
           
      

    const handleDecrease = async (bookId: number, currentQty: number) => {
        if (currentQty <= 1) return
        await updateQuantity({
            bookId,
            quantity: currentQty - 1
        })
    }
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center py-20 text-center">
                <img src="/empty-cart.jpg" className="w-64 mb-6 opacity-80" />
                <h2 className="text-xl font-semibold mb-2">Giỏ hàng đang trống</h2>
                <p className="text-muted-foreground mb-6">
                    Thêm sách để tiếp tục mua sắm 📚
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Link to="/">Tiếp tục mua sắm</Link>
                </Button>
            </div>
        )
    }

    const toggleItem = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const totalPrice = items
        .filter(item => selectedIds.includes(item.bookId))
        .reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* ITEMS */}
            <div className="lg:col-span-2 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {items.map(item => (
                    <div
                        key={item.bookId}
                        className="flex gap-4 rounded-xl border p-4 bg-background shadow-sm"
                    >
                        <Checkbox
                            checked={selectedIds.includes(item.bookId)}
                            onCheckedChange={() => toggleItem(item.bookId)}
                        />

                        <img
                            src={item.image ?? "/placeholder.png"}
                            className="w-24 h-32 object-cover rounded-lg border"
                        />

                        <div className="flex-1">
                            <h3 className="font-semibold text-lg line-clamp-2">
                                {item.title}
                            </h3>

                            <div className="flex items-center gap-3 mt-4">
                                <Button onClick={()=> handleDecrease(item.bookId, item.quantity)} size="icon" variant="outline">
                                    <Minus size={16} />
                                </Button>
                                <span>{item.quantity}</span>
                                <Button onClick={()=> handleIncrease(item.bookId, item.quantity)} size="icon" variant="outline">
                                    <Plus size={16} />
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                            <p className="font-semibold text-lg text-blue-600">
                                {(item.price * item.quantity).toLocaleString()} ₫
                            </p>

                            <Button onClick={()=> handleDelete(item.bookId)} size="icon" variant="ghost">
                                <Trash2 className="text-red-500" size={18} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* SUMMARY */}
            <div className="rounded-2xl border bg-background p-6 shadow-md sticky top-24">
                <h3 className="text-lg font-semibold mb-6">
                    🧾 Tóm tắt đơn hàng
                </h3>

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Sản phẩm đã chọn
                        </span>
                        <span className="font-medium">
                            {selectedIds.length}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Tạm tính</span>
                        <span>
                            {totalPrice.toLocaleString()} ₫
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            Phí vận chuyển
                        </span>
                        <span className="text-green-600">Miễn phí</span>
                    </div>
                </div>

                <hr className="my-5" />

                <div className="flex justify-between items-center mb-6">
                    <span className="font-semibold text-lg">
                        Tổng cộng
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                        {totalPrice.toLocaleString()} ₫
                    </span>
                </div>

                <Button
                    disabled={selectedIds.length === 0}
                    className="
                        w-full h-12 text-base font-semibold
                        bg-blue-600 hover:bg-blue-700
                        disabled:bg-muted disabled:text-muted-foreground
                        disabled:cursor-not-allowed
                        "
                >
                    Thanh toán
                </Button>

                {selectedIds.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center mt-3">
                        Vui lòng chọn ít nhất 1 sản phẩm để thanh toán
                    </p>
                )}
            </div>
        </div>
    )
}

export default CartItemList
