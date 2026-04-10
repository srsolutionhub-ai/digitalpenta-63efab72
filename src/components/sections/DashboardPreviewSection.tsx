import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { TrendingUp, Users, Eye, MousePointerClick } from "lucide-react";

const kpis = [
  { label: "Total Leads", value: 1247, icon: Users, color: "text-violet-400", bg: "bg-violet-500/10" },
  { label: "Page Views", value: 84520, icon: Eye, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { label: "Conversions", value: 342, icon: MousePointerClick, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Revenue", value: 12.4, suffix: "L", prefix: "₹", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10" },
];

function AnimCounter({ value, prefix = "", suffix = "", inView }: { value: number; prefix?: string; suffix?: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (inView && !started.current) {
      started.current = true;
      const dur = 1500;
      const start = performance.now();
      const isFloat = !Number.isInteger(value);
      const animate = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        setCount(isFloat ? parseFloat((eased * value).toFixed(1)) : Math.round(eased * value));
        if (p < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [value, inView]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

const chartBars = [35, 52, 45, 68, 42, 78, 55, 90, 72, 85, 65, 95];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function DashboardPreviewSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-widest">Live Dashboard</span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mt-3 mb-4">
            Your Growth, <span className="text-gradient">Visualized.</span>
          </h2>
          <p className="text-muted-foreground text-sm">Real-time analytics dashboard every client gets access to.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto rounded-2xl glass border border-border/30 p-6 md:p-8 relative overflow-hidden"
        >
          {/* Decorative top bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-amber-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            <span className="ml-3 text-[10px] font-mono text-muted-foreground">dashboard.digitalpenta.com</span>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {kpis.map((k, i) => {
              const Icon = k.icon;
              return (
                <motion.div
                  key={k.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="rounded-xl bg-secondary/30 border border-border/20 p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg ${k.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${k.color}`} />
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">{k.label}</span>
                  </div>
                  <span className="text-xl font-mono font-bold text-foreground">
                    <AnimCounter value={k.value} prefix={k.prefix} suffix={k.suffix} inView={isInView} />
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Chart */}
          <div className="rounded-xl bg-secondary/20 border border-border/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-muted-foreground">Monthly Performance</span>
              <div className="flex gap-3">
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="w-2 h-2 rounded-full bg-primary" /> Leads</span>
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="w-2 h-2 rounded-full bg-accent" /> Revenue</span>
              </div>
            </div>
            <div className="flex items-end gap-2 h-32">
              {chartBars.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <motion.div
                    className="w-full rounded-t bg-gradient-to-t from-primary/60 to-primary/30"
                    initial={{ height: 0 }}
                    animate={isInView ? { height: `${h}%` } : {}}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <span className="text-[8px] text-muted-foreground font-mono">{months[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
