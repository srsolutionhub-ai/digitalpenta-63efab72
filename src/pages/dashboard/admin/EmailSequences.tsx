import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Zap, Plus, Trash2, ChevronUp, ChevronDown, Play, Users, Eye, MousePointerClick,
  Loader2, Power, Mail, UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const db = supabase as any;

interface Sequence {
  id: string;
  name: string;
  trigger_event: "manual" | "lead_submitted" | "audit_completed" | "booking_created";
  is_active: boolean;
}

interface Step {
  id: string;
  sequence_id: string;
  step_order: number;
  delay_days: number;
  subject: string;
  body_html: string;
}

interface Enrollment {
  id: string;
  sequence_id: string;
  email: string;
  name: string | null;
  current_step: number;
  next_send_at: string | null;
  status: "active" | "completed" | "unsubscribed" | "failed";
  opens: number;
  clicks: number;
  enrolled_at: string;
}

const TRIGGERS: { value: Sequence["trigger_event"]; label: string }[] = [
  { value: "manual", label: "Manual only" },
  { value: "lead_submitted", label: "Lead submitted" },
  { value: "audit_completed", label: "Audit completed" },
  { value: "booking_created", label: "Booking created" },
];

const DEFAULT_STEP_HTML = `<p>Hi {{name}},</p>\n<p>Write your follow-up message here.</p>\n<p><a href="https://digitalpenta.com/book-a-call">Book a call →</a></p>`;

