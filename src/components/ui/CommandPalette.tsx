import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Home,
  Megaphone,
  Code2,
  Brain,
  Zap,
  Newspaper,
  Phone,
  CalendarCheck,
  MessageCircle,
  BookOpen,
  BarChart3,
  Mail,
  FileText,
  Sparkles,
  Briefcase,
  Search,
} from "lucide-react";

/**
 * Lovable ⌘K command palette.
 * Lazy-mounted in App.tsx — only initialised after the user presses ⌘K / Ctrl+K / "/" the first time.
 * Keeps initial JS budget small while shipping a Linear-style power-user shortcut.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !isTypingTarget(e.target))) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  const ext = (url: string) => {
    setOpen(false);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages, tools, actions…" />
      <CommandList>
        <CommandEmpty>No matches. Try “seo”, “book”, or “whatsapp”.</CommandEmpty>

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => go("/book-a-call")}>
            <CalendarCheck className="mr-2 h-4 w-4 text-primary" />
            Book a free strategy call
          </CommandItem>
          <CommandItem
            onSelect={() => ext("https://wa.me/918860100039?text=Hi%20Digital%20Penta%2C%20I%27d%20like%20to%20discuss%20my%20project")}
          >
            <MessageCircle className="mr-2 h-4 w-4 text-[#25D366]" />
            Chat on WhatsApp
          </CommandItem>
          <CommandItem onSelect={() => go("/get-proposal")}>
            <FileText className="mr-2 h-4 w-4 text-primary" />
            Get a free proposal
          </CommandItem>
          <CommandItem onSelect={() => go("/tools/seo-audit")}>
            <Search className="mr-2 h-4 w-4 text-primary" />
            Run a free SEO audit
          </CommandItem>
          <CommandItem onSelect={() => (window.location.href = "tel:+918860100039")}>
            <Phone className="mr-2 h-4 w-4" />
            Call +91-88601-00039
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Services">
          <CommandItem onSelect={() => go("/services/digital-marketing")}>
            <Megaphone className="mr-2 h-4 w-4 text-violet-400" /> Digital Marketing
          </CommandItem>
          <CommandItem onSelect={() => go("/services/digital-marketing/seo")}>
            <BarChart3 className="mr-2 h-4 w-4 text-violet-400" /> SEO
          </CommandItem>
          <CommandItem onSelect={() => go("/services/digital-marketing/ppc")}>
            <BarChart3 className="mr-2 h-4 w-4 text-violet-400" /> PPC / Google Ads
          </CommandItem>
          <CommandItem onSelect={() => go("/services/public-relations")}>
            <Newspaper className="mr-2 h-4 w-4 text-cyan-400" /> Public Relations
          </CommandItem>
          <CommandItem onSelect={() => go("/services/development")}>
            <Code2 className="mr-2 h-4 w-4 text-emerald-400" /> Web Development
          </CommandItem>
          <CommandItem onSelect={() => go("/services/ai-solutions")}>
            <Brain className="mr-2 h-4 w-4 text-amber-400" /> AI Solutions
          </CommandItem>
          <CommandItem onSelect={() => go("/services/automation")}>
            <Zap className="mr-2 h-4 w-4 text-orange-400" /> Automation
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="AI Tools">
          <CommandItem onSelect={() => go("/tools")}>
            <Sparkles className="mr-2 h-4 w-4 text-primary" /> All AI Tools
          </CommandItem>
          <CommandItem onSelect={() => go("/tools/growth-score")}>
            <Sparkles className="mr-2 h-4 w-4" /> Growth Score
          </CommandItem>
          <CommandItem onSelect={() => go("/tools/ad-copy")}>
            <Sparkles className="mr-2 h-4 w-4" /> Ad Copy Generator
          </CommandItem>
          <CommandItem onSelect={() => go("/tools/meta-tags")}>
            <Sparkles className="mr-2 h-4 w-4" /> Meta Tags Generator
          </CommandItem>
          <CommandItem onSelect={() => go("/tools/competitor-xray")}>
            <Sparkles className="mr-2 h-4 w-4" /> Competitor X-Ray
          </CommandItem>
          <CommandItem onSelect={() => go("/tools/roi-predictor")}>
            <Sparkles className="mr-2 h-4 w-4" /> ROI Predictor
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/")}>
            <Home className="mr-2 h-4 w-4" /> Home
          </CommandItem>
          <CommandItem onSelect={() => go("/about")}>
            <Briefcase className="mr-2 h-4 w-4" /> About
          </CommandItem>
          <CommandItem onSelect={() => go("/portfolio")}>
            <Briefcase className="mr-2 h-4 w-4" /> Portfolio
          </CommandItem>
          <CommandItem onSelect={() => go("/blog")}>
            <BookOpen className="mr-2 h-4 w-4" /> Blog
          </CommandItem>
          <CommandItem onSelect={() => go("/pricing-calculator")}>
            <BarChart3 className="mr-2 h-4 w-4" /> Pricing Calculator
          </CommandItem>
          <CommandItem onSelect={() => go("/contact")}>
            <Mail className="mr-2 h-4 w-4" /> Contact
          </CommandItem>
          <CommandItem onSelect={() => go("/trust")}>
            <Briefcase className="mr-2 h-4 w-4" /> Trust & Compliance
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}
