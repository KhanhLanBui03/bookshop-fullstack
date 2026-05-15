import { useFetch } from "@/hooks/useFetch"
import { authorService } from "@/services/author.service"
import type { AuthorResponse } from "@/types/Author"
import { BookOpen, Star, Award, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"

export default function FeaturedAuthors() {
    const { data: authors, loading } = useFetch<AuthorResponse[]>(() => authorService.getFeatured(), [])

    if (loading) {
        return (
            <section className="py-24 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col items-center mb-16 text-center">
                        <div className="h-8 w-48 bg-zinc-800 animate-pulse rounded-full mb-4"></div>
                        <div className="h-4 w-64 bg-zinc-800 animate-pulse rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-[450px] bg-zinc-900/50 rounded-[2.5rem] animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (!authors || authors.length === 0) return null

    return (
        <section className="py-24 bg-zinc-950 overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center mb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em] mb-6">
                        <Award className="size-3" />
                        Tâm điểm
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tighter">
                        Tác giả <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">nổi bật</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl font-medium text-lg leading-relaxed">
                        Khám phá những tác giả tài năng và tác phẩm đình đám của họ. 
                        Những người đã góp phần thay đổi thế giới qua từng trang sách.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {authors.map((author) => (
                        <div 
                            key={author.id} 
                            className="group relative p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 hover:border-primary/30 transition-all duration-500 backdrop-blur-xl flex flex-col items-center text-center overflow-hidden"
                        >
                            {/* Hover Gradient Effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                            {/* Avatar Section */}
                            <div className="relative mb-8">
                                <div className="size-32 rounded-full p-1.5 bg-gradient-to-br from-primary via-blue-500 to-purple-500 shadow-2xl shadow-primary/20 group-hover:scale-105 transition-transform duration-500">
                                    <div className="size-full rounded-full border-4 border-zinc-950 overflow-hidden bg-zinc-800">
                                        <img 
                                            src={author.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + author.name} 
                                            alt={author.name}
                                            className="size-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-primary text-white rounded-full text-[10px] font-black shadow-lg">
                                    <BookOpen className="size-3" />
                                    {author.bookCount || 0} Books
                                </div>
                            </div>

                            {/* Author Info */}
                            <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-primary transition-colors">
                                {author.name}
                            </h3>
                            
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-6">
                                <Award className="size-3 text-primary" />
                                {author.bio?.split('.')[0] || "Featured Author"}
                            </div>

                            <p className="text-zinc-400 text-sm leading-relaxed mb-8 line-clamp-3">
                                {author.bio || "Chưa có thông tin tiểu sử chi tiết cho tác giả này. Vui lòng quay lại sau."}
                            </p>

                            {/* Ratings */}
                            <div className="flex items-center gap-1 mb-8">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="size-4 fill-yellow-500 text-yellow-500" />
                                ))}
                            </div>

                            <Link 
                                to={`/authors/${author.id}`}
                                className="mt-auto w-full py-4 rounded-2xl bg-white/5 hover:bg-primary text-white font-black text-sm transition-all duration-300 border border-white/10 hover:border-primary flex items-center justify-center gap-2 group/btn relative z-20"
                            >
                                Xem chi tiết
                                <ChevronRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
