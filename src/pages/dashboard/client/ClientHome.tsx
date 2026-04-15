import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, Search, MousePointerClick, Link2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

function HealthGauge({ score }: { score: number }) {
  const color = score >= 70 ? "hsl(162,100%,44%)" : score >= 40 ? "hsl(45,100%,50%)" : "hsl(0,72%,51%)";
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-3xl text-foreground">{score}</span>
        <span className="text-[10px] text-muted-foreground">Health Score</span>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, change }: { icon: any; label: string; value: string; change?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-display font-bold text-foreground">{value}</p>
      </div>
      {change && <span className="text-xs text-green-400 ml-auto">{change}</span>}
    </div>
  );
}

export default function ClientHome() {
  const { user } = useAuth();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["client-campaign", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("client_campaigns")
        .select("*")
        .eq("client_id", user.id)
        .order("report_month", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const seo = (campaign?.seo_data as any) ?? {};
  const ppc = (campaign?.ppc_data as any) ?? {};
  const social = (campaign?.social_data as any) ?? {};

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 rounded-2xl" />
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="card-surface rounded-2xl p-12 text-center">
        <h2 className="font-display font-bold text-xl text-foreground mb-2">Welcome to Your Dashboard</h2>
        <p className="text-muted-foreground text-sm">Your campaign data will appear here once your account manager sets it up.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Health Score */}
      <div className="card-surface rounded-2xl p-8 text-center">
        <HealthGauge score={campaign.health_score ?? 0} />
        <p className="text-xs text-muted-foreground mt-3">Updated {campaign.updated_at ? new Date(campaign.updated_at).toLocaleDateString() : "recently"}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* SEO Card */}
        <div className="card-surface rounded-2xl p-6 space-y-4">
          <h3 className="font-display font-semibold text-foreground">SEO Metrics</h3>
          <div className="space-y-3">
            <MetricCard icon={TrendingUp} label="Organic Traffic" value={seo.traffic?.toLocaleString() ?? "—"} change={seo.trafficChange ? `${seo.trafficChange}%` : undefined} />
            <MetricCard icon={Search} label="Keywords in Top 10" value={seo.topKeywords?.toString() ?? "—"} />
            <MetricCard icon={Link2} label="New Backlinks" value={seo.newBacklinks?.toString() ?? "—"} />
          </div>
          {seo.trend && (
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={seo.trend}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(220,15%,55%)" }} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "hsl(240,12%,8%)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 11 }} />
                <Line type="monotone" dataKey="value" stroke="hsl(162,100%,44%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* PPC Card */}
        {(ppc.spend || ppc.clicks) && (
          <div className="card-surface rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-semibold text-foreground">PPC Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Ad Spend", value: ppc.spend ? `₹${Number(ppc.spend).toLocaleString()}` : "—" },
                { label: "Clicks", value: ppc.clicks?.toLocaleString() ?? "—" },
                { label: "CTR", value: ppc.ctr ? `${ppc.ctr}%` : "—" },
                { label: "ROAS", value: ppc.roas ? `${ppc.roas}x` : "—" },
              ].map((m) => (
                <div key={m.label} className="p-3 rounded-lg bg-muted/20">
                  <p className="text-[10px] text-muted-foreground uppercase font-mono">{m.label}</p>
                  <p className="font-display font-bold text-foreground">{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Card */}
        <div className="card-surface rounded-2xl p-6 space-y-4">
          <h3 className="font-display font-semibold text-foreground">Social Media</h3>
          <div className="space-y-3">
            <MetricCard icon={TrendingUp} label="Follower Growth" value={social.followerGrowth?.toString() ?? "—"} />
            <MetricCard icon={MousePointerClick} label="Engagement Rate" value={social.engagementRate ? `${social.engagementRate}%` : "—"} />
          </div>
        </div>
      </div>

      {/* Reports */}
      {campaign.report_pdf_url && (
        <div className="card-surface rounded-2xl p-6">
          <h3 className="font-display font-semibold text-foreground mb-4">Monthly Reports</h3>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/10">
            <span className="text-sm text-foreground">{campaign.report_month ? new Date(campaign.report_month).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Latest Report"}</span>
            <a href={campaign.report_pdf_url} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline"><Download className="w-3 h-3 mr-1" /> Download PDF</Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
