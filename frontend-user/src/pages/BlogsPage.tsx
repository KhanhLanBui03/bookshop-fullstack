import { useFetch } from "@/hooks/useFetch"
import { blogService } from "@/services/blog.service"
import type { BlogResponse } from "@/types/Blog"
import BlogCard from "@/components/BlogCard"
import { BookOpen, Search } from "lucide-react"
import { useSEO } from "@/hooks/useSEO"

export default function BlogsPage() {
    useSEO({
        title: "Blog & Chia sẻ",
        description: "Khám phá những bài viết hay về sách, kinh nghiệm đọc sách và kiến thức lập trình tại BookStore."
    })

    const { data, loading } = useFetch<any>(() => blogService.getPublished(0, 12))
    const blogs = data?.content || []

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-primary/5">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[100px]"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold mb-6 animate-fadeIn">
                        <BookOpen className="size-4" />
                        <span className="uppercase tracking-widest">Knowledge Hub</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground tracking-tight animate-fadeIn" style={{ animationDelay: '100ms' }}>
                        Blog <span className="text-primary">&</span> Kiến thức
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: '200ms' }}>
                        Nơi chia sẻ những câu chuyện về sách, kinh nghiệm đọc và những kiến thức bổ ích giúp bạn phát triển bản thân mỗi ngày.
                    </p>
                </div>
            </section>

            {/* Search & Filter (Optional) */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 mb-16 relative z-10 animate-fadeIn" style={{ animationDelay: '300ms' }}>
                <div className="glass p-4 rounded-2xl shadow-xl flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm bài viết..." 
                            className="w-full h-12 pl-12 pr-4 rounded-xl bg-background/50 border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                        />
                    </div>
                    <button className="h-12 px-8 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity">
                        Tìm kiếm
                    </button>
                </div>
            </div>

            {/* Blog Grid */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="h-[450px] bg-muted animate-pulse rounded-2xl"></div>
                        ))
                    ) : blogs.length > 0 ? (
                        blogs.map((blog: BlogResponse, index: number) => (
                            <div key={blog.id} className="animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
                                <BlogCard 
                                    id={blog.id}
                                    title={blog.title}
                                    excerpt={blog.summary}
                                    imageUrl={blog.thumbnail || "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop"}
                                    date={new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                                    readTime="5 phút đọc"
                                    category="Bài viết"
                                    slug={blog.slug}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <BookOpen className="size-16 mx-auto mb-4 opacity-10" />
                            <p className="text-muted-foreground font-medium">Hiện tại chưa có bài viết nào.</p>
                        </div>
                    )}
                </div>

                {/* Pagination (Simplified) */}
                {data?.totalPages > 1 && (
                    <div className="flex justify-center mt-16 gap-2">
                        {[...Array(data.totalPages)].map((_, i) => (
                            <button 
                                key={i}
                                className={`size-10 rounded-lg font-bold transition-all ${data.number === i ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
