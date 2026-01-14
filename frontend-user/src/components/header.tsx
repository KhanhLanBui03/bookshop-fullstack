import { useState } from "react";
import { Link } from "react-router-dom"
import { Button } from "./ui/button";
import { Heart, KeyRound, SearchIcon, ShoppingBag, User, UserRoundPlus } from 'lucide-react';
import { ModeToggle } from "./mode-toggle";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./ui/input-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";

const Header = () => {
    // const [open, setOpen] = useState(false);
    const cartQuantity = 3;
    const isLoggedIn = false;
    return (
        <header className="flex dark:bg-zinc-900  items-center justify-between px-6 md:px-16 py-5 border-b border-gray-200 bg-white">
            <Link to="/" className="flex items-center gap-3">
                <h1 className="text-xl font-bold">BookShop</h1>
            </Link>
            {/* <nav
                className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:h-full items-center justify-center ${open ? "max-md:w-full" : "max-md:w-0"
                    } transition-[width] max-md:bg-white/50 backdrop-blur flex-col md:flex-row flex gap-8 text-gray-900 text-sm font-semibold dark:text-white`}
            >
                <Link to="/" className="hover:text-blue-600">
                    Trang chủ
                </Link>
                <Link to="/ProductListScreen" className="hover:text-blue-600">
                    Sản phẩm
                </Link>
                <Link to="/AssistanceChatScreen" className="hover:text-blue-600">
                    Hỗ trợ
                </Link>
                <Link to="/WarrantyAndReturnPolicy" className="hover:text-blue-600">
                    Chính sách
                </Link>
                <Button
                    id="closeMenu"
                    className="md:hidden text-gray-600"
                    onClick={() => setOpen(false)}
                />
            </nav> */}
            <InputGroup className="mx-4 flex-1 max-w-lg hidden md:flex">
                <InputGroupInput placeholder="Search..." />
                <InputGroupAddon>
                    <SearchIcon />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                    <InputGroupButton>Search</InputGroupButton>
                </InputGroupAddon>
            </InputGroup>

            <div className="hidden md:flex space-x-4 items-center">
                {
                    isLoggedIn ? (
                        <Link to="/UserProfile" className="text-gray-600 hover:text-blue-600">
                            Tài khoản
                        </Link>
                    ) : (
                        <Link to="/LoginScreen">
                            <DropdownMenu>
                                <DropdownMenuTrigger><User className="w-6 h-6 text-gray-400 hover:text-blue-600 transition" /></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem><KeyRound />Đăng nhập</DropdownMenuItem>
                                    <DropdownMenuItem><UserRoundPlus />Đăng ký</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </Link>
                    )
                }
                <Link to="/CartScreen" className="group relative px-3 py-2 rounded hover:hover:bg-accent transition">
                    <ShoppingBag className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition" />
                    {cartQuantity > 0 && (
                        <span className="absolute -top-1 -right-1 px-2 py-0.5 text-xs font-bold text-white bg-blue-600 rounded-full">
                            {cartQuantity}
                        </span>
                    )}
                </Link>

                <Link
                    to="/CartScreen"
                    className="
                        group flex items-center px-2 py-2
                        rounded transition
                        hover:bg-accent
                    "
                >
                    <Heart
                        className="
                            w-5 h-5
                            text-muted-foreground
                            group-hover:text-red-500
                            transition
                            "
                    />

                </Link>

                <ModeToggle />

            </div>
        </header>
    )
}

export default Header
