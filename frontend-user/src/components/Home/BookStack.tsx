import { useState } from "react";
import { ArrowRight, Star, Sparkles } from "lucide-react";

const TAGS = [
  "Tâm Hồn Nhạy Cảm",
  "Fan Trinh Thám",
  "Yêu Lịch Sử",
  "Mê Khoa Học",
  "Sách Thiếu Nhi",
];

// Floating book stack SVG illustration
function BookStack() {
  return (
    <svg viewBox="0 0 320 280" width="320" height="280" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <ellipse cx="160" cy="260" rx="100" ry="14" fill="rgba(0,0,0,0.18)" />

      {/* Book 1 – bottom right, teal */}
      <g transform="rotate(-12, 200, 180)">
        <rect x="155" y="120" width="90" height="125" rx="4" fill="#0d9488" />
        <rect x="155" y="120" width="12" height="125" rx="2" fill="#0f766e" />
        <rect x="163" y="130" width="74" height="3" rx="1.5" fill="rgba(255,255,255,0.25)" />
        <rect x="163" y="138" width="50" height="3" rx="1.5" fill="rgba(255,255,255,0.15)" />
        <circle cx="205" cy="185" r="22" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <text x="205" y="190" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">✦</text>
      </g>

      {/* Book 2 – red, standing */}
      <g transform="rotate(6, 130, 160)">
        <rect x="80" y="80" width="80" height="135" rx="4" fill="#dc2626" />
        <rect x="80" y="80" width="11" height="135" rx="2" fill="#b91c1c" />
        <rect x="88" y="92" width="62" height="3" rx="1.5" fill="rgba(255,255,255,0.3)" />
        <rect x="88" y="100" width="40" height="3" rx="1.5" fill="rgba(255,255,255,0.18)" />
        <circle cx="127" cy="155" r="26" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
        <text x="127" y="161" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">$</text>
        <rect x="88" y="192" width="62" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
        <rect x="88" y="198" width="45" height="2" rx="1" fill="rgba(255,255,255,0.12)" />
      </g>

      {/* Book 3 – orange/gold, tilted */}
      <g transform="rotate(-20, 175, 140)">
        <rect x="130" y="60" width="75" height="110" rx="4" fill="#d97706" />
        <rect x="130" y="60" width="11" height="110" rx="2" fill="#b45309" />
        <rect x="138" y="72" width="57" height="3" rx="1.5" fill="rgba(255,255,255,0.3)" />
        <rect x="138" y="80" width="38" height="3" rx="1.5" fill="rgba(255,255,255,0.18)" />
        <rect x="138" y="88" width="50" height="3" rx="1.5" fill="rgba(255,255,255,0.12)" />
      </g>

      {/* Book 4 – purple, small */}
      <g transform="rotate(15, 90, 200)">
        <rect x="55" y="170" width="60" height="85" rx="3" fill="#7c3aed" />
        <rect x="55" y="170" width="9" height="85" rx="2" fill="#6d28d9" />
        <rect x="61" y="180" width="46" height="2.5" rx="1.2" fill="rgba(255,255,255,0.25)" />
        <rect x="61" y="187" width="30" height="2.5" rx="1.2" fill="rgba(255,255,255,0.15)" />
      </g>

      {/* Feather / quill */}
      <g transform="rotate(-30, 240, 80) translate(195, 30)">
        <ellipse cx="30" cy="50" rx="8" ry="45" fill="rgba(255,255,255,0.85)" />
        <ellipse cx="30" cy="50" rx="4" ry="42" fill="rgba(255,255,255,0.5)" />
        <line x1="30" y1="10" x2="30" y2="90" stroke="rgba(200,200,200,0.6)" strokeWidth="1" />
      </g>

      {/* Stars scattered */}
      <text x="30" y="60" fontSize="18" fill="#fbbf24">★</text>
      <text x="270" y="40" fontSize="14" fill="#fbbf24">✦</text>
      <text x="20" y="200" fontSize="12" fill="rgba(255,255,255,0.5)">✦</text>
      <text x="290" y="200" fontSize="10" fill="#fbbf24">★</text>

      {/* Coin */}
      <circle cx="245" cy="230" r="18" fill="#fbbf24" opacity="0.9" />
      <circle cx="245" cy="230" r="14" fill="#f59e0b" opacity="0.8" />
      <text x="245" y="235" textAnchor="middle" fill="#92400e" fontSize="12" fontWeight="bold">$</text>

      {/* Rainbow */}
      <g transform="translate(10, 20) scale(0.6)">
        <path d="M10 60 Q50 10 90 60" fill="none" stroke="#f87171" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
        <path d="M18 60 Q50 22 82 60" fill="none" stroke="#fb923c" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
        <path d="M25 60 Q50 30 75 60" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        <path d="M32 60 Q50 38 68 60" fill="none" stroke="#34d399" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        <path d="M38 60 Q50 45 62 60" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* Sparkle dots */}
      <circle cx="50" cy="110" r="4" fill="rgba(251,191,36,0.6)" />
      <circle cx="285" cy="130" r="3" fill="rgba(255,255,255,0.4)" />
      <circle cx="160" cy="30" r="3" fill="rgba(255,255,255,0.35)" />
    </svg>
  );
}

