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
        <div className="flex gap-8 items-center bg-gray-50 rounded-xl p-5 mb-6">
            {/* Big score */}
            <div className="text-center min-w-[72px]">
                <p className="text-4xl font-semibold leading-none">
                    {Number(rating).toFixed(1)}
                </p>
                <div className="flex justify-center gap-0.5 mt-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i <= Math.round(rating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-200"
                                }`}
                        />
                    ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">{totalReviews} đánh giá</p>
            </div>

            {/* Distribution bars */}
            {distribution.length > 0 && (
                <div className="flex-1 flex flex-col gap-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const found = distribution.find((d) => d.star === star);
                        const count = found?.count ?? 0;
                        const pct = maxCount ? Math.round((count / maxCount) * 100) : 0;
                        return (
                            <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="w-5 text-right">{star}★</span>
                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <span className="w-5">{count}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}