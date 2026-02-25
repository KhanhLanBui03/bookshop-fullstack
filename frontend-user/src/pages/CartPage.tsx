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
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center mb-8">
                <ShoppingBasket className="mb-4 w-14 h-14 text-blue-600" />
                <h1 className="text-4xl font-semibold text-center">
                    Giỏ hàng của tôi
                </h1>
            </div>

            <CartItemList
                items={cartItems}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
            />
        </div>
    )
}

export default CartPage