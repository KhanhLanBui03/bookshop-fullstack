import { useEffect, useRef, useState } from "react"
import {
    X,
    Tag,
    AlignLeft,
    Image as ImageIcon,
    Upload,
    Link as LinkIcon,
    CheckCircle2,
    AlertCircle,
    Loader2
} from "lucide-react"
import type { CategoryForm, CategoryResponse } from "../category.type"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


interface Props {
    category: CategoryResponse | null   // null = Add mode
    onClose: () => void
    onSave: (form: CategoryForm, id?: number) => Promise<void>
}

const EMPTY_FORM: CategoryForm = {
    name: "",
    description: "",
    url: ""
}

export const CategoryModal = ({ category, onClose, onSave }: Props) => {
    const isEdit = !!category
    const [form, setForm] = useState<CategoryForm>({ ...EMPTY_FORM })
    const [errors, setErrors] = useState<Partial<CategoryForm>>({})
    const [saving, setSaving] = useState(false)
    const [urlTab, setUrlTab] = useState<"url" | "upload">("url")
    const fileRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (category) {
            setForm({
                name: category.name,
                description: category.description ?? "",
                url: category.url ?? "",
            })
        } else {
            setForm({ ...EMPTY_FORM })
        }
        setErrors({})
    }, [category])

    const readFile = (file: File) => {
        if (!file.type.startsWith("image/")) return
        const reader = new FileReader()
        reader.onload = () => setForm(f => ({ ...f, url: reader.result as string }))
        reader.readAsDataURL(file)
    }

    const validate = () => {
        const e: Partial<CategoryForm> = {}
        if (!form.name.trim()) e.name = "Tên danh mục không được để trống"
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleSubmit = async () => {
        if (!validate() || saving) return
        setSaving(true)
        try {
            await onSave(form, category?.id)
            onClose()
        } catch (error) {
            console.error(error)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto" onClick={e => !saving && e.target === e.currentTarget && onClose()}>
            <div className="glass w-full max-w-2xl rounded-[3rem] border-white/20 overflow-hidden animate-in zoom-in-95 fade-in duration-300">

                {/* ── Header ── */}
                <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                            <Tag className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-foreground tracking-tight">{isEdit ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</h2>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{isEdit ? "Cập nhật thông tin phân loại" : "Tạo phân loại sách mới cho hệ thống"}</p>
                        </div>
                    </div>
                    <button onClick={onClose} disabled={saving} className="size-10 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-30">
                        <X className="size-5 text-muted-foreground" />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <Tag className="size-3" /> Tên danh mục <span className="text-rose-500">*</span>
                        </label>
                        <Input
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            placeholder="Ví dụ: Khoa học viễn tưởng"
                            className="h-12 bg-background/50 border-border/50 rounded-2xl focus-visible:ring-primary/20"
                        />
                        {errors.name && <p className="text-[10px] font-bold text-rose-500 uppercase flex items-center gap-1"><AlertCircle className="size-3" /> {errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <AlignLeft className="size-3" /> Mô tả danh mục
                        </label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            placeholder="Mô tả ngắn gọn về loại sách này..."
                            className="w-full min-h-[160px] bg-background/50 border-border/50 rounded-2xl focus-visible:ring-primary/20 resize-y p-5 text-sm leading-relaxed outline-none transition-all focus:border-primary/30"
                        />
                    </div>

                    {/* Image */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <ImageIcon className="size-3" /> Hình ảnh đại diện
                        </label>

                        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 w-fit">
                            <button
                                onClick={() => setUrlTab("url")}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${urlTab === "url" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                <LinkIcon className="size-3" /> Đường dẫn URL
                            </button>
                            <button
                                onClick={() => setUrlTab("upload")}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${urlTab === "upload" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                <Upload className="size-3" /> Tải lên file
                            </button>
                        </div>

                        {urlTab === "url" ? (
                            <Input
                                value={form.url}
                                onChange={e => setForm({ ...form, url: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                                className="h-12 bg-background/50 border-border/50 rounded-2xl focus-visible:ring-primary/20"
                            />
                        ) : (
                            <div
                                onClick={() => fileRef.current?.click()}
                                className="border-2 border-dashed border-white/10 rounded-[2rem] p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
                            >
                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && readFile(e.target.files[0])} />
                                <Upload className="size-8 text-muted-foreground mx-auto mb-3 group-hover:scale-110 group-hover:text-primary transition-all" />
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Kéo thả hoặc click để tải ảnh</p>
                            </div>
                        )}

                        {form.url && (
                            <div className="relative rounded-[2rem] overflow-hidden aspect-video border border-white/10 group shadow-2xl">
                                <img src={form.url} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={() => setForm({ ...form, url: "" })} className="size-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg">
                                        <X className="size-5" />
                                    </button>
                                </div>
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                    <p className="text-[8px] font-black text-white uppercase tracking-widest">Xem trước hình ảnh</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-8 bg-white/5 border-t border-white/10 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} disabled={saving} className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-8 border border-white/10 hover:bg-white/10">
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-10 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] min-w-[160px]"
                    >
                        {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : (isEdit ? <CheckCircle2 className="size-4 mr-2" /> : <Plus className="size-4 mr-2" />)}
                        {isEdit ? "Lưu thay đổi" : "Tạo danh mục"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

const Plus = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
)