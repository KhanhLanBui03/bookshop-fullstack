import { CircleArrowRight } from "lucide-react"
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


const BookList = () => {
  const { data: books, loading } = useFetch<BookCardType[]>(bookService.getBooks)
  const navigate = useNavigate()
  if (loading) {
    return <div>Loading...</div>
  }
  if (!books || books.length === 0) {
    return <div>Không có sách</div>
  }
  return (
    console.log(books),
    <section className="py-8 rounded-lg  bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold dark:text-white">
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Sách
            </span>{" "}
            nổi bật
          </h2>
        </div>

        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent className="-ml-4">
            {books?.map((book) => (
              <CarouselItem
                key={book.id}
                className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/4"
              >
                <BookCard book={book} />

              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div>
          <span 
          onClick={() => navigate("/list-books")}
          className=" mt-6 text-md font-medium hover:text-blue-600 cursor-pointer block text-end dark:text-white">
            Xem tất cả sách
            <CircleArrowRight className="inline ml-1 hover:text-blue-600 w-5 h-5 transition" />
          </span>
        </div>
      </div>
    </section>
  )
}
export default BookList
