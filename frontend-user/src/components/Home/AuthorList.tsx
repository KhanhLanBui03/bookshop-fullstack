import AuthorCard from "../AuthorCard"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"

const authors = [
  {
    id: 1,
    name: "Robert C. Martin",
    bio: "Author of Clean Code and Agile Software Development.",
    imageUrl: "./author3.jpg",
  },
  {
    id: 2,
    name: "Craig Walls",
    bio: "Author of Spring in Action and expert in Spring Framework.",
    imageUrl: "./author1.jpg",
  },
  {
    id: 3,
    name: "Martin Fowler",
    bio: "Renowned software engineer and author of Refactoring.",
    imageUrl: "./author2.jpg",
  },
]


const AuthorList = () => {
  return (
    <section className="py-12 px-8 md:px-10 bg-gray-50 dark:bg-gray-800 rounded-lg w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8 dark:text-white">
          ✍️ Tác giả nổi bật
        </h2>
        <div className="block md:hidden">
          <Carousel opts={{ align: "start" }}>
            <CarouselContent className="-ml-4">
              {authors.map((author) => (
                <CarouselItem key={author.id} className="pl-4 basis-4/5">
                  <AuthorCard {...author} />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div className="hidden md:grid gap-6 md:grid-cols-3">
          {authors.map((author) => (
            <AuthorCard
              key={author.id}
              name={author.name}
              bio={author.bio}
              imageUrl={author.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default AuthorList

