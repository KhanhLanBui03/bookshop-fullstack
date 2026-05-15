
import { useFetch } from "@/hooks/useFetch"
import { categoryService } from "@/services/category.service"
import type { CategoryCard } from "@/types/Category"
import { BookOpen, ChevronRight } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"


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

import { EmptyState } from "../Common/EmptyState"
import { LayoutGrid } from "lucide-react"

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
        return (
            <EmptyState 
                icon={LayoutGrid} 
                title="Không có danh mục" 
                description="Hiện tại chưa có danh mục sách nào được đăng tải. Vui lòng quay lại sau." 
            />
        )
    }

    return (
        <section className="relative py-20 overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                        <BookOpen className="size-4" />
                        <span>Khám phá theo chủ đề</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black text-foreground mb-4">
                        Danh mục <span className="text-primary">nổi bật</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
                        Tìm kiếm sách yêu thích qua các chủ đề được tuyển chọn kỹ lưỡng từ đội ngũ chuyên gia.
                    </p>
                </div>

                {/* Categories Scroll */}
                <div className="flex gap-8 max-w-7xl mx-auto overflow-x-auto pb-10 scrollbar-hide">
                    {categories.map((category, index) => (
                        <Link
                            to={`/list-books?genre=${category.name}`}
                            key={category.id}
                            className="group flex-shrink-0 w-72 cursor-pointer relative"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Card */}
                            <div className="relative rounded-3xl glass dark:bg-card hover:border-primary/30 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3">
                                {/* Image Container */}
                                <div className="relative h-48 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
                                    <img
                                        src={category.url || "/placeholder.png"}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 z-20 glass px-3 py-1 rounded-lg text-[10px] font-bold text-white uppercase tracking-tighter">
                                        Trending
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 relative z-20">
                                    <h3 className="font-black text-2xl mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                                        {category.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                                        Khám phá <ChevronRight className="size-4" />
                                    </div>
                                </div>

                                {/* Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link to="/list-books">
                        <Button size="lg" className="rounded-2xl px-10 h-14 font-bold shadow-xl transition-all hover:scale-105 active:scale-95">
                            <span>Xem tất cả danh mục</span>
                            <ChevronRight className="size-5" />
                        </Button>
                    </Link>
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