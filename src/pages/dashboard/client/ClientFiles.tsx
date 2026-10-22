import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useClientCompanies } from "@/hooks/useClientCompanies";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { FolderOpen, Download, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MAX_MB = 20;

export default function ClientFiles() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: companies = [] } = useClientCompanies();
  const accountIds = companies.map((c: any) => c.id);
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: files = [], isLoading } = useQuery({
    queryKey: ["client-files", user?.id, accountIds.join(",")],
    enabled: !!user && accountIds.length > 0,
    queryFn: async () => {
      const { data } = await supabase
        .from("campaign_files")
        .select("*")
        .in("account_id", accountIds)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  /** Download works for both external links and private bucket paths. */
  const download = async (f: any) => {
    const url = f.file_url || "";
    if (/^https?:\/\//i.test(url)) {
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    const { data, error } = await supabase.storage.from("client-files").createSignedUrl(url, 120);
    if (error || !data?.signedUrl) {
      toast.error("Couldn't open that file. Please try again.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  const upload = async (file: File) => {
    if (!user || !accountIds.length) return;
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`File is too large — max ${MAX_MB} MB`);
      return;
    }
    setUploading(true);
    try {
      const safeName = file.name.replace(/[^\w.\-() ]/g, "_");
      const path = `${accountIds[0]}/${Date.now()}-${safeName}`;
      const { error: upErr } = await supabase.storage
        .from("client-files")
        .upload(path, file, { contentType: file.type || undefined });
      if (upErr) throw upErr;
      const { error: rowErr } = await supabase.from("campaign_files").insert({
        account_id: accountIds[0],
        uploaded_by: user.id,
        name: file.name,
        category: "client-upload",
        file_url: path,
        size_bytes: file.size,
        mime_type: file.type || null,
      } as any);
      if (rowErr) throw rowErr;
      toast.success("File shared with your account team");
      qc.invalidateQueries({ queryKey: ["client-files"] });
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Files & Reports"
        description="Reports, contracts and creatives shared with your account team — in both directions."
      />

      <div className="card-surface rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Send briefs, brand assets or signed documents to your account team (max {MAX_MB} MB).
        </p>
        <input
          ref={fileInput}
          type="file"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
          }}
        />
        <Button size="sm" onClick={() => fileInput.current?.click()} disabled={uploading || !accountIds.length}>
          <Upload className="w-3.5 h-3.5 mr-1.5" /> {uploading ? "Uploading…" : "Upload a file"}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : files.length === 0 ? (
        <EmptyState icon={FolderOpen} title="No files yet" description="Upload a brief or wait for your account manager to share reports and creatives here." />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {files.map((f: any) => (
            <div key={f.id} className="card-surface rounded-xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-medium text-sm text-foreground truncate">{f.name}</p>
                <p className="text-[11px] text-muted-foreground capitalize">
                  {f.category === "client-upload" ? "Uploaded by you" : f.category} · {new Date(f.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button size="icon" variant="ghost" aria-label={`Download ${f.name}`} onClick={() => download(f)}>
                <Download className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
