import React from "react"

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
    color: "var(--text,#e8e4f0)",
    fontFamily: "var(--font-mono,'DM Mono',monospace)",
}

export const EMPTY_FORM = { name: "", description: "", url: "" }

export const CSS = `
  .cat * { box-sizing:border-box; margin:0; padding:0; }
  .cat {
    font-family: var(--font-body,'DM Sans',sans-serif);
    background: var(--bg,#0c0c10);
    min-height: 100vh;
    color: var(--text,#e8e4f0);
  }

  @keyframes catUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes catFade  { from{opacity:0} to{opacity:1} }
  @keyframes catScale { from{opacity:0;transform:scale(.95) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes catSpin  { to{transform:rotate(360deg)} }
  @keyframes catPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
  @keyframes catShim  { from{background-position:-400px 0} to{background-position:400px 0} }

  .cat-up      { animation: catUp .34s cubic-bezier(.22,1,.36,1) both; }
  .cat-stagger { animation: catUp .34s cubic-bezier(.22,1,.36,1) both; }
  .cat-overlay { animation: catFade .2s ease both; }
  .cat-modal   { animation: catScale .24s cubic-bezier(.22,1,.36,1) both; }

  .cat-card {
    transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
    cursor: default;
  }
  .cat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(0,0,0,.4);
    border-color: rgba(255,107,53,.25) !important;
  }

  .cat-btn-primary { transition:all .15s ease; cursor:pointer; border:none; }
  .cat-btn-primary:hover { filter:brightness(1.1); transform:translateY(-1px); box-shadow:0 4px 20px rgba(255,107,53,.35); }
  .cat-btn-primary:active { transform:translateY(0); }
  .cat-btn-primary:disabled { opacity:.45; cursor:not-allowed; transform:none; filter:none; box-shadow:none; }

  .cat-btn-ghost { transition:background .15s ease; cursor:pointer; border:none; }
  .cat-btn-ghost:hover { background:rgba(255,255,255,.07)!important; }
  .cat-btn-ghost:disabled { opacity:.4; cursor:not-allowed; }

  .cat-icon-btn { transition:all .14s ease; cursor:pointer; }
  .cat-icon-btn:hover { background:rgba(255,255,255,.1)!important; transform:scale(1.08); }

  .cat-input { transition:border-color .15s ease; outline:none; }
  .cat-input:focus { border-color:var(--accent,#ff6b35)!important; box-shadow:0 0 0 3px rgba(255,107,53,.12); }

  .cat-chip { cursor:pointer; transition:all .15s ease; }
  .cat-chip:hover  { border-color:var(--accent,#ff6b35)!important; color:var(--accent,#ff6b35)!important; }
  .cat-chip.active { background:var(--accent,#ff6b35)!important; border-color:var(--accent,#ff6b35)!important; color:#fff!important; }

  .cat-spinner { width:18px; height:18px; border-radius:50%; border:2px solid rgba(255,107,53,.2); border-top-color:var(--accent,#ff6b35); animation:catSpin .7s linear infinite; }
  .cat-err { color:var(--red,#ef4444); font-size:10px; margin-top:4px; font-family:var(--font-mono,'DM Mono',monospace); }
  .cat-skeleton { border-radius:8px; background:linear-gradient(90deg,rgba(255,255,255,.03) 25%,rgba(255,255,255,.07) 50%,rgba(255,255,255,.03) 75%); background-size:800px 100%; animation:catShim 1.4s ease infinite; }

  .cat-row-btn { transition:all .15s ease; cursor:pointer; border:none; }
  .cat-row-btn:hover { background:rgba(255,255,255,.07)!important; }

  .cat-img-zone { transition:all .18s ease; cursor:pointer; }
  .cat-img-zone:hover { border-color:var(--accent,#ff6b35)!important; background:rgba(255,107,53,.04)!important; }

  .cat-search-wrap:focus-within .cat-search-icon { color:var(--accent,#ff6b35); transition:color .15s; }
`