import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Users, Eye, Layers, Globe2 } from "lucide-react";

const db = supabase as any;
const CHANNEL_LABEL: Record<string, string> = { organic_search: "Google / search (free)", paid_search: "Search ads", paid_social: "Social ads", organic_social: "Social (free)", ai_assistant: "AI assistants (ChatGPT, Perplexity…)", email: "Email", whatsapp: "WhatsApp", campaign: "Other campaign", referral: "Other websites", direct: "Direct / typed", unknown: "Not yet classified" };
const RANGES = [7, 30, 90] as const;

function fmt(n: number) { return n.toLocaleString(); }
function topN(counts: Record<string, number>, n = 8) {
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, n);
}

export default function AudienceAnalytics() {
  const [days, setDays] = useState<typeof RANGES[number]>(30);

  const { data, isLoading } = useQuery({
    queryKey: ["audience-analytics", days],
    queryFn: async () => {
      const since = new Date(Date.now() - days * 86_400_000).toISOString();

      const [{ data: interactions }, { data: profiles }, { data: leads }] = await Promise.all([
        db.from("visitor_interactions").select("visitor_id, action, page_url, session_id, data, timestamp").gte("timestamp", since).limit(10000),
        db.from("visitor_profiles").select("visitor_id, device_type, location, country, city, browser, os, source_channel, search_engine, search_term, utm_term, landing_page, referral_source, utm_source, utm_medium, utm_campaign, last_visit, lead_id").gte("last_visit", since).limit(5000),
        db.from("leads").select("first_touch").gte("created_at", since).limit(5000),
      ]);

      const rows = interactions ?? [];
      const uniqueVisitors = new Set(rows.map((r: any) => r.visitor_id)).size;
      const uniqueSessions = new Set(rows.map((r: any) => r.session_id).filter(Boolean)).size;
      const pageViews = rows.filter((r: any) => r.action === "page_view" || !!r.page_url).length;

      const pageCounts: Record<string, number> = {};
      rows.forEach((r: any) => {
        if (!r.page_url) return;
        const path = r.page_url.replace(/^https?:\/\/[^/]+/, "") || "/";
        pageCounts[path] = (pageCounts[path] || 0) + 1;
      });

      const sourceCounts: Record<string, number> = {};
      const utmCampaignCounts: Record<string, number> = {};
      const deviceCounts: Record<string, number> = {};
      const cityCounts: Record<string, number> = {};
      const countryCounts: Record<string, number> = {};
      const channelCounts: Record<string, number> = {};
      const channelLeads: Record<string, number> = {};
      const keywordCounts: Record<string, number> = {};
      const engineCounts: Record<string, number> = {};
      const browserCounts: Record<string, number> = {};
      const landingCounts: Record<string, number> = {};
      (profiles ?? []).forEach((p: any) => {
        const src = p.utm_source || p.referral_source || "direct";
        sourceCounts[src] = (sourceCounts[src] || 0) + 1;
        if (p.utm_campaign) utmCampaignCounts[p.utm_campaign] = (utmCampaignCounts[p.utm_campaign] || 0) + 1;
        deviceCounts[p.device_type || "unknown"] = (deviceCounts[p.device_type || "unknown"] || 0) + 1;
        const city = p.city, country = p.country;
        if (city) cityCounts[city] = (cityCounts[city] || 0) + 1;
        if (country) countryCounts[country] = (countryCounts[country] || 0) + 1;
        const ch = p.source_channel || "unknown";
        channelCounts[ch] = (channelCounts[ch] || 0) + 1;
        if (p.lead_id) channelLeads[ch] = (channelLeads[ch] || 0) + 1;
        const kw = p.search_term || p.utm_term;
        if (kw) keywordCounts[kw] = (keywordCounts[kw] || 0) + 1;
        if (p.search_engine) engineCounts[p.search_engine] = (engineCounts[p.search_engine] || 0) + 1;
        const b = [p.browser, p.os].filter(Boolean).join(" · ");
        if (b) browserCounts[b] = (browserCounts[b] || 0) + 1;
        if (p.landing_page) landingCounts[p.landing_page] = (landingCounts[p.landing_page] || 0) + 1;
      });

      const leadPageCounts: Record<string, number> = {};
      (leads ?? []).forEach((l: any) => {
        const landing = l.first_touch?.landing_page ?? l.first_touch?.landing ?? l.first_touch?.page;
        if (landing) leadPageCounts[landing] = (leadPageCounts[landing] || 0) + 1;
      });

      return {
        uniqueVisitors, uniqueSessions, pageViews,
        topPages: topN(pageCounts),
        topSources: topN(sourceCounts),
        topCampaigns: topN(utmCampaignCounts),
        deviceSplit: topN(deviceCounts, 6),
        topCities: topN(cityCounts),
        topCountries: topN(countryCounts),
        leadPages: topN(leadPageCounts),
        channels: topN(channelCounts, 10).map(([k, v]) => [`${CHANNEL_LABEL[k] ?? k} · ${channelLeads[k] ?? 0} leads`, v] as [string, number]),
        keywords: topN(keywordCounts, 12),
        engines: topN(engineCounts, 6),
        browsers: topN(browserCounts, 8),
        landings: topN(landingCounts),
      };
    },
  });

  const kpis = useMemo(() => ([
    { label: "Unique visitors", value: data?.uniqueVisitors ?? 0, icon: Users },
    { label: "Sessions", value: data?.uniqueSessions ?? 0, icon: Layers },
    { label: "Page views", value: data?.pageViews ?? 0, icon: Eye },
    { label: "Countries seen", value: data?.topCountries?.length ?? 0, icon: Globe2 },
  ]), [data]);

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-32" /><Skeleton className="h-64" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-xl text-foreground">Audience Analytics</h1>
          <p className="text-xs text-muted-foreground mt-1">Live first-party visitor data (only visitors who accepted analytics cookies) · location is approximate</p>
        </div>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <Button key={r} size="sm" variant={days === r ? "default" : "outline"} onClick={() => setDays(r)}>{r}d</Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="card-surface rounded-2xl p-4">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5"><k.icon className="w-3.5 h-3.5" />{k.label}</p>
            <p className="font-display font-bold text-2xl text-foreground mt-1">{fmt(k.value)}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="How visitors found you (channel)">
          <List rows={data?.channels} empty="No channel data yet — new visits are classified automatically." />
        </Panel>
        <Panel title="Search keywords">
          <List rows={data?.keywords} empty="No keywords yet. Google hides most search words; ad keywords (utm_term) and Bing/DuckDuckGo searches appear here. See Search Console for Google organic keywords." />
        </Panel>
        <Panel title="Landing pages (first page seen)">
          <List rows={data?.landings} empty="No landing data yet." />
        </Panel>
        <Panel title="Search engines · Browsers">
          <div className="grid grid-cols-2 gap-4">
            <List rows={data?.engines} empty="None yet." compact />
            <List rows={data?.browsers} empty="None yet." compact />
          </div>
        </Panel>
        <Panel title="Top pages">
          <List rows={data?.topPages} empty="No page views recorded yet." />
        </Panel>
        <Panel title="Pages that produced leads">
          <List rows={data?.leadPages} empty="No leads with a recorded landing page yet." />
        </Panel>
        <Panel title="Top sources / UTM source">
          <List rows={data?.topSources} empty="No source data yet." />
        </Panel>
        <Panel title="Top UTM campaigns">
          <List rows={data?.topCampaigns} empty="No campaign data yet." />
        </Panel>
        <Panel title="Device split">
          <List rows={data?.deviceSplit} empty="No device data yet." />
        </Panel>
        <Panel title="Top cities / countries">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] uppercase text-muted-foreground mb-1">Cities</p>
              <List rows={data?.topCities} empty="No city data yet." compact />
            </div>
            <div>
              <p className="text-[11px] uppercase text-muted-foreground mb-1">Countries</p>
              <List rows={data?.topCountries} empty="No country data yet." compact />
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-surface rounded-2xl p-6">
      <p className="font-display font-semibold text-foreground mb-4 text-sm">{title}</p>
      {children}
    </div>
  );
}

function List({ rows, empty, compact }: { rows?: [string, number][]; empty: string; compact?: boolean }) {
  if (!rows?.length) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <ul className={compact ? "space-y-1" : "space-y-2"}>
      {rows.map(([label, count]) => (
        <li key={label} className="flex items-center justify-between gap-3 text-sm">
          <span className="text-foreground truncate">{label}</span>
          <span className="font-mono text-muted-foreground flex-shrink-0">{fmt(count)}</span>
        </li>
      ))}
    </ul>
  );
}
