import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useCartStore } from "@/store/cart.store"
import type { CartItem } from "@/types/Cart"
import { Trash2, Minus, Plus, ShoppingBasket } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"



interface Props {
    items: CartItem[]
    selectedIds: number[]
    setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>
}

const CartItemList = ({ items, selectedIds, setSelectedIds }: Props) => {
    console.log("items:", items)
    const navigate = useNavigate()
    const setSelectedCheckoutIds = useCartStore(state => state.setSelectedCheckoutIds)
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
            <div className="flex flex-col items-center py-32 text-center glass rounded-[3rem] border-white/20 shadow-xl">
                <div className="size-32 bg-primary/5 rounded-full flex items-center justify-center mb-8">
                    <ShoppingBasket className="size-16 text-primary opacity-20" />
                </div>
                <h2 className="text-3xl font-black text-foreground mb-3">Giỏ hàng đang trống</h2>
                <p className="text-muted-foreground font-medium mb-10 max-w-sm mx-auto">
                    Có vẻ như bạn chưa chọn được cuốn sách nào ưng ý. Hãy tiếp tục khám phá thư viện của chúng tôi nhé!
                </p>
                <Button size="lg" className="rounded-2xl font-black px-10 h-14 shadow-lg shadow-primary/20" asChild>
                    <Link to="/">Khám phá ngay</Link>
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
        .filter(item => selectedIds.includes(item.cartItemId))
        .reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <div className="grid lg:grid-cols-3 gap-10">
            {/* ITEMS */}
            <div className="lg:col-span-2 space-y-6">
                {items.map(item => (
                    <div
                        key={item.cartItemId}
                        className="flex flex-col sm:flex-row gap-6 glass rounded-3xl p-6 border-white/10 hover:border-primary/30 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-4 left-4 z-10">
                            <Checkbox
                                checked={selectedIds.includes(item.cartItemId)}
                                onCheckedChange={() => toggleItem(item.cartItemId)}
                                className="size-6 rounded-lg border-2 border-primary/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                        </div>

                        <div className="size-32 sm:size-40 bg-white/50 rounded-2xl overflow-hidden flex-shrink-0 border border-white/20 group-hover:scale-105 transition-transform duration-500">
                            <img
                                src={item.image ?? "/placeholder.png"}
                                className="w-full h-full object-contain p-2"
                            />
                        </div>

                        <div className="flex-1 flex flex-col justify-between py-2">
                            <div>
                                <h3 className="font-black text-xl line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>
                                <div className="flex items-center gap-3 mt-4">
                                    <div className="flex items-center glass-dark p-1 rounded-xl border-white/10">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleDecrease(item.bookId, item.quantity)}
                                            className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                                        >
                                            <Minus size={14} />
                                        </Button>
                                        <span className="w-10 text-center font-black text-sm">{item.quantity}</span>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => handleIncrease(item.bookId, item.quantity)}
                                            className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                                        >
                                            <Plus size={14} />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                                <p className="font-black text-xl text-primary">
                                    {(item.price * item.quantity).toLocaleString()} ₫
                                </p>
                                <Button
                                    onClick={() => handleDelete(item.cartItemId)}
                                    size="icon"
                                    variant="ghost"
                                    className="size-10 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
                                >
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* SUMMARY */}
            <div className="lg:col-span-1">
                <div className="glass rounded-[2.5rem] p-8 shadow-2xl border-white/20 sticky top-24 space-y-8">
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-foreground uppercase tracking-widest">
                            Tóm tắt <span className="text-primary">đơn hàng</span>
                        </h3>
                        <div className="h-1 w-12 bg-primary rounded-full" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Sản phẩm đã chọn</span>
                            <span className="font-black text-foreground bg-primary/10 px-3 py-1 rounded-lg">
                                {selectedIds.length}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Tạm tính</span>
                            <span className="font-bold text-foreground">
                                {totalPrice.toLocaleString()} ₫
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Phí vận chuyển</span>
                            <span className="text-xs font-black text-green-500 uppercase tracking-widest">Miễn phí</span>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-border/50" />

                    <div className="flex justify-between items-end">
                        <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Tổng cộng</span>
                        <div className="text-right">
                            <p className="text-3xl font-black text-primary leading-none">
                                {totalPrice.toLocaleString()} ₫
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase">Đã bao gồm VAT</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button
                            size="lg"
                            onClick={() => {
                                setSelectedCheckoutIds(selectedIds)
                                navigate("/checkout")
                            }}
                            disabled={selectedIds.length === 0}
                            className="w-full h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Thanh toán ngay
                        </Button>

                        {selectedIds.length === 0 ? (
                            <p className="text-[10px] text-destructive text-center font-bold uppercase tracking-widest animate-pulse">
                                Chọn sản phẩm để tiếp tục
                            </p>
                        ) : (
                            <p className="text-[10px] text-muted-foreground text-center font-bold uppercase tracking-widest">
                                Đảm bảo thông tin chính xác
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartItemList
