import type { SaleByCategoryResponse, StatsDashboardResponse, TopBookResponse, TopRecentOrder } from "@/feature/dashboard/dashboard.type";
import axiosClient from "./axios";


export const dashboardApi = {
    getDashboardStats: async (): Promise<StatsDashboardResponse> => {
        const response = await axiosClient.get('/dashboards/stats');
        return response.data.data;

    },
    getTopRecentOrder:  async (): Promise<TopRecentOrder[]> => {
        const response = await axiosClient.get('/dashboards/recent-order');
        return response.data.data;
    },
    getTopBook: async (): Promise<TopBookResponse[]> => {
        const response = await axiosClient.get('/dashboards/top-book');
        return response.data.data;
    },
    getTopBookByCategory: async (): Promise<SaleByCategoryResponse[]> => {
        const response = await axiosClient.get('/dashboards/sale-category');   
        return response.data.data;
    }
}