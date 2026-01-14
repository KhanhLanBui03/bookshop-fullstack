import BlogCard from "../BlogCard"

const blogs = [
  {
    id: 1,
    title: "5 cuốn sách giúp bạn tư duy như lập trình viên giỏi",
    excerpt:
      "Những cuốn sách kinh điển giúp cải thiện tư duy logic và kỹ năng viết code.",
    imageUrl: "./blog1.jpg",
    date: "12/01/2026",
  },
  {
    id: 2,
    title: "Vì sao Clean Code là cuốn sách mọi dev nên đọc?",
    excerpt:
      "Clean Code không chỉ nói về code đẹp, mà còn là cách suy nghĩ của một kỹ sư phần mềm.",
    imageUrl: "./blog2.jpg",
    date: "10/01/2026",
  },
  {
    id: 3,
    title: "Cách chọn sách phù hợp với trình độ của bạn",
    excerpt:
      "Đừng mua sách theo trend – hãy chọn đúng sách theo level để học nhanh hơn.",
    imageUrl: "./blog3.jpg",
    date: "08/01/2026",
  },
]

const BlogList = () => {
  return (
    <section className="py-12 md:px-16 px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold dark:text-white">
          📝 Blog & Chia sẻ
        </h2>
        <p className="text-gray-500 mt-2">
          Góc đọc sách & kiến thức cho bạn
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        {blogs.map((blog) => (
          <BlogCard
            key={blog.id}
            title={blog.title}
            excerpt={blog.excerpt}
            imageUrl={blog.imageUrl}
            date={blog.date}
          />
        ))}
      </div>
    </section>
  )
}

export default BlogList
