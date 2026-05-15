import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

const BookCard = ({ book, viewMode }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    // Map backend fields to component needs
    const price = book.salePrice || book.price || 0;
    const originalPrice = book.originalPrice;
    const rating = book.rating || 0;
    const soldCount = book.soldCount || book.reviews || 0;
    const image = book.image || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400";
    const description = book.description || "Chưa có mô tả cho cuốn sách này.";

    if (viewMode === 'list') {
        return (
            <div className="bg-zinc-900/40 backdrop-blur-md rounded-3xl shadow-md hover:shadow-2xl transition-all p-8 flex gap-8 group border border-white/5">
                <div className="w-32 h-48 flex-shrink-0 overflow-hidden rounded-xl shadow-md">
                    <img
                        src={image}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                            <h3 className="text-2xl font-black mb-2 hover:text-primary cursor-pointer transition-colors text-white">
                                {book.title}
                            </h3>
                            <p className="text-zinc-400 font-bold mb-4">{book.authorName || "Đang cập nhật"}</p>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < Math.floor(rating)
                                                    ? 'fill-yellow-500 text-yellow-500'
                                                    : 'fill-white/5 text-white/5'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="font-black text-white">{rating}</span>
                                <span className="text-zinc-500 text-sm font-medium">({soldCount} đã bán)</span>
                            </div>
                        </div>
                        <Button
                            onClick={() => setIsFavorite(!isFavorite)}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10 shadow-lg"
                        >
                            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-zinc-500'}`} />
                        </Button>
                    </div>
                    <p className="text-zinc-400 mb-8 line-clamp-2 leading-relaxed italic text-sm">
                        {description}
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-black text-primary">
                                {price.toLocaleString('vi-VN')}₫
                            </span>
                            {originalPrice && (
                                <span className="text-lg text-gray-400 line-through decoration-red-500/30">
                                    {originalPrice.toLocaleString('vi-VN')}₫
                                </span>
                            )}
                        </div>
                        <button className="bg-primary text-white px-8 py-3.5 rounded-2xl font-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95">
                            <ShoppingCart className="size-5" />
                            Thêm vào giỏ
                        </button>
                    </div>
                </div>
        );
    }

    return (
        <div className="bg-zinc-900/40 backdrop-blur-md rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-white/5 flex flex-col h-full">
            <div className="relative aspect-[3/4] overflow-hidden">
                <img
                    src={image}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                <Button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="absolute top-4 right-4 size-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform border border-white/50"
                >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
                </Button>
                {book.discount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-xl font-black text-xs shadow-lg">
                        -{book.discount}%
                    </div>
                )}
            </div>
            <div className="p-6 flex flex-col flex-1">
                <h3 className="font-black text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer leading-tight h-12">
                    {book.title}
                </h3>
                <p className="text-zinc-400 text-sm font-medium mb-4">{book.authorName || "Đang cập nhật"}</p>
                
                <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < Math.floor(rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'fill-zinc-200 text-zinc-200'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="font-bold text-xs">{rating}</span>
                    <span className="text-zinc-400 text-xs">({soldCount})</span>
                </div>

                <div className="mt-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-primary leading-none">
                                {price.toLocaleString('vi-VN')}₫
                            </span>
                            {originalPrice && (
                                <span className="text-xs text-zinc-400 line-through mt-1">
                                    {originalPrice.toLocaleString('vi-VN')}₫
                                </span>
                            )}
                        </div>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-2xl font-black transition-all shadow-lg shadow-primary/10 flex items-center justify-center gap-2 active:scale-95">
                        <ShoppingCart className="size-5" />
                        Thêm vào giỏ
                    </Button>
                </div>
            </div>
        </div>
    );
};
export default BookCard