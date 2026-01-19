
import { ArrowRight, Calendar, Clock } from "lucide-react"

type Props = {
  title: string
  excerpt: string
  imageUrl: string
  date: string
  readTime: string
  category: string
}

const BlogCard = ({ title, excerpt, imageUrl, date, readTime, category }: Props) => {
  return (
    <article className="group bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-zinc-700">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-gray-200 dark:bg-zinc-700">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 dark:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
            {category}
          </span>
        </div>

        {/* Read More Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-full font-semibold text-sm flex items-center gap-2 shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <span>Đọc ngay</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed mb-4">
          {excerpt}
        </p>

        {/* Read More Link */}
        <button className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:gap-3 transition-all duration-300">
          <span>Đọc thêm</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </article>
  )
}

export default BlogCard
