
import { useFetch } from "@/hooks/useFetch"
import { categoryService } from "@/services/category.service"
import type { CategoryCard } from "@/types/Category"
import { BookOpen, ChevronRight } from "lucide-react"
import { Skeleton } from "../ui/skeleton"


//     {
//         id: 6,
//         name: "Ngoại ngữ",
//         description: "Tiếng Anh & ngôn ngữ",
//         color: "from-indigo-500 to-indigo-700",
//         bgColor: "bg-indigo-50",
//         hoverColor: "group-hover:from-indigo-600 group-hover:to-indigo-800",
//         books: "190+ sách",
//         trending: false,
//         image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
//     },
// ]

const CategoriesSection = () => {
    const { data: categories, loading } = useFetch<CategoryCard[]>(
        () => categoryService.getCategories()
    )
    if (loading) {
        return (
            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    {/* Header skeleton */}
                    <div className="text-center mb-12">
                        <Skeleton className="h-6 w-40 mx-auto mb-4 rounded-full" />
                        <Skeleton className="h-10 w-64 mx-auto mb-3" />
                        <Skeleton className="h-4 w-96 mx-auto" />
                    </div>

                    {/* Cards skeleton */}
                    <div className="flex gap-6 max-w-7xl mx-auto overflow-x-auto pb-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex-shrink-0 w-64">
                                <div className="rounded-2xl overflow-hidden bg-white dark:bg-zinc-800 shadow-sm">
                                    {/* Image */}
                                    <Skeleton className="h-40 w-full" />

                                    {/* Content */}
                                    <div className="p-5 space-y-3">
                                        <Skeleton className="h-5 w-3/4" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-5/6" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (!categories || categories.length === 0) {
        return <div>Không có danh mục</div>
    }

    return (
        <section className="relative dark:bg-zinc-900 py-12 lg:py-16 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4 bg-black/5 dark:bg-white/5 rounded-3xl py-10 lg:py-16">
                {/* Header */}
                <div className="text-center mb-12 ">
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
                            // onClick={() => handleCategoryClick(category.id)}
                            className="group flex-shrink-0 w-64 cursor-pointer relative"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Card */}
                            <div className={`relative rounded-2xl  dark:bg-zinc-800 hover:border-gray-200 dark:hover:border-zinc-700 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 `}>
                                {/* Image Container */}
                                <div className="relative h-40 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                                    <img
                                        src={category.url || "/placeholder.png"}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3
                                        className="
                                            font-bold text-xl mb-1
                                            bg-gradient-to-r from-blue-600 to-purple-600
                                            dark:from-blue-400 dark:to-purple-400
                                            bg-clip-text text-transparent
                                            transition-all duration-300
                                        "
                                    >
                                        {category.name}
                                    </h3>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        {category.description}
                                    </p>


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