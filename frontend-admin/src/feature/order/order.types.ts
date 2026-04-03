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
    id: number
    orderCode: string
    customerName: string
    customerEmail: string
    countItem: number
    paymentMethod: PaymentMethod
    orderTotalAmount: number
    orderStatus: OrderStatus   // matches backend field name
    orderDate: string
}
export interface OrderAdminParams {
    keyword?: string
    orderStatus?: string
    paymentMethod?: string
    page?: number
    size?: number
    sort?: string
}

export interface PageResponse<T> {
    content: T[]
    totalElements: number
    totalPages: number
    number: number
    size: number
}
