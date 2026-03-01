export type OrderStatus =
  | "Delivered"
  | "Processing"
  | "Shipped"
  | "Pending"
  | "Cancelled";

export interface Order {
    id: string;
    name: string;
    avatar: string;
    items: number;
    total: number;
    date: string;
    status: OrderStatus;
}
export interface StatusConfig {
    bg: string;
    color: string;
    dot: string;
}
export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";
export type BadgeLabel = OrderStatus | StockStatus;