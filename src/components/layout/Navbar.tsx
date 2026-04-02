import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Megaphone, Newspaper, Code2, Brain, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "Digital Marketing",
    href: "/services/digital-marketing",
    icon: Megaphone,
    color: "text-violet-400",
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
    title: "Public Relations",
    href: "/services/public-relations",
    icon: Newspaper,
    color: "text-cyan-400",
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
    title: "Development",
    href: "/services/development",
    icon: Code2,
    color: "text-emerald-400",
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
    title: "AI Solutions",
    href: "/services/ai-solutions",
    icon: Brain,
    color: "text-amber-400",
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
    title: "Automation",
    href: "/services/automation",
    icon: Zap,
    color: "text-orange-400",
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
  { title: "About", href: "/about" },
  { title: "Portfolio", href: "/portfolio" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-2xl shadow-xl shadow-background/30 border-b border-border/20"
          : "bg-transparent"
      }`}
    >
      {/* Glow line on scroll */}
      <div className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${scrolled ? "opacity-100" : "opacity-0"}`}>
        <div className="h-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </div>

      <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10">
            <span className="font-display font-extrabold text-primary text-sm">DP</span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-foreground">
            Digital<span className="text-gradient">Penta</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-display font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-card/40">
              Services <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`} />
            </button>

            {megaOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[800px]">
                <div className="bg-background/95 backdrop-blur-2xl rounded-2xl border border-border/30 shadow-2xl shadow-background/80 overflow-hidden">
                  <div className="grid grid-cols-6 gap-0">
                    <div className="col-span-4 grid grid-cols-3 gap-0 p-6">
                      {services.map((cat) => (
                        <div key={cat.title} className="mb-4">
                          <Link
                            to={cat.href}
                            className="flex items-center gap-2 font-display font-semibold text-sm text-foreground hover:text-primary transition-colors mb-2"
                          >
                            <cat.icon className={`w-4 h-4 ${cat.color}`} />
                            {cat.title}
                          </Link>
                          <ul className="space-y-0.5">
                            {cat.subs.map((s) => (
                              <li key={s.href}>
                                <Link
                                  to={s.href}
                                  className="text-xs text-muted-foreground hover:text-foreground transition-colors block py-0.5 pl-6"
                                >
                                  {s.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {/* CTA card */}
                    <div className="col-span-2 bg-card/40 border-l border-border/20 p-6 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-mono text-primary uppercase tracking-widest mb-2">Get Started</p>
                        <h3 className="font-display font-bold text-lg text-foreground mb-2">Need a custom strategy?</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Our experts craft tailored solutions across all five pillars — no cookie-cutter approaches.
                        </p>
                      </div>
                      <Link to="/get-proposal" className="inline-flex items-center gap-2 mt-4 text-sm text-primary font-display font-semibold hover:text-foreground transition-colors">
                        Get Free Proposal <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`px-4 py-2 text-sm font-display font-medium rounded-lg transition-colors ${
                location.pathname === l.href
                  ? "text-foreground bg-card/40"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              }`}
            >
              {l.title}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/get-proposal">
            <Button size="sm" className="font-display font-bold text-xs tracking-wide rounded-full px-7 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
              Get A Proposal
            </Button>
          </Link>
        </div>

        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-background/98 backdrop-blur-2xl z-40 overflow-y-auto">
          <nav className="container px-4 py-8 space-y-6">
            <div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-4">Services</p>
              <div className="space-y-1">
                {services.map((cat) => (
                  <Link
                    key={cat.href}
                    to={cat.href}
                    className="flex items-center gap-3 py-3 text-lg font-display font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    <cat.icon className={`w-5 h-5 ${cat.color}`} />
                    {cat.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="border-t border-border/30 pt-6 space-y-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  className="block py-3 text-lg font-display font-semibold text-foreground hover:text-primary transition-colors"
                >
                  {l.title}
                </Link>
              ))}
            </div>
            <Link to="/get-proposal" className="block pt-4">
              <Button className="w-full rounded-full font-display font-bold text-base py-6 shadow-lg shadow-primary/20">
                Get A Proposal
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
