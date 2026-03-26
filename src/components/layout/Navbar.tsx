import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    title: "Digital Marketing",
    href: "/services/digital-marketing",
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg shadow-background/50" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:border-primary/60 transition-colors">
            <span className="font-display font-bold text-primary text-sm">DP</span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-foreground">
            Digital<span className="text-gradient">Penta</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {/* Services Mega Menu */}
          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Services <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`} />
            </button>

            {megaOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[720px]">
                <div className="glass rounded-xl p-6 shadow-2xl shadow-background/80">
                  <div className="grid grid-cols-3 gap-6">
                    {services.map((cat) => (
                      <div key={cat.title}>
                        <Link
                          to={cat.href}
                          className="font-display font-semibold text-sm text-foreground hover:text-primary transition-colors"
                        >
                          {cat.title}
                        </Link>
                        <ul className="mt-2 space-y-1">
                          {cat.subs.map((s) => (
                            <li key={s.href}>
                              <Link
                                to={s.href}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors block py-0.5"
                              >
                                {s.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {navLinks.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname === l.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.title}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/get-proposal">
            <Button size="sm" className="font-display font-semibold text-xs tracking-wide rounded-full px-6 bg-primary hover:bg-primary/90">
              Get A Proposal
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-background/98 backdrop-blur-xl z-40 overflow-y-auto">
          <nav className="container px-4 py-8 space-y-6">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">Services</p>
              <div className="space-y-2">
                {services.map((cat) => (
                  <Link
                    key={cat.href}
                    to={cat.href}
                    className="block py-2 text-lg font-display font-semibold text-foreground"
                  >
                    {cat.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="border-t border-border pt-6 space-y-2">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  to={l.href}
                  className="block py-2 text-lg font-display font-semibold text-foreground"
                >
                  {l.title}
                </Link>
              ))}
            </div>
            <Link to="/get-proposal" className="block pt-4">
              <Button className="w-full rounded-full font-display font-semibold">
                Get A Proposal
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
