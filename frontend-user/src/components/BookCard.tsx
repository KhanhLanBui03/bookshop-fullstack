import { Button } from "./ui/button"
import {
    Card,
    CardTitle,
} from "./ui/card"
import { ShoppingBag, Heart, Star, Eye } from "lucide-react"
import type { BookCard as BookCardType } from "@/types/Book"
import { useNavigate } from "react-router-dom"
import { useCartStore } from "@/store/cart.store"
import { useWishlistStore } from "@/store/wishlist.store"
import { cartService } from "@/services/cart.service"
import { toast } from "sonner"

type Props = {
    book: BookCardType
}

const BookCard = ({ book }: Props) => {
    const setCart = useCartStore((state) => state.setCart)
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()
    const navigate = useNavigate();
    if (!book) return null

    const isFavorite = isInWishlist(book.id)

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isFavorite) {
            await removeFromWishlist(book.id)
            toast.success("Đã xóa khỏi danh sách yêu thích")
        } else {
            await addToWishlist(book.id)
            toast.success("Đã thêm vào danh sách yêu thích")
        }
    }
    
    const {
        title,
        salePrice,
        originalPrice,
        rating,
        soldCount,
        image,
        authorName
    } = book

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const updatedCart = await cartService.addToCart({
                bookId: book.id,
                quantity: 1,
            });
            setCart(updatedCart);
            toast.success("Đã thêm vào giỏ hàng!", {
                position: "top-right",
                className: "glass-dark border-primary/20 text-white"
            })
        } catch (error) {
            console.error("Add to cart failed", error);
        }
    };

    const hasDiscount = originalPrice && originalPrice > salePrice

    return (
        <Card 
            onClick={() => navigate(`/books/${book.id}`)}
            className="group relative flex flex-col h-full bg-[#0f172a]/40 backdrop-blur-3xl border border-white/5 hover:border-blue-500/30 transition-all duration-500 rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2"
        >
            {/* Discount Badge */}
            {hasDiscount && (
                <div className="absolute top-4 left-4 z-20 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg">
                    -{Math.round(((originalPrice! - salePrice) / originalPrice!) * 100)}%
                </div>
            )}

            {/* Favorite Button */}
            <button 
                onClick={handleWishlistToggle}
                className={`absolute top-4 right-4 z-20 p-2 rounded-xl transition-all active:scale-90 ${
                    isFavorite ? "text-red-500 bg-red-500/10" : "text-white/40 bg-white/5 hover:text-white hover:bg-white/10"
                }`}
            >
                <Heart className={`size-4 ${isFavorite ? "fill-red-500" : ""}`} />
            </button>

            {/* Image Container */}
            <div className="relative aspect-[3/4] m-2 rounded-[1.5rem] overflow-hidden bg-white flex items-center justify-center shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                <img
                    src={image || "/placeholder.png"}
                    alt={title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Quick Actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <Button 
                        size="icon" 
                        variant="secondary"
                        onClick={handleAddToCart}
                        className="rounded-full bg-white text-blue-600 hover:bg-blue-600 hover:text-white shadow-xl"
                    >
                        <ShoppingBag className="size-4" />
                    </Button>
                    <Button 
                        size="icon" 
                        variant="secondary"
                        className="rounded-full bg-white text-blue-600 hover:bg-blue-600 hover:text-white shadow-xl"
                    >
                        <Eye className="size-4" />
                    </Button>
                </div>
            </div>

            {/* Book Details */}
            <div className="p-5 flex flex-col flex-1">
                <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`size-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-white/10"}`} />
                            ))}
                        </div>
                        <span className="text-[11px] text-white/40 font-medium">{rating.toFixed(1)}</span>
                    </div>
                    
                    <CardTitle className="text-base font-bold text-white/90 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                        {title}
                    </CardTitle>
                    
                    <p className="text-[11px] text-white/40 font-medium truncate">
                        {authorName}
                    </p>
                </div>

                {/* Price & Action */}
                <div className="mt-5 space-y-3">
                    <div className="flex flex-col">
                        {hasDiscount && (
                            <span className="text-[10px] line-through text-white/20 font-medium">
                                {originalPrice!.toLocaleString()}₫
                            </span>
                        )}
                        <span className="text-xl font-bold text-white">
                            {salePrice.toLocaleString()}₫
                        </span>
                    </div>
                    
                    <Button 
                        onClick={handleAddToCart}
                        className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-all"
                    >
                        Mua ngay
                    </Button>
                </div>
                
                {/* Stats Footer */}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-white/30 font-medium uppercase tracking-tight">Đã bán {soldCount}+</span>
                    <div className="size-1.5 rounded-full bg-green-500/50" />
                </div>
            </div>
        </Card>
    )
}

export default BookCard
