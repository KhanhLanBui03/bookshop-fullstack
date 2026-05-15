import { 
    Edit3,
    Trash2, 
    Star, 
    ArrowUpDown, 
    ChevronUp, 
    ChevronDown,
    BookOpen,
    User,
    Tags
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { BookAdminResponse } from "../book.type"

type SortCol = "title" | "salePrice" | "soldCount" | "stock"

interface Props {
    books: BookAdminResponse[]
    loading: boolean
    page: number
    pageSize: number
    sortBy: SortCol
    sortDir: "asc" | "desc"
    onSort: (col: SortCol) => void
    onEdit: (book: BookAdminResponse) => void
    onDelete: (book: BookAdminResponse) => void
}

const fmt = (n: number) => `${Number(n ?? 0).toLocaleString()}₫`

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
    ACTIVE: { label: "Đang bán", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    INACTIVE: { label: "Ngừng bán", color: "text-muted-foreground", bg: "bg-muted/10" },
    OUT_OF_STOCK: { label: "Hết hàng", color: "text-rose-500", bg: "bg-rose-500/10" },
}

export const BookTable = ({
    books, loading, page, pageSize,
    sortBy, sortDir, onSort, onEdit, onDelete,
}: Props) => {
    const SortIcon = ({ col }: { col: SortCol }) => {
        if (sortBy !== col) return <ArrowUpDown className="size-3 opacity-30" />
        return sortDir === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />
    }

    return (
        <div className="glass rounded-[3rem] overflow-hidden border-white/20 mb-10">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">#</th>
                            <th 
                                className="p-6 text-[10px] font-black uppercase tracking-widest cursor-pointer select-none group"
                                onClick={() => onSort("title")}
                            >
                                <div className="flex items-center gap-2">
                                    Sách <SortIcon col="title" />
                                </div>
                            </th>
                            <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Danh mục</th>
                            <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tác giả</th>
                            <th 
                                className="p-6 text-[10px] font-black uppercase tracking-widest cursor-pointer select-none"
                                onClick={() => onSort("salePrice")}
                            >
                                <div className="flex items-center gap-2">
                                    Giá <SortIcon col="salePrice" />
                                </div>
                            </th>
                            <th 
                                className="p-6 text-[10px] font-black uppercase tracking-widest cursor-pointer select-none text-center"
                                onClick={() => onSort("stock")}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    Kho <SortIcon col="stock" />
                                </div>
                            </th>
                            <th 
                                className="p-6 text-[10px] font-black uppercase tracking-widest cursor-pointer select-none text-center"
                                onClick={() => onSort("soldCount")}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    Đã bán <SortIcon col="soldCount" />
                                </div>
                            </th>
                            <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Đánh giá</th>
                            <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Trạng thái</th>
                            <th className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading && books.length === 0 ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={10} className="p-6"><div className="h-12 bg-muted/20 rounded-2xl" /></td>
                                </tr>
                            ))
                        ) : books.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="p-20 text-center">
                                    <div className="size-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="size-10 text-muted-foreground/30" />
                                    </div>
                                    <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Không có sách nào trong danh sách</p>
                                </td>
                            </tr>
                        ) : books.map((b, i) => {
                            const status = STATUS_CFG[b.status] || STATUS_CFG.ACTIVE
                            const isLow = b.stock > 0 && b.stock <= 10
                            const isOut = b.stock === 0

                            return (
                                <tr key={b.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="p-6 text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
                                        {String((page - 1) * pageSize + i + 1).padStart(2, "0")}
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-background border border-border/50 overflow-hidden flex-shrink-0">
                                                {b.images ? (
                                                    <img src={b.images} alt={b.title} className="size-full object-cover" />
                                                ) : (
                                                    <div className="size-full flex items-center justify-center bg-muted/20 text-muted-foreground">
                                                        <BookOpen className="size-5" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-black text-foreground group-hover:text-primary transition-colors truncate max-w-[200px]">{b.title}</span>
                                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{b.publisher}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/5 text-primary border border-primary/10">
                                            <Tags className="size-3" />
                                            <span className="text-[10px] font-black uppercase tracking-tighter">{b.category}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <User className="size-3" />
                                            <span className="text-[11px] font-bold">{b.author}</span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="text-sm font-black text-primary">{fmt(b.salePrice)}</span>
                                    </td>
                                    <td className="p-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className={`text-xs font-black ${isOut ? "text-rose-500" : isLow ? "text-amber-500" : "text-foreground"}`}>
                                                {b.stock}
                                            </span>
                                            {isLow && !isOut && (
                                                <span className="text-[8px] font-black uppercase text-amber-500/80 tracking-tighter">Sắp hết</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-6 text-center">
                                        <span className="text-xs font-black text-muted-foreground">{b.soldCount}</span>
                                    </td>
                                    <td className="p-6 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="flex items-center gap-0.5">
                                                <Star className={`size-2.5 ${b.rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground/20"}`} />
                                                <span className="text-[10px] font-black text-foreground">{b.rating || "—"}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${status.bg} ${status.color} text-[10px] font-black uppercase tracking-widest`}>
                                            <span className="size-1.5 rounded-full bg-current animate-pulse" />
                                            {status.label}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button size="icon" variant="ghost" className="size-9 rounded-xl hover:bg-primary/10 hover:text-primary" onClick={() => onEdit(b)}>
                                                <Edit3 className="size-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="size-9 rounded-xl hover:bg-rose-500/10 hover:text-rose-500" onClick={() => onDelete(b)}>
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}