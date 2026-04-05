import { useEffect, useState } from "react"
import { analyticsApi } from "@/api/analytics.api"
import { ProgressRow } from "../components/ProgressRow"
import type {
  AnalyticsKpi,
  CategoryPerformance,
  FunnelStep,
  Period,
  RevenuePoint,
} from "../analytics.type"

/* ════════ TYPES ════════ */
interface LoadedData {
  kpi: AnalyticsKpi
  revenueWeekly: RevenuePoint[]
  revenueMonthly: RevenuePoint[]
  funnel: FunnelStep[]
  categories: CategoryPerformance[]
}

/* ════════ CHART ════════ */
interface BarChartProps { data: RevenuePoint[]; color?: string; height?: number }
const BarChart = ({ data, color = "#ff6b35", height = 160 }: BarChartProps) => {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height, paddingTop: 8 }}>
      {data.map((d, i) => {
        const pct = d.value / max
        const isLast = i === data.length - 1
        const label = d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : String(d.value)
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
            <span style={{ fontSize: 10, fontFamily: "'DM Mono',monospace", color: "#6b6880", marginTop: "auto", marginBottom: 4 }}>
              {label}
            </span>
            <div style={{
              width: "100%", borderRadius: "4px 4px 0 0",
              background: isLast ? color : `${color}55`,
              height: `${pct * 70}%`, minHeight: 4,
              transition: "height .4s ease",
            }} />
            <span style={{ fontSize: 10, color: isLast ? "#e8e4f0" : "#6b6880", fontFamily: "'DM Mono',monospace", whiteSpace: "nowrap" }}>
              {d.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ════════ SKELETON ════════ */
const Skel = ({ w = "100%", h = 14, r = 6 }: { w?: string | number; h?: number; r?: number }) => (
  <div style={{
    width: w, height: h, borderRadius: r,
    background: "linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.08) 50%,rgba(255,255,255,.04) 75%)",
    backgroundSize: "400px 100%",
    animation: "shimmer 1.4s ease infinite",
  }} />
)

/* ════════ KPI CARD ════════ */
interface KpiCardProps { label: string; value: string; sub: string; up: boolean; icon: string; loading?: boolean }
const KpiCard = ({ label, value, sub, up, icon, loading }: KpiCardProps) => (
  <div style={{ background: "var(--bg2,#111117)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: "18px 20px" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ fontSize: 10, color: "#9490a8", textTransform: "uppercase", letterSpacing: 1, fontFamily: "'DM Mono',monospace" }}>{label}</span>
      <span style={{ fontSize: 16, color: "#9490a8" }}>{icon}</span>
    </div>
    {loading
      ? <Skel h={30} w="60%" r={6} />
      : <div style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 26, fontWeight: 800, color: "#e8e4f0", marginBottom: 6 }}>{value}</div>
    }
    {loading
      ? <Skel h={12} w="80%" r={4} />
      : <span style={{ fontSize: 11, color: up ? "#22c55e" : "#ef4444", fontFamily: "'DM Mono',monospace" }}>
        {up ? "↑" : "↓"} {sub}
      </span>
    }
  </div>
)

/* ════════ TRAFFIC — static (no backend signal tracking) ════════ */
const TRAFFIC = [
  { label: "Organic Search", value: 42, color: "#60a5fa" },
  { label: "Direct", value: 28, color: "#ff6b35" },
  { label: "Social Media", value: 18, color: "#a78bfa" },
  { label: "Referral", value: 8, color: "#34d399" },
  { label: "Email", value: 4, color: "#f59e0b" },
]

const CAT_COLORS = ["#a78bfa", "#60a5fa", "#34d399", "#f472b6", "#fb923c"]

/* ════════ CSS ════════ */
const CSS = `
  @keyframes shimmer { from{background-position:-400px 0} to{background-position:400px 0} }
  .an-row { transition: background .1s ease; }
  .an-row:hover { background: rgba(255,255,255,.025) !important; }
  .an-chip { cursor:pointer; transition:all .15s ease; }
  .an-chip:hover { border-color:var(--accent,#ff6b35)!important; color:var(--accent,#ff6b35)!important; }
  .an-chip.active { background:var(--accent,#ff6b35)!important; border-color:var(--accent,#ff6b35)!important; color:#fff!important; }
`

const card: React.CSSProperties = {
  background: "var(--bg2,#111117)",
  border: "1px solid rgba(255,255,255,.07)",
  borderRadius: 14, overflow: "hidden",
}

const mono: React.CSSProperties = { fontFamily: "'DM Mono',monospace" }

/* ════════ PAGE ════════ */
export const AnalyticsPage = () => {
  const [period, setPeriod] = useState<Period>("monthly")
  const [data, setData] = useState<LoadedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /* Fetch everything in parallel on mount */
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await analyticsApi.loadAll(period)
        setData({
          kpi: res.kpi,
          revenueWeekly: res.revenueWeekly,
          revenueMonthly: res.revenueMonthly,
          funnel: res.funnel,
          categories: res.categories,
        })
      } catch (e) {
        console.error(e)
        setError("Failed to load analytics data")
      } finally {
        setLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Revenue data switches instantly (already fetched) */
  const revenueData = data
    ? period === "weekly" ? data.revenueWeekly : data.revenueMonthly
    : []

  const kpi = data?.kpi
  const funnel = data?.funnel ?? []
  const categories = data?.categories ?? []
  const totalRev = categories.reduce((s, c) => s + c.revenue, 0)

  /* ── Error state ── */
  if (error) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300, color: "#ef4444", ...mono, fontSize: 13 }}>
      ⚠ {error}
    </div>
  )

  return (
    <div className="page-enter">
      <style>{CSS}</style>

      {/* ── KPIs ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <KpiCard
          loading={loading}
          label="Conversion Rate"
          value={kpi ? `${kpi.conversionRate}%` : "—"}
          sub={`${kpi?.conversionRate ?? 0}% of orders delivered`}
          up={true} icon="◈"
        />
        <KpiCard
          loading={loading}
          label="Avg. Order Value"
          value={kpi ? `$${kpi.avgOrderValue.toFixed(2)}` : "—"}
          sub="per delivered order"
          up={true} icon="◇"
        />
        <KpiCard
          loading={loading}
          label="Return Rate"
          value={kpi ? `${kpi.returnRate}%` : "—"}
          sub="orders refunded"
          up={kpi ? kpi.returnRate < 3 : true} icon="↩"
        />
        <KpiCard
          loading={loading}
          label="New / Returning"
          value={kpi ? `${kpi.newUsers}/${kpi.returningUsers}` : "—"}
          sub="users this month"
          up={true} icon="◉"
        />
      </div>

      {/* ── Revenue + Traffic ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 16 }}>

        {/* Revenue bar chart */}
        <div style={card}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontFamily: "var(--font-display,'Fraunces',serif)", fontSize: 15, fontWeight: 700 }}>Revenue Overview</h2>
            <div style={{ display: "flex", gap: 6 }}>
              {(["weekly", "monthly"] as Period[]).map(p => (
                <button
                  key={p}
                  className={`an-chip ${period === p ? "active" : ""}`}
                  onClick={() => setPeriod(p)}
                  style={{ padding: "5px 12px", borderRadius: 99, border: "1px solid rgba(255,255,255,.07)", background: "#111117", color: "#9490a8", fontSize: 11, cursor: "pointer" }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding: "20px 22px 16px" }}>
            {loading ? (
              <>
                <Skel h={36} w="45%" r={6} />
                <div style={{ marginTop: 20 }}><Skel h={160} r={8} /></div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
                  <span style={{ fontFamily: "'Fraunces',serif", fontSize: 36, fontWeight: 800 }}>
                    ${revenueData.reduce((s, d) => s + d.value, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                  <span style={{ fontSize: 12, color: "#9490a8" }}>
                    total · {period === "monthly" ? "last 6 months" : "last 7 days"}
                  </span>
                </div>
                {revenueData.length > 0
                  ? <BarChart data={revenueData} color="#ff6b35" height={160} />
                  : <p style={{ ...mono, fontSize: 12, color: "#6b6880", textAlign: "center", paddingTop: 40 }}>No revenue data yet</p>
                }
              </>
            )}
          </div>
        </div>

        {/* Traffic sources — static */}
        <div style={card}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 700 }}>Traffic Sources</h2>
            <p style={{ ...mono, fontSize: 9, color: "#6b6880", marginTop: 3 }}>Estimated distribution</p>
          </div>
          <div style={{ padding: "20px 22px" }}>
            {TRAFFIC.map((t, i) => (
              <ProgressRow key={i} label={t.label} value={t.value} max={100} color={t.color} suffix="%" />
            ))}
          </div>
        </div>
      </div>

      {/* ── Funnel + Category performance ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* Funnel */}
        <div style={card}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 700 }}>Conversion Funnel</h2>
          </div>
          <div style={{ padding: "20px 22px" }}>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <Skel h={12} w="50%" r={4} />
                  <div style={{ marginTop: 8 }}><Skel h={8} r={99} /></div>
                </div>
              ))
              : funnel.length === 0
                ? <p style={{ ...mono, fontSize: 12, color: "#6b6880", textAlign: "center", paddingTop: 30 }}>No funnel data</p>
                : funnel.map((f, i) => {
                  const pct = ((f.value / (funnel[0]?.value || 1)) * 100).toFixed(1)
                  const color = CAT_COLORS[i % CAT_COLORS.length]
                  return (
                    <div key={i} style={{ marginBottom: i < funnel.length - 1 ? 16 : 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
                          <span style={{ fontSize: 13, color: "#9490a8" }}>{f.label}</span>
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <span style={{ fontSize: 11, color: "#9490a8", ...mono }}>{pct}%</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text,#e8e4f0)", ...mono, minWidth: 56, textAlign: "right" }}>
                            {f.value.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div style={{ height: 8, background: "rgba(255,255,255,.07)", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width .5s ease" }} />
                      </div>
                    </div>
                  )
                })
            }
          </div>
        </div>

        {/* Category Performance */}
        <div style={card}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 15, fontWeight: 700 }}>Category Performance</h2>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,.02)", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
                {["Category", "Revenue", "Units", "Share"].map((h, i) => (
                  <th key={h} style={{ padding: "10px 18px", textAlign: i > 0 ? "right" : "left", fontSize: 10, color: "#9490a8", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, ...mono }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,.07)" }}>
                    {[1, 2, 3, 4].map(j => (
                      <td key={j} style={{ padding: "14px 18px" }}>
                        <Skel h={12} w={j === 1 ? "80%" : "50%"} r={4} />
                      </td>
                    ))}
                  </tr>
                ))
                : categories.length === 0
                  ? <tr><td colSpan={4} style={{ textAlign: "center", padding: "32px 0", ...mono, fontSize: 12, color: "#6b6880" }}>No data</td></tr>
                  : categories.map((c, i) => {
                    const share = totalRev === 0 ? "0" : ((c.revenue / totalRev) * 100).toFixed(0)
                    const color = CAT_COLORS[i % CAT_COLORS.length]
                    return (
                      <tr key={i} className="an-row" style={{ borderTop: "1px solid rgba(255,255,255,.07)" }}>
                        <td style={{ padding: "12px 18px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
                            <span style={{ fontSize: 13 }}>{c.cat}</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px 18px", textAlign: "right", ...mono, fontSize: 12, fontWeight: 600 }}>
                          ${Number(c.revenue).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </td>
                        <td style={{ padding: "12px 18px", textAlign: "right", ...mono, fontSize: 12, color: "#9490a8" }}>
                          {c.units}
                        </td>
                        <td style={{ padding: "12px 18px", textAlign: "right" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                            <div style={{ width: 48, height: 4, background: "rgba(255,255,255,.08)", borderRadius: 99, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${share}%`, background: color, borderRadius: 99 }} />
                            </div>
                            <span style={{ fontSize: 11, ...mono, color, minWidth: 28, textAlign: "right" }}>{share}%</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}