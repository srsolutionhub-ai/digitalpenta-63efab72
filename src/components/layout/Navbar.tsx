import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Megaphone, Newspaper, Code2, Brain, Zap, ArrowRight, Phone } from "lucide-react";
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
  const location = useLocation();
  const [lastY, setLastY] = useState(0);

  const onScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 20);
    if (y > 200) {
      setHidden(y > lastY && y - lastY > 5);
    } else {
      setHidden(false);
    }
    setLastY(y);
  }, [lastY]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <AnnounceBar />
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
          hidden && !mobileOpen ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled
            ? "bg-background/70 backdrop-blur-3xl shadow-2xl shadow-background/40 border-b border-border/10"
            : "bg-transparent"
        }`}
      >
        <div className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-0"}`}>
          <div className="h-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="Digital Penta logo" width={36} height={36} decoding="async" className="w-9 h-9 object-contain" />
            <span className="font-display font-bold text-lg tracking-tight text-foreground">
              Digital<span className="text-gradient">Penta</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-display font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-card/40">
                Services <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[800px]"
                  >
                    <div className="bg-background/95 backdrop-blur-3xl rounded-2xl border border-border/20 shadow-2xl shadow-primary/5 overflow-hidden">
                      <div className="grid grid-cols-6 gap-0">
                        <div className="col-span-4 grid grid-cols-3 gap-0 p-6">
                          {services.map((cat) => (
                            <div key={cat.title} className="mb-4">
                              <Link
                                to={cat.href}
                                className="flex items-center gap-2 font-display font-semibold text-sm text-foreground hover:text-primary transition-colors mb-2 group"
                              >
                                <span className="p-1 rounded-md bg-muted/50 group-hover:bg-primary/10 transition-colors">
                                  <cat.icon className={`w-3.5 h-3.5 ${cat.color}`} />
                                </span>
                                {cat.title}
                              </Link>
                              <ul className="space-y-0.5">
                                {cat.subs.map((s) => (
                                  <li key={s.href}>
                                    <Link to={s.href} className="text-xs text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all block py-0.5 pl-7">
                                      {s.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className="col-span-2 bg-gradient-to-b from-primary/5 to-accent/5 border-l border-border/10 p-6 flex flex-col justify-between">
                          <div>
                            <p className="text-xs font-mono text-primary uppercase tracking-widest mb-2">Get Started</p>
                            <h3 className="font-display font-bold text-lg text-foreground mb-2">Need a custom strategy?</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Our experts craft tailored solutions across all five pillars — no cookie-cutter approaches.
                            </p>
                          </div>
                          <Link to="/get-proposal" className="inline-flex items-center gap-2 mt-4 text-sm text-primary font-display font-semibold hover:text-foreground transition-colors group">
                            Get Free Proposal <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className={`relative px-4 py-2 text-sm font-display font-medium rounded-lg transition-colors ${
                  location.pathname === l.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/40"
                }`}
              >
                {l.title}
                {location.pathname === l.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:+918860100039" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono">
              <Phone className="w-3.5 h-3.5" />
              +91-88601-00039
            </a>
            <div className="w-px h-5 bg-border/50" />
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

          <button
            className="lg:hidden p-2 text-foreground relative z-50"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Bottom Sheet */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="lg:hidden fixed inset-0 top-16 bg-background/60 backdrop-blur-sm z-30"
                onClick={() => setMobileOpen(false)}
              />
              {/* Bottom sheet */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 100) setMobileOpen(false);
                }}
                className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border/30 rounded-t-3xl overflow-y-auto"
                style={{ maxHeight: "65vh" }}
              >
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-10 h-1 rounded-full bg-border/60" />
                </div>

                <nav className="px-6 pb-8 space-y-5">
                  <div>
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">Services</p>
                    <div className="space-y-1">
                      {services.map((cat, i) => (
                        <motion.div
                          key={cat.href}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.04 }}
                        >
                          <Link
                            to={cat.href}
                            className="flex items-center gap-3 py-2.5 text-base font-display font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            <span className="p-1.5 rounded-lg bg-muted/50">
                              <cat.icon className={`w-4 h-4 ${cat.color}`} />
                            </span>
                            {cat.title}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-border/30 pt-4 space-y-1">
                    {navLinks.map((l, i) => (
                      <motion.div
                        key={l.href}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 + i * 0.04 }}
                      >
                        <Link
                          to={l.href}
                          className="block py-2.5 text-base font-display font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {l.title}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <Link to="/get-proposal" className="block pt-2">
                      <Button className="w-full rounded-full font-display font-bold text-base py-6">
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
