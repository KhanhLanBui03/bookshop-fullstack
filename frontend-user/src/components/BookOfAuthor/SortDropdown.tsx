import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

const SortDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState('Mới nhất');

    const options = ['Mới nhất', 'Cũ nhất', 'Giá thấp đến cao', 'Giá cao đến thấp', 'Đánh giá cao nhất'];

    return (
        <div className="relative">
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
            >
                <span className="font-medium">{selected}</span>
                <ChevronDown className="w-4 h-4" />
            </Button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                    {options.map((option) => (
                        <Button
                            key={option}
                            onClick={() => {
                                setSelected(option);
                                setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl transition-colors"
                        >
                            {option}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
};
export default SortDropdown;