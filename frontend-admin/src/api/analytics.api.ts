import axiosClient from "./axios";

export const analyticsApi = {
    getRevenue() {
        return axiosClient.get(`/admin/analytics/revenue`);
    },
    getCategories() {
        return axiosClient.get(`/admin/analytics/categories`);
    },
    getOverall() {
        return axiosClient.get(`/admin/analytics/overall`);
    },
    // Keep loadAll for compatibility if needed, but we'll migrate to new endpoints
    async loadAll(_period: string) {
        const [rev, cat, over] = await Promise.all([
            this.getRevenue(),
            this.getCategories(),
            this.getOverall()
        ]);
        
        // Map backend data to frontend types
        return {
            kpi: {
                conversionRate: 85.5, // Mocked for now or calculate from overall
                avgOrderValue: over.data.data.totalRevenue / (over.data.data.deliveredOrders || 1),
                returnRate: 2.1,
                newUsers: 1250,
                returningUsers: 3400
            },
            revenueWeekly: rev.data.data.map((r: any) => ({ label: r.date, value: r.amount })),
            revenueMonthly: [], // Backend could provide this later
            revenueYearly: [],
            funnel: [
                { label: "Lượt xem", value: 12000 },
                { label: "Thêm giỏ hàng", value: 4500 },
                { label: "Thanh toán", value: 2100 },
                { label: "Thành công", value: over.data.data.deliveredOrders || 0 }
            ],
            categories: cat.data.data.map((c: any) => ({ cat: c.category, revenue: c.amount, units: 100 })) // Units mocked
        };
    }
}