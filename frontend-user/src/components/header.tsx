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
import { useCartStore } from "@/store/cart.store"
import { useWishlistStore } from "@/store/wishlist.store"
import { useEffect } from "react"
import NotificationBell from "./NotificationBell"

const Header = () => {
  const { isAuthenticated, user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { wishlist, fetchWishlist } = useWishlistStore()
  const totalItems = useCartStore(state => state.cart?.totalItems || 0)
  const wishlistQuantity = wishlist?.items?.length || 0

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist()
    }
  }, [isAuthenticated])

  const handleLogout = async () => {
    await logout()
    setUserMenuOpen(false)
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-50 glass border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* ===== TOP BAR ===== */}
        <div className="flex items-center justify-between h-20">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center text-foreground hover:bg-accent rounded-xl transition-all"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center transition-transform hover:scale-105">
            <img src="/log5.png" alt="Logo" className="w-auto h-12 object-contain" />
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 mx-8 max-w-lg">
            <InputGroup className="w-full shadow-sm hover:shadow-md transition-shadow duration-300">
              <InputGroupInput placeholder="Tìm sách, tác giả..." className="bg-background/50" />
              <InputGroupAddon>
                <SearchIcon className="w-4 h-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <InputGroupButton className="bg-primary hover:bg-primary/90 text-primary-foreground">Tìm</InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            {/* User Menu */}
            {loading ? (
              <div className="p-2">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
              </div>
            ) : !isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="rounded-xl hover:bg-accent transition-all"
                >
                  <User className="size-6 text-foreground/80" />
                </Button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 glass rounded-2xl shadow-2xl border border-border py-2 animate-in fade-in zoom-in duration-200">
                    <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors">
                      <KeyRound className="w-4 h-4 text-primary" /> Đăng nhập
                    </Link>
                    <Link to="/register" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors">
                      <UserRoundPlus className="w-4 h-4 text-primary" /> Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-accent transition-all"
                >
                  <span className="hidden md:inline text-sm font-semibold text-foreground/90">
                    {user?.fullName || user?.email}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-lg ring-2 ring-primary/20">
                    {(user?.fullName || user?.email || 'U').split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                </Button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 glass rounded-2xl shadow-2xl border border-border py-2 animate-in fade-in zoom-in duration-200 overflow-hidden">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-accent transition-colors">
                      <User className="w-4 h-4 text-primary" /> Hồ sơ cá nhân
                    </Link>
                    <div className="px-2 py-1">
                      <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className="w-full justify-start gap-3 rounded-xl py-5"
                      >
                        <LogOut className="w-4 h-4" /> Đăng xuất
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isAuthenticated && <NotificationBell />}

            <Link to="/wishlist" className="relative p-2 hover:bg-accent rounded-xl transition-all group">
              <Heart className="size-6 text-foreground/80 group-hover:text-red-500 transition-colors" />
              {wishlistQuantity > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-[10px] bg-red-500 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold border-2 border-background">
                  {wishlistQuantity}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-accent rounded-xl transition-all group">
              <ShoppingBag className="size-6 text-foreground/80 group-hover:text-primary transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-[10px] bg-primary text-primary-foreground rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold border-2 border-background">
                  {totalItems}
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
