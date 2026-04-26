import { useState, useEffect, useCallback, useRef, KeyboardEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Megaphone,
  Newspaper,
  Code2,
  Brain,
  Zap,
  ArrowRight,
  Phone,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import AnnounceBar from "@/components/ui/announce-bar";
import logo from "@/assets/digital-penta-logo.png";

const services = [
  {
    title: "Digital Marketing", href: "/services/digital-marketing", icon: Megaphone, color: "text-violet-400",
    subs: [
      { title: "SEO", href: "/services/digital-marketing/seo" },
      { title: "PPC Management", href: "/services/digital-marketing/ppc" },
      { title: "Social Media", href: "/services/digital-marketing/social-media" },
      { title: "Content Marketing", href: "/services/digital-marketing/content" },
      { title: "Email Marketing", href: "/services/digital-marketing/email" },
      { title: "Influencer Marketing", href: "/services/digital-marketing/influencer" },
      { title: "Video Marketing", href: "/services/digital-marketing/video" },
      { title: "Performance Marketing", href: "/services/digital-marketing/performance" },
    ],
  },
  {
    title: "Public Relations", href: "/services/public-relations", icon: Newspaper, color: "text-cyan-400",
    subs: [
      { title: "Media Relations", href: "/services/public-relations/media-relations" },
      { title: "Brand Reputation", href: "/services/public-relations/brand-reputation" },
      { title: "Crisis Management", href: "/services/public-relations/crisis" },
      { title: "Digital PR", href: "/services/public-relations/digital-pr" },
      { title: "Press Release", href: "/services/public-relations/press-release" },
      { title: "Thought Leadership", href: "/services/public-relations/thought-leadership" },
      { title: "Event PR", href: "/services/public-relations/event-pr" },
    ],
  },
  {
    title: "Development", href: "/services/development", icon: Code2, color: "text-emerald-400",
    subs: [
      { title: "Website Development", href: "/services/development/website" },
      { title: "Mobile App", href: "/services/development/mobile-app" },
      { title: "E-commerce", href: "/services/development/ecommerce" },
      { title: "Web Application", href: "/services/development/web-app" },
      { title: "CMS Development", href: "/services/development/cms" },
      { title: "API Integration", href: "/services/development/api" },
      { title: "UI/UX Design", href: "/services/development/ui-ux" },
    ],
  },
  {
    title: "AI Solutions", href: "/services/ai-solutions", icon: Brain, color: "text-amber-400",
    subs: [
      { title: "AI Strategy", href: "/services/ai-solutions/strategy" },
      { title: "AI Chatbot", href: "/services/ai-solutions/chatbot" },
      { title: "Content Generation", href: "/services/ai-solutions/content-gen" },
      { title: "Predictive Analytics", href: "/services/ai-solutions/predictive" },
      { title: "Computer Vision", href: "/services/ai-solutions/computer-vision" },
      { title: "NLP Solutions", href: "/services/ai-solutions/nlp" },
      { title: "AI Marketing", href: "/services/ai-solutions/marketing" },
    ],
  },
  {
    title: "Automation", href: "/services/automation", icon: Zap, color: "text-orange-400",
    subs: [
      { title: "Marketing Automation", href: "/services/automation/marketing" },
      { title: "Workflow Automation", href: "/services/automation/workflow" },
      { title: "CRM Automation", href: "/services/automation/crm" },
      { title: "Sales Automation", href: "/services/automation/sales" },
      { title: "Social Automation", href: "/services/automation/social" },
      { title: "Reporting Automation", href: "/services/automation/reporting" },
      { title: "WhatsApp Automation", href: "/services/automation/whatsapp" },
    ],
  },
];

const navLinks = [
  { title: "Results", href: "/#results" },
  { title: "About", href: "/about" },
  { title: "Portfolio", href: "/portfolio" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileServiceExpanded, setMobileServiceExpanded] = useState<string | null>(null);
  const location = useLocation();
  const lastYRef = useRef(0);
  const megaTimeoutRef = useRef<number | null>(null);
  const megaContainerRef = useRef<HTMLDivElement>(null);
  const mobileSheetRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const onScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 20);
    if (y > 200) {
      setHidden(y > lastYRef.current && y - lastYRef.current > 5);
    } else {
      setHidden(false);
    }
    lastYRef.current = y;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
    setMobileServiceExpanded(null);
  }, [location.pathname]);

  // Lock body scroll on mobile open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // ESC closes overlays + return focus
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        if (mobileOpen) {
          setMobileOpen(false);
          menuButtonRef.current?.focus();
        }
        if (megaOpen) setMegaOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, megaOpen]);

  // Click outside closes mega menu
  useEffect(() => {
    if (!megaOpen) return;
    const onClick = (e: MouseEvent) => {
      if (megaContainerRef.current && !megaContainerRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [megaOpen]);

  // Hover open/close with delay (fallback to click on touch)
  const openMega = () => {
    if (megaTimeoutRef.current) window.clearTimeout(megaTimeoutRef.current);
    setMegaOpen(true);
  };
  const closeMegaDelayed = () => {
    if (megaTimeoutRef.current) window.clearTimeout(megaTimeoutRef.current);
    megaTimeoutRef.current = window.setTimeout(() => setMegaOpen(false), 120);
  };

  const onMegaButtonKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setMegaOpen(true);
      // Focus first link inside mega panel after render
      requestAnimationFrame(() => {
        const first = megaContainerRef.current?.querySelector<HTMLAnchorElement>("a[href]");
        first?.focus();
      });
    }
  };

  return (
    <>
      <AnnounceBar />
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
          hidden && !mobileOpen ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled
            ? "bg-background/60 backdrop-blur-3xl shadow-2xl shadow-primary/10 border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
        role="banner"
      >
        <div className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-0"}`}>
          <div className="h-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        </div>

        <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
          <Link
            to="/"
            className="flex items-center gap-2.5 group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Digital Penta — Home"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"
                style={{ background: "radial-gradient(circle, hsl(256 90% 62% / 0.7), transparent 70%)" }} />
              <img src={logo} alt="" width={36} height={36} decoding="async" className="relative w-9 h-9 object-contain" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-foreground">
              Digital<span className="text-gradient">Penta</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Primary">
            <div
              ref={megaContainerRef}
              className="relative"
              onMouseEnter={openMega}
              onMouseLeave={closeMegaDelayed}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={megaOpen}
                aria-controls="mega-menu-services"
                onClick={() => setMegaOpen((v) => !v)}
                onKeyDown={onMegaButtonKey}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-display font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-card/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Services <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    id="mega-menu-services"
                    role="menu"
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[min(800px,90vw)]"
                  >
                    <div className="bg-background/95 backdrop-blur-3xl rounded-2xl border border-white/[0.08] shadow-[0_30px_80px_-20px_hsl(256_90%_30%/0.5)] overflow-hidden">
                      <div className="grid grid-cols-6 gap-0">
                        <div className="col-span-4 grid grid-cols-3 gap-0 p-6">
                          {services.map((cat) => (
                            <div key={cat.title} className="mb-4">
                              <Link
                                to={cat.href}
                                role="menuitem"
                                className="flex items-center gap-2 font-display font-semibold text-sm text-foreground hover:text-primary transition-colors mb-2 group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              >
                                <span className="p-1.5 rounded-lg bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.06] group-hover:border-primary/30 group-hover:shadow-[0_0_16px_-4px_hsl(256_90%_62%/0.6)] transition-all">
                                  <cat.icon className={`w-3.5 h-3.5 ${cat.color}`} aria-hidden />
                                </span>
                                {cat.title}
                              </Link>
                              <ul className="space-y-0.5">
                                {cat.subs.map((s) => (
                                  <li key={s.href}>
                                    <Link
                                      to={s.href}
                                      role="menuitem"
                                      className="text-xs text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all block py-0.5 pl-7 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                    >
                                      {s.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className="col-span-2 relative border-l border-white/[0.06] p-6 flex flex-col justify-between overflow-hidden">
                          <div aria-hidden className="absolute inset-0 pointer-events-none"
                            style={{ background: "radial-gradient(120% 100% at 100% 0%, hsl(256 90% 62% / 0.18), transparent 60%), radial-gradient(80% 100% at 0% 100%, hsl(192 95% 56% / 0.12), transparent 60%)" }} />
                          <div className="relative">
                            <p className="text-xs font-mono text-primary uppercase tracking-widest mb-2">Get Started</p>
                            <h3 className="font-display font-bold text-lg text-foreground mb-2">Need a custom strategy?</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Our experts craft tailored solutions across all five pillars — no cookie-cutter approaches.
                            </p>
                          </div>
                          <Link
                            to="/get-proposal"
                            role="menuitem"
                            className="relative inline-flex items-center gap-2 mt-4 text-sm font-display font-semibold neon-link bg-clip-text text-transparent rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            style={{ backgroundImage: "linear-gradient(90deg, hsl(256 100% 80%), hsl(192 100% 75%))" }}
                          >
                            Get Free Proposal <ArrowRight className="w-3.5 h-3.5 text-primary" aria-hidden />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((l) => {
              const active = location.pathname === l.href;
              return (
                <Link
                  key={l.href}
                  to={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative px-4 py-2 text-sm font-display font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                  }`}
                >
                  {l.title}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                      style={{ background: "linear-gradient(90deg, hsl(256 90% 62%), hsl(192 95% 56%))", boxShadow: "0 0 12px hsl(256 90% 62% / 0.7)" }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop right cluster */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to={location.pathname.startsWith("/ar") ? "/" : "/ar"}
              hrefLang={location.pathname.startsWith("/ar") ? "en" : "ar"}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Switch language"
            >
              <Globe className="w-3.5 h-3.5" aria-hidden />
              {location.pathname.startsWith("/ar") ? "EN" : "ع"}
            </Link>
            <a href="tel:+918860100039" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" dir="ltr">
              <Phone className="w-3.5 h-3.5" aria-hidden />
              <span dir="ltr" style={{ unicodeBidi: "isolate" }}>+91-88601-00039</span>
            </a>
            <div className="w-px h-5 bg-border/50" aria-hidden />
            <Link to="/contact">
              <Button variant="outline" size="sm" className="rounded-full font-display font-semibold text-xs px-5 h-8">
                Book Free Call
              </Button>
            </Link>
            <Link to="/get-proposal">
              <Button size="sm" className="rounded-full font-display font-bold text-xs px-5 h-8">
                Get Proposal →
              </Button>
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            ref={menuButtonRef}
            type="button"
            className="lg:hidden p-2 text-foreground relative z-50 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                  <X className="w-5 h-5" aria-hidden />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
                  <Menu className="w-5 h-5" aria-hidden />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile drawer (full-screen, side-slide for premium feel) */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="lg:hidden fixed inset-0 top-16 bg-background/70 backdrop-blur-md z-30"
                onClick={() => setMobileOpen(false)}
                aria-hidden
              />
              <motion.div
                ref={mobileSheetRef}
                id="mobile-nav-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="lg:hidden fixed top-16 bottom-0 right-0 z-40 w-[88vw] max-w-sm bg-background/95 backdrop-blur-3xl border-l border-white/[0.06] overflow-y-auto overscroll-contain"
                style={{
                  boxShadow: "-30px 0 80px -20px hsl(256 90% 30% / 0.5)",
                }}
              >
                {/* Decorative gradient */}
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none opacity-60"
                  style={{
                    background:
                      "radial-gradient(80% 50% at 100% 0%, hsl(256 90% 62% / 0.16), transparent 60%), radial-gradient(60% 40% at 0% 100%, hsl(192 95% 56% / 0.12), transparent 60%)",
                  }}
                />

                <nav className="relative px-5 py-6 space-y-6" aria-label="Mobile primary">
                  {/* Services with collapsible groups */}
                  <div>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-3 px-1">Services</p>
                    <ul className="space-y-1">
                      {services.map((cat, i) => {
                        const expanded = mobileServiceExpanded === cat.title;
                        return (
                          <motion.li
                            key={cat.href}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.28, delay: i * 0.04 }}
                            className="rounded-xl overflow-hidden border border-white/[0.04] bg-white/[0.02]"
                          >
                            <div className="flex items-stretch">
                              <Link
                                to={cat.href}
                                className="flex-1 flex items-center gap-3 py-3 px-3 text-sm font-display font-semibold text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:bg-white/[0.04]"
                              >
                                <span className="p-1.5 rounded-lg bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.06]">
                                  <cat.icon className={`w-4 h-4 ${cat.color}`} aria-hidden />
                                </span>
                                {cat.title}
                              </Link>
                              <button
                                type="button"
                                onClick={() => setMobileServiceExpanded(expanded ? null : cat.title)}
                                aria-expanded={expanded}
                                aria-label={`${expanded ? "Collapse" : "Expand"} ${cat.title} services`}
                                className="px-3 text-muted-foreground hover:text-foreground transition-colors border-l border-white/[0.04] focus-visible:outline-none focus-visible:bg-white/[0.04]"
                              >
                                <ChevronRight
                                  className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-90 text-primary" : ""}`}
                                  aria-hidden
                                />
                              </button>
                            </div>
                            <AnimatePresence initial={false}>
                              {expanded && (
                                <motion.ul
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                  className="overflow-hidden border-t border-white/[0.04] bg-black/20"
                                >
                                  {cat.subs.map((s) => (
                                    <li key={s.href}>
                                      <Link
                                        to={s.href}
                                        className="block py-2 pl-12 pr-3 text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-colors focus-visible:outline-none focus-visible:bg-white/[0.05]"
                                      >
                                        {s.title}
                                      </Link>
                                    </li>
                                  ))}
                                </motion.ul>
                              )}
                            </AnimatePresence>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Primary links */}
                  <div className="border-t border-white/[0.06] pt-5">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-2 px-1">Explore</p>
                    <ul className="space-y-0.5">
                      {navLinks.map((l, i) => {
                        const active = location.pathname === l.href;
                        return (
                          <motion.li
                            key={l.href}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.28, delay: 0.2 + i * 0.04 }}
                          >
                            <Link
                              to={l.href}
                              aria-current={active ? "page" : undefined}
                              className={`flex items-center justify-between py-3 px-3 rounded-lg text-base font-display font-semibold transition-colors focus-visible:outline-none focus-visible:bg-white/[0.04] ${
                                active ? "text-primary bg-white/[0.04]" : "text-foreground hover:text-primary hover:bg-white/[0.03]"
                              }`}
                            >
                              <span>{l.title}</span>
                              <ChevronRight className="w-4 h-4 opacity-40" aria-hidden />
                            </Link>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Contact strip */}
                  <div className="border-t border-white/[0.06] pt-5 space-y-3">
                    <a
                      href="tel:+918860100039"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-colors focus-visible:outline-none focus-visible:bg-white/[0.04]"
                      dir="ltr"
                    >
                      <Phone className="w-4 h-4 text-primary" aria-hidden />
                      <span>+91-88601-00039</span>
                    </a>
                    <Link
                      to={location.pathname.startsWith("/ar") ? "/" : "/ar"}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-muted-foreground hover:text-foreground hover:bg-white/[0.03] transition-colors focus-visible:outline-none focus-visible:bg-white/[0.04]"
                    >
                      <Globe className="w-4 h-4 text-primary" aria-hidden />
                      Switch to {location.pathname.startsWith("/ar") ? "English" : "العربية"}
                    </Link>
                  </div>

                  {/* CTAs */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, delay: 0.35 }}
                    className="space-y-2.5 pt-2"
                  >
                    <Link to="/contact" className="block">
                      <Button variant="outline" className="w-full rounded-full font-display font-semibold text-sm h-12">
                        Book Free Call
                      </Button>
                    </Link>
                    <Link to="/get-proposal" className="block">
                      <Button className="w-full rounded-full font-display font-bold text-sm h-12 btn-glow">
                        Get Free Proposal →
                      </Button>
                    </Link>
                  </motion.div>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