export default function EmailSequences() {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [enrollmentStats, setEnrollmentStats] = useState<Record<string, {
    enrolled: number; active: number; completed: number; opens: number; clicks: number;
  }>>({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [showEnrollments, setShowEnrollments] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTrigger, setNewTrigger] = useState<Sequence["trigger_event"]>("manual");
  const [creating, setCreating] = useState(false);
  const [enrollEmail, setEnrollEmail] = useState("");
  const [enrollName, setEnrollName] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [running, setRunning] = useState(false);
  const [savingStepId, setSavingStepId] = useState<string | null>(null);

  const loadSequences = async () => {
    setLoading(true);
    const { data: seqs, error } = await db.from("email_sequences").select("*").order("name");
    if (error) {
      toast({ title: "Failed to load sequences", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    setSequences(seqs ?? []);

    const { data: allEnrollments } = await db
      .from("email_sequence_enrollments")
      .select("sequence_id,status,opens,clicks");
    const stats: Record<string, { enrolled: number; active: number; completed: number; opens: number; clicks: number }> = {};
    for (const e of allEnrollments ?? []) {
      const s = stats[e.sequence_id] ?? { enrolled: 0, active: 0, completed: 0, opens: 0, clicks: 0 };
      s.enrolled++;
      if (e.status === "active") s.active++;
      if (e.status === "completed") s.completed++;
      s.opens += e.opens ?? 0;
      s.clicks += e.clicks ?? 0;
      stats[e.sequence_id] = s;
    }
    setEnrollmentStats(stats);
    setLoading(false);
  };

  const loadSteps = async (sequenceId: string) => {
    const { data } = await db
      .from("email_sequence_steps")
      .select("*")
      .eq("sequence_id", sequenceId)
      .order("step_order");
    setSteps(data ?? []);
  };

  const loadEnrollments = async (sequenceId: string) => {
    const { data } = await db
      .from("email_sequence_enrollments")
      .select("*")
      .eq("sequence_id", sequenceId)
      .order("enrolled_at", { ascending: false })
      .limit(200);
    setEnrollments(data ?? []);
  };

  useEffect(() => { loadSequences(); }, []);
  useEffect(() => {
    if (!selected) return;
    loadSteps(selected);
    loadEnrollments(selected);
    setShowEnrollments(false);
  }, [selected]);

  const createSequence = async () => {
    if (!newName.trim()) { toast({ title: "Name required", variant: "destructive" }); return; }
    setCreating(true);
    const { data, error } = await db
      .from("email_sequences")
      .insert({ name: newName.trim(), trigger_event: newTrigger, is_active: false })
      .select("*")
      .single();
    setCreating(false);
    if (error) {
      toast({ title: "Create failed", description: error.message, variant: "destructive" });
      return;
    }
    setNewName("");
    await loadSequences();
    setSelected(data.id);
    toast({ title: "Sequence created" });
  };

  const toggleActive = async (seq: Sequence) => {
    const { error } = await db.from("email_sequences").update({ is_active: !seq.is_active }).eq("id", seq.id);
    if (error) { toast({ title: "Update failed", description: error.message, variant: "destructive" }); return; }
    await loadSequences();
  };

  const deleteSequence = async (seq: Sequence) => {
    if (!confirm(`Delete sequence "${seq.name}"? This removes its steps too.`)) return;
    await db.from("email_sequence_steps").delete().eq("sequence_id", seq.id);
    const { error } = await db.from("email_sequences").delete().eq("id", seq.id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    if (selected === seq.id) setSelected(null);
    await loadSequences();
  };

  const addStep = async () => {
    if (!selected) return;
    const nextOrder = steps.length ? Math.max(...steps.map((s) => s.step_order)) + 1 : 1;
    const { error } = await db.from("email_sequence_steps").insert({
      sequence_id: selected,
      step_order: nextOrder,
      delay_days: nextOrder === 1 ? 0 : 3,
      subject: "Following up",
      body_html: DEFAULT_STEP_HTML,
    });
    if (error) { toast({ title: "Add step failed", description: error.message, variant: "destructive" }); return; }
    await loadSteps(selected);
  };

  const updateStepField = (id: string, field: keyof Step, value: string | number) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const saveStep = async (step: Step) => {
    setSavingStepId(step.id);
    const { error } = await db.from("email_sequence_steps").update({
      delay_days: step.delay_days,
      subject: step.subject,
      body_html: step.body_html,
    }).eq("id", step.id);
    setSavingStepId(null);
    if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Step saved" });
  };

  const deleteStep = async (step: Step) => {
    if (!selected) return;
    if (!confirm(`Delete step ${step.step_order}?`)) return;
    const { error } = await db.from("email_sequence_steps").delete().eq("id", step.id);
    if (error) { toast({ title: "Delete failed", description: error.message, variant: "destructive" }); return; }
    await loadSteps(selected);
  };

  const reorderStep = async (step: Step, direction: -1 | 1) => {
    if (!selected) return;
    const sorted = [...steps].sort((a, b) => a.step_order - b.step_order);
    const idx = sorted.findIndex((s) => s.id === step.id);
    const swapIdx = idx + direction;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const other = sorted[swapIdx];
    await db.from("email_sequence_steps").update({ step_order: other.step_order }).eq("id", step.id);
    await db.from("email_sequence_steps").update({ step_order: step.step_order }).eq("id", other.id);
    await loadSteps(selected);
  };

  const enrollManually = async () => {
    if (!selected) return;
    const email = enrollEmail.trim().toLowerCase();
    if (!email) { toast({ title: "Email required", variant: "destructive" }); return; }
    const sorted = [...steps].sort((a, b) => a.step_order - b.step_order);
    const firstStep = sorted[0];
    if (!firstStep) { toast({ title: "Add at least one step first", variant: "destructive" }); return; }
    setEnrolling(true);
    const { error } = await db.from("email_sequence_enrollments").insert({
      sequence_id: selected,
      email,
      name: enrollName.trim() || null,
      current_step: firstStep.step_order,
      next_send_at: new Date(Date.now() + (firstStep.delay_days ?? 0) * 86_400_000).toISOString(),
      status: "active",
    });
    setEnrolling(false);
    if (error) {
      toast({ title: "Enroll failed", description: error.message, variant: "destructive" });
      return;
    }
    setEnrollEmail(""); setEnrollName("");
    await loadEnrollments(selected);
    await loadSequences();
    toast({ title: `${email} enrolled` });
  };

  const runNow = async () => {
    setRunning(true);
    const { data, error } = await supabase.functions.invoke("sequence-runner", { body: {} });
    setRunning(false);
    if (error || data?.error) {
      toast({ title: "Run failed", description: data?.error ?? error?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Sequence runner completed", description: `${data?.sent ?? 0} sent · ${data?.failed ?? 0} failed · ${data?.completed ?? 0} completed` });
    await loadSequences();
    if (selected) await loadEnrollments(selected);
  };

  const selectedSeq = sequences.find((s) => s.id === selected) ?? null;
  const sortedSteps = [...steps].sort((a, b) => a.step_order - b.step_order);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-3">
            <Zap className="w-7 h-7 text-primary" /> Email Sequences
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Automated follow-up drips triggered by leads, audits, or bookings.
          </p>
        </div>
        <Button size="sm" onClick={runNow} disabled={running} data-testid="run-now">
          {running ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Play className="w-4 h-4 mr-1" />}
          Run now
        </Button>
      </div>

      <div className="glass-card p-4 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs uppercase text-muted-foreground font-mono">New sequence name</label>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Lead nurture — no reply"
            className="w-full mt-1 rounded-lg bg-card border border-white/10 p-2.5 text-sm text-foreground"
          />
        </div>
        <div>
          <label className="text-xs uppercase text-muted-foreground font-mono">Trigger</label>
          <select
            value={newTrigger}
            onChange={(e) => setNewTrigger(e.target.value as Sequence["trigger_event"])}
            className="mt-1 rounded-lg bg-card border border-white/10 p-2.5 text-sm text-foreground"
          >
            {TRIGGERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <Button size="sm" onClick={createSequence} disabled={creating}>
          {creating ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
          Create
        </Button>
      </div>

      <div className="grid lg:grid-cols-[340px_1fr] gap-6">
        {/* Sequence list */}
        <div className="glass-card p-4 space-y-2">
          {loading ? (
            <p className="text-sm text-muted-foreground p-4 text-center">Loading…</p>
          ) : sequences.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4 text-center">No sequences yet — create one above.</p>
          ) : sequences.map((seq) => {
            const stats = enrollmentStats[seq.id] ?? { enrolled: 0, active: 0, completed: 0, opens: 0, clicks: 0 };
            return (
              <button
                key={seq.id}
                onClick={() => setSelected(seq.id)}
                className={`w-full text-left rounded-lg border p-3 transition ${
                  selected === seq.id ? "border-primary bg-primary/10" : "border-white/10 bg-card/50 hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-display font-semibold text-foreground text-sm">{seq.name}</p>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                    seq.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-muted-foreground"
                  }`}>
                    {seq.is_active ? "active" : "paused"}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono mt-1">{seq.trigger_event}</p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground font-mono">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {stats.enrolled}</span>
                  <span>{stats.active} active</span>
                  <span>{stats.completed} done</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {stats.opens}</span>
                  <span className="flex items-center gap-1"><MousePointerClick className="w-3 h-3" /> {stats.clicks}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div className="space-y-6">
          {!selectedSeq ? (
            <div className="glass-card p-10 text-center text-muted-foreground text-sm">
              Select a sequence to edit its steps and enrollments.
            </div>
          ) : (
            <>
              <div className="glass-card p-4 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="font-display font-bold text-foreground">{selectedSeq.name}</h2>
                  <p className="text-xs text-muted-foreground font-mono">Trigger: {selectedSeq.trigger_event}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => toggleActive(selectedSeq)}>
                    <Power className="w-4 h-4 mr-1" /> {selectedSeq.is_active ? "Pause" : "Activate"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteSequence(selectedSeq)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>

              {/* Steps */}
              <div className="glass-card p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Steps
                  </h3>
                  <Button size="sm" variant="outline" onClick={addStep}>
                    <Plus className="w-4 h-4 mr-1" /> Add step
                  </Button>
                </div>
                {sortedSteps.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No steps yet.</p>
                ) : sortedSteps.map((step, idx) => (
                  <div key={step.id} className="rounded-lg border border-white/10 bg-card/50 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground">Step {step.step_order}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => reorderStep(step, -1)} disabled={idx === 0} className="p-1 disabled:opacity-30">
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button onClick={() => reorderStep(step, 1)} disabled={idx === sortedSteps.length - 1} className="p-1 disabled:opacity-30">
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteStep(step)} className="p-1 text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <label className="text-xs text-muted-foreground font-mono whitespace-nowrap">Delay (days)</label>
                      <input
                        type="number"
                        min={0}
                        value={step.delay_days}
                        onChange={(e) => updateStepField(step.id, "delay_days", Number(e.target.value))}
                        className="w-20 rounded-lg bg-card border border-white/10 p-1.5 text-sm text-foreground"
                      />
                    </div>
                    <input
                      value={step.subject}
                      onChange={(e) => updateStepField(step.id, "subject", e.target.value)}
                      placeholder="Subject"
                      className="w-full rounded-lg bg-card border border-white/10 p-2 text-sm text-foreground"
                    />
                    <textarea
                      value={step.body_html}
                      onChange={(e) => updateStepField(step.id, "body_html", e.target.value)}
                      rows={6}
                      placeholder="HTML body — use {{name}} to personalize"
                      className="w-full rounded-lg bg-card border border-white/10 p-2 text-xs font-mono text-foreground"
                    />
                    <div className="flex justify-end">
                      <Button size="sm" onClick={() => saveStep(step)} disabled={savingStepId === step.id}>
                        {savingStepId === step.id ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                        Save step
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Manual enroll */}
              <div className="glass-card p-4 space-y-3">
                <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                  <UserPlus className="w-4 h-4" /> Enroll manually
                </h3>
                <div className="flex flex-wrap gap-2">
                  <input
                    value={enrollEmail}
                    onChange={(e) => setEnrollEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="flex-1 min-w-[180px] rounded-lg bg-card border border-white/10 p-2 text-sm text-foreground"
                  />
                  <input
                    value={enrollName}
                    onChange={(e) => setEnrollName(e.target.value)}
                    placeholder="Name (optional)"
                    className="flex-1 min-w-[140px] rounded-lg bg-card border border-white/10 p-2 text-sm text-foreground"
                  />
                  <Button size="sm" onClick={enrollManually} disabled={enrolling}>
                    {enrolling ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                    Enroll
                  </Button>
                </div>
              </div>

              {/* Enrollments */}
              <div className="glass-card p-4">
                <button
                  onClick={() => setShowEnrollments((v) => !v)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" /> Enrollments ({enrollments.length})
                  </h3>
                  <span className="text-xs text-primary">{showEnrollments ? "Hide" : "Show"}</span>
                </button>
                {showEnrollments && (
                  <div className="mt-3 overflow-x-auto">
                    {enrollments.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No one enrolled yet.</p>
                    ) : (
                      <table className="w-full text-xs">
                        <thead className="text-muted-foreground uppercase font-mono">
                          <tr>
                            <th className="text-left p-2">Email</th>
                            <th className="text-left p-2">Step</th>
                            <th className="text-left p-2">Status</th>
                            <th className="text-left p-2">Next send</th>
                            <th className="text-left p-2">Opens</th>
                            <th className="text-left p-2">Clicks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enrollments.map((e) => (
                            <tr key={e.id} className="border-t border-white/5">
                              <td className="p-2 text-foreground">{e.email}</td>
                              <td className="p-2 font-mono">{e.current_step}</td>
                              <td className="p-2">
                                <span className={`font-mono uppercase px-2 py-0.5 rounded-full ${
                                  e.status === "active" ? "bg-emerald-500/10 text-emerald-400"
                                  : e.status === "completed" ? "bg-primary/10 text-primary"
                                  : e.status === "failed" ? "bg-red-500/10 text-red-400"
                                  : "bg-white/5 text-muted-foreground"
                                }`}>{e.status}</span>
                              </td>
                              <td className="p-2 font-mono text-muted-foreground">
                                {e.next_send_at ? new Date(e.next_send_at).toLocaleString() : "—"}
                              </td>
                              <td className="p-2 font-mono">{e.opens}</td>
                              <td className="p-2 font-mono">{e.clicks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
