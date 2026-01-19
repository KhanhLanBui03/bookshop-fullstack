import { Link } from "react-router-dom"
import {
  Heart,
  KeyRound,
  Menu,
  SearchIcon,
  ShoppingBag,
  User,
  UserRoundPlus,
  X,
} from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group"

import MainNavigation from "./Home/MainNavigation"


import { useState } from "react"
const user = {
  name: "Bùi Khánh Lân",
  avatar: null,
}
const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const wishlistQuantity = 2
  const cartQuantity = 3
  const isLoggedIn = true

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* ===== TOP BAR ===== */}
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors flex-shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
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
          {/* Icons */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            {/* User Menu */}
            {!isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-400" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 py-2">
                    <a href="/login" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700">
                      <KeyRound className="w-4 h-4" /> Đăng nhập
                    </a>
                    <a href="/register" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700">
                      <UserRoundPlus className="w-4 h-4" /> Đăng ký
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <a href="/profile" className="hidden md:flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-zinc-800 px-3 py-2 rounded-lg transition-colors">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.name}</span>
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
              </a>
            )}

            <a href="/wishlist" className="relative p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <Heart className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-400" />
              {wishlistQuantity > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {wishlistQuantity}
                </span>
              )}
            </a>

            {/* Cart */}
            <a href="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-400" />
              {cartQuantity > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartQuantity}
                </span>
              )}
            </a>

            <ModeToggle  />
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
      {/* Desktop Navigation */}
      <div className="hidden lg:block border-t border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-2">
          <MainNavigation />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-slideDown">
          <div className="max-w-7xl mx-auto px-4 py-3 max-h-[calc(100vh-10rem)] overflow-y-auto">
            <MainNavigation isMobile={true} />
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
