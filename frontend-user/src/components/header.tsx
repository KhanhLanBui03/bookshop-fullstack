import { Link } from "react-router-dom"
import {
  Heart,
  KeyRound,
  SearchIcon,
  ShoppingBag,
  User,
  UserRoundPlus,
} from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import MainNavigation from "./Home/MainNavigation"
import { Avatar } from "@radix-ui/react-avatar"
import { AvatarFallback, AvatarImage } from "./ui/avatar"
const user = {
  name: "Bùi Khánh Lân",
  avatar: null,
}
const Header = () => {
  const wishlistQuantity = 2
  const cartQuantity = 3
  const isLoggedIn = true

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* ===== TOP BAR ===== */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            <img  src="./log5.png" className="w-30 h-20" />
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 mx-6 max-w-lg">
            <InputGroup className="w-full">
              <InputGroupInput placeholder="Tìm sách, tác giả..." />
              <InputGroupAddon>
                <SearchIcon className="w-4 h-4" />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupButton>Tìm</InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <User className="w-6 h-6 text-muted-foreground hover:text-blue-600" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="flex gap-2">
                      <KeyRound className="w-4 h-4" /> Đăng nhập
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/register" className="flex gap-2">
                      <UserRoundPlus className="w-4 h-4" /> Đăng ký
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/profile" className="group flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 transition">
                  {user.name}
                </span>
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-muted text-sm font-medium">
                    {user.name
                      .split(" ")
                      .map(w => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                  <AvatarImage src={user.avatar ?? undefined} />
                </Avatar>

              </Link>

            )}

            <Link to="/wishlist" className="relative">
              <Heart className="w-6 h-6 text-muted-foreground hover:text-red-500" />
              {wishlistQuantity > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-1.5">
                  {wishlistQuantity}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative">
              <ShoppingBag className="w-6 h-6 text-muted-foreground hover:text-blue-600" />
              {cartQuantity > 0 && (
                <span className="absolute -top-2 -right-2 text-xs bg-blue-600 text-white rounded-full px-1.5">
                  {cartQuantity}
                </span>
              )}
            </Link>

            <ModeToggle />
          </div>
        </div>

        {/* ===== SEARCH MOBILE ===== */}
        <div className="md:hidden py-3">
          <InputGroup>
            <InputGroupInput placeholder="Tìm sách..." />
            <InputGroupAddon>
              <SearchIcon className="w-4 h-4" />
            </InputGroupAddon>
          </InputGroup>
        </div>

      </div>

      {/* ===== NAVIGATION BAR (DƯỚI HEADER) ===== */}
      <div className="border-t bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <MainNavigation />
        </div>
      </div>
    </header>
  )
}

export default Header
