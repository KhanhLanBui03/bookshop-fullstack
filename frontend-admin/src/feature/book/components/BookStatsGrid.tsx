import { BookOpen, Package, AlertCircle, ShoppingCart, ArrowUpRight } from "lucide-react"
import type { BookDashboardStats } from "../book.type"

interface Props {
  stats: BookDashboardStats | null
}

export const BookStatsGrid = ({ stats }: Props) => {
  const cards = [
    {
      label: "Tổng số lượng sách",
      value: stats?.totalBooks?.toLocaleString() || "0",
      icon: <BookOpen className="size-5" />,
      color: "text-primary",
      bg: "bg-primary/10",
      desc: "Đầu sách trong kho"
    },
    {
      label: "Sách đang bán",
      value: stats?.countActive?.toLocaleString() || "0",
      icon: <Package className="size-5" />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      desc: "Trạng thái hoạt động"
    },
    {
      label: "Sắp hết hàng",
      value: stats?.countLowStock?.toLocaleString() || "0",
      icon: <AlertCircle className="size-5" />,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      desc: "Số lượng < 10"
    },
    {
      label: "Đã bán được",
      value: stats?.totalSold?.toLocaleString() || "0",
      icon: <ShoppingCart className="size-5" />,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      desc: "Tổng doanh số"
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {cards.map((stat, i) => (
        <div key={i} className="glass p-6 rounded-[2.5rem] border-white/20 hover:border-primary/30 transition-all group relative overflow-hidden">
          <div className={`size-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
            {stat.icon}
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{stat.label}</p>
          <h3 className="text-2xl font-black text-foreground tracking-tighter mb-1">{stat.value}</h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{stat.desc}</p>
          
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="size-4 text-muted-foreground" />
          </div>
        </div>
      ))}
    </div>
  )
}