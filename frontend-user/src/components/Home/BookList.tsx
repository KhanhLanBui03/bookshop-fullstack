import { CircleArrowRight } from "lucide-react"
import BookCard from "../BookCard"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const books = [
  {
    id: 1,
    title: "Clean Code",
    description: "A Handbook of Agile Software Craftsmanship",
    rating: 4.8,
    category: "Programming",
    imageUrl: "./gia-kim.jpg",
    originalPrice: 250000,
    salePrice: 199000,
  },
  {
    id: 2,
    title: "Spring in Action",
    description: "Comprehensive guide to Spring Framework",
    rating: 4.5,
    category: "Truyện tranh",
    imageUrl: "./connan.jpg",
    originalPrice: 280000,
    salePrice: 229000,
  },
  {
    id: 3,
    title: "Spring in Action",
    description: "Comprehensive guide to Spring Framework",
    rating: 4.5,
    category: "Truyện tranh",
    imageUrl: "./connan.jpg",
    originalPrice: 280000,
    salePrice: 229000,
  },
  {
    id: 4,
    title: "Spring in Action",
    description: "Comprehensive guide to Spring Framework",
    rating: 4.5,
    category: "Truyện tranh",
    imageUrl: "./connan.jpg",
    originalPrice: 280000,
    salePrice: 229000,
  },
  {
    id: 5,
    title: "Spring in Action",
    description: "Comprehensive guide to Spring Framework",
    rating: 4.5,
    category: "Truyện tranh",
    imageUrl: "./connan.jpg",
    originalPrice: 280000,
    salePrice: 229000,
  },
  {
    id: 6,
    title: "Clean Code",
    description: "A Handbook of Agile Software Craftsmanship",
    rating: 4.8,
    category: "Programming",
    imageUrl: "./gia-kim.jpg",
    originalPrice: 250000,
    salePrice: 199000,
  },
]

const BookList = () => {
  return (
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
            {books.map((book) => (
              <CarouselItem
                key={book.id}
                className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/4"
              >
                <BookCard
                  title={book.title}
                  description={book.description}
                  rating={book.rating}
                  category={book.category}
                  imageUrl={book.imageUrl}
                  originalPrice={book.originalPrice}
                  salePrice={book.salePrice}
                />

              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <div>
          <span className=" mt-6 text-md font-medium hover:text-blue-600 cursor-pointer block text-end dark:text-white">
            Xem tất cả sách
            <CircleArrowRight className="inline ml-1 hover:text-blue-600 w-5 h-5 transition" />
          </span>
        </div>
      </div>
    </section>
  )
}


export default BookList
