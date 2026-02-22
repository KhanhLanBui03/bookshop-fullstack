import type { BookCard } from "./Book"

export interface AuthorResponse {
  id: number
  name: string
  email: string
  bio: string
  image: string
}

export interface AuthorDetailResponse {
    author: AuthorResponse;
    books: BookCard[]
}
