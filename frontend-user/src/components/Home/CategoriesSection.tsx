
import { BookOpen } from "lucide-react"
import { useNavigate } from "react-router-dom"

const categories = [
    {
        id: 1,
        name: "Văn học",
        description: "Tiểu thuyết & truyện ngắn",
        color: "from-purple-600 to-purple-800",
        bgColor: "bg-purple-50",
        books: "320+ sách",
        trending: true,
        image:
            "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    },
    {
        id: 2,
        name: "Kinh tế",
        description: "Kinh doanh & tài chính",
        color: "from-blue-600 to-blue-800",
        bgColor: "bg-blue-50",
        books: "210+ sách",
        trending: true,
        image:
            "https://images.unsplash.com/photo-1454165205744-3b78555e5572",
    },
    {
        id: 3,
        name: "Công nghệ",
        description: "Lập trình & IT",
        color: "from-green-600 to-green-800",
        bgColor: "bg-green-50",
        books: "180+ sách",
        trending: false,
        image:
            "https://images.unsplash.com/photo-1517433456452-f9633a875f6f",
    },
    {
        id: 4,
        name: "Thiếu nhi",
        description: "Sách cho trẻ em",
        color: "from-yellow-500 to-yellow-700",
        bgColor: "bg-yellow-50",
        books: "260+ sách",
        trending: false,
        image:
            "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d",
    },
    {
        id: 5,
        name: "Kỹ năng sống",
        description: "Phát triển bản thân",
        color: "from-pink-500 to-pink-700",
        bgColor: "bg-pink-50",
        books: "140+ sách",
        trending: true,
        image:
            "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
    },
    {
        id: 6,
        name: "Ngoại ngữ",
        description: "Tiếng Anh & ngôn ngữ",
        color: "from-indigo-500 to-indigo-700",
        bgColor: "bg-indigo-50",
        books: "190+ sách",
        trending: false,
        image:
            "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
    },
]

const CategoriesSection = () => {
    const navigate = useNavigate()

    return (
        <section className="relative dark:bg-zinc-900 py-8 lg:py-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-2xl lg:text-3xl dark:text-white font-bold text-gray-900 mb-2">
                        <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Danh mục </span>
                        nổi bật
                    </h2>
                </div>

                <div  className="flex gap-4 max-w-7xl mx-auto overflow-x-auto pb-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => navigate(`/books?category=${category.id}`)}
                            className={`group flex-shrink-0 w-48 cursor-pointer rounded-2xl ${category.bgColor} border border-gray-100 hover:shadow-md transition-all`}
                        >
                            {category.trending && (
                                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded-full flex gap-1 items-center">
                                    <BookOpen className="w-3 h-3" />
                                    Hot
                                </div>
                            )}

                            <div className="p-4 text-center">
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-24 rounded-xl object-cover mb-2 group-hover:scale-105 transition-transform"
                                />

                                <h3
                                    className={`font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}
                                >
                                    {category.name}
                                </h3>

                                <p className="text-xs text-gray-500">{category.books}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CategoriesSection
