export const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,700;0,800;1,600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg:          #0c0c10;
      --bg2:         #111117;
      --bg3:         #18181f;
      --border:      rgba(255,255,255,0.07);
      --border2:     rgba(255,255,255,0.12);
      --text:        #e8e4f0;
      --muted:       #6b6880;
      --muted2:      #9490a8;
      --accent:      #ff6b35;
      --green:       #22c55e;
      --red:         #ef4444;
      --amber:       #f59e0b;
      --blue:        #60a5fa;
      --font-display:'Fraunces', serif;
      --font-body:   'DM Sans', sans-serif;
      --font-mono:   'DM Mono', monospace;
    }

    body { background: var(--bg); font-family: var(--font-body); color: var(--text); }

    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #2a2a35; border-radius: 99px; }
    ::-webkit-scrollbar-thumb:hover { background: #3a3a48; }

    input, select, textarea, button { font-family: var(--font-body); }
    input:focus, select:focus { outline: none; }
    input::placeholder { color: var(--muted); }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(.95); }
      to   { opacity: 1; transform: scale(1); }
    }

    .page-enter    { animation: fadeUp .35s cubic-bezier(.22,1,.36,1) both; }
    .modal-backdrop{ animation: fadeIn .2s ease both; }
    .modal-panel   { animation: scaleIn .22s cubic-bezier(.22,1,.36,1) both; }

    .sidebar-link { transition: all .15s ease; cursor: pointer; }
    .sidebar-link:hover  { background: rgba(255,255,255,0.05) !important; }
    .sidebar-link.active { background: rgba(255,107,53,0.12)  !important; }

    .table-row { transition: background .1s ease; }
    .table-row:hover { background: rgba(255,255,255,0.03) !important; }

    .btn-primary { transition: all .15s ease; }
    .btn-primary:hover  { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(255,107,53,0.35); }
    .btn-primary:active { transform: translateY(0); }

    .btn-ghost { transition: all .15s ease; }
    .btn-ghost:hover { background: rgba(255,255,255,0.07) !important; }

    .stat-card { transition: all .2s ease; }
    .stat-card:hover { border-color: rgba(255,255,255,0.15) !important; transform: translateY(-2px); }

    .icon-btn { transition: all .12s ease; }
    .icon-btn:hover { background: rgba(255,255,255,0.1) !important; }

    .filter-chip { transition: all .15s ease; cursor: pointer; }
    .filter-chip:hover  { border-color: var(--accent) !important; color: var(--accent) !important; }
    .filter-chip.active { background: var(--accent) !important; border-color: var(--accent) !important; color: #fff !important; }

    .settings-tab-btn { transition: all .15s ease; }
  `}</style>
);
