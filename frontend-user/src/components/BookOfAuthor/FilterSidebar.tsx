import { SlidersHorizontal, Star } from "lucide-react";
import { Button } from "../ui/button";

const FilterSidebarAuthor = ({ filters, onFilterChange }) => {
    return (
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 sticky top-28 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-primary/10 rounded-xl">
                    <SlidersHorizontal className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-black text-xl text-white tracking-tight">Bộ lọc</h3>
            </div>

            {/* Price Range */}
            <div className="mb-8 pb-8 border-b border-white/5">
                <h4 className="font-black text-xs uppercase tracking-widest text-zinc-500 mb-6">Khoảng giá</h4>
                <div className="space-y-4">
                    {['Tất cả', 'Dưới 200K', '200K - 300K', '300K - 500K', 'Trên 500K'].map((range) => (
                        <label key={range} className="flex items-center gap-3 cursor-pointer group text-zinc-400 hover:text-white transition-colors">
                            <div className="relative flex items-center justify-center">
                                <input type="checkbox" className="peer appearance-none size-5 rounded-lg border-2 border-white/10 checked:bg-primary checked:border-primary transition-all cursor-pointer" />
                                <div className="absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                                    <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                                </div>
                            </div>
                            <span className="font-bold text-sm">{range}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Format */}
            <div className="mb-8 pb-8 border-b border-white/5">
                <h4 className="font-black text-xs uppercase tracking-widest text-zinc-500 mb-6">Hình thức</h4>
                <div className="space-y-4">
                    {['Bìa cứng', 'Bìa mềm', 'Ebook'].map((format) => (
                        <label key={format} className="flex items-center gap-3 cursor-pointer group text-zinc-400 hover:text-white transition-colors">
                            <div className="relative flex items-center justify-center">
                                <input type="checkbox" className="peer appearance-none size-5 rounded-lg border-2 border-white/10 checked:bg-primary checked:border-primary transition-all cursor-pointer" />
                                <div className="absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                                    <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                                </div>
                            </div>
                            <span className="font-bold text-sm">{format}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Rating */}
            <div>
                <h4 className="font-black text-xs uppercase tracking-widest text-zinc-500 mb-6">Đánh giá</h4>
                <div className="space-y-4">
                    {[5, 4, 3].map((rating) => (
                        <label key={rating} className="flex items-center gap-3 cursor-pointer group text-zinc-400 hover:text-white transition-colors">
                            <div className="relative flex items-center justify-center">
                                <input type="checkbox" className="peer appearance-none size-5 rounded-lg border-2 border-white/10 checked:bg-primary checked:border-primary transition-all cursor-pointer" />
                                <div className="absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                                    <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'fill-yellow-500 text-yellow-500' : 'fill-white/5 text-white/5'}`} />
                                    ))}
                                </div>
                                <span className="text-xs font-bold ml-1">trở lên</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <Button className="w-full mt-10 py-6 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black transition-all shadow-lg shadow-primary/20 active:scale-95 uppercase text-xs tracking-widest">
                Áp dụng bộ lọc
            </Button>
        </div>
    );
};
export default FilterSidebarAuthor;