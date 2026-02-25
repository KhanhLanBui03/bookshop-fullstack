import { create } from "zustand"
import type { CartResponse } from "@/types/Cart"
import { cartService } from "@/services/cart.service"

interface CartState {
  cart: CartResponse | null
  loading: boolean
  
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

  setCart: (cart) => set({ cart }),

  clearCart: () => set({ cart: null }),
}))