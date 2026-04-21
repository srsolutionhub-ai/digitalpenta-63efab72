/**
 * Internal-link graph builder (Phase 3 / Phase 8 supplement).
 *
 * Builds a contextual graph between:
 *   - /lp/{keyword}        — Tier-2/3 keyword landing pages
 *   - /:service/:city      — programmatic matrix pages
 *   - /services/{cat}/{s}  — service hub pages
 *   - /locations/{city}    — location hub pages
 *
 * Each node in the graph carries a `topic` (service category) and `geo`
 * (city slug) so we can surface highly relevant cross-links instead of
 * generic "explore more" placeholders. This dramatically lifts SEO topical
 * relevance and reduces bounce rate.
 *
 * Two query helpers are exposed:
 *   - getRelatedForLanding(slug)  — for /lp/ pages
 *   - getRelatedForMatrix(svc, city) — for /:svc/:city programmatic pages
 *
 * Both return ≤6 contextually relevant items deduped by URL.
 */

import { getAllKeywordLandings, type KeywordLandingData } from "@/data/keywordLandingData";
import { getAllMatrixPages, MATRIX_SERVICES } from "@/data/matrixData";

export interface GraphNode {
  url: string;
  title: string;
  desc: string;
  kind: "lp" | "matrix" | "service-hub" | "location";
  topic?: string;            // normalised service slug e.g. "seo"
  geo?: string;              // city slug e.g. "delhi"
}

/* Normalise free-text "SEO" / "PPC" / etc → matrix service slug. */
const SERVICE_NAME_TO_SLUG: Record<string, string> = {
  seo: "seo",
  "seo agency": "seo",
  "google ads": "ppc",
  "google ads agency": "ppc",
  ppc: "ppc",
  "performance marketing": "ppc",
  "social media": "social-media",
  "social media marketing": "social-media",
  "web development": "web-development",
  "shopify development": "web-development",
  "ai chatbot": "ai-solutions",
  "ai solutions": "ai-solutions",
};

function inferTopic(category: string): string | undefined {
  const norm = category.trim().toLowerCase();
  if (SERVICE_NAME_TO_SLUG[norm]) return SERVICE_NAME_TO_SLUG[norm];
  // Fallback: match against any matrix service slug or its name
  const bySlug = MATRIX_SERVICES.find(s => norm.includes(s.slug));
  if (bySlug) return bySlug.slug;
  const byName = MATRIX_SERVICES.find(s => norm.includes(s.name.toLowerCase()));
  return byName?.slug;
}

function inferGeo(city?: string): string | undefined {
  if (!city) return undefined;
  return city.trim().toLowerCase().replace(/\s+/g, "-");
}

/** Build the full graph once at module load. */
function buildGraph(): GraphNode[] {
  const nodes: GraphNode[] = [];

  // /lp/ landing pages
  for (const lp of getAllKeywordLandings()) {
    nodes.push({
      url: `/lp/${lp.slug}`,
      title: lp.primaryKeyword,
      desc: lp.heroSubhead.slice(0, 110),
      kind: "lp",
      topic: inferTopic(lp.serviceCategory) ?? inferTopic(lp.primaryKeyword),
      geo: inferGeo(lp.city),
    });
  }

  // /:service/:city matrix pages
  for (const m of getAllMatrixPages()) {
    nodes.push({
      url: `/${m.service.slug}/${m.city.slug}`,
      title: `${m.service.name} Agency in ${m.city.city}`,
      desc: `${m.service.longName} for ${m.city.city}'s top brands.`,
      kind: "matrix",
      topic: m.service.slug,
      geo: m.city.slug,
    });
  }

  // Service hubs
  for (const s of MATRIX_SERVICES) {
    nodes.push({
      url: s.hubHref,
      title: `${s.name} Services`,
      desc: `${s.longName} — ${s.metaIntent}.`,
      kind: "service-hub",
      topic: s.slug,
    });
  }

  // Location hubs (matrix cities only — already canonical)
  for (const m of getAllMatrixPages()) {
    const url = `/locations/${m.city.slug}`;
    if (!nodes.find(n => n.url === url)) {
      nodes.push({
        url,
        title: `Digital Marketing in ${m.city.city}`,
        desc: m.city.marketAngle,
        kind: "location",
        geo: m.city.slug,
      });
    }
  }

  return nodes;
}

const GRAPH = buildGraph();

/** Score a candidate against the source: same geo (+3), same topic (+2), other-kind (+1). */
function score(source: GraphNode, candidate: GraphNode): number {
  if (source.url === candidate.url) return -1;
  let s = 0;
  if (source.geo && candidate.geo === source.geo) s += 3;
  if (source.topic && candidate.topic === source.topic) s += 2;
  if (source.kind !== candidate.kind) s += 1;
  return s;
}

function topRelated(source: GraphNode, limit = 6): GraphNode[] {
  const ranked = GRAPH
    .map(c => ({ c, s: score(source, c) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map(x => x.c);

  // Dedupe by URL while preserving rank
  const seen = new Set<string>();
  const out: GraphNode[] = [];
  for (const n of ranked) {
    if (seen.has(n.url)) continue;
    seen.add(n.url);
    out.push(n);
    if (out.length >= limit) break;
  }
  return out;
}

/** Get contextual links for a /lp/{slug} page. */
export function getRelatedForLanding(lp: KeywordLandingData, limit = 6): GraphNode[] {
  const source: GraphNode = {
    url: `/lp/${lp.slug}`,
    title: lp.primaryKeyword,
    desc: lp.heroSubhead,
    kind: "lp",
    topic: inferTopic(lp.serviceCategory) ?? inferTopic(lp.primaryKeyword),
    geo: inferGeo(lp.city),
  };
  return topRelated(source, limit);
}

/** Get contextual links for a programmatic matrix page. */
export function getRelatedForMatrix(serviceSlug: string, citySlug: string, limit = 6): GraphNode[] {
  const source: GraphNode = {
    url: `/${serviceSlug}/${citySlug}`,
    title: `${serviceSlug}/${citySlug}`,
    desc: "",
    kind: "matrix",
    topic: serviceSlug,
    geo: citySlug,
  };
  return topRelated(source, limit);
}

export { GRAPH as INTERNAL_LINK_GRAPH };
