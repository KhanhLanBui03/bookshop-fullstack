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
                className="flex items-center gap-2 px-6 py-4 bg-zinc-950 border border-white/5 rounded-2xl hover:border-primary/50 transition-all text-white"
            >
                <span className="font-bold text-sm">{selected}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
            {isOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in zoom-in duration-200">
                    {options.map((option) => (
                        <button
                            key={option}
                            onClick={() => {
                                setSelected(option);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-6 py-3 text-sm font-bold transition-all ${selected === option ? 'text-primary bg-primary/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
export default SortDropdown;