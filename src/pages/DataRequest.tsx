import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const REQUEST_TYPES = [
  { value: "access", label: "Access my data" },
  { value: "delete", label: "Delete my data" },
  { value: "rectify", label: "Correct my data" },
  { value: "portability", label: "Export my data" },
  { value: "object", label: "Object to processing" },
];

const dsrSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100, "Name too long"),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  request_type: z.enum(["access", "delete", "rectify", "portability", "object"]),
  details: z.string().trim().max(2000, "Details must be under 2000 characters").optional(),
});

export default function DataRequest() {
  const [form, setForm] = useState({ name: "", email: "", request_type: "access", details: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErrors({});
    const parsed = dsrSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { fieldErrors[i.path[0] as string] = i.message; });
      setErrors(fieldErrors);
      toast.error("Please fix the highlighted fields");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("contacts").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        message: `[DSR/${parsed.data.request_type}] ${parsed.data.details || "(no additional details)"}`,
        service: "Data Subject Request",
        source: "dsr_form",
        urgency: "high",
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (e: any) {
      toast.error("Failed to submit. Email support@digitalpenta.com");
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <SEOHead
        title="Data Request (GDPR / DPDP) | Digital Penta"
        description="Submit a data subject request: access, delete, correct, export, or object to data processing. GDPR & India DPDP compliant."
        canonical="https://digitalpenta.com/data-request"
      />
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <Shield className="w-10 h-10 text-primary mx-auto mb-3" />
          <h1 className="font-display font-bold text-3xl text-foreground">Data Subject Request</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
            Under GDPR (EU) and DPDP Act 2023 (India), you have the right to access, correct, delete, or export your personal data. We respond within 30 days.
          </p>
        </div>

        {submitted ? (
          <div className="card-surface rounded-2xl p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="font-display font-bold text-xl text-foreground">Request received</h2>
            <p className="text-sm text-muted-foreground mt-2">We'll verify your identity and respond to <strong>{form.email}</strong> within 30 days.</p>
          </div>
        ) : (
          <div className="card-surface rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Full name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>Email on file</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </div>
            <div>
              <Label>Request type</Label>
              <Select value={form.request_type} onValueChange={(v) => setForm({ ...form, request_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {REQUEST_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Additional details (optional)</Label>
              <Textarea rows={4} value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} placeholder="Tell us which data, accounts, or interactions this concerns." />
            </div>
            <Button onClick={submit} disabled={loading} className="w-full">{loading ? "Submitting..." : "Submit request"}</Button>
            <p className="text-[11px] text-muted-foreground text-center">
              For urgent matters email <a href="mailto:support@digitalpenta.com" className="text-primary underline">support@digitalpenta.com</a>.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
