import { Link } from "react-router-dom";

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

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30">
      {/* CTA Banner */}
      <div className="container mx-auto px-4 py-16">
        <div className="rounded-2xl glass p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 mesh-gradient opacity-40" />
          <div className="relative z-10">
            <h2 className="font-display font-bold text-2xl md:text-4xl text-foreground mb-3">
              Ready to Scale Your <span className="text-gradient">Digital Presence</span>?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6 text-sm">
              Let's craft a strategy that drives measurable results for your business across India and the Middle East.
            </p>
            <Link
              to="/get-proposal"
              className="inline-flex items-center justify-center h-11 px-8 rounded-full bg-primary text-primary-foreground font-display font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Start Your Project →
            </Link>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="font-display font-bold text-primary text-[10px]">DP</span>
            </div>
            <span className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Digital Penta. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
