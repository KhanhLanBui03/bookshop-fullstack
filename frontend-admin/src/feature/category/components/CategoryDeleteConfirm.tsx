import { 
  Trash2, 
  AlertTriangle, 
  Loader2 
} from "lucide-react"
import type { CategoryResponse } from "../category.type"
import { Button } from "@/components/ui/button"

interface Props {
    category: CategoryResponse
    deleting: boolean
    onClose: () => void
    onConfirm: () => Promise<void>
}

export const CategoryDeleteConfirm = ({ category, deleting, onClose, onConfirm }: Props) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4" onClick={e => !deleting && e.target === e.currentTarget && onClose()}>
            <div className="glass w-full max-w-md rounded-[3rem] border-white/20 overflow-hidden animate-in zoom-in-95 fade-in duration-300 shadow-2xl">
                
                {/* ── Content ── */}
                <div className="p-10 text-center space-y-6">
                    <div className="size-20 bg-rose-500/10 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner border border-rose-500/20">
                        <Trash2 className="size-10" />
                    </div>
                    
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black text-foreground tracking-tight">Xác nhận xóa?</h3>
                        <p className="text-sm font-bold text-muted-foreground leading-relaxed px-4">
                            Bạn có chắc chắn muốn xóa danh mục <span className="text-rose-500">"{category.name}"</span>? Hành động này không thể hoàn tác.
                        </p>
                    </div>

                    {category.bookCount > 0 && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3 text-left">
                            <AlertTriangle className="size-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider leading-relaxed">
                                Cảnh báo: Danh mục này đang chứa <span className="text-amber-700 font-black">{category.bookCount} cuốn sách</span>. Việc xóa danh mục có thể ảnh hưởng đến dữ liệu sách liên quan.
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="p-8 bg-rose-500/5 border-t border-rose-500/10 flex flex-col gap-3">
                    <Button 
                        onClick={onConfirm} 
                        disabled={deleting}
                        className="w-full rounded-2xl font-black text-[10px] uppercase tracking-widest h-14 bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {deleting ? <Loader2 className="size-4 animate-spin mr-2" /> : <Trash2 className="size-4 mr-2" />}
                        Xác nhận xóa danh mục
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={onClose} 
                        disabled={deleting}
                        className="w-full rounded-2xl font-black text-[10px] uppercase tracking-widest h-14 text-muted-foreground hover:bg-white/5"
                    >
                        Hủy bỏ
                    </Button>
                </div>
            </div>
        </div>
    )
}