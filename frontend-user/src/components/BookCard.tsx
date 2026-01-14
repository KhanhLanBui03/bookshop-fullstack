import { Button } from "./ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "./ui/card"
import { ShoppingBag, Heart, Star, Eye } from "lucide-react"

type Props = {
    title: string
    description: string
    rating: number
    category: string
    imageUrl: string
    originalPrice: number
    salePrice: number
}

const BookCard = ({
    title,
    description,
    rating,
    category,
    imageUrl,
    originalPrice,
    salePrice,
}: Props) => {
    return (
        <Card className="group hover:shadow-lg transition w-full">
            {/* Image */}
            <div className="relative overflow-hidden rounded-t-lg group">
                {originalPrice > 0 && (
                    <span className="absolute top-1 right-1 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        -{Math.round(((originalPrice - salePrice) / originalPrice) * 100)}%
                    </span>
                )}

                {/* Image */}
                <div className="h-48 flex items-center justify-center bg-white">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* ACTION ICONS (HOVER) */}
                <div className="
                        absolute top-1/2 right-2 -translate-y-1/2
                        flex flex-col gap-2
                        opacity-0 translate-x-4
                        group-hover:opacity-100 group-hover:translate-x-0
                        transition-all duration-300
                    
                    ">
                    {/* Add to cart */}
                    <Button className="p-2 bg-white text-gray-700 rounded-full shadow hover:bg-blue-600 hover:text-white transition">
                        <ShoppingBag className="w-4 h-4" />
                    </Button>

                    {/* View detail */}
                    <Button className="p-2 bg-white text-gray-700 rounded-full shadow hover:bg-gray-800 hover:text-white transition">
                        <Eye className="w-4 h-4" />
                    </Button>

                    {/* Wishlist */}
                    <Button className="p-2 bg-white text-gray-700 rounded-full shadow hover:bg-red-500 hover:text-white transition">
                        <Heart className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-base line-clamp-1">
                    {title}
                </CardTitle>
                <p className="text-sm text-gray-500 line-clamp-2">
                    {description}
                </p>
                <span className="flex justify-center items-center bg-transparent border-gray-400 border-2 w-25 text-black text-xs px-2 py-1 rounded-2xl dark:text-white mt-2">
                    {category}
                </span>
            </CardHeader>

            <CardContent className="flex items-center justify-between">
                {/* Rating */}
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
                    <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                </div>

                {/* Price */}
                <div className="text-right">
                    <p className="text-sm line-through text-gray-400">
                        {originalPrice.toLocaleString()}₫
                    </p>
                    <p className="text-lg font-bold text-red-600">
                        {salePrice.toLocaleString()}₫
                    </p>
                </div>
            </CardContent>

            {/* <CardFooter className="flex gap-2">
                <Button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                    <ShoppingBag className="w-4 h-4" />
                    Thêm
                </Button>
                <Button className="p-2 border rounded hover:bg-gray-100 transition">
                    <Heart className="w-4 h-4 text-gray-500 hover:text-red-600" />
                </Button>
            </CardFooter> */}
        </Card>
    )
}

export default BookCard
