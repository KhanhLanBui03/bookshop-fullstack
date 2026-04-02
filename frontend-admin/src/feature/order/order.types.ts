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

export interface OrderDashboardStats  {
    totalRevenue: number;
    totalPending: number;
    totalDelivered: number;
    totalShipping: number;
}
export type PaymentMethod =
    | "COD"
    | "BANK"
    | "VNPAY"
export interface OrderAdminResponse {
    id: number;
    orderCode: string;
    customerName: string;
    customerEmail: string;
    countItem: number;
    paymentMethod: PaymentMethod;
    orderTotalAmount: number;
    status: OrderStatus;
    orderDate: string;
}
