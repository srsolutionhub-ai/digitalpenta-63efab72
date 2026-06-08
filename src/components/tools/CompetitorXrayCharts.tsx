import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
} from "recharts";

interface Gap { category: string; priority: string; }

const PRIO_WEIGHT: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
const PRIO_COLOR: Record<string, string> = {
  High: "hsl(348, 83%, 60%)",
  Medium: "hsl(38, 92%, 55%)",
  Low: "hsl(220, 12%, 55%)",
};

export default function CompetitorXrayCharts({ gaps }: { gaps: Gap[] }) {
  if (!gaps?.length) return null;

  const byCategory = Object.values(
    gaps.reduce<Record<string, { category: string; score: number; priority: string }>>((acc, g) => {
      const key = g.category;
      if (!acc[key]) acc[key] = { category: key, score: 0, priority: g.priority };
      acc[key].score += PRIO_WEIGHT[g.priority] ?? 1;
      // Track highest priority
      if ((PRIO_WEIGHT[g.priority] ?? 0) > (PRIO_WEIGHT[acc[key].priority] ?? 0)) {
        acc[key].priority = g.priority;
      }
      return acc;
    }, {})
  ).sort((a, b) => b.score - a.score).slice(0, 8);

  return (
    <div className="card-surface rounded-xl p-4">
      <p className="type-label text-primary mb-3 font-mono text-xs">Gap intensity by category</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={byCategory} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(220,15%,55%)" }} />
          <YAxis dataKey="category" type="category" width={110} tick={{ fontSize: 11, fill: "hsl(220,15%,75%)" }} />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            contentStyle={{ background: "hsl(240,12%,8%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 12 }}
          />
          <Bar dataKey="score" radius={[0, 6, 6, 0]}>
            {byCategory.map((d, i) => (
              <Cell key={i} fill={PRIO_COLOR[d.priority] ?? PRIO_COLOR.Low} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
