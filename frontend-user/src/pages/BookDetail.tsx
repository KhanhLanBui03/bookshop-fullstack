import { useEffect, useState } from 'react';
import { Star} from 'lucide-react';
import ImageGallery from '@/components/BookDetail/ImageGallery';
import PriceSection from '@/components/BookDetail/PriceSection';
import Rating from '@/components/BookDetail/Rating';
import ActionButtons from '@/components/BookDetail/ActionButtons';
import BookInfo from '@/components/BookDetail/BookInfo';
import ReviewCard from '@/components/BookDetail/ReviewCard';
import RelatedBookCard from '@/components/BookDetail/RelatedBookCard';
import { useParams } from 'react-router-dom';
import type { BookDetail } from '@/types/Book';
import { bookService } from '@/services/book.service';
import { useFetch } from '@/hooks/useFetch';
const BookDetail = () => {
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const {id} = useParams();
    const { data: book, loading } = useFetch<BookDetail>(()=>bookService.getBookById(Number(id)));
      if (loading) {
        return <div>Loading...</div>
      }
        if (!book) {
        return <div>Không tìm thấy sách</div>
      }
//     const book = {
//         title: "The Midnight Library",
//         author: "Matt Haig",
//         rating: 4.5,
//         reviews: 1247,
//         price: 299000,
//         originalPrice: 399000,
//         discount: 25,
//         stock: 45,
//         publisher: "Viking Press",
//         pages: 304,
//         format: "Bìa cứng",
//         images: [
//             "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600",
//             "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600",
//             "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600",
//             "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600"
//         ],
//         description: `Nora Seed tìm thấy mình giữa cuộc đời và cái chết, trong một thư viện kỳ diệu nơi mỗi cuốn sách đại diện cho một phiên bản khác nhau của cuộc đời cô có thể đã có.

// Với sự giúp đỡ của người thủ thư bí ẩn, cô bắt đầu cuộc hành trình khám phá những gì có thể xảy ra nếu cô đã đưa ra những lựa chọn khác trong cuộc sống.

// Một câu chuyện đầy cảm xúc về sự hối tiếc, hy vọng và khả năng vô tận của cuộc sống. Matt Haig đã tạo ra một tác phẩm sâu sắc về việc tìm kiếm ý nghĩa và niềm vui trong cuộc sống.`,
//         features: [
//             "✓ Bestseller của New York Times",
//             "✓ Giải thưởng Goodreads Choice Award",
//             "✓ Đã bán hơn 5 triệu bản toàn cầu",
//             "✓ Được dịch ra 45 ngôn ngữ"
//         ]
//     };

    const reviews = [
        {
            id: 1,
            user: "Nguyễn Văn A",
            rating: 5,
            date: "15/01/2026",
            comment: "Cuốn sách tuyệt vời! Đã thay đổi cách nhìn của tôi về cuộc sống. Rất đáng đọc!",
            helpful: 24
        },
        {
            id: 2,
            user: "Trần Thị B",
            rating: 4,
            date: "10/01/2026",
            comment: "Câu chuyện hay và ý nghĩa. Tuy nhiên có một vài đoạn hơi dài dòng.",
            helpful: 12
        },
        {
            id: 3,
            user: "Lê Văn C",
            rating: 5,
            date: "05/01/2026",
            comment: "Không thể đặt xuống! Đọc xong trong một đêm. Matt Haig là thiên tài!",
            helpful: 18
        }
    ];

    const relatedBooks = [
        {
            id: 2,
            title: "Reasons to Stay Alive",
            author: "Matt Haig",
            price: 249000,
            image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300"
        },
        {
            id: 3,
            title: "The Comfort Book",
            author: "Matt Haig",
            price: 279000,
            image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300"
        },
        {
            id: 4,
            title: "Notes on a Nervous Planet",
            author: "Matt Haig",
            price: 269000,
            image: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=300"
        },
        {
            id: 5,
            title: "How to Stop Time",
            author: "Matt Haig",
            price: 289000,
            image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300"
        }
    ];

    const handleAddToCart = () => {
        alert(`Đã thêm ${quantity} cuốn sách vào giỏ hàng!`);
    };

    return (
        <div className="w-full bg-gray-50 t">
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 ">
                {/* Product Section - 2 Columns */}
                <div className="bg-white rounded-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left - Image Gallery */}
                        <ImageGallery images={book.images}  />
                        {/* discount={book.discount} */}

                        {/* Right - Product Details */}
                        <div className="space-y-6">
                            {/* <div>
                                <h1 className="text-3xl font-bold mb-3">{book.title}</h1>
                                <Rating rating={book.rating} reviews={book.reviews} />
                            </div> */}

                            <PriceSection
                                price={book.salePrice}
                                originalPrice={book.originalPrice}
                                stock={book.stock}
                            />

                            <div>
                                <h3 className="font-semibold mb-3">Mô tả sản phẩm</h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                                    {book.description}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-3">Điểm nổi bật</h3>
                                {/* <ul className="space-y-2 text-sm text-gray-700">
                                    {book.features.map((feature, idx) => (
                                        <li key={idx}>{feature}</li>
                                    ))}
                                </ul> */}
                            </div>

                            <BookInfo book={book} />

                            <ActionButtons
                                quantity={quantity}
                                onQuantityChange={setQuantity}
                                onAddToCart={handleAddToCart}
                                isFavorite={isFavorite}
                                onFavoriteToggle={() => setIsFavorite(!isFavorite)}
                            />
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-lg p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Đánh giá sản phẩm</h2>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                            Viết đánh giá
                        </button>
                    </div>

                    {/* Review Stats */}
                    <div className="flex items-center gap-8 mb-8 pb-6 border-b">
                        <div className="text-center">
                            <div className="text-4xl font-bold mb-2">{book.rating}</div>
                            <div className="flex items-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(book.rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            {/* <div className="text-sm text-gray-600">{book.reviews} đánh giá</div> */}
                        </div>
                        <div className="flex-1 space-y-2">
                            {[5, 4, 3, 2, 1].map(star => (
                                <div key={star} className="flex items-center gap-3">
                                    <span className="text-sm w-12">{star} sao</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-yellow-400 h-2 rounded-full"
                                            style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : 10}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-600 w-12 text-right">
                                        {star === 5 ? 872 : star === 4 ? 250 : star === 3 ? 75 : star === 2 ? 30 : 20}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Review List */}
                    <div className="space-y-6">
                        {reviews.map(review => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                </div>

                {/* Related Products Section */}
                <div className="bg-white rounded-lg p-8">
                    <h2 className="text-2xl font-bold mb-6">Sách liên quan</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedBooks.map(book => (
                            <RelatedBookCard key={book.id} book={book} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;