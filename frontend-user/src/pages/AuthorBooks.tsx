import BookCard from "@/components/BookOfAuthor/BookCard";
import FilterSidebarAuthor from "@/components/BookOfAuthor/FilterSidebar";
import SortDropdown from "@/components/BookOfAuthor/SortDropdown";
import { Button } from "@/components/ui/button";
import { ChevronRight, Grid3x3, List, Search, Star } from "lucide-react";
import { useState } from "react";

const AuthorBooksPage = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');

    const author = {
        name: 'Matt Haig',
        image: 'https://ui-avatars.com/api/?name=Matt+Haig&size=200&background=3b82f6&color=fff&bold=true',
        bio: 'Matt Haig là tác giả người Anh của nhiều cuốn sách bán chạy nhất, bao gồm cả tiểu thuyết và phi hư cấu. Tác phẩm của ông thường khám phá các chủ đề về sức khỏe tâm thần, hy vọng và bản chất của con người.',
        booksCount: 12,
        followers: '245K',
        rating: 4.3
    };

    const books = [
        {
            id: 1,
            title: 'The Midnight Library',
            year: '2020',
            rating: 4.5,
            reviews: 1247,
            price: 299000,
            originalPrice: 399000,
            discount: 25,
            image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
            description: 'Một câu chuyện đầy cảm xúc về sự hối tiếc, hy vọng và khả năng vô tận của cuộc sống.'
        },
        {
            id: 2,
            title: 'Reasons to Stay Alive',
            year: '2015',
            rating: 4.3,
            reviews: 892,
            price: 249000,
            originalPrice: 329000,
            discount: 24,
            image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
            description: 'Hồi ký cảm động về cuộc chiến với trầm cảm và lo âu của tác giả.'
        },
        {
            id: 3,
            title: 'The Comfort Book',
            year: '2021',
            rating: 4.4,
            reviews: 654,
            price: 279000,
            originalPrice: 369000,
            discount: 24,
            image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
            description: 'Những suy nghĩ và ghi chú nhỏ để giúp bạn vượt qua những ngày khó khăn.'
        },
        {
            id: 4,
            title: 'Notes on a Nervous Planet',
            year: '2018',
            rating: 4.2,
            reviews: 523,
            price: 269000,
            image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400',
            description: 'Khám phá cách thức thế giới hiện đại ảnh hưởng đến sức khỏe tâm thần của chúng ta.'
        },
        {
            id: 5,
            title: 'How to Stop Time',
            year: '2017',
            rating: 4.1,
            reviews: 789,
            price: 289000,
            originalPrice: 379000,
            discount: 24,
            image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
            description: 'Một câu chuyện kỳ diệu về tình yêu, mất mát và nghệ thuật sống trong hiện tại.'
        },
        {
            id: 6,
            title: 'The Humans',
            year: '2013',
            rating: 4.0,
            reviews: 456,
            price: 259000,
            image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
            description: 'Một người ngoài hành tinh đến Trái đất và khám phá ra điều gì khiến con người trở nên đặc biệt.'
        },
        {
            id: 7,
            title: 'The Radleys',
            year: '2010',
            rating: 3.9,
            reviews: 321,
            price: 239000,
            image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
            description: 'Một gia đình ma cà rồng đang cố gắng sống một cuộc sống bình thường ở ngoại ô.'
        },
        {
            id: 8,
            title: 'A Boy Called Christmas',
            year: '2015',
            rating: 4.6,
            reviews: 987,
            price: 229000,
            originalPrice: 299000,
            discount: 23,
            image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
            description: 'Câu chuyện nguồn gốc kỳ diệu về ông già Noel dành cho mọi lứa tuổi.'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">Trang chủ</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 hover:text-blue-600 cursor-pointer transition-colors">Tác giả</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">{author.name}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Author Info Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex items-start gap-8">
                        <img
                            src={author.image}
                            alt={author.name}
                            className="w-32 h-32 rounded-full shadow-xl"
                        />
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold mb-3">{author.name}</h1>
                            <p className="text-gray-700 mb-6 leading-relaxed max-w-3xl text-lg">
                                {author.bio}
                            </p>
                            <div className="flex items-center gap-8">
                                <div>
                                    <span className="font-bold text-2xl text-blue-600">{author.booksCount}</span>
                                    <span className="ml-2 text-gray-600">Cuốn sách</span>
                                </div>
                                <div>
                                    <span className="font-bold text-2xl text-blue-600">{author.followers}</span>
                                    <span className="ml-2 text-gray-600">Người theo dõi</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-bold text-xl">{author.rating}</span>
                                    <span className="ml-1 text-gray-600">Đánh giá TB</span>
                                </div>
                            </div>
                        </div>
                        <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md">
                            Theo dõi
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar - Left */}
                    <div className="lg:col-span-1">
                        <FilterSidebarAuthor />
                    </div>

                    {/* Books List - Right */}
                    <div className="lg:col-span-3">
                        {/* Toolbar */}
                        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex-1 min-w-[300px]">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Tìm kiếm trong sách của tác giả..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                                        <Button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-md' : 'hover:bg-gray-200'
                                                }`}
                                        >
                                            <Grid3x3 className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-md' : 'hover:bg-gray-200'
                                                }`}
                                        >
                                            <List className="w-5 h-5" />
                                        </Button>
                                    </div>

                                    <SortDropdown />
                                </div>
                            </div>

                            <div className="mt-4 text-gray-600">
                                Hiển thị <span className="font-semibold text-gray-900">{books.length}</span> sách
                            </div>
                        </div>

                        {/* Books Grid/List */}
                        <div className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                                : 'space-y-6'
                        }>
                            {books.map(book => (
                                <BookCard key={book.id} book={book} viewMode={viewMode} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-2 mt-12">
                            <button className="px-4 py-2 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:text-blue-500 transition-colors font-medium">
                                Trước
                            </button>
                            {[1, 2, 3, 4, 5].map(page => (
                                <button
                                    key={page}
                                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${page === 1
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button className="px-4 py-2 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:text-blue-500 transition-colors font-medium">
                                Sau
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorBooksPage;