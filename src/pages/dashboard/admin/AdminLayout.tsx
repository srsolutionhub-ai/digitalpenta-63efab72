import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Users, FileText, Receipt, PenLine, Settings, LogOut,
  ChevronLeft, ChevronRight, UserCircle, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/admin" },
  { label: "Leads", icon: Users, path: "/dashboard/admin/leads" },
  { label: "Billing", icon: Receipt, path: "/dashboard/admin/billing" },
  { label: "Blog", icon: PenLine, path: "/dashboard/admin/blog" },
  { label: "Settings", icon: Settings, path: "/dashboard/admin/settings" },
];

export default function AdminLayout() {
  const { user, role, signOut } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("admin_sidebar_collapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("admin_sidebar_collapsed", String(collapsed));
  }, [collapsed]);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen border-r border-border/20 bg-card flex flex-col transition-all duration-300 z-30 ${
          collapsed ? "w-16" : "w-56"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/20">
          {!collapsed && (
            <Link to="/" className="font-display font-bold text-foreground text-sm">
              Digital<span className="text-gradient">Penta</span>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="text-muted-foreground hover:text-foreground">
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map((item) => {
            const active = location.pathname === item.path ||
              (item.path !== "/dashboard/admin" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border/20">
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-56"}`}>
        {/* Top bar */}
        <header className="h-16 border-b border-border/20 flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-md z-20">
          <h2 className="font-display font-semibold text-foreground text-sm">Admin Dashboard</h2>
          <div className="flex items-center gap-3">
            <button className="text-muted-foreground hover:text-foreground relative">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-primary" />
              </div>
              {user && (
                <div className="hidden md:block">
                  <p className="text-xs font-medium text-foreground">{user.email}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{role}</p>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
