export type Period = "weekly" | "monthly" | "yearly"

export interface AnalyticsKpi {
    conversionRate: number       // %
    avgOrderValue: number       // $
    returnRate: number       // %
    newUsers: number
    returningUsers: number
}

export interface RevenuePoint {
    label: string                 // "Jan 2024" | "Monday"
    value: number
}

export interface FunnelStep {
    label: string
    value: number
}

export interface CategoryPerformance {
    cat: string
    revenue: number
    units: number
}

export interface AnalyticsData {
    kpi: AnalyticsKpi
    revenue: RevenuePoint[]
    funnel: FunnelStep[]
    categories: CategoryPerformance[]
}