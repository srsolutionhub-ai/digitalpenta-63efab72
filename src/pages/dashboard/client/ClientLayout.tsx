import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, FileText, MessageCircle, LogOut, Download, Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "My Campaign", icon: LayoutDashboard, path: "/dashboard/client" },
  { label: "Invoices", icon: FileText, path: "/dashboard/client/invoices" },
  { label: "Support", icon: MessageCircle, path: "/dashboard/client/support" },
];

export default function ClientLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav */}
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

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden md:block">{user?.email}</span>
            <Button size="sm" variant="ghost" onClick={signOut}><LogOut className="w-4 h-4" /></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Quick links sidebar */}
      <aside className="fixed right-4 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2">
        <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full card-surface flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" title="Book a Call">
          <Calendar className="w-4 h-4" />
        </a>
        <a href="https://wa.me/918860100039?text=Hi,%20I%20need%20help%20with%20my%20campaign" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full card-surface flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" title="WhatsApp AM">
          <Phone className="w-4 h-4" />
        </a>
      </aside>
    </div>
  );
}
