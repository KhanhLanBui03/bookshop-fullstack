import { create } from "zustand"
import type { CartResponse, UpdateCartItemRequest } from "@/types/Cart"
import { cartService } from "@/services/cart.service"

interface CartState {
  cart: CartResponse | null
  loading: boolean

  selectedCheckoutIds: number[]
  setSelectedCheckoutIds: (ids: number[]) => void
  clearSelectedCheckoutIds: () => void

  updateQuantity: (data: UpdateCartItemRequest) => Promise<void>
  deleteCartItem: (cartItemId: number) => Promise<void>
  fetchCart: () => Promise<void>
  setCart: (cart: CartResponse) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  loading: false,

  fetchCart: async () => {
    try {
      set({ loading: true })
      const data = await cartService.getCart()
      set({ cart: data })
    } catch (error) {
      console.error("Fetch cart failed", error)
    } finally {
      set({ loading: false })
    }
  },
  updateQuantity: async (data: UpdateCartItemRequest) => {
    const updatedCart = await cartService.updateCartItem(data)
    set({ cart: updatedCart })
  },
  deleteCartItem: async (cartItemId: number) => {
    const updatedCart = await cartService.removeCartItem(cartItemId)
    set({ cart: updatedCart })
  },
  setCart: (cart) => set({ cart }),

  clearCart: () => set({ cart: null }),
  selectedCheckoutIds: [],
  setSelectedCheckoutIds: (ids) => set({ selectedCheckoutIds: ids }),
  clearSelectedCheckoutIds: () => set({ selectedCheckoutIds: [] }),
}))