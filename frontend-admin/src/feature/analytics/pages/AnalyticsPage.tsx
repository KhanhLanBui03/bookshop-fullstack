import { useState } from "react";

import { ProgressRow } from "../components/ProgressRow";

export interface ChartPoint {
  label: string;
  value: number;
}
/* ── Bar Chart ── */
interface BarChartProps { data: ChartPoint[]; color?: string; height?: number; }
const BarChart = ({ data, color = "#ff6b35", height = 160 }: BarChartProps) => {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height, paddingTop: 8 }}>
      {data.map((d, i) => {
        const pct = d.value / max;
        const isLast = i === data.length - 1;
        const label = d.value >= 1000 ? `${(d.value / 1000).toFixed(1)}k` : String(d.value);
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
            <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: "#6b6880", marginTop: "auto", marginBottom: 4 }}>
              {label}
            </span>
            <div style={{
              width: "100%", borderRadius: "4px 4px 0 0",
              background: isLast ? color : `${color}55`,
              height: `${pct * 70}%`, minHeight: 4,
            }} />
            <span style={{ fontSize: 10, color: isLast ? "#e8e4f0" : "#6b6880", fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap" }}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ── Data ── */
const MONTHLY: ChartPoint[] = [
  { label: "Aug", value: 31200 }, { label: "Sep", value: 28900 },
  { label: "Oct", value: 34500 }, { label: "Nov", value: 41800 },
  { label: "Dec", value: 52300 }, { label: "Jan", value: 43100 },
  { label: "Feb", value: 48291 },
];
const WEEKLY: ChartPoint[] = [
  { label: "Mon", value: 5200 }, { label: "Tue", value: 6800 },
  { label: "Wed", value: 4900 }, { label: "Thu", value: 7300 },
  { label: "Fri", value: 8100 }, { label: "Sat", value: 9400 },
  { label: "Sun", value: 6491 },
];

const TRAFFIC = [
  { label: "Organic Search", value: 42, color: "#60a5fa" },
  { label: "Direct",         value: 28, color: "#ff6b35" },
  { label: "Social Media",   value: 18, color: "#a78bfa" },
  { label: "Referral",       value: 8,  color: "#34d399" },
  { label: "Email",          value: 4,  color: "#f59e0b" },
];

const FUNNEL = [
  { label: "Visitors",      value: 12840, color: "#60a5fa" },
  { label: "Product Views", value: 7210,  color: "#a78bfa" },
  { label: "Add to Cart",   value: 2890,  color: "#ff6b35" },
  { label: "Checkout",      value: 1340,  color: "#f59e0b" },
  { label: "Purchased",     value: 847,   color: "#22c55e" },
];

const TOP_CATS = [
  { cat: "Fiction",    revenue: 18400, units: 641, color: "#a78bfa" },
  { cat: "Sci-Fi",     revenue: 14200, units: 373, color: "#60a5fa" },
  { cat: "Self-Help",  revenue: 11800, units: 679, color: "#34d399" },
  { cat: "History",    revenue: 8100,  units: 189, color: "#f472b6" },
  { cat: "Psychology", revenue: 5791,  units: 143, color: "#fb923c" },
];
const TOTAL_REV = TOP_CATS.reduce((a, t) => a + t.revenue, 0);

type Period = "weekly" | "monthly";

/* ── KPI card ── */
interface KpiCardProps { label: string; value: string; change: string; up: boolean; icon: string; }
const KpiCard = ({ label, value, change, up, icon }: KpiCardProps) => (
  <div style={{ background: "#111117", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 20px" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <span style={{ fontSize: 10, color: "#9490a8", textTransform: "uppercase", letterSpacing: 1, fontFamily: "'DM Mono', monospace" }}>{label}</span>
      <span style={{ fontSize: 16, color: "#9490a8" }}>{icon}</span>
    </div>
    <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "#e8e4f0", marginBottom: 6 }}>{value}</div>
    <span style={{ fontSize: 11, color: up ? "#22c55e" : "#ef4444", fontFamily: "'DM Mono', monospace" }}>
      {up ? "↑" : "↓"} {change} vs last period
    </span>
  </div>
);

/* ── Page ── */
export const AnalyticsPage = () => {
  const [period, setPeriod] = useState<Period>("monthly");
  const chartData = period === "monthly" ? MONTHLY : WEEKLY;

  return (
    <div className="page-enter">
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        <KpiCard label="Conversion Rate"  value="6.6%"   change="0.8%"  up={true}  icon="◈" />
        <KpiCard label="Avg. Order Value" value="$38.20" change="$4.10" up={true}  icon="◇" />
        <KpiCard label="Return Rate"      value="2.1%"   change="0.3%"  up={true}  icon="↩" />
        <KpiCard label="New vs Returning" value="64/36"  change="5%"    up={true}  icon="◉" />
      </div>

      {/* Revenue + Traffic */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 16 }}>
        <div style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700 }}>Revenue Overview</h2>
            <div style={{ display: "flex", gap: 6 }}>
              {(["weekly", "monthly"] as Period[]).map((p) => (
                <button key={p} onClick={() => setPeriod(p)} className={`filter-chip ${period === p ? "active" : ""}`}
                  style={{ padding: "5px 12px", borderRadius: 99, border: "1px solid rgba(255,255,255,0.07)", background: "#111117", color: "#9490a8", fontSize: 11, cursor: "pointer" }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding: "20px 22px 16px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 20 }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 800 }}>$48,291</span>
              <span style={{ fontSize: 13, color: "#22c55e", fontFamily: "'DM Mono', monospace" }}>↑ 12.4%</span>
              <span style={{ fontSize: 12, color: "#9490a8" }}>vs last {period === "monthly" ? "month" : "week"}</span>
            </div>
            <BarChart data={chartData} color="#ff6b35" height={160} />
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700 }}>Traffic Sources</h2>
          </div>
          <div style={{ padding: "20px 22px" }}>
            {TRAFFIC.map((t, i) => (
              <ProgressRow key={i} label={t.label} value={t.value} max={100} color={t.color} suffix="%" />
            ))}
          </div>
        </div>
      </div>

      {/* Funnel + Category table */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700 }}>Conversion Funnel</h2>
          </div>
          <div style={{ padding: "20px 22px" }}>
            {FUNNEL.map((f, i) => {
              const pct = ((f.value / FUNNEL[0].value) * 100).toFixed(1);
              return (
                <div key={i} style={{ marginBottom: i < FUNNEL.length - 1 ? 16 : 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: f.color, display: "inline-block" }} />
                      <span style={{ fontSize: 13, color: "#9490a8" }}>{f.label}</span>
                    </div>
                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "#9490a8", fontFamily: "'DM Mono', monospace" }}>{pct}%</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", fontFamily: "'DM Mono', monospace", minWidth: 48, textAlign: "right" }}>
                        {f.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div style={{ height: 8, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: f.color, borderRadius: 99 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 15, fontWeight: 700 }}>Category Performance</h2>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,.02)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                {["Category", "Revenue", "Units", "Share"].map((h, i) => (
                  <th key={h} style={{ padding: "10px 18px", textAlign: i > 0 ? "right" : "left", fontSize: 10, color: "#9490a8", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_CATS.map((c, i) => {
                const share = ((c.revenue / TOTAL_REV) * 100).toFixed(0);
                return (
                  <tr key={i} className="table-row" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <td style={{ padding: "12px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, display: "inline-block", flexShrink: 0 }} />
                        <span style={{ fontSize: 13 }}>{c.cat}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 18px", textAlign: "right", fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600 }}>
                      ${c.revenue.toLocaleString()}
                    </td>
                    <td style={{ padding: "12px 18px", textAlign: "right", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#9490a8" }}>{c.units}</td>
                    <td style={{ padding: "12px 18px", textAlign: "right" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                        <div style={{ width: 48, height: 4, background: "var(--bg3)", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${share}%`, background: c.color, borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: c.color, minWidth: 28, textAlign: "right" }}>{share}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
