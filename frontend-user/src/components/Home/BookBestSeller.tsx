import { CircleArrowRight, Trophy } from "lucide-react"
import { EmptyState } from "../Common/EmptyState"
import type { BookCard as BookCardType } from "@/types/Book"
import BookCard from "../BookCard"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { bookService } from "@/services/book.service"
import { useFetch } from "@/hooks/useFetch"

// const books = [
//   {
//     id: 1,
//     title: "Clean Code",
//     description: "A Handbook of Agile Software Craftsmanship",
//     rating: 4.8,
//     category: "Programming",
//     imageUrl: "./gia-kim.jpg",
//     originalPrice: 250000,
//     salePrice: 199000,
//   },
//   {
//     id: 2,
//     title: "Spring in Action",
//     description: "Comprehensive guide to Spring Framework",
//     rating: 4.5,
//     category: "Truyện tranh",
//     imageUrl: "./connan.jpg",
//     originalPrice: 280000,
//     salePrice: 229000,
//   },
//   {
//     id: 3,
//     title: "Spring in Action",
//     description: "Comprehensive guide to Spring Framework",
//     rating: 4.5,
//     category: "Truyện tranh",
//     imageUrl: "./connan.jpg",
//     originalPrice: 280000,
//     salePrice: 229000,
//   },
//   {
//     id: 4,
//     title: "Spring in Action",
//     description: "Comprehensive guide to Spring Framework",
//     rating: 4.5,
//     category: "Truyện tranh",
//     imageUrl: "./connan.jpg",
//     originalPrice: 280000,
//     salePrice: 229000,
//   },
//   {
//     id: 5,
//     title: "Spring in Action",
//     description: "Comprehensive guide to Spring Framework",
//     rating: 4.5,
//     category: "Truyện tranh",
//     imageUrl: "./connan.jpg",
//     originalPrice: 280000,
//     salePrice: 229000,
//   },
//   {
//     id: 6,
//     title: "Clean Code",
//     description: "A Handbook of Agile Software Craftsmanship",
//     rating: 4.8,
//     category: "Programming",
//     imageUrl: "./gia-kim.jpg",
//     originalPrice: 250000,
//     salePrice: 199000,
//   },
// ]

const BookBestSeller = () => {
  const { data: books, loading } = useFetch<BookCardType[]>(bookService.getTopBooksBestSeller)
    if (loading) {
      return <div>Loading...</div>
    }
    if (!books || books.length === 0) {
      return (
        <EmptyState 
          icon={Trophy} 
          title="Chưa có sách bán chạy" 
          description="Hiện tại hệ thống chưa cập nhật danh sách các tựa sách bán chạy nhất. Vui lòng quay lại sau." 
        />
      )
    }
  return (
    <section className="py-20 bg-[#050505] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 size-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 size-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-16 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <CircleArrowRight className="size-4" />
            <span>Được yêu thích nhất</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
            <span className="text-primary">Sách</span> bán chạy nhất 🔥
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto font-medium">
            Những tựa sách đang làm mưa làm gió trên thị trường, được tuyển chọn dựa trên lượt mua và đánh giá thực tế.
          </p>
        </div>

        <Carousel 
          opts={{ align: "start" }} 
          className="w-full"
        >
          <CarouselContent className="-ml-6">
            {books?.map((book) => (
              <CarouselItem
                key={book.id}
                className="pl-6 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <BookCard book={book} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  )
}



export default BookBestSeller
