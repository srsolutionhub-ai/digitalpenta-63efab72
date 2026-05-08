import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Mail } from "lucide-react";
import { trackFunnel, getAttribution } from "@/lib/funnel";

/**
 * Shared runner for every AI tool. Renders the tool-specific input fields
 * passed via `children`, an email gate, and posts to the `ai-tools`
 * edge function. The result is rendered with a custom render function so
 * each tool can present its JSON how it likes.
 */
export interface AiToolRunnerProps<T> {
  toolSlug: string;
  toolName: string;
  inputs: Record<string, unknown>;
  isReady: boolean;            // tool-specific validation
  renderResult: (result: T) => React.ReactNode;
  children: React.ReactNode;   // tool-specific input fields
}

export default function AiToolRunner<T = unknown>({
  toolSlug, toolName, inputs, isReady, renderResult, children,
}: AiToolRunnerProps<T>) {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<T | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const onRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isReady) {
      toast({ title: "Add a few details", description: "Please fill in the tool fields first.", variant: "destructive" });
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast({ title: "Valid email required", variant: "destructive" });
      return;
    }
    setRunning(true);
    setSubmitted(true);
    trackFunnel({ stage: "tool_submit", tool: toolSlug, source: "tool_page" });
    try {
      const { data, error } = await supabase.functions.invoke("ai-tools", {
        body: { tool: toolSlug, inputs, email, name, company, utm: getAttribution() },
      });
      if (error) throw error;
      const payload = (data as { result: T })?.result;
      setResult(payload);
      trackFunnel({ stage: "tool_result", tool: toolSlug });
      toast({ title: "Done!", description: `Your ${toolName} report is ready.` });
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: (err as Error).message ?? "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <form onSubmit={onRun} className="card-premium p-6 space-y-5">
        <div>
          <p className="type-label text-primary mb-2 font-mono">Step 1 — your details</p>
          <div className="space-y-3">
            {children}
          </div>
        </div>
        <div className="border-t border-border/30 pt-5">
          <p className="type-label text-primary mb-2 font-mono flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Step 2 — get the report</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="run-name" className="text-xs">Your name</Label>
              <Input id="run-name" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
            </div>
            <div>
              <Label htmlFor="run-company" className="text-xs">Company</Label>
              <Input id="run-company" value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Inc." />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="run-email" className="text-xs">Work email *</Label>
              <Input id="run-email" required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
            </div>
          </div>
        </div>
        <Button type="submit" disabled={running} size="lg" className="w-full rounded-full font-display font-semibold">
          {running ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating…</>) : (<><Sparkles className="w-4 h-4 mr-2" /> Run {toolName}</>)}
        </Button>
        <p className="text-[11px] text-muted-foreground">By running this tool you agree to our privacy policy. We'll occasionally email you marketing tips — unsubscribe anytime.</p>
      </form>

      <div className="card-premium p-6 min-h-[400px]">
        <p className="type-label text-primary mb-3 font-mono">Result</p>
        {!submitted && (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-12">
            <Sparkles className="w-10 h-10 text-primary/40 mb-3" />
            <p className="text-sm max-w-xs">Fill in the fields and your AI report will appear here in seconds.</p>
          </div>
        )}
        {submitted && running && (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="text-sm">Analysing… this usually takes 8–15 seconds.</p>
          </div>
        )}
        {result && renderResult(result)}
      </div>
    </div>
  );
}
