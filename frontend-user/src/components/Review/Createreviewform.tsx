import { useState, useRef } from "react";
import { Star, Send, AlertCircle, Camera, X } from "lucide-react";
import { reviewApi } from "@/api/review.api";
import type { ReviewResponse } from "@/types/Review";

const STAR_LABELS: Record<number, string> = {
    1: "Rất tệ",
    2: "Tệ",
    3: "Bình thường",
    4: "Tốt",
    5: "Tuyệt vời",
};

interface CreateReviewFormProps {
    bookId: number;
    userId: number;
    hasPurchased: boolean;
    hasReviewed: boolean;
    onCreated: (review: ReviewResponse) => void;
}

export default function CreateReviewForm({
    bookId,
    hasPurchased,
    hasReviewed,
    onCreated,
}: CreateReviewFormProps) {
    const [rating, setRating] = useState<number>(0);
    const [hovered, setHovered] = useState<number>(0);
    const [content, setContent] = useState<string>("");
    const [images, setImages] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!hasPurchased) {
        return (
            <div className="glass border border-white/10 rounded-2xl p-6 mb-10 flex items-center gap-4 text-muted-foreground bg-amber-500/5">
                <AlertCircle className="size-6 text-amber-500" />
                <p className="text-sm font-medium">Bạn cần mua và nhận sách để có thể đánh giá.</p>
            </div>
        );
    }

    if (hasReviewed) {
        return (
            <div className="glass border border-white/10 rounded-2xl p-6 mb-10 flex items-center gap-4 text-muted-foreground bg-primary/5">
                <Star className="size-6 text-primary fill-primary/20" />
                <p className="text-sm font-medium">Bạn đã đánh giá sách này rồi. Cảm ơn phản hồi của bạn!</p>
            </div>
        );
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const remainingSlots = 5 - images.length;
        const filesToProcess = Array.from(files).slice(0, remainingSlots);

        filesToProcess.forEach(file => {
            if (!file.type.startsWith('image/')) return;
            const reader = new FileReader();
            reader.onload = () => {
                setImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!rating) return setError("Vui lòng chọn số sao.");
        if (!content.trim()) return setError("Vui lòng nhập nội dung đánh giá.");

        setError("");
        setSubmitting(true);
        try {
            const review = await reviewApi.createReview({
                bookId,
                content,
                rating,
                imageUrls: images
            });
            onCreated(review);
            setRating(0);
            setContent("");
            setImages([]);
        } catch (e: unknown) {
            const msg =
                (e as { response?: { data?: { message?: string } } })?.response?.data
                    ?.message ?? "Có lỗi xảy ra, vui lòng thử lại.";
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const display = hovered || rating;

    return (
        <div className="glass border border-white/10 rounded-[2.5rem] p-8 mb-10 shadow-xl bg-card/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h3 className="text-xl font-black text-foreground uppercase tracking-widest mb-1">Viết đánh giá</h3>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Chia sẻ cảm nhận thực tế của bạn về cuốn sách</p>
                </div>

                {/* Star picker */}
                <div className="flex items-center gap-2 bg-foreground/5 p-3 rounded-2xl border border-white/5">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <button
                            key={i}
                            type="button"
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(0)}
                            onClick={() => setRating(i)}
                            className="p-1 focus:outline-none transition-transform hover:scale-125"
                            aria-label={`${i} sao`}
                        >
                            <Star
                                className={`w-8 h-8 transition-all ${display >= i
                                        ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                                        : "text-foreground/10"
                                    }`}
                            />
                        </button>
                    ))}
                    <span className="min-w-[80px] text-[10px] font-black text-primary uppercase tracking-widest ml-4">
                        {STAR_LABELS[display] || "Chọn sao"}
                    </span>
                </div>
            </div>

            {/* Textarea */}
            <div className="relative group mb-6">
                <textarea
                    className="w-full bg-foreground/5 border border-white/10 rounded-3xl p-6 text-base font-medium placeholder:text-foreground/20 outline-none focus:border-primary/50 focus:bg-foreground/[0.08] transition-all min-h-[150px] resize-none"
                    maxLength={500}
                    placeholder="Nội dung đánh giá của bạn (ví dụ: Sách in rất đẹp, nội dung lôi cuốn...)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <div className="absolute bottom-6 right-6 flex items-center gap-4">
                    <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest">{content.length}/500</span>
                </div>
            </div>

            {/* Image Upload Area */}
            <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">Hình ảnh thực tế ({images.length}/5)</p>
                    {images.length < 5 && (
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
                        >
                            <Camera className="size-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Thêm ảnh</span>
                        </button>
                    )}
                </div>
                
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                />

                <div className="flex flex-wrap gap-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative size-24 rounded-2xl overflow-hidden border border-white/10 group/img shadow-lg">
                            <img src={img} alt="review" className="w-full h-full object-cover" />
                            <button 
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 size-6 bg-black/60 backdrop-blur-md rounded-lg flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
                            >
                                <X className="size-3" />
                            </button>
                        </div>
                    ))}
                    
                    {images.length < 5 && (
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="size-24 rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground group"
                        >
                            <div className="size-8 rounded-full bg-foreground/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Camera className="size-4" />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-tighter leading-none">Tải ảnh lên</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-6">
                {error ? (
                    <div className="flex items-center gap-2 text-red-500 animate-in fade-in slide-in-from-left duration-300">
                        <AlertCircle className="size-4" />
                        <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-muted-foreground opacity-50">
                        <Star className="size-4" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Đánh giá của bạn sẽ giúp ích cho độc giả khác</p>
                    </div>
                )}
                
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || !rating || !content.trim()}
                    className="group relative px-10 py-4 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-xs overflow-hidden shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all"
                >
                    <span className="relative z-10 flex items-center gap-3">
                        {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                        <Send className="size-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </button>
            </div>
        </div>
    );
}