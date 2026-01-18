

import {  Heart, Share2, ShoppingCart } from 'lucide-react';
const ActionButtons = ({ quantity, onQuantityChange, onAddToCart, isFavorite, onFavoriteToggle }) => {
    return (
        <div className="space-y-3">
            <div className="flex gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                        className="px-4 py-2.5 hover:bg-gray-50 border-r"
                    >
                        −
                    </button>
                    <span className="px-6 py-2.5 font-medium min-w-[60px] text-center">
                        {quantity}
                    </span>
                    <button
                        onClick={() => onQuantityChange(quantity + 1)}
                        className="px-4 py-2.5 hover:bg-gray-50 border-l"
                    >
                        +
                    </button>
                </div>
                <button
                    onClick={onAddToCart}
                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                    <ShoppingCart className="w-5 h-5" />
                    Thêm vào giỏ hàng
                </button>
            </div>
            <button className="w-full bg-orange-500 text-white py-2.5 rounded-lg font-medium hover:bg-orange-600">
                Mua ngay
            </button>
            <div className="flex gap-2">
                <button
                    onClick={onFavoriteToggle}
                    className={`flex-1 py-2.5 rounded-lg border font-medium flex items-center justify-center gap-2 ${isFavorite
                            ? 'border-red-500 text-red-500 bg-red-50'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
                    Yêu thích
                </button>
                <button className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Chia sẻ
                </button>
            </div>
        </div>
    );
};
export default ActionButtons;