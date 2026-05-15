import { Star } from "lucide-react";

interface StarDistribution {
    star: number;
    count: number;
}

interface RatingSummaryProps {
    rating: number;
    totalReviews: number;
    distribution?: StarDistribution[];
}

export default function RatingSummary({
    rating = 0,
    totalReviews = 0,
    distribution = [],
}: RatingSummaryProps) {
    const maxCount = distribution.length
        ? Math.max(...distribution.map((d) => d.count))
        : 0;

    return (
        <div className="flex flex-col md:flex-row gap-10 items-center glass border border-white/10 rounded-[2.5rem] p-8 mb-10 shadow-xl relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
            
            {/* Big score */}
            <div className="text-center min-w-[120px] relative z-10">
                <p className="text-6xl font-black text-foreground tracking-tighter mb-2">
                    {Number(rating).toFixed(1)}
                </p>
                <div className="flex justify-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                            key={i}
                            className={`w-5 h-5 ${i <= Math.round(rating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-foreground/10"
                                }`}
                        />
                    ))}
                </div>
                <div className="px-4 py-1.5 bg-primary/10 rounded-full inline-block">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">{totalReviews} đánh giá</p>
                </div>
            </div>

            {/* Distribution bars */}
            <div className="flex-1 w-full flex flex-col gap-3 relative z-10">
                {[5, 4, 3, 2, 1].map((star) => {
                    const found = distribution.find((d) => d.star === star);
                    const count = found?.count ?? 0;
                    const pct = maxCount ? Math.round((count / maxCount) * 100) : 0;
                    return (
                        <div key={star} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                            <span className="w-10 text-right">{star} sao</span>
                            <div className="flex-1 h-2 bg-foreground/5 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                            <span className="w-8 opacity-40">{count}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}