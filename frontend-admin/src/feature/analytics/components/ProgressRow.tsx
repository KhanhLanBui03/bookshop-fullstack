
interface ProgressRowProps { label: string; value: number; max: number; color: string; suffix?: string; }
export const ProgressRow = ({ label, value, max, color, suffix = "" }: ProgressRowProps) => {
    const pct = (value / max) * 100;
    return (
        <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#9490a8" }}>{label}</span>
                <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: "var(--text)", fontWeight: 600 }}>{value}{suffix}</span>
            </div>
            <div style={{ height: 6, background: "#18181f", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99 }} />
            </div>
        </div>
    );
};