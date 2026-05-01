import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/**
 * BookingCalendar
 * ----------------
 * In-app strategy-call scheduler. Two-step flow:
 *   1. Pick a date (next 14 working days) + time slot (9 fixed IST slots)
 *   2. Enter contact details + topic → inserts into `strategy_call_bookings`
 *      and triggers an internal "new_lead"-style email via send-notification.
 *
 * Renders as a Dialog. Pass `trigger` to control the launching button.
 */

type Props = {
  trigger: React.ReactNode;
  source?: string;
  defaultTopic?: string;
};

const SLOTS = [
  "09:30",
  "10:30",
  "11:30",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const WEEKDAY_LABEL = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABEL = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function isWeekend(d: Date) {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function nextWorkingDays(count: number) {
  const out: Date[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1); // start tomorrow
  while (out.length < count) {
    if (!isWeekend(cursor)) out.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

function fmtDate(d: Date) {
  return `${WEEKDAY_LABEL[d.getDay()]}, ${d.getDate()} ${MONTH_LABEL[d.getMonth()]}`;
}

function toIsoDate(d: Date) {
  // YYYY-MM-DD in local time (avoids UTC shifting the day)
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function BookingCalendar({ trigger, source = "website", defaultTopic = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"slot" | "contact" | "done">("slot");
  const days = useMemo(() => nextWorkingDays(10), []);
  const [pageStart, setPageStart] = useState(0);
  const visible = days.slice(pageStart, pageStart + 5);

  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [topic, setTopic] = useState(defaultTopic);
  const [submitting, setSubmitting] = useState(false);

  // Reset on close
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep("slot");
        setDate(null);
        setSlot(null);
        setSubmitting(false);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  const tz = typeof Intl !== "undefined"
    ? Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata"
    : "Asia/Kolkata";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !slot) return;
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({ title: "Add your name and a valid email", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("strategy_call_bookings").insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || null,
        company: company.trim() || null,
        preferred_date: toIsoDate(date),
        preferred_slot: slot,
        timezone: tz,
        topic: topic.trim() || null,
        source,
      });
      if (error) throw error;

      // Fire internal notification (non-blocking)
      supabase.functions.invoke("send-notification", {
        body: {
          type: "new_lead",
          data: {
            name,
            email,
            phone,
            company,
            service: "Strategy Call Booking",
            message: `Requested ${fmtDate(date)} at ${slot} (${tz}). Topic: ${topic || "—"}`,
            source: `booking:${source}`,
          },
        },
      }).catch(() => { /* noop */ });

      setStep("done");
      toast({ title: "Slot requested ✓", description: "Our team will confirm within 1 working hour." });
    } catch (err) {
      console.error("Booking failed", err);
      toast({
        title: "Couldn't save your slot",
        description: "Please try again or WhatsApp us at +91-88601-00039.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl bg-card/98 backdrop-blur-xl border-primary/15">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="w-5 h-5 text-primary" />
            Book your free strategy call
          </DialogTitle>
          <DialogDescription>
            30-minute, no-pitch session with a senior strategist. Confirmation within 1 working hour.
          </DialogDescription>
        </DialogHeader>

        {step === "slot" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                Pick a day
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPageStart(Math.max(0, pageStart - 5))}
                  disabled={pageStart === 0}
                  className="p-1.5 rounded-md hover:bg-white/5 disabled:opacity-30"
                  aria-label="Earlier days"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPageStart(Math.min(days.length - 5, pageStart + 5))}
                  disabled={pageStart >= days.length - 5}
                  className="p-1.5 rounded-md hover:bg-white/5 disabled:opacity-30"
                  aria-label="Later days"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {visible.map((d) => {
                const active = date && toIsoDate(date) === toIsoDate(d);
                return (
                  <button
                    key={toIsoDate(d)}
                    onClick={() => setDate(d)}
                    className={cn(
                      "rounded-xl border px-2 py-3 text-center transition-all",
                      active
                        ? "border-primary bg-primary/15 shadow-[0_0_0_1px_hsl(var(--primary))]"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-primary/40 hover:bg-primary/5"
                    )}
                  >
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      {WEEKDAY_LABEL[d.getDay()]}
                    </p>
                    <p className="text-lg font-bold text-foreground mt-0.5">{d.getDate()}</p>
                    <p className="text-[10px] font-mono text-muted-foreground/80">
                      {MONTH_LABEL[d.getMonth()]}
                    </p>
                  </button>
                );
              })}
            </div>

            <div>
              <p className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-3">
                Pick a time <span className="normal-case text-muted-foreground/60">(IST)</span>
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {SLOTS.map((s) => {
                  const active = slot === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSlot(s)}
                      disabled={!date}
                      className={cn(
                        "rounded-lg border py-2 text-sm font-mono transition-all",
                        active
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-white/[0.08] bg-white/[0.02] text-foreground/80 hover:border-primary/40 hover:text-foreground",
                        !date && "opacity-40 cursor-not-allowed"
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {!date && (
                <p className="mt-2 text-xs text-muted-foreground/70">Select a day first.</p>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/[0.05]">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                Your details stay private. No spam, ever.
              </p>
              <Button
                onClick={() => setStep("contact")}
                disabled={!date || !slot}
                className="gap-2"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {step === "contact" && date && slot && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary/10 border border-primary/20 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-medium">{fmtDate(date)}</span>
              <span className="text-muted-foreground">at</span>
              <span className="font-mono">{slot} IST</span>
              <button
                type="button"
                onClick={() => setStep("slot")}
                className="ml-auto text-xs text-primary hover:underline"
              >
                Change
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="b-name">Full name *</Label>
                <Input id="b-name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
              </div>
              <div>
                <Label htmlFor="b-email">Work email *</Label>
                <Input id="b-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div>
                <Label htmlFor="b-phone">Phone / WhatsApp</Label>
                <Input id="b-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
              </div>
              <div>
                <Label htmlFor="b-company">Company</Label>
                <Input id="b-company" value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" />
              </div>
            </div>

            <div>
              <Label htmlFor="b-topic">What would you like to discuss?</Label>
              <Textarea
                id="b-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="E.g. Scaling our SEO from 10K to 100K monthly visitors"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button type="button" variant="ghost" onClick={() => setStep("slot")}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button type="submit" disabled={submitting} className="flex-1 gap-2">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Booking…
                  </>
                ) : (
                  <>
                    Confirm booking
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {step === "done" && date && slot && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-4 text-center space-y-4"
          >
            <div className="mx-auto w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Slot requested 🎉</h3>
              <p className="text-sm text-muted-foreground mt-1">
                We've reserved <span className="text-foreground font-medium">{fmtDate(date)} at {slot} IST</span>.
                A senior strategist will confirm and send a calendar invite within 1 working hour.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Need it sooner? WhatsApp us at <span className="font-mono text-foreground">+91-88601-00039</span>.
            </p>
            <Button onClick={() => setOpen(false)} className="w-full">
              Done
            </Button>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}
