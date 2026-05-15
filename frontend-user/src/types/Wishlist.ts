export interface WishlistItemResponse {
  id: number;
  bookId: number;
  bookTitle: string;
  bookImage: string | null;
  salePrice: number;
}

export interface WishlistResponse {
  wishlistId: number;
  userId: number;
  items: WishlistItemResponse[];
}
