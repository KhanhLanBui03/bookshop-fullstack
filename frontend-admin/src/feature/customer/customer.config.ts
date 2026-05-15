import type { AuthProvider, RoleName } from "./customer.type"

export const AVATAR_COLORS = [
    "#ff6b35", "#22c55e", "#60a5fa", "#f59e0b", "#a78bfa", "#34d399", "#fb7185", "#38bdf8",
]

export const avatarColor = (id: number) => AVATAR_COLORS[id % AVATAR_COLORS.length]

export const PROVIDER_CFG: Record<AuthProvider, { icon: string; label: string; color: string }> = {
    LOCAL: { icon: "🔑", label: "Local", color: "var(--muted2,#9490a8)" },
    GOOGLE: { icon: "G", label: "Google", color: "#ea4335" },
    FACEBOOK: { icon: "F", label: "Facebook", color: "#1877f2" },
    GITHUB: { icon: "GH", label: "Github", color: "#24292e" },
}

export const ROLE_CFG: Record<RoleName, { label: string; bg: string; color: string }> = {
    ADMIN: { label: "Admin", bg: "rgba(255,107,53,0.15)", color: "var(--accent,#ff6b35)" },
    STAFF: { label: "Staff", bg: "rgba(96,165,250,0.15)", color: "#60a5fa" },
    USER: { label: "User", bg: "rgba(255,255,255,0.07)", color: "var(--muted2,#9490a8)" },
}

export const mono: React.CSSProperties = { fontFamily: "var(--font-mono,'DM Mono',monospace)" }

export const glass = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: "var(--bg3,#18181f)",
    border: "1px solid var(--border,rgba(255,255,255,.07))",
    borderRadius: 14,
    ...extra,
})

export const fmt = (n: number) => `$${Number(n ?? 0).toFixed(2)}`
export const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })

export const initials = (name: string) =>
    (name ?? "?").split(" ").filter(Boolean).slice(-2).map(w => w[0]).join("").toUpperCase()

export const CSS = `
  .cm * { box-sizing: border-box; margin: 0; padding: 0; }
  .cm {
    font-family: var(--font-body,'DM Sans',sans-serif);
    background: var(--bg,#0c0c10);
    min-height: 100vh;
    color: var(--text,#e8e4f0);
  }
  @keyframes cmUp     { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes cmFadeIn { from{opacity:0} to{opacity:1} }
  @keyframes cmSlide  { from{opacity:0;transform:translateX(32px)} to{opacity:1;transform:translateX(0)} }
  @keyframes cmSpin   { to{transform:rotate(360deg)} }
  @keyframes cmSkel   { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  .cm-up  { animation: cmUp .32s cubic-bezier(.22,1,.36,1) both; }
  .cm-row { transition: background .1s ease; cursor: pointer; }
  .cm-row:hover { background: rgba(255,255,255,0.035) !important; }

  .cm-btn-primary { transition: all .15s ease; cursor: pointer; border: none; }
  .cm-btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
  .cm-btn-primary:active { transform: translateY(0); }
  .cm-btn-ghost { transition: background .15s ease; cursor: pointer; border: none; }
  .cm-btn-ghost:hover { background: rgba(255,255,255,0.07) !important; }

  .cm-input { transition: border-color .15s ease; outline: none; }
  .cm-input:focus { border-color: var(--accent,#ff6b35) !important; box-shadow: 0 0 0 3px rgba(255,107,53,0.12); }

  .cm-chip { cursor: pointer; transition: all .15s ease; }
  .cm-chip:hover  { border-color: var(--accent,#ff6b35) !important; color: var(--accent,#ff6b35) !important; }
  .cm-chip.active { background: var(--accent,#ff6b35) !important; border-color: var(--accent,#ff6b35) !important; color:#fff !important; }

  .cm-overlay { animation: cmFadeIn .2s ease both; }
  .cm-drawer  { animation: cmSlide .28s cubic-bezier(.22,1,.36,1) both; }

  .cm-icon-btn { transition: background .12s ease; cursor: pointer; }
  .cm-icon-btn:hover { background: rgba(255,255,255,0.1) !important; }

  .cm-page-btn { transition: all .15s ease; cursor: pointer; border: 1px solid rgba(255,255,255,0.07); }
  .cm-page-btn:hover:not(:disabled) { border-color: var(--accent,#ff6b35) !important; color: var(--accent,#ff6b35) !important; background: rgba(255,107,53,0.06) !important; }
  .cm-page-btn:disabled { opacity:.28; cursor:not-allowed; }
  .cm-page-btn.pg-active { background: var(--accent,#ff6b35) !important; border-color: var(--accent,#ff6b35) !important; color:#fff !important; }

  .cm-spinner {
    width:18px; height:18px; border-radius:50%;
    border:2px solid rgba(255,255,255,0.1);
    border-top-color: var(--accent,#ff6b35);
    animation: cmSpin .7s linear infinite;
  }
  .cm-skeleton {
    background: linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%);
    background-size: 200% 100%;
    animation: cmSkel 1.4s ease infinite;
    border-radius: 6px;
  }
`