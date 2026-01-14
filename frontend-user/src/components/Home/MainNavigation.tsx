import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"

const MainNavigation = () => {
    return (
        <NavigationMenu className="w-full px-6 md:px-16 py-2 bg-white border-b border-gray-200 dark:bg-zinc-900">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Sách</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <div className="grid grid-cols-2 gap-6 p-6 w-[520px]">

                            {/* Cột 1 */}
                            <div>
                                <h4 className="mb-2 text-sm font-semibold text-gray-900">
                                    Thể loại
                                </h4>
                                <ul className="space-y-2 text-sm">
                                    <NavigationMenuLink className="block hover:text-blue-600">
                                        Văn học
                                    </NavigationMenuLink>
                                    <NavigationMenuLink className="block hover:text-blue-600">
                                        Kinh tế
                                    </NavigationMenuLink>
                                    <NavigationMenuLink className="block hover:text-blue-600">
                                        Thiếu nhi
                                    </NavigationMenuLink>
                                    <NavigationMenuLink className="block hover:text-blue-600">
                                        Tâm lý – Kỹ năng sống
                                    </NavigationMenuLink>
                                </ul>
                            </div>

                            {/* Cột 2 */}
                            <div>
                                <h4 className="mb-2 text-sm font-semibold text-gray-900">
                                    Theo nhu cầu
                                </h4>
                                <ul className="space-y-2 text-sm">
                                    <NavigationMenuLink className="block hover:text-blue-600">
                                        Sách bán chạy
                                    </NavigationMenuLink>
                                    <NavigationMenuLink className="block hover:text-blue-600">
                                        Sách mới phát hành
                                    </NavigationMenuLink>
                                    <NavigationMenuLink className="block hover:text-blue-600">
                                        Sách giảm giá
                                    </NavigationMenuLink>
                                    <NavigationMenuLink className="block hover:text-blue-600">
                                        Combo tiết kiệm
                                    </NavigationMenuLink>
                                </ul>
                            </div>

                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                {/* NGOẠI NGỮ */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Ngoại ngữ</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-2 p-4 w-[300px] text-sm">
                            <NavigationMenuLink className="hover:text-blue-600">
                                Tiếng Anh
                            </NavigationMenuLink>
                            <NavigationMenuLink className="hover:text-blue-600">
                                Tiếng Nhật
                            </NavigationMenuLink>
                            <NavigationMenuLink className="hover:text-blue-600">
                                Tiếng Hàn
                            </NavigationMenuLink>
                            <NavigationMenuLink className="hover:text-blue-600">
                                Tiếng Trung
                            </NavigationMenuLink>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                {/* CÔNG NGHỆ */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Công nghệ</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-2 p-4 w-[280px] text-sm">
                            <NavigationMenuLink className="hover:text-blue-600">
                                Lập trình
                            </NavigationMenuLink>
                            <NavigationMenuLink className="hover:text-blue-600">
                                AI – Data
                            </NavigationMenuLink>
                            <NavigationMenuLink className="hover:text-blue-600">
                                Backend
                            </NavigationMenuLink>
                            <NavigationMenuLink className="hover:text-blue-600">
                                DevOps
                            </NavigationMenuLink>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                {/* KHUYẾN MÃI */}
                <NavigationMenuItem>
                    <NavigationMenuLink className="px-4 py-2 text-red-600 font-semibold hover:text-red-700">
                        Khuyến mãi
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink className="px-4 py-2  font-semibold hover:text-blue-600">
                        Hỗ trợ
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink className="px-4 py-2 font-semibold hover:text-blue-600">
                    <Link to="/about">Về chúng tôi</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

            </NavigationMenuList>
        </NavigationMenu>
    )
}

export default MainNavigation
