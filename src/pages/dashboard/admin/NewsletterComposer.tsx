import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Send, Mail, Eye, TestTube, Save, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  subject: string;
  body_html: string;
  status: string;
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  sent_at: string | null;
  created_at: string;
  audience_type?: string | null;
  audience_snapshot?: Record<string, unknown> | null;
}

const DEFAULT_HTML = `<h1>Big news from Digital Penta</h1>
<p>Hey {{name}},</p>
<p>Write your update here. Keep it punchy — one core message, one CTA, and a signature.</p>
<p><a href="https://digitalpenta.com/book-a-call" style="display:inline-block;padding:12px 24px;background:#8b5cf6;color:#fff;border-radius:999px;text-decoration:none;font-weight:600;">Book a strategy call →</a></p>
<p>— The Digital Penta team</p>`;

export default function NewsletterComposer() {
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState(DEFAULT_HTML);
  const [audience, setAudience] = useState<"all" | "confirmed">("confirmed");
  const [testEmail, setTestEmail] = useState("");
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [sending, setSending] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [past, setPast] = useState<Campaign[]>([]);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [openRecipients, setOpenRecipients] = useState<string | null>(null);
  const [recipients, setRecipients] = useState<
    { email: string; status: string; error: string | null; sent_at: string | null }[]
  >([]);

  useEffect(() => {
    const load = async () => {
      let countQuery = supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact", head: true });
      if (audience === "confirmed") {
        countQuery = countQuery.eq("status", "confirmed");
      }
      const [{ count }, { data }] = await Promise.all([
        countQuery,
        supabase.from("newsletter_campaigns").select("*").order("created_at", { ascending: false }).limit(10),
      ]);
      setSubscriberCount(count ?? 0);
      setPast((data as Campaign[]) ?? []);
    };
    load();
  }, [audience]);

  const audienceSnapshot = () => ({
    type: audience,
    label: audience === "confirmed" ? "Confirmed subscribers" : "All active subscribers",
    filters: { unsubscribed_at: null, ...(audience === "confirmed" ? { status: "confirmed" } : {}) },
    estimated_count: subscriberCount ?? 0,
    captured_at: new Date().toISOString(),
  });

  const reload = async () => {
    const { data } = await supabase
      .from("newsletter_campaigns")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    setPast((data as Campaign[]) ?? []);
  };

  /** Persists (or updates) the draft and returns its id so test sends + broadcasts can attach to it. */
  const upsertDraft = async (): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    const payload = {
      subject,
      body_html: bodyHtml,
      audience_filter: { type: audience },
      audience_type: audience,
      audience_snapshot: audienceSnapshot() as never,
      status: "draft",
      recipient_count: subscriberCount ?? 0,
      created_by: user?.id,
    };
    if (draftId) {
      const { error } = await supabase.from("newsletter_campaigns").update(payload).eq("id", draftId);
      if (error) throw error;
      return draftId;
    }
    const { data, error } = await supabase
      .from("newsletter_campaigns")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw error;
    setDraftId(data.id);
    return data.id;
  };

  const loadRecipients = async (campaignId: string) => {
    if (openRecipients === campaignId) { setOpenRecipients(null); return; }
    setOpenRecipients(campaignId);
    const { data } = await supabase
      .from("newsletter_campaign_recipients")
      .select("email,status,error,sent_at")
      .eq("campaign_id", campaignId)
      .order("email");
    setRecipients(data ?? []);
  };

  const saveDraft = async () => {
    if (!subject) { toast({ title: "Subject required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      await upsertDraft();
      await reload();
      toast({ title: "Draft saved", description: "Audience selection stored for auditing." });
    } catch (e) {
      toast({ title: "Save failed", description: e instanceof Error ? e.message : "unknown", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const sendTest = async () => {
    if (!testEmail || !subject) { toast({ title: "Test email + subject required", variant: "destructive" }); return; }
    setTesting(true);
    const { error } = await supabase.functions.invoke("send-email", {
      body: {
        template: "newsletter-broadcast",
        to: testEmail,
        data: { subject, bodyHtml, name: "Test" },
      },
    });
    if (error) {
      setTesting(false);
      toast({ title: "Test send failed", description: error.message, variant: "destructive" });
      return;
    }
    // Persist the test send against the campaign record for the audit trail.
    try {
      const id = await upsertDraft();
      if (id) {
        const { data: row } = await supabase
          .from("newsletter_campaigns").select("test_sends").eq("id", id).single();
        const prev = Array.isArray(row?.test_sends) ? (row!.test_sends as unknown[]) : [];
        await supabase.from("newsletter_campaigns").update({
          test_sends: [...prev, { to: testEmail, at: new Date().toISOString() }] as never,
        }).eq("id", id);
      }
      await reload();
    } catch { /* non-blocking */ }
    setTesting(false);
    toast({ title: `Test sent to ${testEmail}` });
  };

  const broadcast = async () => {
    if (!subject) { toast({ title: "Subject required", variant: "destructive" }); return; }
    if (!confirm(`Send this newsletter to ${subscriberCount} subscribers? This cannot be undone.`)) return;
    setSending(true);
    const { data, error } = await supabase.functions.invoke("newsletter-broadcast", {
      body: {
        subject,
        bodyHtml,
        audience,
        campaignId: draftId,
        audienceSnapshot: audienceSnapshot(),
        metadata: { composer: "admin-newsletter-composer", tested: !!testEmail },
      },
    });
    setSending(false);
    if (error || data?.error) {
      toast({ title: "Broadcast failed", description: data?.error ?? error?.message, variant: "destructive" });
      return;
    }
    setDraftId(null);
    await reload();
    toast({ title: "Broadcast queued", description: `${data?.sent ?? 0} sent · ${data?.failed ?? 0} failed` });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
          <Mail className="w-7 h-7 text-primary" /> Newsletter Composer
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Write, preview, and broadcast to your subscriber list.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Compose */}
        <div className="glass-card p-6 space-y-4">
          <div>
            <label className="text-xs uppercase text-muted-foreground font-mono">Subject</label>
            <input
              value={subject}
              data-testid="newsletter-subject"
              onChange={(e) => setSubject(e.target.value)}
              placeholder="What's the one-line summary?"
              className="w-full mt-1 rounded-lg bg-card border border-white/10 p-3 text-foreground"
            />
          </div>
          <div>
            <label className="text-xs uppercase text-muted-foreground font-mono flex items-center justify-between">
              <span>Body (HTML)</span>
              <span className="text-[10px]">{`{{name}}`} is replaced per subscriber</span>
            </label>
            <textarea
              value={bodyHtml}
              data-testid="newsletter-body"
              onChange={(e) => setBodyHtml(e.target.value)}
              rows={16}
              className="w-full mt-1 rounded-lg bg-card border border-white/10 p-3 text-foreground font-mono text-xs"
            />
          </div>
          <div>
            <label className="text-xs uppercase text-muted-foreground font-mono">Audience</label>
            <div className="mt-2 flex gap-2">
              <button
                data-testid="audience-confirmed"
                onClick={() => setAudience("confirmed")}
                className={`px-3 py-1.5 rounded-full text-xs ${audience === "confirmed" ? "bg-primary text-primary-foreground" : "bg-card border border-white/10"}`}
              >
                Confirmed only
              </button>
              <button
                data-testid="audience-all"
                onClick={() => setAudience("all")}
                className={`px-3 py-1.5 rounded-full text-xs ${audience === "all" ? "bg-primary text-primary-foreground" : "bg-card border border-white/10"}`}
              >
                All subscribers
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> {subscriberCount ?? "…"} recipients
            </p>
          </div>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            <Button variant="outline" size="sm" data-testid="save-draft" onClick={saveDraft} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
              Save Draft
            </Button>
            <input
              placeholder="you@example.com"
              value={testEmail}
              data-testid="test-email"
              onChange={(e) => setTestEmail(e.target.value)}
              className="rounded-lg bg-card border border-white/10 px-3 py-1.5 text-sm flex-1 min-w-[180px]"
            />
            <Button variant="outline" size="sm" data-testid="send-test" onClick={sendTest} disabled={testing}>
              {testing ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <TestTube className="w-4 h-4 mr-1" />}
              Send Test
            </Button>
            <Button size="sm" data-testid="broadcast" onClick={broadcast} disabled={sending}>
              {sending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Send className="w-4 h-4 mr-1" />}
              Broadcast
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="glass-card p-4">
          <p className="text-xs uppercase text-muted-foreground font-mono mb-2 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> Live Preview
          </p>
          <iframe
            title="Preview"
            data-testid="newsletter-preview"
            className="w-full h-[600px] rounded-lg bg-white"
            srcDoc={`<html><head><meta charset="utf-8"><style>
              body{font-family:-apple-system,Inter,sans-serif;padding:24px;color:#0a0a1a;max-width:600px;margin:0 auto;line-height:1.6;}
              h1,h2{font-family:'Plus Jakarta Sans',Inter,sans-serif;}
              a{color:#8b5cf6;}
            </style></head><body><h2 style="color:#666;font-size:14px;margin-bottom:16px">Subject: ${subject.replace(/</g, "&lt;")}</h2>${bodyHtml.replace(/\{\{name\}\}/g, "Friend")}</body></html>`}
          />
        </div>
      </div>

      {/* Past campaigns */}
      <div className="glass-card p-6">
        <h2 className="font-display font-bold text-foreground mb-4">Past broadcasts</h2>
        {past.length === 0 ? (
          <p className="text-sm text-muted-foreground">No campaigns yet.</p>
        ) : (
          <div className="space-y-2">
            {past.map((c) => (
              <div key={c.id} className="rounded-lg border border-white/10 bg-card/50" data-testid="campaign-row">
                <div className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-display font-semibold text-foreground text-sm">{c.subject}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {c.status} · {c.sent_count}/{c.recipient_count} sent · audience: {c.audience_type ?? "all"} · {new Date(c.sent_at ?? c.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => loadRecipients(c.id)}
                      className="text-xs font-mono text-primary hover:underline"
                    >
                      {openRecipients === c.id ? "Hide" : "Audit"} recipients
                    </button>
                    <span className={`text-xs px-2 py-1 rounded-full font-mono uppercase ${
                      c.status === "sent" ? "bg-emerald-500/10 text-emerald-400"
                      : c.status === "draft" ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-white/5 text-muted-foreground"
                    }`}>{c.status}</span>
                  </div>
                </div>
                {openRecipients === c.id && (
                  <div className="border-t border-white/10 px-3 py-2 max-h-64 overflow-auto">
                    {recipients.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No recipient rows logged.</p>
                    ) : recipients.map((r) => (
                      <p key={r.email} className="text-xs font-mono text-muted-foreground py-0.5">
                        {r.status === "sent" ? "✓" : "✕"} {r.email}
                        {r.error ? ` — ${r.error}` : ""}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
