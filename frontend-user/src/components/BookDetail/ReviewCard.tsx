import { Star } from "lucide-react";
import { Button } from "../ui/button";

const ReviewCard = ({ review }) => {
    return (
        <div className="border-b pb-6 last:border-b-0">
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {review.user[0]}
                    </div>
                    <div>
                        <p className="font-medium">{review.user}</p>
                        <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
            <Button className="mt-3 text-sm text-gray-600 hover:text-blue-600">
                Hữu ích ({review.helpful})
            </Button>
        </div>
    );
};
export default ReviewCard;