import { create } from "zustand"
import { wishlistService } from "@/services/wishlist.service"
import type { WishlistResponse } from "@/types/Wishlist"

interface WishlistState {
  wishlist: WishlistResponse | null
  loading: boolean
  fetchWishlist: () => Promise<void>
  addToWishlist: (bookId: number) => Promise<void>
  removeFromWishlist: (bookId: number) => Promise<void>
  isInWishlist: (bookId: number) => boolean
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlist: null,
  loading: false,

  fetchWishlist: async () => {
    try {
      set({ loading: true })
      const data = await wishlistService.getWishlist()
      set({ wishlist: data })
    } catch (error) {
      console.error("Fetch wishlist failed", error)
    } finally {
      set({ loading: false })
    }
  },

  addToWishlist: async (bookId: number) => {
    try {
      await wishlistService.addToWishlist(bookId)
      await get().fetchWishlist()
    } catch (error) {
      console.error("Add to wishlist failed", error)
    }
  },

  removeFromWishlist: async (bookId: number) => {
    try {
      await wishlistService.removeFromWishlist(bookId)
      await get().fetchWishlist()
    } catch (error) {
      console.error("Remove from wishlist failed", error)
    }
  },

  isInWishlist: (bookId: number) => {
    const { wishlist } = get()
    if (!wishlist || !wishlist.items) return false
    return wishlist.items.some(item => item.bookId === bookId)
  }
}))
