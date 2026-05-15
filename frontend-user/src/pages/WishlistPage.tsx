import { useEffect } from "react"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { useWishlistStore } from "@/store/wishlist.store"
import { useCartStore } from "@/store/cart.store"
import { Link } from "react-router-dom"
import { cartService } from "@/services/cart.service"
import { toast } from "sonner"

const WishlistPage = () => {
    const { wishlist, loading, fetchWishlist, removeFromWishlist } = useWishlistStore()
    const { fetchCart } = useCartStore()

    useEffect(() => {
        fetchWishlist()
    }, [])

    const handleAddToCart = async (bookId: number) => {
        try {
            await cartService.addToCart({ bookId, quantity: 1 })
            fetchCart()
            toast.success("Đã thêm vào giỏ hàng")
        } catch (error) {
            toast.error("Thêm vào giỏ hàng thất bại")
        }
    }

    const items = wishlist?.items ?? []

    if (loading && items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header Area */}
            <div className="glass border-b mb-12">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex flex-col items-center text-center gap-4">
                        <div className="size-20 bg-primary/10 rounded-3xl flex items-center justify-center shadow-inner">
                            <Heart className="size-10 text-primary fill-primary/20" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-foreground">
                            Danh sách <span className="text-primary">yêu thích</span>
                        </h1>
                        <p className="text-muted-foreground font-medium max-w-md">
                            Lưu giữ những tác phẩm bạn yêu thích để dễ dàng tìm lại và sở hữu chúng sau này.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-6">
                        <div className="bg-muted size-32 rounded-full flex items-center justify-center">
                            <Heart className="size-16 text-muted-foreground" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold">Danh sách yêu thích trống</h3>
                            <p className="text-muted-foreground">Bạn chưa thêm cuốn sách nào vào danh sách yêu thích.</p>
                        </div>
                        <Link to="/books" className="btn btn-primary px-8">
                            Khám phá ngay
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => (
                            <div key={item.id} className="group relative bg-card border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                                <div className="aspect-[3/4] overflow-hidden">
                                    <img 
                                        src={item.bookImage || "/placeholder-book.jpg"} 
                                        alt={item.bookTitle}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold line-clamp-1 mb-2">
                                        <Link to={`/books/${item.bookId}`} className="hover:text-primary transition-colors">
                                            {item.bookTitle}
                                        </Link>
                                    </h3>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-xl font-black text-primary">
                                            {item.salePrice.toLocaleString('vi-VN')}đ
                                        </span>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => removeFromWishlist(item.bookId)}
                                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                title="Xóa khỏi wishlist"
                                            >
                                                <Trash2 className="size-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleAddToCart(item.bookId)}
                                                className="p-2 bg-primary text-primary-foreground rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all"
                                                title="Thêm vào giỏ hàng"
                                            >
                                                <ShoppingCart className="size-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default WishlistPage
