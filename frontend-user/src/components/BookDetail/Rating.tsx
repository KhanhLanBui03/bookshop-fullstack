
import { Star } from 'lucide-react';

const Rating = ({ rating, reviews }) => {
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
            <span className="text-lg font-semibold">{rating}</span>
            <span className="text-gray-500">({reviews} đánh giá)</span>
        </div>
    );
};
export default Rating;