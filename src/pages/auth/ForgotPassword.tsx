import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";
import { friendlyAuthError } from "@/lib/authErrors";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      // Don't reveal whether the email exists — but do surface real
      // transient errors (rate limit, network) so the user isn't confused.
      if (error.status === 429 || (error.message || "").toLowerCase().includes("rate limit")) {
        toast.error(friendlyAuthError(error));
      } else {
        setSent(true);
      }
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="font-display font-bold text-2xl text-foreground">
              Digital<span className="text-gradient">Penta</span>
            </h1>
          </Link>
          <p className="text-muted-foreground text-sm mt-2">Reset your password</p>
        </div>

        {sent ? (
          <div className="card-surface rounded-2xl p-8 text-center space-y-4">
            <Mail className="w-12 h-12 text-primary mx-auto" />
            <p className="text-foreground font-display font-semibold">Check your inbox</p>
            <p className="text-muted-foreground text-sm">
              If an account exists for <strong className="text-foreground">{email}</strong>, we've sent a password
              reset link. It expires shortly, so use it soon.
            </p>
            <Link to="/login" className="text-primary text-sm hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="min-h-[48px]"
              />
            </div>

            <Button type="submit" className="w-full min-h-[48px] font-display font-semibold" disabled={loading}>
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </Button>

            <Link to="/login" className="text-muted-foreground text-sm hover:text-foreground flex items-center justify-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
