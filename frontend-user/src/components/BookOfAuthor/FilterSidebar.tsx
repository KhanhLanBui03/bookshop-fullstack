import { SlidersHorizontal, Star } from "lucide-react";
import { Button } from "../ui/button";

const FilterSidebarAuthor = ({ filters, onFilterChange }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-5 h-5" />
                <h3 className="font-bold text-xl">Bộ lọc</h3>
            </div>

            {/* Price Range */}
            <div className="mb-6 pb-6 border-b">
                <h4 className="font-semibold mb-4">Khoảng giá</h4>
                <div className="space-y-2">
                    {['Tất cả', 'Dưới 200K', '200K - 300K', '300K - 500K', 'Trên 500K'].map((range) => (
                        <label key={range} className="flex items-center gap-3 cursor-pointer hover:text-blue-600">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                            <span>{range}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Format */}
            <div className="mb-6 pb-6 border-b">
                <h4 className="font-semibold mb-4">Hình thức</h4>
                <div className="space-y-2">
                    {['Bìa cứng', 'Bìa mềm', 'Ebook'].map((format) => (
                        <label key={format} className="flex items-center gap-3 cursor-pointer hover:text-blue-600">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                            <span>{format}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Rating */}
            <div>
                <h4 className="font-semibold mb-4">Đánh giá</h4>
                <div className="space-y-2">
                    {[5, 4, 3].map((rating) => (
                        <label key={rating} className="flex items-center gap-3 cursor-pointer hover:text-blue-600">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                            <div className="flex items-center gap-1">
                                {[...Array(rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                                <span className="ml-1">trở lên</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <Button className="w-full mt-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                Áp dụng bộ lọc
            </Button>
        </div>
    );
};
export default FilterSidebarAuthor;