import { BookOpen, TrendingUp, ChevronRight } from "lucide-react"

const categories = [
    {
        id: 1,
        name: "Văn học",
        description: "Tiểu thuyết & truyện ngắn",
        color: "from-purple-600 to-purple-800",
        bgColor: "bg-purple-50",
        hoverColor: "group-hover:from-purple-700 group-hover:to-purple-900",
        books: "320+ sách",
        trending: true,
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    },
    {
        id: 2,
        name: "Kinh tế",
        description: "Kinh doanh & tài chính",
        color: "from-blue-600 to-blue-800",
        bgColor: "bg-blue-50",
        hoverColor: "group-hover:from-blue-700 group-hover:to-blue-900",
        books: "210+ sách",
        trending: true,
        image: "https://images.unsplash.com/photo-1454165205744-3b78555e5572",
    },
    {
        id: 3,
        name: "Công nghệ",
        description: "Lập trình & IT",
        color: "from-green-600 to-green-800",
        bgColor: "bg-green-50",
        hoverColor: "group-hover:from-green-700 group-hover:to-green-900",
        books: "180+ sách",
        trending: false,
        image: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f",
    },
    {
        id: 4,
        name: "Thiếu nhi",
        description: "Sách cho trẻ em",
        color: "from-yellow-500 to-yellow-700",
        bgColor: "bg-yellow-50",
        hoverColor: "group-hover:from-yellow-600 group-hover:to-yellow-800",
        books: "260+ sách",
        trending: false,
        image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d",
    },
    {
        id: 5,
        name: "Kỹ năng sống",
        description: "Phát triển bản thân",
        color: "from-pink-500 to-pink-700",
        bgColor: "bg-pink-50",
        hoverColor: "group-hover:from-pink-600 group-hover:to-pink-800",
        books: "140+ sách",
        trending: true,
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
    },
    {
        id: 6,
        name: "Ngoại ngữ",
        description: "Tiếng Anh & ngôn ngữ",
        color: "from-indigo-500 to-indigo-700",
        bgColor: "bg-indigo-50",
        hoverColor: "group-hover:from-indigo-600 group-hover:to-indigo-800",
        books: "190+ sách",
        trending: false,
        image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
    },
]

const CategoriesSection = () => {
    const handleCategoryClick = (categoryId) => {
        console.log(`Navigate to books?category=${categoryId}`)
    }

    return (
        <section className="relative dark:bg-zinc-900 py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <BookOpen className="w-4 h-4" />
                        <span>Khám phá theo chủ đề</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl dark:text-white font-bold text-gray-900 mb-3">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Danh mục
                        </span>{" "}
                        nổi bật
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Tìm kiếm sách yêu thích theo danh mục được tuyển chọn kỹ lưỡng
                    </p>
                </div>

                {/* Categories Grid */}
                <div className="flex gap-6 max-w-7xl mx-auto overflow-x-auto pb-6 scrollbar-hide">
                    {categories.map((category, index) => (
                        <div
                            key={category.id}
                            onClick={() => handleCategoryClick(category.id)}
                            className="group flex-shrink-0 w-64 cursor-pointer relative"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Card */}
                            <div className={`relative rounded-2xl ${category.bgColor} dark:bg-zinc-800 border-2 border-transparent hover:border-gray-200 dark:hover:border-zinc-700 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2`}>
                                {/* Trending Badge */}
                                {category.trending && (
                                    <div className="absolute top-3 right-3 z-10">
                                        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 text-xs font-bold rounded-full flex gap-1.5 items-center shadow-lg animate-pulse">
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            HOT
                                        </div>
                                    </div>
                                )}

                                {/* Image Container */}
                                <div className="relative h-40 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className={`font-bold text-xl mb-1 bg-gradient-to-r ${category.color} ${category.hoverColor} bg-clip-text text-transparent transition-all duration-300`}>
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        {category.description}
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                {category.books}
                                            </span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 group-hover:translate-x-1 transition-all duration-300" />
                                    </div>
                                </div>

                                {/* Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-10">
                    <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <span>Xem tất cả danh mục</span>
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    )
}

export default CategoriesSection