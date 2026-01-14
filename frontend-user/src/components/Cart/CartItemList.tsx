import { Button } from "@/components/ui/button"
import { Trash2, Minus, Plus } from "lucide-react"

type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface Props {
  items: CartItem[]
}

const CartItemList = ({ items }: Props) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <img
          src="/empty-cart.jpg"
          className="w-64 mb-6 opacity-80"
        />
        <h2 className="text-xl font-semibold mb-2">
          Giỏ hàng đang trống
        </h2>
        <p className="text-muted-foreground mb-6">
          Thêm sách để tiếp tục mua sắm 📚
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Tiếp tục mua sắm
        </Button>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* CART ITEMS */}
      <div className="lg:col-span-2 space-y-4">
        {items.map(item => (
          <div
            key={item.id}
            className="flex gap-4 rounded-xl border p-4 bg-background shadow-sm"
          >
            <img
              src={item.image}
              className="w-24 h-32 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.name}</h3>

              <div className="flex items-center gap-3 mt-3">
                <Button size="icon" variant="outline">
                  <Minus size={16} />
                </Button>
                <span>{item.quantity}</span>
                <Button size="icon" variant="outline">
                  <Plus size={16} />
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between">
              <p className="font-semibold text-lg">
                {(item.price * item.quantity).toLocaleString()} ₫
              </p>

              <Button size="icon" variant="ghost">
                <Trash2 className="text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY */}
      <div className="rounded-xl border p-6 h-fit bg-muted">
        <h3 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>

        <div className="flex justify-between mb-2">
          <span>Tạm tính</span>
          <span>550.000 ₫</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Phí vận chuyển</span>
          <span>20.000 ₫</span>
        </div>

        <hr className="my-3" />

        <div className="flex justify-between font-bold text-lg">
          <span>Tổng cộng</span>
          <span className="text-blue-600">570.000 ₫</span>
        </div>

        <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
          Thanh toán
        </Button>
      </div>
    </div>
  )
}

export default CartItemList
