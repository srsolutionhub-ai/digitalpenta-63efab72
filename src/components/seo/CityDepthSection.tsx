import { Building2, IndianRupee, Target, HelpCircle } from "lucide-react";
import { getCityDepth } from "@/data/cityDepth";

interface Props {
  /** Location slug (e.g. "mumbai"). Renders nothing when no depth layer exists. */
  citySlug: string;
  city: string;
}

/**
 * CityDepthSection — unique, city-specific substance for priority markets.
 *
 * Pure presentation, no data fetching, no charts: renders only when the city
 * has a hand-written depth record so the perf budget stays intact.
 */
export default function CityDepthSection({ citySlug, city }: Props) {
  const depth = getCityDepth(citySlug);
  if (!depth) return null;

  return (
    <section className="py-20 border-t border-border/20" aria-labelledby="city-depth-heading">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2
          id="city-depth-heading"
          className="font-display font-bold text-2xl md:text-3xl text-foreground mb-6"
        >
          The <span className="text-gradient">{city} market</span>, as we actually see it
        </h2>

        <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
          {depth.marketNotes.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>

        {/* Micro-markets — hyperlocal relevance signals */}
        <div className="mt-10">
          <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" /> Business districts we work across in {city}
          </h3>
          <ul className="flex flex-wrap gap-2">
            {depth.districts.map((d) => (
              <li
                key={d}
                className="text-xs text-muted-foreground px-3 py-2 rounded-full glass border border-border/20"
              >
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/* Budget benchmarks */}
        <div className="mt-10">
          <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-primary" /> What campaigns typically cost in {city}
          </h3>
          <div className="overflow-x-auto rounded-2xl glass border border-border/20">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                Typical monthly digital marketing budget benchmarks in {city}
              </caption>
              <thead>
                <tr className="border-b border-border/20 text-xs uppercase tracking-wider text-muted-foreground">
                  <th scope="col" className="px-4 py-3 font-mono font-normal">Channel</th>
                  <th scope="col" className="px-4 py-3 font-mono font-normal">Typical monthly range</th>
                  <th scope="col" className="px-4 py-3 font-mono font-normal">Why</th>
                </tr>
              </thead>
              <tbody>
                {depth.budgets.map((b) => (
                  <tr key={b.channel} className="border-b border-border/10 last:border-0">
                    <th scope="row" className="px-4 py-3 font-display font-semibold text-foreground whitespace-nowrap">
                      {b.channel}
                    </th>
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">{b.range}</td>
                    <td className="px-4 py-3 text-muted-foreground text-[13px]">{b.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            Indicative ranges based on current auction pricing and competitive depth in {city}; your
            audit gives exact figures for your accounts.
          </p>
        </div>

        {/* SERP reality — the honest competitive read */}
        <div className="mt-10 card-premium p-6">
          <h3 className="font-display font-semibold text-lg text-foreground mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" /> What it takes to rank in {city}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{depth.serpReality}</p>
        </div>

        {/* City FAQs — long-tail + AEO capture */}
        <div className="mt-10">
          <h3 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary" /> {city} questions we get asked most
          </h3>
          <div className="space-y-3">
            {depth.faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl glass border border-border/20 p-5 open:border-primary/30 transition-colors"
              >
                <summary className="cursor-pointer list-none font-display font-semibold text-sm text-foreground marker:hidden">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
