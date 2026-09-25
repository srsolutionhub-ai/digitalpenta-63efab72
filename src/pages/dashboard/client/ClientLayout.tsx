import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, FileText, MessageCircle, LogOut, Calendar, Phone,
  FolderOpen, BookOpen, Bell, FolderKanban, ClipboardCheck, BarChart3,
  Menu, ChevronDown, Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DashboardTitleProvider, useDashboardTitle } from "@/components/dashboard/ui/dashboard-title-context";

// Data-driven nav: add new items/groups here without touching layout markup.
// Other agents may append entries to any group's `items` array safely.
const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Home", icon: LayoutDashboard, path: "/dashboard/client" },
      { label: "Reports", icon: BarChart3, path: "/dashboard/client/reports" },
    ],
  },
  {
    label: "Work",
    items: [
      { label: "Projects", icon: FolderKanban, path: "/dashboard/client/projects" },
      { label: "Approvals", icon: ClipboardCheck, path: "/dashboard/client/approvals" },
      { label: "Files", icon: FolderOpen, path: "/dashboard/client/files" },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Invoices", icon: FileText, path: "/dashboard/client/invoices" },
    ],
  },
  {
    label: "Support",
    items: [
      { label: "Knowledge", icon: BookOpen, path: "/dashboard/client/knowledge" },
      { label: "Support", icon: MessageCircle, path: "/dashboard/client/support" },
    ],
  },
];

const flatNavItems = navGroups.flatMap((g) => g.items);

function isActive(pathname: string, path: string) {
  return pathname === path;
}

function TopBarTitle() {
  const { title, description } = useDashboardTitle();
  return (
    <div className="min-w-0 hidden lg:block">
      <h2 className="font-display font-semibold text-foreground text-sm truncate">{title || "Client Portal"}</h2>
      {description && <p className="text-[11px] text-muted-foreground truncate">{description}</p>}
    </div>
  );
}

function ClientLayoutInner() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: notifications = [] } = useQuery({
    queryKey: ["client-notifications", user?.id],
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

  const unread = notifications.filter((n: any) => !n.read).length;
  const initials = (user?.email?.[0] ?? "C").toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b border-border/20 sticky top-0 bg-background/80 backdrop-blur-md z-30">
        <div className="container mx-auto h-full flex items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-muted-foreground hover:text-foreground p-1.5 -ml-1.5 rounded-lg hover:bg-muted/40 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="font-display font-bold text-foreground text-sm flex-shrink-0">
              Digital<span className="text-gradient">Penta</span>
            </Link>
            <TopBarTitle />
            <nav className="hidden lg:flex items-center gap-1">
              {flatNavItems.map((item) => {
                const active = isActive(location.pathname, item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted/40 transition-colors">
                  <Bell className="w-4 h-4" />
                  {unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary text-[9px] text-primary-foreground flex items-center justify-center font-bold">
                      {unread}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="px-4 py-3 border-b border-border/20">
                  <p className="font-display font-semibold text-sm">Updates</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted-foreground">All caught up.</div>
                  ) : notifications.map((n: any) => (
                    <div key={n.id} className={`px-4 py-3 border-b border-border/10 ${!n.read ? "bg-primary/5" : ""}`}>
                      <p className="text-xs font-medium text-foreground">{n.title}</p>
                      {n.body && <p className="text-[11px] text-muted-foreground mt-0.5">{n.body}</p>}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-muted/40 transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-xs text-muted-foreground max-w-[160px] truncate">{user?.email}</span>
                  <ChevronDown className="hidden md:block w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-xs font-medium text-foreground truncate">{user?.email}</p>
                  <p className="text-[10px] text-muted-foreground">Client</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/client/support" className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" /> Account & Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0 flex flex-col bg-card border-border/20">
          <div className="h-16 flex items-center px-4 border-b border-border/20">
            <Link to="/" className="font-display font-bold text-foreground text-sm">
              Digital<span className="text-gradient">Penta</span>
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = isActive(location.pathname, item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
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
              <span>Sign Out</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <aside className="fixed right-4 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2">
        <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full card-surface flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" title="Book a Call">
          <Calendar className="w-4 h-4" />
        </a>
        <a href="https://wa.me/918860100039?text=Hi,%20I%20need%20help%20with%20my%20campaign" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full card-surface flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" title="WhatsApp">
          <Phone className="w-4 h-4" />
        </a>
      </aside>
    </div>
  );
}

export default function ClientLayout() {
  return (
    <DashboardTitleProvider fallback="Client Portal">
      <ClientLayoutInner />
    </DashboardTitleProvider>
  );
}
