import { useState } from "react"
import {
    BookOpen,
    Globe,
    Code,
    Tag,
    HelpCircle,
    Info,
    TrendingUp,
    Sparkles,
    Clock,
    Percent,
    Package,
    ChevronDown,
    PenTool
} from "lucide-react"




// Main Navigation Component
const MainNavigation = ({ isMobile = false }) => {
    const [activeMenu, setActiveMenu] = useState(null)
    const [mobileActiveMenu, setMobileActiveMenu] = useState(null)

    const menuItems = {
        books: {
            title: "Sách",
            icon: BookOpen,
            sections: [
                {
                    title: "Thể loại phổ biến",
                    items: [
                        { name: "Văn học", icon: BookOpen },
                        { name: "Kinh tế", icon: TrendingUp },
                        { name: "Thiếu nhi", icon: Sparkles },
                        { name: "Tâm lý – Kỹ năng", icon: HelpCircle },
                    ]
                },
                {
                    title: "Chuyên mục đặc biệt",
                    items: [
                        { name: "Ngoại ngữ", icon: Globe },
                        { name: "Công nghệ & Lập trình", icon: Code },
                        { name: "Sách mới", icon: Clock },
                        { name: "Combo tiết kiệm", icon: Package },
                    ]
                }
            ]
        }
    }

    const toggleMobileSubmenu = (menu) => {
        setMobileActiveMenu(mobileActiveMenu === menu ? null : menu)
    }

    if (isMobile) {
        return (
            <div className="py-2 space-y-1">
                {/* Sách - Mobile */}
                <div>
                    <button
                        onClick={() => toggleMobileSubmenu('books')}
                        className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span>Sách</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileActiveMenu === 'books' ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileActiveMenu === 'books' && (
                        <div className="mt-1 ml-4 space-y-3 py-2">
                            {menuItems.books.sections.map((section, idx) => (
                                <div key={idx}>
                                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 px-4">
                                        {section.title}
                                    </h4>
                                    <ul className="space-y-0.5">
                                        {section.items.map((item, i) => (
                                            <li key={i}>
                                                <a
                                                    href="/list-books"
                                                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                                                >
                                                    <item.icon className="w-3.5 h-3.5 text-gray-400" />
                                                    <span>{item.name}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Other Links - Mobile */}
                <a href="/list-books" className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors">
                    <Tag className="w-4 h-4" />
                    <span>Khuyến mãi</span>
                    <span className="ml-auto bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 text-xs px-2 py-0.5 rounded-full font-bold">HOT</span>
                </a>

                <a href="/blogs" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <PenTool className="w-4 h-4" />
                    <span>Blog</span>
                </a>

                <a href="/support" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <HelpCircle className="w-4 h-4" />
                    <span>Hỗ trợ</span>
                </a>

                <a href="/about" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <Info className="w-4 h-4" />
                    <span>Về chúng tôi</span>
                </a>
            </div>
        )
    }

    // Desktop Navigation
    return (
        <div className="flex items-center gap-1">
            {/* Sách Dropdown */}
            <div
                className="relative"
                onMouseEnter={() => setActiveMenu('books')}
                onMouseLeave={() => setActiveMenu(null)}
            >
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-200">
                    <BookOpen className="w-4 h-4" />
                    <span>Sách</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeMenu === 'books' ? 'rotate-180' : ''}`} />
                </button>

                {activeMenu === 'books' && (
                    <div className="absolute top-full left-0 mt-2 w-[580px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 p-6 animate-fadeIn z-50">
                        <div className="grid grid-cols-2 gap-8">
                            {menuItems.books.sections.map((section, idx) => (
                                <div key={idx}>
                                    <h4 className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-4">
                                        {section.title}
                                    </h4>
                                    <ul className="space-y-1">
                                        {section.items.map((item, i) => (
                                            <li key={i}>
                                                <a
                                                    href="/list-books"
                                                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-zinc-300 hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 rounded-xl transition-all duration-200 group"
                                                >
                                                    <item.icon className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                                                    <span className="font-semibold">{item.name}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Other Links */}
            <a href="/list-books" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all duration-200">
                <Tag className="w-4 h-4" />
                <span>Khuyến mãi</span>
                <span className="ml-1 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 text-[10px] px-2 py-0.5 rounded-full font-black">HOT</span>
            </a>

            <a href="/blogs" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-200">
                <PenTool className="w-4 h-4" />
                <span>Blog</span>
            </a>

            <a href="/support" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-200">
                <HelpCircle className="w-4 h-4" />
                <span>Hỗ trợ</span>
            </a>

            <a href="/about" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all duration-200">
                <Info className="w-4 h-4" />
                <span>Về chúng tôi</span>
            </a>
        </div>
    )
}
export default MainNavigation