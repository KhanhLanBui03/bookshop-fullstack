import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

const BookCard = ({ book, viewMode }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    if (viewMode === 'list') {
        return (
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 flex gap-6">
                <img
                    src={book.image}
                    alt={book.title}
                    className="w-32 h-48 object-cover rounded-xl shadow-md"
                />
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="text-2xl font-bold mb-2 hover:text-blue-600 cursor-pointer">
                                {book.title}
                            </h3>
                            <p className="text-gray-600 mb-3">{book.year}</p>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < Math.floor(book.rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'fill-gray-200 text-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="font-semibold">{book.rating}</span>
                                <span className="text-gray-500">({book.reviews} đánh giá)</span>
                            </div>
                        </div>
                        <Button
                            onClick={() => setIsFavorite(!isFavorite)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                        </Button>
                    </div>
                    <p className="text-gray-700 mb-4 line-clamp-2 leading-relaxed">
                        {book.description}
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-blue-600">
                                {book.price.toLocaleString('vi-VN')}₫
                            </span>
                            {book.originalPrice && (
                                <span className="text-lg text-gray-400 line-through">
                                    {book.originalPrice.toLocaleString('vi-VN')}₫
                                </span>
                            )}
                        </div>
                        <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group">
            <div className="relative overflow-hidden">
                <img
                    src={book.image}
                    alt={book.title}
                    className="w-full aspect-[3/4] object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <Button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </Button>
                {book.discount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg font-bold">
                        -{book.discount}%
                    </div>
                )}
            </div>
            <div className="p-5">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer">
                    {book.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">{book.year}</p>
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(book.rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'fill-gray-200 text-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="font-semibold text-sm">{book.rating}</span>
                    <span className="text-gray-500 text-sm">({book.reviews})</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-2xl font-bold text-blue-600">
                            {book.price.toLocaleString('vi-VN')}₫
                        </p>
                        {book.originalPrice && (
                            <p className="text-sm text-gray-400 line-through">
                                {book.originalPrice.toLocaleString('vi-VN')}₫
                            </p>
                        )}
                    </div>
                </div>
                <Button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Thêm vào giỏ
                </Button>
            </div>
        </div>
    );
};
export default BookCard