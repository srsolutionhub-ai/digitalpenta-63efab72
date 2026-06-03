/**
 * Lazy-loaded Recharts radar visualization for Live Growth Score.
 * Isolated in its own chunk so Recharts is only pulled in after the user runs an audit.
 */
import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
} from "recharts";

type Score = { performance: number; seo: number; accessibility: number; best_practices: number };

export default function LiveGrowthScoreRadar({ mobile, desktop }: { mobile: Score; desktop: Score }) {
  const data = [
    { axis: "Performance", Mobile: mobile.performance, Desktop: desktop.performance },
    { axis: "SEO", Mobile: mobile.seo, Desktop: desktop.seo },
    { axis: "Accessibility", Mobile: mobile.accessibility, Desktop: desktop.accessibility },
    { axis: "Best Practices", Mobile: mobile.best_practices, Desktop: desktop.best_practices },
  ];

  return (
    <div className="h-[260px] -mx-2">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="hsl(0 0% 100% / 0.08)" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "hsl(220 15% 70%)", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "hsl(220 15% 45%)", fontSize: 10 }}
            stroke="hsl(0 0% 100% / 0.08)"
          />
          <Radar
            name="Mobile"
            dataKey="Mobile"
            stroke="hsl(256 90% 70%)"
            fill="hsl(256 90% 62%)"
            fillOpacity={0.35}
          />
          <Radar
            name="Desktop"
            dataKey="Desktop"
            stroke="hsl(192 95% 65%)"
            fill="hsl(192 95% 56%)"
            fillOpacity={0.2}
          />
          <Legend wrapperStyle={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace" }} />
          <Tooltip
            contentStyle={{
              background: "hsl(240 12% 8%)",
              border: "1px solid hsl(0 0% 100% / 0.08)",
              borderRadius: 12,
              fontSize: 12,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
