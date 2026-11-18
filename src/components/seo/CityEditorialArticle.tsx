import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const articles = import.meta.glob<string>("../../data/cityArticles/*.md", {
  query: "?raw",
  import: "default",
});

export default function CityEditorialArticle({ citySlug, city }: { citySlug: string; city: string }) {
  const [content, setContent] = useState<string>();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const loader = articles[`../../data/cityArticles/${citySlug}.md`];

  useEffect(() => {
    let cancelled = false;
    setContent(undefined);
    setFailed(false);
    if (loader) {
      loader().then((text) => { if (!cancelled) setContent(text); })
        .catch(() => { if (!cancelled) setFailed(true); });
    }
    return () => { cancelled = true; };
  }, [loader, attempt]);

  if (!loader) return null;
  if (!content) return (
    <section className="container mx-auto max-w-4xl px-4 py-12" aria-busy={!failed}>
      {failed ? <Button variant="outline" onClick={() => setAttempt((value) => value + 1)}>
        <RotateCcw className="mr-2 size-4" /> Retry article
      </Button> : <p role="status" className="text-muted-foreground">Loading {city} business guide…</p>}
    </section>
  );

  const headings = [...content.matchAll(/^## (.+)$/gm)].map((match, index) => ({ label: match[1], id: `city-guide-${index}` }));
  let headingIndex = 0;

  return (
    <section className="border-t border-border/30 py-16" aria-label={`${city} business guide`} data-city-editorial>
      <div className="container mx-auto max-w-4xl px-4">
        <nav aria-label={`${city} guide contents`} className="mb-12 border-y border-border/30 py-6">
          <p className="mb-4 font-display font-semibold text-foreground">In this guide</p>
          <ol className="grid gap-x-8 gap-y-3 md:grid-cols-2">
            {headings.map((heading) => <li key={heading.id}>
              <a href={`#${heading.id}`} className="block text-sm leading-relaxed text-muted-foreground underline-offset-4 hover:text-primary hover:underline focus-visible:outline-primary">{heading.label}</a>
            </li>)}
          </ol>
        </nav>
        <article className="prose prose-invert max-w-none prose-headings:font-display prose-headings:text-foreground prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-a:text-primary prose-strong:text-foreground [overflow-wrap:anywhere]">
          <ReactMarkdown components={{
            h1: ({ children }) => <h2 className="mb-6 text-2xl md:text-3xl">{children}</h2>,
            h2: ({ children }) => <h3 id={`city-guide-${headingIndex++}`} className="scroll-mt-28 mt-12 text-xl md:text-2xl">{children}</h3>,
            h3: ({ children }) => <h4 className="mt-8 text-lg">{children}</h4>,
            a: ({ href, children }) => <a href={href} target={href?.startsWith("https://") ? "_blank" : undefined} rel={href?.startsWith("https://") ? "noopener noreferrer" : undefined}>{children}</a>,
          }}>{content}</ReactMarkdown>
        </article>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-border/30 pt-8">
          <p className="max-w-md text-muted-foreground">Discuss your {city} business requirements and the next practical step.</p>
          <Button asChild className="h-auto min-h-11 whitespace-normal py-3">
            <Link to={`/get-proposal?city=${encodeURIComponent(citySlug)}`}>Request a proposal <ArrowRight className="ml-2 size-4 shrink-0" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}