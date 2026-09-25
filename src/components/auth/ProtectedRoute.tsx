import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="card-surface rounded-2xl p-10 max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <span className="text-2xl">⏳</span>
          </div>
          <h2 className="font-display font-bold text-xl text-foreground">Your account is awaiting access</h2>
          <p className="text-muted-foreground text-sm">
            You're signed in as <strong className="text-foreground">{user.email}</strong>, but no role has been
            assigned to your account yet. Please reach out to your administrator to get access to the dashboard.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => window.location.href = "/contact"}
              className="text-primary text-sm hover:underline"
            >
              Contact us
            </button>
            <button
              onClick={() => signOut().then(() => (window.location.href = "/login"))}
              className="text-muted-foreground text-sm hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="card-surface rounded-2xl p-10 max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <span className="text-2xl">⛔</span>
          </div>
          <h2 className="font-display font-bold text-xl text-foreground">Access Denied</h2>
          <p className="text-muted-foreground text-sm">
            You don't have permission to access this section. Your role: <span className="text-foreground font-medium">{role}</span>
          </p>
          <button
            onClick={() => window.location.href = "/"}
            className="text-primary text-sm hover:underline"
          >
            ← Back to Website
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
