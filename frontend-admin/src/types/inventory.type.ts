export interface InventoryLogResponse {
    id: number;
    bookId: number;
    bookTitle: string;
    changeAmount: number;
    stockAfter: number;
    reason: string;
    createdAt: string;
}
