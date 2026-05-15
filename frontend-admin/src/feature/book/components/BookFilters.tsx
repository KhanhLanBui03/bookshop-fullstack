import { Search, X, Filter } from "lucide-react"
import type { BookStatus } from "../book.type"
import type { DropdownItem } from "@/api/metadata.api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
    search: string
    filterStatus: BookStatus | "ALL"
    filterCategory: string
    categories: DropdownItem[]
    totalElements: number
    totalPages: number
    onSearchChange: (v: string) => void
    onSearchClear: () => void
    onStatusChange: (s: BookStatus | "ALL") => void
    onCategoryChange: (id: string) => void
}

const STATUS_LABELS: Record<string, string> = {
    ALL: "Tất cả trạng thái",
    ACTIVE: "Đang bán",
    INACTIVE: "Ngừng bán",
    OUT_OF_STOCK: "Hết hàng"
}

export const BookFilters = ({
    search, filterStatus, filterCategory,
    categories, totalElements,
    onSearchChange, onSearchClear, onStatusChange, onCategoryChange,
}: Props) => (
    <div className="glass p-4 rounded-3xl flex flex-wrap items-center gap-4 relative z-40 border-white/20 mb-10">
        {/* Search */}
        <div className="relative flex-1 min-w-[300px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
                value={search}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
                className="pl-11 h-12 bg-background/50 border-border/50 rounded-2xl focus-visible:ring-primary/20"
            />
            {search && (
                <button
                    onClick={onSearchClear}
                    className="absolute right-4 top-1/2 -translate-y-1/2 size-6 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                >
                    <X className="size-4" />
                </button>
            )}
        </div>

        {/* Status Select */}
        <Select 
            value={filterStatus} 
            onValueChange={(v) => onStatusChange(v as BookStatus | "ALL")}
        >
            <SelectTrigger className="w-full md:w-48 h-12 bg-background/50 border-border/50 rounded-2xl font-bold">
                <div className="flex items-center gap-2">
                    <Filter className="size-3 text-muted-foreground" />
                    <SelectValue placeholder="Trạng thái" />
                </div>
            </SelectTrigger>
            <SelectContent className="glass border-border/50 rounded-2xl">
                {(["ALL", "ACTIVE", "INACTIVE", "OUT_OF_STOCK"] as const).map(s => (
                    <SelectItem key={s} value={s} className="text-xs font-black uppercase m-1 rounded-xl">
                        {STATUS_LABELS[s]}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>

        {/* Category Select */}
        <Select 
            value={filterCategory} 
            onValueChange={onCategoryChange}
        >
            <SelectTrigger className="w-full md:w-56 h-12 bg-background/50 border-border/50 rounded-2xl font-bold">
                <SelectValue placeholder="Tất cả danh mục" />
            </SelectTrigger>
            <SelectContent className="glass border-border/50 rounded-2xl max-h-72">
                <SelectItem value="ALL" className="text-xs font-black uppercase m-1 rounded-xl">Tất cả danh mục</SelectItem>
                {categories.map(c => (
                    <SelectItem key={c.id} value={c.id.toString()} className="text-xs font-black uppercase m-1 rounded-xl">
                        {c.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>

        <Button 
            variant="ghost" 
            onClick={onSearchClear}
            className="h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5"
        >
            Đặt lại
        </Button>

        <div className="hidden lg:flex flex-col items-end gap-0.5 ml-auto pr-4">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Kết quả</span>
            <span className="text-sm font-black text-primary">{totalElements.toLocaleString()} <span className="text-foreground">Sách</span></span>
        </div>
    </div>
)