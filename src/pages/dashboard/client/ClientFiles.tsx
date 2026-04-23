import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { FolderOpen, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClientFiles() {
  const { user } = useAuth();

  const { data: files = [], isLoading } = useQuery({
    queryKey: ["client-files", user?.id],
    queryFn: async () => {
      if (!user) return [];
      // Get account ids the user belongs to
      const { data: memberships } = await supabase.from("account_team_members").select("account_id").eq("user_id", user.id);
      const accountIds = (memberships ?? []).map((m: any) => m.account_id);
      if (accountIds.length === 0) return [];
      const { data } = await supabase.from("campaign_files").select("*").in("account_id", accountIds).order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!user,
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Files & Reports" description="Reports, contracts and creatives shared by your account team." />

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : files.length === 0 ? (
        <EmptyState icon={FolderOpen} title="No files yet" description="Your account manager will share campaign reports and creatives here." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {files.map((f: any) => (
            <div key={f.id} className="card-surface rounded-xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-medium text-sm text-foreground truncate">{f.name}</p>
                <p className="text-[11px] text-muted-foreground capitalize">{f.category} · {new Date(f.created_at).toLocaleDateString()}</p>
              </div>
              <a href={f.file_url} target="_blank" rel="noopener noreferrer">
                <Button size="icon" variant="ghost"><Download className="w-3.5 h-3.5" /></Button>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
