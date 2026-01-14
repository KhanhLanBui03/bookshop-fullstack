import { useState } from "react"
import CartItemList from "@/components/Cart/CartItemList"
import { Button } from "@/components/ui/button"
import { ShoppingBasket } from "lucide-react"

const CartPage = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Clean Code",
            price: 150000,
            quantity: 1,
            image: "/gia-kim.jpg",
        },
        {
            id: 2,
            name: "Thám tử lừng danh Conan",
            price: 150000,
            quantity: 2,
            image: "/connan.jpg",
        },
    ])

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center mb-8">
                <ShoppingBasket className="mb-4 w-14 h-14 text-blue-600" />
                <h1 className="text-4xl font-semibold text-center">
                    Giỏ hàng của tôi
                </h1>
            </div>

            <Button
                variant="outline"
                className="mb-4"
                onClick={() => setCartItems([])}
            >
                Fake empty cart
            </Button>

            <CartItemList items={cartItems} />
        </div>
    )
}

export default CartPage
