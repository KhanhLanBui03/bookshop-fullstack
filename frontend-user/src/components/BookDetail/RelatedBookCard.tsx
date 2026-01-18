
const RelatedBookCard = ({ book }) => {
    return (
        <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white">
            <img src={book.image} alt={book.title} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="font-medium mb-1 line-clamp-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                <p className="font-semibold text-blue-600">{book.price.toLocaleString('vi-VN')}₫</p>
            </div>
        </div>
    );
};
export default RelatedBookCard;