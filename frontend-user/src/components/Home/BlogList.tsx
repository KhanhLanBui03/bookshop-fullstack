import { ArrowRight, BookOpen } from "lucide-react"
import BlogCard from "../BlogCard"

const blogs = [
  {
    id: 1,
    title: "5 cuốn sách giúp bạn tư duy như lập trình viên giỏi",
    excerpt: "Những cuốn sách kinh điển giúp cải thiện tư duy logic và kỹ năng viết code.",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop",
    date: "12/01/2026",
    readTime: "5 phút đọc",
    category: "Lập trình",
  },
  {
    id: 2,
    title: "Vì sao Clean Code là cuốn sách mọi dev nên đọc?",
    excerpt: "Clean Code không chỉ nói về code đẹp, mà còn là cách suy nghĩ của một kỹ sư phần mềm.",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop",
    date: "10/01/2026",
    readTime: "7 phút đọc",
    category: "Review sách",
  },
  {
    id: 3,
    title: "Cách chọn sách phù hợp với trình độ của bạn",
    excerpt: "Đừng mua sách theo trend – hãy chọn đúng sách theo level để học nhanh hơn.",
    imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&h=600&fit=crop",
    date: "08/01/2026",
    readTime: "4 phút đọc",
    category: "Hướng dẫn",
  },
]

const BlogList = () => {
  return (
    <section className="py-16 px-4 md:px-16 bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            <span>Kiến thức & Chia sẻ</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold mb-3">
            <span className="text-blue-600 dark:text-blue-400">Blog</span>
            <span className="text-gray-900 dark:text-white"> & Chia sẻ</span>
          </h2>

          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Góc đọc sách và kiến thức hữu ích dành cho bạn
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <div
              key={blog.id}
              style={{ animationDelay: `${index * 150}ms` }}
              className="animate-fadeIn"
            >
              <BlogCard {...blog} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105">
            <span>Xem tất cả bài viết</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  )
}

export default BlogList
