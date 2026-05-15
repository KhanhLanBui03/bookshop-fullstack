import { useState } from 'react';
import { Star, ChevronRight } from 'lucide-react';
import ImageGallery from '@/components/BookDetail/ImageGallery';
import PriceSection from '@/components/BookDetail/PriceSection';
import BookInfo from '@/components/BookDetail/BookInfo';
import ActionButtons from '@/components/BookDetail/ActionButtons';

import BookCard from '@/components/BookCard';
import { useParams, useNavigate } from 'react-router-dom';
import type { BookCard as BookCardType, BookDetail } from '@/types/Book';
import { bookService } from '@/services/book.service';
import { useFetch } from '@/hooks/useFetch';
import ReviewSection from '@/components/Review/ReviewSection';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart.store';
import { useWishlistStore } from '@/store/wishlist.store';
import { toast } from 'sonner';
import { cartService } from '@/services/cart.service';
import { useSEO } from '@/hooks/useSEO';

const BookDetailPage = () => {
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const bookId = Number(id);

    const { fetchCart } = useCartStore()
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()
    const isFavorite = isInWishlist(bookId)

    const { data: book, loading } = useFetch<BookDetail>(() => bookService.getBookById(bookId));
    const { data: relatedBooks } = useFetch<BookCardType[]>(
        () => bookService.getRelatedBooks(bookId),
        [id]
    );

    useSEO({
        title: book?.title,
        description: book?.description?.slice(0, 160),
        image: book?.images[0],
        keywords: `${book?.title}, ${book?.authorName}, ${book?.categoryName}, mua sách online`
    })

    const handleAddToCart = async () => {
        try {
            await cartService.addToCart({ bookId, quantity })
            fetchCart()
            toast.success(`Đã thêm ${quantity} cuốn sách vào giỏ hàng!`)
        } catch (error) {
            toast.error("Thêm vào giỏ hàng thất bại")
        }
    };

    const handleWishlistToggle = async () => {
        if (isFavorite) {
            await removeFromWishlist(bookId)
            toast.success("Đã xóa khỏi danh sách yêu thích")
        } else {
            await addToWishlist(bookId)
            toast.success("Đã thêm vào danh sách yêu thích")
        }
    }

    if (loading) {
        return (
            <div className="w-full bg-background min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Đang tải tri thức...</div>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="w-full bg-background min-h-screen flex items-center justify-center">
                <div className="glass p-12 rounded-3xl text-center max-w-md">
                    <div className="text-4xl mb-4">📚</div>
                    <div className="text-xl font-black text-foreground">Không tìm thấy sách</div>
                    <p className="text-muted-foreground mt-2">Cuốn sách bạn tìm kiếm hiện không có trong thư viện.</p>
                    <Button onClick={() => navigate("/")} className="mt-6 rounded-xl font-bold">Quay lại trang chủ</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-background min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">

                {/* ── Product Section ── */}
                <div className="glass rounded-[3rem] p-8 md:p-12 shadow-2xl border-white/20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Left — Image Gallery */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary/5 rounded-[2rem] blur-2xl group-hover:bg-primary/10 transition-colors" />
                            <ImageGallery images={book.images} />
                        </div>

                        {/* Right — Product Details */}
                        <div className="space-y-10 relative">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    Best Seller
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight">{book.title}</h1>
                                
                                {book.rating != null && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 bg-amber-400/10 px-3 py-1.5 rounded-xl">
                                            <Star className="size-4 fill-amber-400 text-amber-400" />
                                            <span className="text-sm font-black text-amber-700">
                                                {Number(book.rating).toFixed(1)}
                                            </span>
                                        </div>
                                        <div className="h-1 w-1 rounded-full bg-muted" />
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                            {book.soldCount || 0} lượt mua
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="glass p-8 rounded-3xl border-primary/10 bg-primary/[0.02]">
                                <PriceSection
                                    price={book.salePrice}
                                    originalPrice={book.originalPrice}
                                    stock={book.stock}
                                />
                            </div>

                            {book.description && (
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Mô tả tác phẩm</h3>
                                    <p className="text-foreground/80 leading-relaxed whitespace-pre-line text-sm font-medium">
                                        {book.description}
                                    </p>
                                </div>
                            )}

                            <div className="border-t border-border/50 pt-8">
                                <BookInfo book={book} />
                            </div>

                            <ActionButtons
                                quantity={quantity}
                                onQuantityChange={setQuantity}
                                onAddToCart={handleAddToCart}
                                isFavorite={isFavorite}
                                onFavoriteToggle={handleWishlistToggle}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Reviews Section ── */}
                <div className="glass rounded-[3rem] p-8 md:p-12 shadow-xl border-white/20">
                    <div className="mb-10">
                        <h2 className="text-2xl font-black text-foreground uppercase tracking-widest">Đánh giá từ độc giả</h2>
                        <div className="h-1.5 w-20 bg-primary mt-2 rounded-full" />
                    </div>
                    <ReviewSection bookId={bookId} bookRating={book.rating ?? 0} />
                </div>

                {/* ── Related Products ── */}
                {relatedBooks && relatedBooks.length > 0 && (
                    <div className="space-y-10">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-black text-foreground">Sách <span className="text-primary">liên quan</span></h2>
                            <Button variant="ghost" onClick={() => navigate("/list-books")} className="font-bold gap-2">
                                Xem tất cả <ChevronRight className="size-4" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                            {relatedBooks.map(b => (
                                <BookCard key={b.id} book={b} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookDetailPage;