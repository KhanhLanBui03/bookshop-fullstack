import { Button } from "./ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "./ui/card"
import { ShoppingBag, Heart, Star, Eye } from "lucide-react"
import type { BookCard as BookCardType } from "@/types/Book"

type Props = {
    book: BookCardType
}


const BookCard = ({ book }: Props) => {
    if (!book) return null
    const {
        title,
        salePrice,
        originalPrice,
        rating,
        soldCount,
        image,
        authorName
    } = book

    const hasDiscount = originalPrice && originalPrice > salePrice
    
    return (
        <Card className="group hover:shadow-lg transition w-full">
            {/* IMAGE */}
            <div className="relative overflow-hidden rounded-t-lg">
                {hasDiscount && (
                    <span className="absolute top-1 right-1 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        -{Math.round(
                            ((originalPrice! - salePrice) / originalPrice!) * 100
                        )}%
                    </span>
                )}

                <div className="relative w-full aspect-[3/4] bg-white overflow-hidden">
                    <img
                        src={image || "/placeholder.png"}
                        alt={title}
                        className="w-full h-full object-contain"
                    />
                </div>


                {/* ACTION ICONS */}
                <div
                    className="
                        absolute top-1/2 right-2 -translate-y-1/2
                        flex flex-col gap-2
                        opacity-0 translate-x-4
                        group-hover:opacity-100 group-hover:translate-x-0
                        transition-all duration-300
                    "
                >
                    <Button className="p-2 bg-white text-gray-700 rounded-full shadow hover:bg-blue-600 hover:text-white">
                        <ShoppingBag className="w-4 h-4" />
                    </Button>

                    <Button className="p-2 bg-white text-gray-700 rounded-full shadow hover:bg-gray-800 hover:text-white">
                        <Eye className="w-4 h-4" />
                    </Button>

                    <Button className="p-2 bg-white text-gray-700 rounded-full shadow hover:bg-red-500 hover:text-white">
                        <Heart className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* CONTENT */}
            <CardHeader className="pb-2">
                <CardTitle className="text-base line-clamp-2">
                    {title}
                </CardTitle>

                <p className="text-sm text-gray-500">
                    {authorName}
                </p>
            </CardHeader>

            <CardContent className="flex items-center justify-between">
                {/* RATING */}
                <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.round(rating)
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-gray-300"
                                }`}
                        />
                    ))}
                    <span className="text-sm font-medium text-gray-700">
                        ({rating.toFixed(1)})
                    </span>
                </div>

                {/* PRICE */}
                <div className="text-right">
                    {hasDiscount && (
                        <p className="text-sm line-through text-gray-400">
                            {originalPrice!.toLocaleString()}₫
                        </p>
                    )}
                    <p className="text-lg font-bold text-red-600">
                        {salePrice.toLocaleString()}₫
                    </p>
                </div>
            </CardContent>

            {/* SOLD */}
            <div className="px-4 pb-4 text-xs text-gray-500">
                Đã bán {soldCount}
            </div>
        </Card>
    )
}

export default BookCard
