import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Download, Loader2 } from "lucide-react";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
});

interface EmailGateProps {
  onSubmit: (data: { name: string; email: string }) => Promise<void>;
  loading?: boolean;
}

export function EmailGate({ onSubmit, loading }: EmailGateProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse({ name, email });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    await onSubmit({ name: parsed.data.name!, email: parsed.data.email! });
  };

  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-lg bg-primary/15 p-2 text-primary">
          <Download className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground">Get the full PDF report</h3>
          <p className="text-sm text-muted-foreground">Includes all AI fix recommendations + a free 30-min strategy call.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="audit-name" className="text-xs">Your name</Label>
            <Input id="audit-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" disabled={loading} />
          </div>
          <div>
            <Label htmlFor="audit-email" className="text-xs">Work email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="audit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@company.com"
                className="pl-9"
                disabled={loading}
              />
            </div>
          </div>
        </div>
        {error && <p className="text-xs text-rose-400">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating PDF…
            </>
          ) : (
            <>Email me the full report</>
          )}
        </Button>
        <p className="text-[11px] text-muted-foreground">
          We respect your inbox. Unsubscribe anytime. By submitting you agree to our privacy policy.
        </p>
      </form>
    </div>
  );
}