export default function HeroBanner() {
  const [hoveredTag, setHoveredTag] = useState(null);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        minHeight: 420,
        background: "linear-gradient(135deg, #1e3a5f 0%, #2d5282 35%, #2a6496 60%, #1a4a6e 100%)",
      }}
    >
      {/* ── Background large ghost text ── */}
      <div
        aria-hidden
        className="absolute inset-0 flex flex-col justify-center select-none pointer-events-none"
        style={{ paddingLeft: "2%" }}
      >
        {["GỢI Ý", "QUÀ", "TẶNG"].map((word, i) => (
          <div
            key={i}
            className="leading-none font-black uppercase"
            style={{
              fontSize: "clamp(60px, 10vw, 130px)",
              color: "rgba(255,255,255,0.07)",
              letterSpacing: "-0.02em",
              lineHeight: 0.92,
              WebkitTextStroke: "1px rgba(255,255,255,0.05)",
            }}
          >
            {word}
          </div>
        ))}
      </div>

      {/* ── Scattered cloud/bubble shapes ── */}
      <div className="absolute top-8 right-80 w-52 h-44 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-64 h-32 opacity-8 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)" }} />

      {/* ── Bubble behind illustration ── */}
      <div
        className="absolute right-16 top-1/2 -translate-y-1/2"
        style={{
          width: 320, height: 320,
          background: "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 60%, transparent 100%)",
          borderRadius: "50%",
        }}
      />

      {/* ── Small decorative stars top ── */}
      {[
        { top: "12%", left: "5%", size: 20, opacity: 0.7 },
        { top: "8%", left: "62%", size: 14, opacity: 0.5 },
        { top: "20%", right: "8%", size: 18, opacity: 0.6 },
        { bottom: "15%", left: "8%", size: 12, opacity: 0.4 },
      ].map((s, i) => (
        <div key={i} className="absolute" style={{ ...s, color: "#fbbf24", fontSize: s.size, opacity: s.opacity, userSelect: "none" }}>★</div>
      ))}

      {/* ── CONTENT ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 flex items-center justify-between" style={{ minHeight: 420 }}>

        {/* Left: text + CTA */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto">
          {/* Top badge */}
          <div className="flex items-center gap-2 mb-4 bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full">
            <Sparkles size={13} className="text-yellow-300" />
            <span className="text-yellow-300 text-xs font-semibold tracking-wide uppercase">Gợi ý sách hay</span>
          </div>

          {/* Main heading */}
          <h1
            className="text-white font-black uppercase leading-tight mb-4"
            style={{
              fontSize: "clamp(22px, 3.5vw, 42px)",
              letterSpacing: "-0.01em",
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}
          >
            Chọn Ngay Sách Sắp Ra Mắt<br />
            <span style={{ color: "#fbbf24" }}>Đặt Trước – Ưu Đãi Ngay!</span>
          </h1>

          {/* Description */}
          <p className="text-blue-100 text-base leading-relaxed mb-8 max-w-md" style={{ fontFamily: "system-ui" }}>
            Bạn chưa biết chọn sách nào sắp ra mắt?
            Cùng khám phá những đầu sách được mong chờ nhất và đặt trước ngay hôm nay!
          </p>

          {/* CTA Button */}
          <button
            className="group flex items-center gap-3 text-white font-bold text-base px-8 py-4 rounded-xl mb-6 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            style={{
              background: "#e53e3e",
              boxShadow: "0 4px 20px rgba(229,62,62,0.5)",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#c53030"}
            onMouseLeave={e => e.currentTarget.style.background = "#e53e3e"}
          >
            Xem sách sắp ra mắt
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Tag pills */}
          <div className="flex flex-wrap justify-center gap-2">
            {TAGS.map((tag, i) => (
              <button
                key={i}
                onMouseEnter={() => setHoveredTag(i)}
                onMouseLeave={() => setHoveredTag(null)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  fontFamily: "system-ui",
                  background: hoveredTag === i ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.25)",
                  backdropFilter: "blur(8px)",
                  transform: hoveredTag === i ? "translateY(-2px)" : "none",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Right: illustration */}
        <div
          className="flex-shrink-0 hidden lg:flex items-center justify-center"
          style={{ marginRight: "-20px" }}
        >
          <div
            style={{
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))",
              animation: "float 4s ease-in-out infinite",
            }}
          >
            <BookStack />
          </div>
        </div>
      </div>

      {/* ── float animation ── */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}