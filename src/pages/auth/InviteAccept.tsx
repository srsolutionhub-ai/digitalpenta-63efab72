import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function InviteAccept() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  // checking → waiting for the invite session; ready → valid; invalid → bad link
  const [state, setState] = useState<"checking" | "ready" | "invalid">("checking");

  useEffect(() => {
    let cancelled = false;

    // Listen FIRST so a session established during hash/code exchange is caught.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if ((event === "SIGNED_IN" || event === "USER_UPDATED" || event === "PASSWORD_RECOVERY") && session) {
        setState("ready");
      }
    });

    const init = async () => {
      const search = new URLSearchParams(window.location.search);
      const code = search.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (!error) { setState("ready"); return; }
      }
      // Hash-based invite tokens are exchanged by the SDK; verify a real
      // session exists rather than trusting the hash text alone.
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      setState(session ? "ready" : "invalid");
    };
    init();

    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Password set successfully! Redirecting...");

    // Fetch role to determine redirect
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: roleData } = await supabase.rpc("get_user_role", {
        _user_id: user.id,
      });
      const role = roleData as string | null;
      if (role === "client") {
        navigate("/dashboard/client");
      } else if (role) {
        navigate("/dashboard/admin");
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }

    setLoading(false);
  };

  if (state === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (state === "invalid") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm text-center space-y-6">
          <Link to="/" className="inline-block">
            <h1 className="font-display font-bold text-2xl text-foreground">
              Digital<span className="text-gradient">Penta</span>
            </h1>
          </Link>
          <div className="card-surface rounded-2xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <span className="text-xl">⚠️</span>
            </div>
            <h2 className="font-display font-bold text-lg text-foreground">Invalid Invite Link</h2>
            <p className="text-muted-foreground text-sm">
              This invite link is invalid or has expired. Please request a new invitation from your administrator.
            </p>
            <Link to="/login" className="text-primary text-sm hover:underline inline-block">
              ← Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="font-display font-bold text-2xl text-foreground">
              Digital<span className="text-gradient">Penta</span>
            </h1>
          </Link>
          <p className="text-muted-foreground text-sm mt-2">Complete your account setup</p>
        </div>

        <div className="card-surface rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-display font-semibold text-foreground text-sm">Set Your Password</p>
              <p className="text-muted-foreground text-xs">Choose a secure password for your account</p>
            </div>
          </div>

          <form onSubmit={handleSetPassword} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                  className="min-h-[48px] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                minLength={8}
                className="min-h-[48px]"
              />
            </div>

            <Button type="submit" className="w-full min-h-[48px] font-display font-semibold" disabled={loading}>
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              ) : (
                "Set Password & Continue"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
