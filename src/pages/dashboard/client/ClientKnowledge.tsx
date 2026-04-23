import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { BookOpen, Search, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ClientKnowledge() {
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: articles = [] } = useQuery({
    queryKey: ["kb-articles", search],
    queryFn: async () => {
      let q = supabase.from("kb_articles").select("*").eq("is_published", true).order("category");
      if (search) q = q.or(`title.ilike.%${search}%,body.ilike.%${search}%`);
      const { data } = await q;
      return data ?? [];
    },
  });

  const active = articles.find((a: any) => a.id === activeId);

  if (active) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Button variant="ghost" size="sm" onClick={() => setActiveId(null)}><ChevronLeft className="w-3.5 h-3.5 mr-1" /> Back</Button>
        <article className="prose prose-invert max-w-none">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{active.category}</p>
          <h1 className="font-display font-bold text-3xl text-foreground">{active.title}</h1>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed mt-6">{active.body}</div>
        </article>
      </div>
    );
  }

  const grouped = articles.reduce((acc: Record<string, any[]>, a: any) => {
    (acc[a.category] = acc[a.category] || []).push(a);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader title="Knowledge Base" description="Guides, FAQs and explainers from the Digital Penta team." />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search articles…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {articles.length === 0 ? (
        <EmptyState icon={BookOpen} title="No articles yet" description="Knowledge base will populate as your team publishes guides." />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">{cat}</p>
              <div className="grid md:grid-cols-2 gap-3">
                {(items as any[]).map((a: any) => (
                  <button
                    key={a.id}
                    onClick={() => setActiveId(a.id)}
                    className="card-surface rounded-xl p-4 text-left hover:border-primary/40 border border-transparent transition-colors"
                  >
                    <p className="font-display font-medium text-sm text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.body.slice(0, 120)}…</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
