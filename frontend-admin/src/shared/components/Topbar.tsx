import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useRef, useEffect } from "react"
import { Bell, Search, ChevronDown, Settings, LogOut, Sun, CheckCircle2, AlertTriangle, Package, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { notificationApi } from "@/api/notification.api"
import type { NotificationResponse } from "@/types/notification.type"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { useAuth } from "@/feature/auth/contexts/AuthContext"

interface TopbarProps {
  title: string
  subtitle?: string
}

export const Topbar = ({ title, subtitle }: TopbarProps) => {
  const { user, logout } = useAuth()
  const [showNotif, setShowNotif] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const [notifs, setNotifs] = useState<NotificationResponse[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const notifRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = async () => {
    try {
      const [list, count] = await Promise.all([
        notificationApi.getMyNotifications(),
        notificationApi.getUnreadCount()
      ])
      setNotifs(list)
      setUnreadCount(count)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Poll every 3 seconds for near real-time updates
    const interval = setInterval(fetchNotifications, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUser(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id)
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      setNotifs(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  const getIcon = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes("đơn hàng") || t.includes("order")) return <Package className="size-5 text-blue-500" />
    if (t.includes("hết hàng") || t.includes("stock") || t.includes("cảnh báo")) return <AlertTriangle className="size-5 text-amber-500" />
    if (t.includes("thành công") || t.includes("success")) return <CheckCircle2 className="size-5 text-emerald-500" />
    return <Info className="size-5 text-slate-500" />
  }

  return (
    <header className="h-20 bg-white/80 dark:bg-card/80 backdrop-blur-xl sticky top-0 z-40 border-b border-border/50 px-8 flex items-center justify-between shadow-sm">
      {/* ── LEFT: Title ── */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-1 bg-primary rounded-full hidden lg:block" />
        <div className="space-y-0.5">
          <h1 className="text-xl font-black text-foreground tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{subtitle}</p>
          )}
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative group hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
                placeholder="Tìm kiếm nhanh..." 
                className="w-64 pl-11 bg-muted/50 border-border/50 rounded-2xl h-11 focus-visible:ring-primary/20 transition-all focus-visible:w-80"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                <kbd className="px-1.5 py-0.5 rounded-md bg-background border border-border/50 text-[10px] font-black text-muted-foreground shadow-sm">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded-md bg-background border border-border/50 text-[10px] font-black text-muted-foreground shadow-sm">K</kbd>
            </div>
        </div>

        <div className="flex items-center gap-3 border-l border-border/50 pl-6">
            {/* Notification bell */}
            <div ref={notifRef} className="relative">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { setShowNotif(!showNotif); setShowUser(false) }}
                    className={`size-11 rounded-2xl relative transition-all ${unreadCount > 0 ? "bg-primary/5 text-primary" : "text-muted-foreground"}`}
                >
                    <Bell className={`size-5 ${unreadCount > 0 ? "animate-pulse" : ""}`} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2.5 right-2.5 size-4 bg-primary text-primary-foreground text-[10px] font-black rounded-full border-2 border-background flex items-center justify-center animate-bounce">
                            {unreadCount}
                        </span>
                    )}
                </Button>

                {showNotif && (
                    <div className="absolute right-0 top-full mt-4 w-96 glass rounded-[2rem] shadow-2xl overflow-hidden border border-border/50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-5 border-b border-border/50 flex items-center justify-between bg-muted/10">
                            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Thông báo</h3>
                            <button 
                              onClick={handleMarkAllAsRead}
                              className="text-[10px] font-black text-primary uppercase hover:underline disabled:opacity-50"
                              disabled={unreadCount === 0}
                            >
                              Đánh dấu tất cả là đã đọc
                            </button>
                        </div>
                        <div className="max-h-[32rem] overflow-y-auto scrollbar-hide py-2">
                            {notifs.length === 0 ? (
                              <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
                                <Bell className="size-8 opacity-20" />
                                <p className="text-xs font-bold uppercase tracking-tighter">Không có thông báo nào</p>
                              </div>
                            ) : (
                              notifs.map((n) => (
                                <div 
                                  key={n.id} 
                                  onClick={() => handleMarkAsRead(n.id)}
                                  className={`px-5 py-4 hover:bg-primary/5 transition-colors cursor-pointer flex gap-4 group ${!n.read ? "bg-primary/[0.02]" : ""}`}
                                >
                                    <div className="size-10 rounded-xl bg-muted flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                      {getIcon(n.title)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className={`text-xs leading-relaxed ${!n.read ? "font-black text-foreground" : "font-medium text-muted-foreground"}`}>
                                          {n.content}
                                        </p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">
                                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: vi })}
                                        </p>
                                    </div>
                                    {!n.read && <div className="size-2 bg-primary rounded-full mt-2" />}
                                </div>
                              ))
                            )}
                        </div>
                        <div className="p-4 border-t border-border/50 bg-muted/20">
                            <Button variant="ghost" className="w-full text-xs font-black text-primary uppercase">Xem tất cả thông báo</Button>
                        </div>
                    </div>
                )}
            </div>

            {/* User Dropdown */}
            <div ref={userRef} className="relative">
                <button 
                    onClick={() => { setShowUser(!showUser); setShowNotif(false) }}
                    className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-muted/50 transition-all border border-transparent hover:border-border/50 group"
                >
                    <Avatar className="size-9 border-2 border-primary/10 group-hover:border-primary/30 transition-colors">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.fullName || 'Admin'}&background=random`} />
                        <AvatarFallback className="font-black text-xs text-primary">
                          {(user?.fullName || 'AD').substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden sm:block">
                        <p className="text-xs font-black text-foreground leading-none">{user?.fullName || 'Admin'}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mt-1">
                          {user?.roles.includes('ROLE_ADMIN') ? 'Quản trị viên' : 'Người dùng'}
                        </p>
                    </div>
                    <ChevronDown className={`size-4 text-muted-foreground transition-transform duration-300 ${showUser ? "rotate-180" : ""}`} />
                </button>

                {showUser && (
                    <div className="absolute right-0 top-full mt-4 w-64 glass rounded-[2rem] shadow-2xl border border-border/50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-4 border-b border-border/50 mb-2">
                             <p className="text-xs font-black text-foreground">{user?.email}</p>
                             <div className="mt-2 inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                                Role: {user?.roles.join(', ')}
                             </div>
                        </div>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-2xl transition-all">
                            <Settings className="size-4" />
                            Cài đặt tài khoản
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-2xl transition-all">
                            <Sun className="size-4" />
                            Giao diện: Sáng
                        </button>
                        <div className="h-px bg-border/50 my-2 mx-4" />
                        <button 
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-destructive hover:bg-destructive/5 rounded-2xl transition-all"
                        >
                            <LogOut className="size-4" />
                            Đăng xuất hệ thống
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </header>
  )
}