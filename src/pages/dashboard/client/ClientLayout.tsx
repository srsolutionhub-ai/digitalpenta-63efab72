import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, FileText, MessageCircle, LogOut, Calendar, Phone,
  FolderOpen, BookOpen, Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const navItems = [
  { label: "Campaign", icon: LayoutDashboard, path: "/dashboard/client" },
  { label: "Files", icon: FolderOpen, path: "/dashboard/client/files" },
  { label: "Invoices", icon: FileText, path: "/dashboard/client/invoices" },
  { label: "Knowledge", icon: BookOpen, path: "/dashboard/client/knowledge" },
  { label: "Support", icon: MessageCircle, path: "/dashboard/client/support" },
];

export default function ClientLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();

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

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b border-border/20 sticky top-0 bg-background/80 backdrop-blur-md z-30">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-display font-bold text-foreground text-sm">
              Digital<span className="text-gradient">Penta</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground"
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
            <span className="text-xs text-muted-foreground hidden md:block">{user?.email}</span>
            <Button size="sm" variant="ghost" onClick={signOut}><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>
      </header>

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
