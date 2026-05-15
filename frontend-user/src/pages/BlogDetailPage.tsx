import { useParams, Link } from "react-router-dom"
import { useFetch } from "@/hooks/useFetch"
import { blogService } from "@/services/blog.service"
import type { BlogResponse } from "@/types/Blog"
import { Calendar, User, ChevronRight, Clock, Share2, BookOpen } from "lucide-react"
import { useSEO } from "@/hooks/useSEO"

export default function BlogDetailPage() {
    const { slug } = useParams<{ slug: string }>()
    const { data: blog, loading } = useFetch<BlogResponse>(() => blogService.getBySlug(slug!), [slug])
    const { data: relatedBlogs, loading: relatedLoading } = useFetch<BlogResponse[]>(
        () => blog && blog.id ? blogService.getRelated(blog.id) : Promise.resolve([]),
        [blog?.id]
    )

    useSEO({
        title: blog?.title,
        description: blog?.summary,
        image: blog?.thumbnail
    })

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse">
                <div className="h-10 w-3/4 bg-muted mb-6 rounded-lg"></div>
                <div className="h-6 w-1/2 bg-muted mb-12 rounded-lg"></div>
                <div className="h-96 w-full bg-muted mb-12 rounded-2xl"></div>
                <div className="space-y-4">
                    <div className="h-4 w-full bg-muted rounded"></div>
                    <div className="h-4 w-full bg-muted rounded"></div>
                    <div className="h-4 w-2/3 bg-muted rounded"></div>
                </div>
            </div>
        )
    }

    if (!blog) {
        return <div className="text-center py-20">Bài viết không tồn tại.</div>
    }

    return (
        <div className="bg-background min-h-screen">
            {/* Breadcrumbs */}
            <div className="max-w-5xl mx-auto px-4 py-6">
                <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Link to="/" className="hover:text-primary transition-colors font-medium">Trang chủ</Link>
                    <ChevronRight className="size-4 opacity-30" />
                    <Link to="/blogs" className="hover:text-primary transition-colors font-medium">Blog</Link>
                    <ChevronRight className="size-4 opacity-30" />
                    <span className="text-foreground font-bold line-clamp-1">{blog.title}</span>
                </nav>
            </div>

            <article className="max-w-4xl mx-auto px-4 pb-20">
                {/* Header */}
                <header className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                        <BookOpen className="size-3" />
                        Bài viết mới nhất
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-8 text-foreground leading-[1.1] tracking-tighter">
                        {blog.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 py-8 border-y border-foreground/5">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-black shadow-lg">
                                {blog.authorName ? blog.authorName[0] : "A"}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-foreground/40 font-bold uppercase tracking-widest">Tác giả</span>
                                <span className="text-sm font-black text-foreground">{blog.authorName || "Admin"}</span>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-foreground/5 hidden md:block"></div>
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground/60">
                                <Calendar className="size-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-foreground/40 font-bold uppercase tracking-widest">Ngày đăng</span>
                                <span className="text-sm font-black text-foreground">{new Date(blog.createdAt).toLocaleDateString('vi-VN', { dateStyle: 'long' })}</span>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-foreground/5 hidden md:block"></div>
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground/60">
                                <Clock className="size-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-foreground/40 font-bold uppercase tracking-widest">Thời lượng</span>
                                <span className="text-sm font-black text-foreground">5 phút đọc</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                <div className="mb-16 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5 ring-1 ring-white/10 group">
                    <img
                        src={blog.thumbnail || "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=600&fit=crop"}
                        alt={blog.title}
                        className="w-full h-auto object-cover max-h-[600px] group-hover:scale-105 transition-transform duration-1000"
                    />
                </div>

                {/* Content */}
                <div className="relative">
                    <div className="absolute -left-20 top-0 hidden xl:flex flex-col gap-4 sticky top-32">
                        <button className="size-12 rounded-2xl bg-foreground/5 hover:bg-primary hover:text-white transition-all flex items-center justify-center group shadow-xl">
                            <Share2 className="size-5" />
                        </button>
                    </div>

                    <div className="prose prose-zinc dark:prose-invert max-w-none 
                        prose-p:text-lg prose-p:leading-relaxed prose-p:text-foreground/70 prose-p:font-medium
                        prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground
                        prose-strong:text-foreground prose-strong:font-black
                        prose-ul:list-disc prose-ul:pl-6 prose-li:text-foreground/70
                        whitespace-pre-line px-1"
                    >
                        <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
                    </div>
                </div>

                {/* Tags */}
                <footer className="mt-20 pt-10 border-t border-foreground/5">
                    <div className="flex flex-wrap gap-2">
                        {["#BookStore", "#Knowledge", "#Reading", "#Success"].map(tag => (
                            <span key={tag} className="px-4 py-2 rounded-xl bg-foreground/5 text-xs font-black text-foreground/40 hover:text-primary hover:bg-primary/10 cursor-pointer transition-all">
                                {tag}
                            </span>
                        ))}
                    </div>
                </footer>
            </article>

            {/* Related Posts Section */}
            <section className="bg-foreground/[0.02] py-24 border-t border-foreground/5">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Đọc tiếp</span>
                            <h2 className="text-3xl font-black text-foreground tracking-tighter">Có thể bạn quan tâm</h2>
                        </div>
                        <Link to="/blogs" className="text-sm font-black text-primary hover:underline underline-offset-8">Xem tất cả bài viết</Link>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {relatedLoading ? (
                            [...Array(3)].map((_, i) => (
                                <div key={i} className="h-80 bg-foreground/5 animate-pulse rounded-3xl"></div>
                            ))
                        ) : relatedBlogs && relatedBlogs.length > 0 ? (
                            relatedBlogs.map((rBlog) => (
                                <div key={rBlog.id} className="h-full">
                                    <BlogCard
                                        id={rBlog.id}
                                        title={rBlog.title}
                                        excerpt={rBlog.summary}
                                        imageUrl={rBlog.thumbnail || "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop"}
                                        date={new Date(rBlog.createdAt).toLocaleDateString('vi-VN')}
                                        readTime="5 phút đọc"
                                        category="Đề xuất"
                                        slug={rBlog.slug}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-muted-foreground font-medium bg-background/50 rounded-3xl border border-dashed border-foreground/10">
                                Không có bài viết liên quan nào khác.
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}
