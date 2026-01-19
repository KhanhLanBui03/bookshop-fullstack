import { Feather, BookOpen, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"

const authors = [
  {
    id: 1,
    name: "Robert C. Martin",
    bio: "Author of Clean Code and Agile Software Development.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    books: 12,
    specialty: "Software Engineering",
  },
  {
    id: 2,
    name: "Craig Walls",
    bio: "Author of Spring in Action and expert in Spring Framework.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    books: 8,
    specialty: "Spring Framework",
  },
  {
    id: 3,
    name: "Martin Fowler",
    bio: "Renowned software engineer and author of Refactoring.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    books: 15,
    specialty: "Software Architecture",
  },
]

const AuthorCard = ({ name, bio, imageUrl, books, specialty }) => {
  return (
    <div className="group relative bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-zinc-700">
      {/* Content */}
      <div className="relative p-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            {/* Avatar */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 dark:border-zinc-700 shadow-lg group-hover:border-blue-500 dark:group-hover:border-blue-500 transition-all duration-300">
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
              <BookOpen className="w-3 h-3 inline mr-1" />
              {books} Books
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="text-center space-y-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {name}
          </h3>

          <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-zinc-700 px-3 py-1.5 rounded-lg">
            <Feather className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {specialty}
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed px-2">
            {bio}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mt-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
            Xem tác phẩm
          </button>
        </div>
      </div>
    </div>
  )
}

const AuthorList = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % authors.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + authors.length) % authors.length)
  }

  return (
    <section className="py-16 px-4 md:px-10 bg-gray-50 dark:bg-zinc-900 relative">
      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Feather className="w-4 h-4" />
            <span>Những cây bút tài năng</span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold mb-3">
            <span className="text-blue-600 dark:text-blue-400">Tác giả</span>
            <span className="text-gray-900 dark:text-white"> nổi bật</span>
          </h2>

          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Khám phá những tác giả tài năng và tác phẩm đình đám của họ
          </p>
        </div>

        {/* Mobile Carousel */}
        <div className="block md:hidden relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {authors.map((author) => (
                <div key={author.id} className="w-full flex-shrink-0 px-4">
                  <AuthorCard {...author} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white dark:bg-zinc-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-gray-200 dark:border-zinc-700"
            aria-label="Previous author"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </Button>

          <Button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white dark:bg-zinc-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-gray-200 dark:border-zinc-700"
            aria-label="Next author"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {authors.map((_, idx) => (
              <Button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                    ? 'w-8 bg-blue-600 dark:bg-blue-500'
                    : 'w-2 bg-gray-300 dark:bg-zinc-600'
                  }`}
                aria-label={`Go to author ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid gap-8 md:grid-cols-3">
          {authors.map((author, index) => (
            <div
              key={author.id}
              style={{ animationDelay: `${index * 150}ms` }}
              className="animate-fadeIn"
            >
              <AuthorCard {...author} />
            </div>
          ))}
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

export default AuthorList