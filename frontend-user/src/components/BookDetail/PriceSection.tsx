

const PriceSection = ({ price, originalPrice, stock }) => {
    return (
        <div className="border-t border-b py-6 space-y-3">
            <div className="flex items-end gap-3">
                <span className="text-4xl font-bold text-blue-600">
                    {price.toLocaleString('vi-VN')}₫
                </span>
                <span className="text-xl text-gray-400 line-through mb-1">
                    {originalPrice.toLocaleString('vi-VN')}₫
                </span>
            </div>
            <p className="text-sm text-green-600 font-medium">
                Còn {stock} sản phẩm
            </p>
        </div>
    );
};
export default PriceSection;