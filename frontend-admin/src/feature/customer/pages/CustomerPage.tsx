import React, { useState, useEffect, useCallback, useRef } from "react"
import { CSS, mono } from "../customer.config"
import { customerApi } from "@/api/customer.api"
import type { AuthProvider, RoleName, UserAdminResponse, UserDashboardStats } from "../customer.type"

import { CustomerStatsGrid } from "../components/CustomerStatsGrid"
import { CustomerFilters } from "../components/CustomerFilters"
import { CustomerTable } from "../components/CustomerTable"
import { CustomerPagination } from "../components/CustomerPagination"
import { CustomerDrawer } from "../components/CustomerDrawer"

type SortCol = "fullName" | "dateJoin" | "totalOrder" | "totalSpent"

const PAGE_SIZE = 10

export const CustomerPage = () => {
    /* ── Server data ── */
    const [stats, setStats] = useState<UserDashboardStats | null>(null)
    const [users, setUsers] = useState<UserAdminResponse[]>([])
    const [totalPages, setTotalPages] = useState(1)
    const [totalElements, setTotalElements] = useState(0)
    const [loading, setLoading] = useState(false)
    const [statsLoading, setStatsLoading] = useState(true)

    /* ── Filter / sort / page state ── */
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const [filterRole, setFilterRole] = useState<RoleName | "ALL">("ALL")
    const [filterProvider, setFilterProvider] = useState<AuthProvider | "ALL">("ALL")
    const [sortBy, setSortBy] = useState<SortCol>("dateJoin")
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
    const [page, setPage] = useState(1)

    /* ── UI state ── */
    const [selected, setSelected] = useState<UserAdminResponse | null>(null)
    const [toast, setToast] = useState<string | null>(null)

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    /* ── Debounce search ── */
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            setDebouncedSearch(search)
            setPage(1)
        }, 400)
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    }, [search])

    /* ── Fetch stats (once) ── */
    useEffect(() => {
        const load = async () => {
            setStatsLoading(true)
            try { setStats(await customerApi.getDashboardStats()) }
            catch (e) { console.error("stats error:", e) }
            finally { setStatsLoading(false) }
        }
        load()
    }, [])

    /* ── Fetch users (server-side) ── */
    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const res = await customerApi.getAllAdminUsers({
                keyword: debouncedSearch || undefined,
                role: filterRole !== "ALL" ? filterRole : undefined,
                authProvider: filterProvider !== "ALL" ? filterProvider : undefined,
                page: page - 1,   // Spring 0-indexed
                size: PAGE_SIZE,
                sort: `${sortBy},${sortDir}`,
            })
            setUsers(res.content)
            setTotalPages(res.totalPages)
            setTotalElements(res.totalElements)
        } catch (e) {
            console.error("users error:", e)
        } finally {
            setLoading(false)
        }
    }, [debouncedSearch, filterRole, filterProvider, page, sortBy, sortDir])

    useEffect(() => { fetchUsers() }, [fetchUsers])

    /* ── Handlers ── */
    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(null), 2800)
    }

    const handleSort = (col: SortCol) => {
        if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc")
        else { setSortBy(col); setSortDir("desc") }
        setPage(1)
    }

    const handleSearchClear = () => {
        setSearch("")
        setDebouncedSearch("")
        setPage(1)
    }

    const handleClearFilters = () => {
        setSearch(""); setDebouncedSearch("")
        setFilterRole("ALL"); setFilterProvider("ALL")
        setPage(1)
    }

    /* ════════ RENDER ════════ */
    return (
        <div className="cm">
            <style>{CSS}</style>

            {/* Toast */}
            {toast && (
                <div style={{
                    position: "fixed", bottom: 24, right: 24, zIndex: 100,
                    background: "var(--bg3,#18181f)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderLeft: "3px solid var(--accent,#ff6b35)",
                    borderRadius: 10, padding: "12px 18px",
                    ...mono, fontSize: 12, color: "var(--text)",
                    animation: "cmUp .3s cubic-bezier(.22,1,.36,1) both",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}>
                    ✓ {toast}
                </div>
            )}

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 28px" }}>

                {/* ── Page header ── */}
                <div className="cm-up" style={{ marginBottom: 28 }}>
                    <p style={{
                        ...mono, fontSize: 10, color: "var(--muted)",
                        textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6,
                    }}>
                        User Management
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h1 style={{
                            fontFamily: "var(--font-display,'Fraunces',serif)",
                            fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px",
                        }}>
                            Customers
                        </h1>
                        {loading && (
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div className="cm-spinner" />
                                <span style={{ ...mono, fontSize: 11, color: "var(--muted)" }}>Syncing…</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Stats ── */}
                <CustomerStatsGrid stats={stats} loading={statsLoading} />

                {/* ── Filters ── */}
                <CustomerFilters
                    search={search}
                    filterRole={filterRole}
                    filterProvider={filterProvider}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    onSearchChange={v => { setSearch(v) }}
                    onSearchClear={handleSearchClear}
                    onRoleChange={r => { setFilterRole(r); setPage(1) }}
                    onProviderChange={p => { setFilterProvider(p); setPage(1) }}
                    onClearAll={handleClearFilters}
                />

                {/* ── Table ── */}
                <CustomerTable
                    users={users}
                    loading={loading}
                    page={page}
                    pageSize={PAGE_SIZE}
                    sortBy={sortBy}
                    sortDir={sortDir}
                    onSort={handleSort}
                    onView={setSelected}
                />

                {/* ── Pagination ── */}
                <CustomerPagination
                    page={page}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    pageSize={PAGE_SIZE}
                    onPageChange={setPage}
                />
            </div>

            {/* ── Drawer ── */}
            {selected && (
                <CustomerDrawer
                    user={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    )
}