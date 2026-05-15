import React from "react"
import type { BookStatus } from "./book.type"

export const mono: React.CSSProperties = { fontFamily: "var(--font-mono,'DM Mono',monospace)" }

export const glass = (extra?: React.CSSProperties): React.CSSProperties => ({
    background: "var(--bg3,#18181f)",
    border: "1px solid var(--border,rgba(255,255,255,.07))",
    borderRadius: 14,
    ...extra,
})

export const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--bg2,#111117)",
    border: "1px solid var(--border,rgba(255,255,255,.07))",
    borderRadius: 8,
    padding: "9px 12px",
    fontSize: 13,
    color: "var(--text)",
    fontFamily: "var(--font-mono,'DM Mono',monospace)",
}

export const STATUS_CFG: Record<BookStatus, { label: string; bg: string; color: string }> = {
    ACTIVE: { label: "Active", bg: "rgba(34,197,94,.12)", color: "var(--green,#22c55e)" },
    INACTIVE: { label: "Inactive", bg: "rgba(255,255,255,.06)", color: "var(--muted2,#9490a8)" },
    OUT_OF_STOCK: { label: "Out of Stock", bg: "rgba(239,68,68,.12)", color: "var(--red,#ef4444)" },
}

export const fmt = (n: number) => `$${Number(n ?? 0).toFixed(2)}`

export const EMPTY_FORM = {
    title: "", originalPrice: "", salePrice: "",
    description: "", status: "ACTIVE" as BookStatus, stock: "",
    categoryId: "", authorId: "", publisherId: "", images: [] as any[],
}

export const CSS = `
  .bm * { box-sizing:border-box; margin:0; padding:0; }
  .bm { font-family:var(--font-body,'DM Sans',sans-serif); background:var(--bg,#0c0c10); min-height:100vh; color:var(--text,#e8e4f0); }
  @keyframes bmUp     { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes bmFadeIn { from{opacity:0} to{opacity:1} }
  @keyframes bmScale  { from{opacity:0;transform:scale(.96) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes bmSpin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes bmShimmer{ from{background-position:-400px 0} to{background-position:400px 0} }
  .bm-up   { animation:bmUp .32s cubic-bezier(.22,1,.36,1) both; }
  .bm-row  { transition:background .1s ease; cursor:default; }
  .bm-row:hover { background:rgba(255,255,255,0.03)!important; }
  .bm-btn-primary { transition:all .15s ease; cursor:pointer; border:none; }
  .bm-btn-primary:hover { filter:brightness(1.1); transform:translateY(-1px); box-shadow:0 4px 20px rgba(255,107,53,.35); }
  .bm-btn-primary:active { transform:translateY(0); }
  .bm-btn-primary:disabled { opacity:.45; cursor:not-allowed; transform:none; filter:none; box-shadow:none; }
  .bm-btn-ghost { transition:background .15s ease; cursor:pointer; border:none; }
  .bm-btn-ghost:hover { background:rgba(255,255,255,0.07)!important; }
  .bm-btn-ghost:disabled { opacity:.4; cursor:not-allowed; }
  .bm-input { transition:border-color .15s ease; outline:none; }
  .bm-input:focus { border-color:var(--accent,#ff6b35)!important; box-shadow:0 0 0 3px rgba(255,107,53,.12); }
  .bm-chip { cursor:pointer; transition:all .15s ease; }
  .bm-chip:hover  { border-color:var(--accent,#ff6b35)!important; color:var(--accent,#ff6b35)!important; }
  .bm-chip.active { background:var(--accent,#ff6b35)!important; border-color:var(--accent,#ff6b35)!important; color:#fff!important; }
  .bm-overlay { animation:bmFadeIn .2s ease both; }
  .bm-modal   { animation:bmScale .22s cubic-bezier(.22,1,.36,1) both; }
  .bm-icon-btn { transition:background .12s ease; cursor:pointer; }
  .bm-icon-btn:hover { background:rgba(255,255,255,0.1)!important; }
  .bm-search-wrap:focus-within .bm-search-icon { color:var(--accent,#ff6b35); }
  .bm-page-btn { transition:all .15s ease; cursor:pointer; border:1px solid var(--border,rgba(255,255,255,.07)); }
  .bm-page-btn:hover:not(:disabled) { border-color:var(--accent,#ff6b35)!important; color:var(--accent,#ff6b35)!important; background:rgba(255,107,53,.06)!important; }
  .bm-page-btn:disabled { opacity:.28; cursor:not-allowed; }
  .bm-page-btn.pg-active { background:var(--accent,#ff6b35)!important; border-color:var(--accent,#ff6b35)!important; color:#fff!important; }
  .bm-spinner { width:20px; height:20px; border-radius:50%; border:2px solid rgba(255,107,53,.2); border-top-color:var(--accent,#ff6b35); animation:bmSpin .7s linear infinite; }
  .bm-err  { color:var(--red,#ef4444); font-size:10px; margin-top:4px; font-family:var(--font-mono,'DM Mono',monospace); }
  .bm-skeleton { border-radius:6px; background:linear-gradient(90deg,var(--bg2,#111117) 25%,rgba(255,255,255,.04) 50%,var(--bg2,#111117) 75%); background-size:800px 100%; animation:bmShimmer 1.4s ease infinite; }
`