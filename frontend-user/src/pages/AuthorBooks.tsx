import BookCard from "@/components/BookOfAuthor/BookCard";
import FilterSidebarAuthor from "@/components/BookOfAuthor/FilterSidebar";
import SortDropdown from "@/components/BookOfAuthor/SortDropdown";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { authorService } from "@/services/author.service";
import type { AuthorDetailResponse } from "@/types/Author";
import { ChevronRight, Grid3x3, List, Search, Star } from "lucide-react";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";

const AuthorBooksPage = () => {
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const { id } = useParams();

    const { data: dataResponse, loading } = useFetch<AuthorDetailResponse>(() =>
        authorService.getBooksByAuthor(Number(id)), [id]
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-zinc-400 font-bold animate-pulse">Đang tải dữ liệu tác giả...</p>
                </div>
            </div>
        );
    }

    const filteredBooks = dataResponse?.books.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            {/* Breadcrumb */}
            <div className="bg-zinc-900/50 border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-3 text-sm font-medium">
                        <Link to="/" className="text-zinc-500 hover:text-primary transition-colors">Trang chủ</Link>
                        <ChevronRight className="w-4 h-4 text-zinc-700" />
                        <span className="text-zinc-500">Tác giả</span>
                        <ChevronRight className="w-4 h-4 text-zinc-700" />
                        <span className="text-primary font-bold">{dataResponse?.author.name}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Author Info Card */}
                <div className="bg-zinc-900 rounded-[3rem] shadow-2xl p-10 mb-16 border border-white/5 relative overflow-hidden">
                    {/* Background Glows */}
                    <div className="absolute -top-24 -right-24 size-96 bg-primary/20 blur-[120px] rounded-full"></div>
                    <div className="absolute -bottom-24 -left-24 size-96 bg-blue-500/10 blur-[120px] rounded-full"></div>

                    <div className="relative z-10 flex flex-col lg:row items-center lg:items-start gap-12 lg:flex-row">
                        <div className="relative group flex-shrink-0">
                            <div className="size-56 rounded-full p-2 bg-gradient-to-br from-primary via-blue-500 to-purple-500 shadow-2xl shadow-primary/20 group-hover:scale-105 transition-transform duration-700">
                                <div className="size-full rounded-full border-8 border-zinc-900 overflow-hidden bg-zinc-800">
                                    <img
                                        src={dataResponse?.author.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dataResponse?.author.name}`}
                                        alt={dataResponse?.author.name}
                                        className="size-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                <Star className="size-3 fill-primary" />
                                Tác giả tiêu biểu
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">
                                {dataResponse?.author.name}
                            </h1>
                            <p className="text-zinc-400 mb-10 leading-relaxed max-w-3xl text-lg font-medium italic">
                                "{dataResponse?.author.bio || "Chưa có thông tin tiểu sử chi tiết cho tác giả này."}"
                            </p>
                            
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 md:gap-16">
                                <div className="flex flex-col">
                                    <span className="text-4xl font-black text-white leading-none mb-2">
                                        {dataResponse?.author.bookCount || dataResponse?.books.length || 0}
                                    </span>
                                    <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">Tác phẩm</span>
                                </div>
                                <div className="h-12 w-px bg-white/10 hidden md:block"></div>
                                <div className="flex flex-col">
                                    <span className="text-4xl font-black text-white leading-none mb-2">
                                        {dataResponse?.author.follower?.toLocaleString() || "0"}
                                    </span>
                                    <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">Người theo dõi</span>
                                </div>
                                <div className="h-12 w-px bg-white/10 hidden md:block"></div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="size-5 fill-yellow-500 text-yellow-500" />
                                        ))}
                                    </div>
                                    <span className="text-zinc-500 text-xs font-black uppercase tracking-widest">Đánh giá 5 sao</span>
                                </div>
                            </div>
                        </div>

                        <Button className="bg-white hover:bg-zinc-200 text-zinc-950 px-12 py-8 rounded-3xl font-black text-xl transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3 lg:self-center">
                            Theo dõi
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <FilterSidebarAuthor />
                    </div>

                    {/* Books Content */}
                    <div className="lg:col-span-3">
                        {/* Toolbar */}
                        <div className="bg-zinc-900/40 rounded-[2.5rem] border border-white/5 p-8 mb-8 backdrop-blur-sm">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="relative w-full md:max-w-md">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-zinc-500" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm tác phẩm..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4 bg-zinc-950 border border-white/5 rounded-2xl focus:border-primary/50 focus:outline-none transition-all placeholder:text-zinc-600 font-medium"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-white/5">
                                        <Button
                                            onClick={() => setViewMode('grid')}
                                            className={`size-12 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-zinc-800 text-primary shadow-xl' : 'bg-transparent text-zinc-500 hover:text-zinc-300'}`}
                                        >
                                            <Grid3x3 className="size-6" />
                                        </Button>
                                        <Button
                                            onClick={() => setViewMode('list')}
                                            className={`size-12 rounded-xl transition-all ${viewMode === 'list' ? 'bg-zinc-800 text-primary shadow-xl' : 'bg-transparent text-zinc-500 hover:text-zinc-300'}`}
                                        >
                                            <List className="size-6" />
                                        </Button>
                                    </div>
                                    <SortDropdown />
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between px-2">
                                <p className="text-zinc-400 font-medium">
                                    Hiển thị <span className="text-white font-black">{filteredBooks.length}</span> tác phẩm tiêu biểu
                                </p>
                            </div>
                        </div>

                        {/* Books Grid */}
                        <div className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8'
                                : 'space-y-8'
                        }>
                            {filteredBooks.map(book => (
                                <BookCard key={book.id} book={book} viewMode={viewMode} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {filteredBooks.length > 0 && (
                            <div className="flex items-center justify-center gap-3 mt-20">
                                <Button className="px-6 py-4 bg-zinc-900 border border-white/5 rounded-2xl text-zinc-400 hover:text-white transition-all">Trước</Button>
                                {[1, 2, 3].map(page => (
                                    <Button
                                        key={page}
                                        className={`size-14 rounded-2xl font-black transition-all ${page === 1 ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-zinc-900 text-zinc-500 border border-white/5 hover:border-primary/30'}`}
                                    >
                                        {page}
                                    </Button>
                                ))}
                                <Button className="px-6 py-4 bg-zinc-900 border border-white/5 rounded-2xl text-zinc-400 hover:text-white transition-all">Sau</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorBooksPage;