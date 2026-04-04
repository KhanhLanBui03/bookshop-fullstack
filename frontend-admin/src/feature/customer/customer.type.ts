export type AuthProvider = "LOCAL" | "GOOGLE"

export type RoleName = "ADMIN" | "USER" | "STAFF"

export interface UserAdminResponse {
    id: number
    fullName: string
    email: string
    phoneNumber: string
    authProvider: AuthProvider
    roles: string[]        // e.g. ["ADMIN", "USER"] — ROLE_ prefix stripped by service
    totalOrder: number
    totalSpent: number
    createAt: string    // LocalDate → ISO string "YYYY-MM-DD"
}

export interface UserDashboardStats {
    totalCustomers: number
    totalRevenue: number
    totalOrders: number
    newThisMonth: number
}

export interface CustomerAdminParams {
    keyword?: string
    role?: RoleName        // sent without ROLE_ prefix; service adds it
    authProvider?: AuthProvider
    page?: number          // 0-indexed (Spring)
    size?: number
    sort?: string
}