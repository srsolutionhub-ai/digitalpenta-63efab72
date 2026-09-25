import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, UserPlus } from "lucide-react";
import { friendlyAuthError, getPasswordStrength } from "@/lib/authErrors";
import { cn } from "@/lib/utils";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // After the confirmation link is clicked, land back on login where
        // session persistence will pick up the confirmed account.
        emailRedirectTo: `${window.location.origin}/login`,
        data: { full_name: fullName },
      },
    });

    if (error) {
      toast.error(friendlyAuthError(error));
    } else {
      setSent(true);
      toast.success("Account created! Check your email to confirm.");
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
          <p className="text-muted-foreground text-sm mt-2">Create your client account</p>
        </div>

        {sent ? (
          <div className="card-surface rounded-2xl p-8 text-center space-y-4">
            <Mail className="w-12 h-12 text-primary mx-auto" />
            <p className="text-foreground font-display font-semibold">Confirm your email</p>
            <p className="text-muted-foreground text-sm">
              We've sent a confirmation link to <strong className="text-foreground">{email}</strong>. Click it to
              activate your account, then sign in.
            </p>
            <Link to="/login" className="text-primary text-sm hover:underline inline-block">
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                required
                className="min-h-[48px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden flex gap-1">
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
              <Label htmlFor="confirm">Confirm password</Label>
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
            </div>

            <Button type="submit" className="w-full min-h-[48px] font-display font-semibold" disabled={loading}>
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" /> Create Account
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
