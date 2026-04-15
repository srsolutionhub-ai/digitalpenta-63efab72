import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

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
    return <Navigate to="/auth/login" replace />;
  }

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="card-surface rounded-2xl p-10 max-w-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="font-display font-bold text-xl text-foreground">No Role Assigned</h2>
          <p className="text-muted-foreground text-sm">Contact your administrator to get access to the dashboard.</p>
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

  if (!allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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
