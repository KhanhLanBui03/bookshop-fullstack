import type { Image } from "./Image"
import type { Publisher } from "./Publisher"

export type BookCard = {
  id: number
  title: string
  salePrice: number
  originalPrice?: number
  rating: number
  soldCount: number
  image: string
  authorName: string
}
export type BookDetail = {
  id: number
  title: string
  description: string
  originalPrice: number
  salePrice: number
  rating: number
  stock: number
  soldCount: number
  categoryName: string
  authorName: string
  publisher: Publisher
  images: Image[]
  createdAt: string
}
export interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number
  size: number
}
