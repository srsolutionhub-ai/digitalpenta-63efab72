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
    <div className="bg-primary/10 border-b border-primary/10 overflow-hidden relative">
      <div className="marquee-mask">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-[11px] font-mono text-primary/80 tracking-wider py-1.5 px-2">{track}</span>
          <span className="text-[11px] font-mono text-primary/80 tracking-wider py-1.5 px-2">{track}</span>
        </div>
      </div>
    </div>
  );
}
