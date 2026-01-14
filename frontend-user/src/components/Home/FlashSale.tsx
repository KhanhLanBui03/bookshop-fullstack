import { useEffect, useState } from "react"
import { Flame, Timer } from "lucide-react"
import BookCard from "../BookCard"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const FLASH_END_KEY = "flash_sale_end_time"

const flashSaleBooks = [
  {
    id: 1,
    title: "Clean Code",
    description: "A Handbook of Agile Software Craftsmanship",
    rating: 4.8,
    category: "Programming",
    imageUrl: "/gia-kim.jpg",
    originalPrice: 250000,
    salePrice: 175000,
    
  },
  {
    id: 2,
    title: "Spring in Action",
    description: "Comprehensive guide to Spring Framework",
    rating: 4.5,
    category: "Programming",
    imageUrl: "/connan.jpg",
    originalPrice: 280000,
    salePrice: 210000,
  },
]

const getEndTime = () => {
  const saved = localStorage.getItem(FLASH_END_KEY)
  if (saved) return Number(saved)

  const end = Date.now() + 2 * 60 * 60 * 1000 // 2 tiếng
  localStorage.setItem(FLASH_END_KEY, end.toString())
  return end
}

const FlashSale = () => {
  const [endTime] = useState(getEndTime)
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(endTime - Date.now())
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  const formatTime = (ms: number) => {
    if (ms <= 0) return "00:00:00"
    const totalSeconds = Math.floor(ms / 1000)
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  return (
    <section className="px-4 md:px-16 py-10 bg-red-50 rounded-xl w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-red-600">
          <Flame /> Flash Sale hôm nay
        </h2>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded shadow">
          <Timer className="w-5 h-5 text-red-500" />
          <span className="font-mono text-lg text-red-600">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <Carousel>
        <CarouselContent className="-ml-4">
          {flashSaleBooks.map((book) => (
            <CarouselItem key={book.id} className="pl-4 basis-1/2 md:basis-1/4">
              <BookCard {...book} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  )
}

export default FlashSale
