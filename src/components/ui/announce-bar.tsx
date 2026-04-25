export default function AnnounceBar() {
  const items = [
    "🚀 500+ Clients Served",
    "⭐ 4.9/5 Rating",
    "📈 3X Average ROI",
    "🏆 Award Winning Agency",
    "🇮🇳 India's Fastest Growing Digital Agency",
  ];
  const track = items.join("  •  ") + "  •  ";

  return (
    <div
      className="border-b border-white/[0.06] overflow-hidden relative"
      style={{
        background:
          "linear-gradient(90deg, hsl(256 90% 62% / 0.10) 0%, hsl(322 90% 62% / 0.08) 50%, hsl(192 95% 56% / 0.10) 100%)",
      }}
    >
      <div className="marquee-mask">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-[11px] font-mono tracking-[0.18em] py-1.5 px-2 bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, hsl(256 100% 80%), hsl(192 100% 75%), hsl(322 100% 80%), hsl(256 100% 80%))" }}
          >{track}</span>
          <span className="text-[11px] font-mono tracking-[0.18em] py-1.5 px-2 bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(90deg, hsl(256 100% 80%), hsl(192 100% 75%), hsl(322 100% 80%), hsl(256 100% 80%))" }}
          >{track}</span>
        </div>
      </div>
    </div>
  );
}
