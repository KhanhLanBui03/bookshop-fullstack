import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"

type Props = {
  title: string
  excerpt: string
  imageUrl: string
  date: string
}

const BlogCard = ({ title, excerpt, imageUrl, date }: Props) => {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition">
      <div className="h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-105 transition"
        />
      </div>

      <CardContent className="p-4">
        <p className="text-sm text-gray-500 mb-1">{date}</p>
        <h3 className="font-semibold text-lg line-clamp-2 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">
          {excerpt}
        </p>

        <Link
          to="#"
          className="inline-block mt-3 text-blue-600 text-sm font-medium hover:underline"
        >
          Đọc thêm →
        </Link>
      </CardContent>
    </Card>
  )
}

export default BlogCard
