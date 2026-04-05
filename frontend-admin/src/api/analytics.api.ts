import axiosClient from "./axios"
import type {
    AnalyticsKpi,
    AnalyticsData,
    CategoryPerformance,
    FunnelStep,
    Period,
    RevenuePoint,
} from "@/feature/analytics/analytics.type"

export const analyticsApi = {
    /** KPI cards */
    getKpi: async (): Promise<AnalyticsKpi> => {
        const res = await axiosClient.get("/analytics/kpi")
        return res.data.data
    },

    /** Revenue time series — weekly | monthly */
    getRevenue: async (period: Period): Promise<RevenuePoint[]> => {
        const res = await axiosClient.get("/analytics/revenue", { params: { period } })
        return res.data.data
    },

    /** Conversion funnel */
    getFunnel: async (): Promise<FunnelStep[]> => {
        const res = await axiosClient.get("/analytics/funnel")
        return res.data.data
    },

    /** Top 5 categories */
    getCategoryPerformance: async (): Promise<CategoryPerformance[]> => {
        const res = await axiosClient.get("/analytics/categories")
        return res.data.data
    },

    /**
     * Fetch everything in parallel.
     * Revenue is fetched twice (weekly + monthly) so toggling period is instant.
     */
    loadAll: async (period: Period): Promise<AnalyticsData & { revenueWeekly: RevenuePoint[]; revenueMonthly: RevenuePoint[] }> => {
        const [kpi, revenueWeekly, revenueMonthly, funnel, categories] = await Promise.all([
            analyticsApi.getKpi(),
            analyticsApi.getRevenue("weekly"),
            analyticsApi.getRevenue("monthly"),
            analyticsApi.getFunnel(),
            analyticsApi.getCategoryPerformance(),
        ])
        return {
            kpi,
            revenue: period === "weekly" ? revenueWeekly : revenueMonthly,
            revenueWeekly,
            revenueMonthly,
            funnel,
            categories,
        }
    },
}