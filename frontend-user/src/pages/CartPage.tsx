import { useEffect, useState } from "react"

import { ShoppingBasket } from "lucide-react"
import { useCartStore } from "@/store/cart.store"
import CartItemList from "@/components/Cart/CartItemList"

const CartPage = () => {
    const { cart, fetchCart } = useCartStore()
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    useEffect(() => {
        fetchCart()
    }, [])

    const cartItems = cart?.items ?? []

    const isAllSelected =
        cartItems.length > 0 &&
        selectedIds.length === cartItems.length

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([])
        } else {
            setSelectedIds(cartItems.map(item => item.id))
        }
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header Area */}
            <div className="glass border-b mb-12">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="size-20 bg-primary/10 rounded-3xl flex items-center justify-center shadow-inner">
                            <ShoppingBasket className="size-10 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-foreground">
                            Giỏ hàng <span className="text-primary">của tôi</span>
                        </h1>
                        <p className="text-muted-foreground font-medium max-w-md">
                            Kiểm tra lại các tác phẩm bạn đã chọn trước khi tiến hành thanh toán và sở hữu chúng.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <CartItemList
                    items={cartItems}
                    selectedIds={selectedIds}
                    setSelectedIds={setSelectedIds}
                />
            </div>
        </div>
    )
}

export default CartPage