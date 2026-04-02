import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Search, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";

const popularLinks = [
  { label: "Digital Marketing", href: "/services/digital-marketing" },
  { label: "AI Solutions", href: "/services/ai-solutions" },
  { label: "Development", href: "/services/development" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Contact Us", href: "/contact" },
  { label: "Get a Proposal", href: "/get-proposal" },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <section className="pt-32 pb-20 min-h-[80vh] flex items-center relative">
        <div className="absolute inset-0 mesh-gradient opacity-40" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1
            className="font-display font-extrabold text-gradient leading-none mb-6"
            style={{ fontSize: "clamp(6rem, 15vw, 14rem)" }}
          >
            404
          </h1>
          <p className="font-display font-bold text-xl md:text-2xl text-foreground mb-3">
            Page Not Found
          </p>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>

          <div className="max-w-md mx-auto mb-12">
            <div className="flex items-center gap-2 rounded-full glass border border-border/30 px-5 py-3">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for a service, page, or topic..."
                className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">Popular Pages</p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularLinks.map(l => (
                <Link
                  key={l.href}
                  to={l.href}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full glass border border-border/30 text-xs font-display font-medium text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all"
                >
                  {l.label} <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>

          <Link to="/" className="inline-block mt-10 text-primary font-display font-semibold text-sm hover:text-foreground transition-colors">
            ← Return to Home
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
