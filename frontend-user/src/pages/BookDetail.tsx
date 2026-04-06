import { useState } from 'react';
import { Star } from 'lucide-react';
import ImageGallery from '@/components/BookDetail/ImageGallery';
import PriceSection from '@/components/BookDetail/PriceSection';
import BookInfo from '@/components/BookDetail/BookInfo';
import ActionButtons from '@/components/BookDetail/ActionButtons';

import RelatedBookCard from '@/components/BookDetail/RelatedBookCard';
import { useParams } from 'react-router-dom';
import type { BookCard, BookDetail } from '@/types/Book';
import { bookService } from '@/services/book.service';
import { useFetch } from '@/hooks/useFetch';
import ReviewSection from '@/components/Review/ReviewSection';

const BookDetailPage = () => {
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const { id } = useParams<{ id: string }>();
    const bookId = Number(id);

    const { data: book, loading } = useFetch<BookDetail>(() => bookService.getBookById(bookId));
    const { data: relatedBooks } = useFetch<BookCard[]>(
        () => bookService.getRelatedBooks(bookId),
        [id]
    );

    if (loading) {
        return (
            <div className="w-full bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-sm text-gray-400">Đang tải...</div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="w-full bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-sm text-gray-500">Không tìm thấy sách</div>
            </div>
        );
    }

    const handleAddToCart = () => {
        alert(`Đã thêm ${quantity} cuốn sách vào giỏ hàng!`);
    };

    return (
        <div className="w-full bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

                {/* ── Product Section ── */}
                <div className="bg-white rounded-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left — Image Gallery */}
                        <ImageGallery images={book.images} />

                        {/* Right — Product Details */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">{book.title}</h1>
                                {book.rating != null && (
                                    <div className="flex items-center gap-1.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i <= Math.round(book.rating)
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-gray-200'}`}
                                            />
                                        ))}
                                        <span className="text-sm text-gray-500 ml-1">
                                            {Number(book.rating).toFixed(1)}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <PriceSection
                                price={book.salePrice}
                                originalPrice={book.originalPrice}
                                stock={book.stock}
                            />

                            {book.description && (
                                <div>
                                    <h3 className="font-semibold mb-2">Mô tả sản phẩm</h3>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                                        {book.description}
                                    </p>
                                </div>
                            )}

                            <BookInfo book={book} />

                            <ActionButtons
                                quantity={quantity}
                                onQuantityChange={setQuantity}
                                onAddToCart={handleAddToCart}
                                isFavorite={isFavorite}
                                onFavoriteToggle={() => setIsFavorite(f => !f)}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Reviews Section ── */}
                <div className="bg-white rounded-lg p-8">
                    {/*
                     * ReviewSection quản lý toàn bộ logic:
                     *  - fetch reviews (phân trang)
                     *  - check purchased / reviewed
                     *  - create / delete / reply / helpful
                     */}
                    <ReviewSection bookId={bookId} bookRating={book.rating ?? 0} />
                </div>

                {/* ── Related Products ── */}
                {relatedBooks && relatedBooks.length > 0 && (
                    <div className="bg-white rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-6">Sách liên quan</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedBooks.map(b => (
                                <RelatedBookCard key={b.id} book={b} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookDetailPage;