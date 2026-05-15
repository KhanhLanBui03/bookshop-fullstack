import { ArrowRight, BookOpen } from "lucide-react"
import BlogCard from "../BlogCard"
import { useFetch } from "@/hooks/useFetch"
import { blogService } from "@/services/blog.service"
import type { BlogResponse } from "@/types/Blog"

const BlogList = () => {
  const { data, loading } = useFetch<any>(() => blogService.getPublished(0, 3))
  const blogs = data?.content || []

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
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-[400px] bg-muted animate-pulse rounded-2xl"></div>
            ))
          ) : blogs.length > 0 ? (
            blogs.map((blog: BlogResponse, index: number) => (
              <div
                key={blog.id}
                style={{ animationDelay: `${index * 150}ms` }}
                className="animate-fadeIn"
              >
                <BlogCard 
                    id={blog.id}
                    title={blog.title}
                    excerpt={blog.summary}
                    imageUrl={blog.thumbnail || "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop"}
                    date={new Date(blog.createdAt).toLocaleDateString('vi-VN')}
                    readTime="5 phút đọc"
                    category="Sách mới"
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-muted-foreground">
                Chưa có bài viết nào
            </div>
          )}
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
