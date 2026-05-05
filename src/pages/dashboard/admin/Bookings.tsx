import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Search, Download, CalendarDays, Clock, Mail, Phone, Building2 } from "lucide-react";

const STATUSES = ["pending", "confirmed", "completed", "no_show", "cancelled"];
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  confirmed: "bg-green-500/20 text-green-400",
  completed: "bg-blue-500/20 text-blue-400",
  no_show: "bg-red-500/20 text-red-400",
  cancelled: "bg-muted text-muted-foreground",
};

export default function Bookings() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<any | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-bookings", search, statusFilter],
    queryFn: async () => {
      let q = supabase
        .from("strategy_call_bookings")
        .select("*")
        .order("preferred_date", { ascending: true })
        .order("preferred_slot", { ascending: true })
        .limit(200);
      if (statusFilter !== "all") q = q.eq("status", statusFilter);
      if (search) q = q.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateBooking = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase.from("strategy_call_bookings").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast.success("Booking updated");
    },
    onError: (e: any) => toast.error(e.message ?? "Update failed"),
  });

  const exportCSV = () => {
    if (!data?.length) return;
    const headers = ["Date", "Slot", "TZ", "Name", "Email", "Phone", "Company", "Topic", "Source", "Status", "Created"];
    const rows = data.map((b: any) => [
      b.preferred_date, b.preferred_slot, b.timezone, b.name, b.email, b.phone,
      b.company, b.topic, b.source, b.status, b.created_at,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${(c ?? "").toString().replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = data?.filter((b: any) => b.preferred_date >= today) ?? [];
  const pendingCount = data?.filter((b: any) => b.status === "pending").length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-xl text-foreground">Strategy Call Bookings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {upcoming.length} upcoming · {pendingCount} pending confirmation
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={exportCSV}>
          <Download className="w-3 h-3 mr-1" /> Export
        </Button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 min-h-[40px]"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="card-surface rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20">
                <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">When</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Name</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Company</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Email</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Source</th>
                <th className="text-left p-3 text-xs text-muted-foreground font-mono uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="p-3"><Skeleton className="h-8" /></td></tr>
                ))
              ) : data?.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No bookings yet</td></tr>
              ) : (
                data?.map((b: any) => (
                  <tr
                    key={b.id}
                    onClick={() => setSelected(b)}
                    className="border-b border-border/10 hover:bg-muted/20 cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-3.5 h-3.5 text-primary" />
                        <span>{b.preferred_date}</span>
                        <span className="font-mono text-xs text-muted-foreground">{b.preferred_slot}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground/70 mt-0.5 ml-5">{b.timezone}</p>
                    </td>
                    <td className="p-3 text-foreground">{b.name}</td>
                    <td className="p-3 text-muted-foreground">{b.company || "—"}</td>
                    <td className="p-3 text-muted-foreground text-xs">{b.email}</td>
                    <td className="p-3 text-muted-foreground text-xs">{b.source || "—"}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full capitalize ${STATUS_COLORS[b.status] || STATUS_COLORS.pending}`}>
                        {(b.status || "pending").replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  {selected.name}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-3 text-xs pt-1">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{selected.preferred_date} · {selected.preferred_slot} {selected.timezone}</span>
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-1 gap-2 text-muted-foreground">
                  <a href={`mailto:${selected.email}`} className="flex items-center gap-2 hover:text-foreground"><Mail className="w-3.5 h-3.5" />{selected.email}</a>
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`} className="flex items-center gap-2 hover:text-foreground"><Phone className="w-3.5 h-3.5" />{selected.phone}</a>
                  )}
                  {selected.company && (
                    <span className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5" />{selected.company}</span>
                  )}
                </div>
                {selected.topic && (
                  <div>
                    <Label className="text-xs">Topic</Label>
                    <p className="text-sm text-foreground/90 mt-1 p-3 rounded-lg bg-muted/30">{selected.topic}</p>
                  </div>
                )}
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select
                    value={selected.status || "pending"}
                    onValueChange={(v) => {
                      updateBooking.mutate({ id: selected.id, updates: { status: v } });
                      setSelected({ ...selected, status: v });
                    }}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Internal notes</Label>
                  <Textarea
                    rows={3}
                    defaultValue={selected.notes ?? ""}
                    onBlur={(e) => {
                      const v = e.target.value;
                      if (v !== (selected.notes ?? "")) {
                        updateBooking.mutate({ id: selected.id, updates: { notes: v || null } });
                      }
                    }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground/70">
                  Source: {selected.source || "—"} · Booked {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
