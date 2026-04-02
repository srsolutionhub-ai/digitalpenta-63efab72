import { Link } from "react-router-dom";
import { ArrowRight, Linkedin, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerSections = [
  {
    title: "Services",
    links: [
      { label: "Digital Marketing", href: "/services/digital-marketing" },
      { label: "Public Relations", href: "/services/public-relations" },
      { label: "Development", href: "/services/development" },
      { label: "AI Solutions", href: "/services/ai-solutions" },
      { label: "Automation", href: "/services/automation" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "Get a Proposal", href: "/get-proposal" },
    ],
  },
  {
    title: "Industries",
    links: [
      { label: "Real Estate", href: "/industries/real-estate" },
      { label: "Healthcare", href: "/industries/healthcare" },
      { label: "E-commerce", href: "/industries/ecommerce" },
      { label: "Finance", href: "/industries/finance" },
      { label: "SaaS", href: "/industries/saas" },
    ],
  },
  {
    title: "Locations",
    links: [
      { label: "Delhi, India", href: "/locations/delhi" },
      { label: "Dubai, UAE", href: "/locations/dubai" },
      { label: "Abu Dhabi, UAE", href: "/locations/abu-dhabi" },
      { label: "Riyadh, KSA", href: "/locations/riyadh" },
      { label: "Doha, Qatar", href: "/locations/doha" },
    ],
  },
];

const socials = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border/30">
      {/* Gradient separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* CTA Banner */}
      <div className="container mx-auto px-4 py-20">
        <div className="rounded-3xl glass border border-border/20 p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="relative z-10">
            <h2 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mb-4">
              Ready to Scale Your <span className="text-gradient">Digital Presence</span>?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-base">
              Let's craft a strategy that drives measurable results for your business across India and the Middle East.
            </p>
            <Link to="/get-proposal">
              <Button size="lg" className="rounded-full px-10 py-6 font-display font-bold text-base gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                Start Your Project <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Newsletter + Links */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-5 gap-12 mb-12">
          {/* Newsletter */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center border border-primary/20">
                <span className="font-display font-extrabold text-primary text-xs">DP</span>
              </div>
              <span className="font-display font-bold text-foreground">
                Digital<span className="text-gradient">Penta</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed mb-5">
              Five powers. One seamless force driving growth across India & the Middle East.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Your email" className="bg-secondary/40 border-border/30 text-xs h-9" />
              <Button size="sm" className="rounded-lg px-3 h-9 text-xs font-display font-semibold">
                Join
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-secondary/40 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all"
                >
                  <s.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-display font-semibold text-sm text-foreground mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border/20">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Digital Penta. All rights reserved.
          </span>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
