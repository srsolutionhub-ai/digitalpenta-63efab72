import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Users, Receipt, PenLine, Settings, LogOut,
  ChevronLeft, ChevronRight, UserCircle, Bell, FileSearch,
  MessageCircle, Kanban, Briefcase, Wallet, FolderKanban, Clock, CalendarDays,
  Sparkles, Activity, TrendingUp, Mic, Mail, Send, Contact, CheckSquare, Bot, Plug, Megaphone, FileText, ShieldCheck, BarChart3, ListOrdered, Search,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import GlobalSearch from "@/components/admin/GlobalSearch";

const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/admin" },
      { label: "Funnel", icon: Activity, path: "/dashboard/admin/funnel" },
      { label: "Audience", icon: BarChart3, path: "/dashboard/admin/audience" },
      { label: "AI Tool Leads", icon: Sparkles, path: "/dashboard/admin/tool-runs" },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Pipeline", icon: Kanban, path: "/dashboard/admin/crm" },
      { label: "Contacts", icon: Contact, path: "/dashboard/admin/contacts" },
      { label: "Leads", icon: Users, path: "/dashboard/admin/leads" },
      { label: "Tasks", icon: CheckSquare, path: "/dashboard/admin/tasks" },
      { label: "Bookings", icon: CalendarDays, path: "/dashboard/admin/bookings" },
      { label: "Quotations", icon: Briefcase, path: "/dashboard/admin/quotations" },
      { label: "Invoices", icon: Receipt, path: "/dashboard/admin/invoices" },
    ],
  },
  {
    label: "Delivery",
    items: [
      { label: "Projects", icon: FolderKanban, path: "/dashboard/admin/projects" },
      { label: "Time Tracking", icon: Clock, path: "/dashboard/admin/time" },
      { label: "SEO Audits", icon: FileSearch, path: "/dashboard/admin/audits" },
      { label: "SEO Ranks", icon: TrendingUp, path: "/dashboard/admin/seo-ranks" },
      { label: "WhatsApp Hub", icon: MessageCircle, path: "/dashboard/admin/whatsapp" },
      { label: "WhatsApp Bot", icon: Bot, path: "/dashboard/admin/whatsapp/bot" },
      { label: "WA Templates", icon: FileText, path: "/dashboard/admin/whatsapp/templates" },
      { label: "WA Broadcasts", icon: Megaphone, path: "/dashboard/admin/whatsapp/broadcasts" },
      { label: "Client Deliverables", icon: FolderKanban, path: "/dashboard/admin/deliverables" },
    ],
  },
  {
    label: "Studio",
    items: [
      { label: "Blog", icon: PenLine, path: "/dashboard/admin/blog" },
      { label: "Voice Studio", icon: Mic, path: "/dashboard/admin/voice-studio" },
      { label: "Newsletter", icon: Send, path: "/dashboard/admin/newsletter" },
      { label: "Email Sequences", icon: ListOrdered, path: "/dashboard/admin/sequences" },
      { label: "Email Log", icon: Mail, path: "/dashboard/admin/email-log" },
      { label: "Finance", icon: Wallet, path: "/dashboard/admin/billing" },
      { label: "Team & Roles", icon: ShieldCheck, path: "/dashboard/admin/team" },
      { label: "Integrations", icon: Plug, path: "/dashboard/admin/integrations" },
      { label: "Settings", icon: Settings, path: "/dashboard/admin/settings" },
    ],
  },
];

export default function AdminLayout() {
  const { user, role, signOut } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("admin_sidebar_collapsed") === "true");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("admin_sidebar_collapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      return data ?? [];
    },
    enabled: !!user,
    refetchInterval: 60000,
  });

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <div className="min-h-screen flex bg-background">
      <aside
        className={`fixed left-0 top-0 h-screen border-r border-border/20 bg-card flex flex-col transition-all duration-300 z-30 ${
          collapsed ? "w-16" : "w-60"
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

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">{group.label}</p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = location.pathname === item.path ||
                    (item.path !== "/dashboard/admin" && item.path !== "/dashboard/admin/whatsapp" && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
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
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-border/20">
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <div className={`flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-60"}`}>
        <header className="h-16 border-b border-border/20 flex items-center justify-between px-6 sticky top-0 bg-background/80 backdrop-blur-md z-20">
          <h2 className="font-display font-semibold text-foreground text-sm">Agency OS</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border/30 hover:bg-muted/40 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search…</span>
              <kbd className="hidden sm:inline text-[10px] font-mono bg-muted/50 px-1.5 py-0.5 rounded">⌘K</kbd>
            </button>
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted/40 transition-colors">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="px-4 py-3 border-b border-border/20">
                  <p className="font-display font-semibold text-sm">Notifications</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted-foreground">No notifications yet</div>
                  ) : (
                    notifications.map((n: any) => (
                      <Link
                        key={n.id}
                        to={n.link || "#"}
                        className={`block px-4 py-3 border-b border-border/10 hover:bg-muted/30 ${!n.read ? "bg-primary/5" : ""}`}
                      >
                        <p className="text-xs font-medium text-foreground">{n.title}</p>
                        {n.body && <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>}
                        <p className="text-[10px] text-muted-foreground/70 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                      </Link>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-primary" />
              </div>
              {user && (
                <div className="hidden md:block">
                  <p className="text-xs font-medium text-foreground">{user.email}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{role?.replace(/_/g, " ")}</p>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>

        <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
      </div>
    </div>
  );
}
