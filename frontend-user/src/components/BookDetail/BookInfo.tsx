
const BookInfo = ({ book }) => {
    return (
        <div className="space-y-3 text-sm">
            <div className="flex">
                <span className="w-32 text-gray-600">Tác giả:</span>
                <span className="font-medium">{book.authorName}</span>
            </div>
            <div className="flex">
                <span className="w-32 text-gray-600">Nhà xuất bản:</span>
                <span className="font-medium">{book.publisher.name}</span>
            </div>
            <div className="flex">
                <span className="w-32 text-gray-600">Quốc gia:</span>
                <span className="font-medium">
                    {book.publisher?.country}
                </span>
            </div>
            <div className="flex">
                <span className="w-32 text-gray-600">Năm xuất bản:</span>
                <span className="font-medium">2020</span>
            </div>
            {/* <div className="flex">
                <span className="w-32 text-gray-600">Số trang:</span>
                <span className="font-medium">{book.pages}</span>
            </div>
            <div className="flex">
                <span className="w-32 text-gray-600">Hình thức:</span>
                <span className="font-medium">{book.format}</span>
            </div> */}
        </div>
    );
};

export default BookInfo;