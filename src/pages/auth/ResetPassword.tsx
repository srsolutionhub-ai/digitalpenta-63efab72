import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { friendlyAuthError, getPasswordStrength } from "@/lib/authErrors";
import { cn } from "@/lib/utils";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [checking, setChecking] = useState(true);

  const strength = getPasswordStrength(password);

  useEffect(() => {
    let cancelled = false;

    // Register the listener FIRST (synchronously) so a PASSWORD_RECOVERY
    // event fired during the initial hash/code exchange is never missed.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
        setChecking(false);
      } else if (event === "SIGNED_IN" && session) {
        // Some recovery links land as a plain SIGNED_IN event depending on flow.
        setIsRecovery(true);
        setChecking(false);
      }
    });

    // Supabase sends recovery via either:
    //  - hash:  #access_token=...&type=recovery  (legacy)
    //  - query: ?code=...&type=recovery           (PKCE)
    const hash = window.location.hash;
    const search = new URLSearchParams(window.location.search);
    const code = search.get("code");

    const init = async () => {
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (!error) {
          setIsRecovery(true);
          setChecking(false);
          return;
        }
      }

      if (hash.includes("type=recovery")) {
        // The onAuthStateChange handler above will also fire PASSWORD_RECOVERY;
        // this covers browsers/timing where it doesn't.
        setIsRecovery(true);
        setChecking(false);
        return;
      }

      // Last resort — if the user is already authenticated (e.g. re-visits the
      // page mid-flow) let them still update their password.
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (session) setIsRecovery(true);
      setChecking(false);
    };

    init();

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords do not match");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    if (strength === "weak") return toast.error("Please choose a stronger password (mix letters, numbers, symbols).");

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(friendlyAuthError(error));
    } else {
      toast.success("Password updated. Please sign in.");
      await supabase.auth.signOut();
      navigate("/login");
    }
    setLoading(false);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="card-surface rounded-2xl p-10 max-w-md text-center space-y-4">
          <h2 className="font-display font-bold text-xl text-foreground">Invalid Link</h2>
          <p className="text-muted-foreground text-sm">This reset link is invalid or has expired.</p>
          <Link to="/forgot-password" className="text-primary text-sm hover:underline">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-display font-bold text-2xl text-foreground">
            Digital<span className="text-gradient">Penta</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-2">Set your new password</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPass ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="min-h-[48px] pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password.length > 0 && (
              <div className="space-y-1">
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      strength === "weak" && "w-1/3 bg-destructive",
                      strength === "fair" && "w-2/3 bg-yellow-500",
                      strength === "strong" && "w-full bg-green-500"
                    )}
                  />
                </div>
                <p className="text-xs text-muted-foreground capitalize">{strength} password</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="min-h-[48px]"
            />
            {confirm.length > 0 && confirm !== password && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>

          <Button type="submit" className="w-full min-h-[48px] font-display font-semibold" disabled={loading}>
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
