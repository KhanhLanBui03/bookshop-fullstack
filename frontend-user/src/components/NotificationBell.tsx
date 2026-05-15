import { useEffect, useState, useRef } from "react"
import { Bell, CheckCheck, ExternalLink } from "lucide-react"
import { notificationService } from "@/services/notification.service"
import type { NotificationResponse } from "@/types/Notification"
import { Link } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { useAuth } from "@/contexts/AuthContext"

export default function NotificationBell() {
    const { isAuthenticated } = useAuth()
    const [notifications, setNotifications] = useState<NotificationResponse[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const fetchNotifications = async () => {
        if (!isAuthenticated) return
        try {
            const [list, count] = await Promise.all([
                notificationService.getAll(),
                notificationService.getUnreadCount()
            ])
            setNotifications(list)
            setUnreadCount(count)
        } catch (error) {
            console.error("Failed to fetch notifications", error)
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications()
            const interval = setInterval(fetchNotifications, 60000) // Polling every minute
            return () => clearInterval(interval)
        }
    }, [isAuthenticated])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleMarkAsRead = async (id: number) => {
        try {
            await notificationService.markAsRead(id)
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (error) {
            console.error("Failed to mark as read", error)
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead()
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
            setUnreadCount(0)
        } catch (error) {
            console.error("Failed to mark all as read", error)
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-accent rounded-xl transition-all group focus:outline-none"
            >
                <Bell className={`size-6 ${unreadCount > 0 ? 'text-primary animate-wiggle' : 'text-foreground/80'}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-background">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 glass rounded-2xl shadow-2xl border border-border overflow-hidden z-[100] animate-in fade-in zoom-in duration-200">
                    <div className="p-4 border-b border-border flex justify-between items-center bg-accent/30">
                        <h3 className="font-bold text-foreground">Thông báo</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                            >
                                <CheckCheck className="size-3" /> Đánh dấu đã đọc hết
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-10 text-center text-muted-foreground">
                                <Bell className="size-10 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">Không có thông báo nào</p>
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    className={`p-4 border-b border-border last:border-0 hover:bg-accent/50 transition-colors relative ${!n.isRead ? 'bg-primary/[0.03]' : ''}`}
                                    onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                                >
                                    {!n.isRead && (
                                        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary" />
                                    )}
                                    <div className="pr-4">
                                        <p className={`text-sm font-bold ${!n.isRead ? 'text-foreground' : 'text-foreground/70'}`}>
                                            {n.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                            {n.content}
                                        </p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-[10px] text-muted-foreground uppercase font-medium">
                                                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: vi })}
                                            </span>
                                            {n.link && (
                                                <Link
                                                    to={n.link}
                                                    className="text-[10px] text-primary flex items-center gap-1 hover:underline font-bold uppercase tracking-wider"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    Xem chi tiết <ExternalLink className="size-2" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-3 bg-accent/10 text-center border-t border-border">
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                            Cuộn để xem thêm
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
