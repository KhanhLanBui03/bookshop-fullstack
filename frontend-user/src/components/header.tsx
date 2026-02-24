import { Link, useNavigate } from "react-router-dom"
import {
  Heart,
  KeyRound,
  Menu,
  SearchIcon,
  ShoppingBag,
  User,
  UserRoundPlus,
  X,
  LogOut,
} from "lucide-react"
import { ModeToggle } from "./mode-toggle"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group"

import MainNavigation from "./Home/MainNavigation"
import { useAuth } from "@/contexts/AuthContext"
import { useState } from "react"
import { Button } from "./ui/button"

const Header = () => {
  const { isAuthenticated, user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const wishlistQuantity = 2
  const cartQuantity = 3

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
    navigate("/")
  }

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
            {loading ? (
              <div className="p-2">
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gray-300 dark:bg-zinc-700 animate-pulse"></div>
              </div>
            ) : !isAuthenticated ? (
              <div className="relative">
                <Button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-4 bg-white hover:bg-gray-300 rounded-lg transition-colors"
                >
                    <User className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                </Button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 py-2">
                    <Link to="/login" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700">
                      <KeyRound className="w-4 h-4" /> Đăng nhập
                    </Link>
                    <Link to="/register" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-700">
                      <UserRoundPlus className="w-4 h-4" /> Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative bg-white">
                <Button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-white hover:text-gray-900"
                >
                  <span className="text-sm font-medium text-gray-900 bg-white">
                    {user?.email || 'User'}
                  </span>

                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {(user?.email || 'U').split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                </Button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200  py-2">
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100">
                      <User className="w-4 h-4" /> Hồ sơ
                    </Link>
                    <Button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </Button>
                  </div>
                )}
              </div>
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
