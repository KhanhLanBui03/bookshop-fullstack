export interface StatsDashboardResponse {
    revenue: number;
    orders: number;
    bookSold: number;
    customers: number;
}
export interface TopRecentOrder {
    id: number;
    fullName: string;
    orderDate: string;
    orderStatus: string;
    orderTotalAmount: number;
}
export interface TopBookResponse {
    id: number;
    title: string;
    authorName: string;
    rating: number;
    sold: number;
    stock: number;
}
export interface SaleByCategoryResponse {
    categoryName: string;
    totalSold: number;
    percent: number;
}