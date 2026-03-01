interface AvatarProps { initials: string; size?: number; color?: string; }
export const Avatar = ({ initials, size = 28, color = "#ff6b35" }: AvatarProps) => (
    <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `${color}22`, border: `1.5px solid ${color}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.36, fontWeight: 600, color,
        flexShrink: 0, fontFamily: "var(--font-mono)",
    }}>
        {initials}
    </div>
);