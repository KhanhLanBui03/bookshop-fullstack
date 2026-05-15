import { CircleArrowRight, Sparkles, BookCopy } from "lucide-react"
import { EmptyState } from "../Common/EmptyState"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { bookService } from "@/services/book.service"
import { useFetch } from "@/hooks/useFetch"
import type { BookCard as BookCardType } from "@/types/Book"
import BookCard from "../BookCard"
import { useNavigate } from "react-router-dom"
import { Button } from "../ui/button"


const BookList = () => {
  const { data: books, loading } = useFetch<BookCardType[]>(bookService.getBooks)
  const navigate = useNavigate()
  if (loading) {
    return <div>Loading...</div>
  }
  if (!books || books.length === 0) {
    return (
      <EmptyState 
        icon={BookCopy} 
        title="Thư viện đang trống" 
        description="Chúng tôi đang cập nhật thêm nhiều đầu sách mới hấp dẫn. Vui lòng quay lại sau." 
      />
    )
  }
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-16 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="size-4" />
            <span>Được yêu thích nhất</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-foreground mb-4">
            Sách <span className="text-primary">nổi bật</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
            Những tác phẩm tâm huyết, nhận được đánh giá cao nhất từ cộng đồng.
          </p>
        </div>

        <Carousel opts={{ align: "start" }} className="w-full">
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

          <CarouselPrevious className="hidden md:flex glass hover:bg-primary hover:text-primary-foreground border-none" />
          <CarouselNext className="hidden md:flex glass hover:bg-primary hover:text-primary-foreground border-none" />
        </Carousel>

        <div className="mt-16 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/list-books")}
            className="group gap-3 text-lg font-black text-foreground hover:text-primary transition-all px-8 py-6 rounded-2xl"
          >
            <span>Khám phá toàn bộ thư viện</span>
            <CircleArrowRight className="size-6 group-hover:translate-x-2 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  )
}
export default BookList
