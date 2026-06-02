/**
 * Verifiable site metrics — the source of truth behind every hardcoded
 * "500+ clients", "₹10Cr+", "4.9★" stat shown on the homepage.
 *
 * Each metric ships with methodology + last-updated date so the tooltip
 * in StatsSection can render an auditable explanation.
 *
 * When the numbers change, edit ONLY this file. The /trust page will
 * source the same data in a future sprint so the org has one canonical
 * record.
 */

export type SiteMetric = {
  key: string;
  display: string;
  label: string;
  sub: string;
  methodology: string;
  updatedAt: string; // ISO date
};

export const SITE_METRICS: SiteMetric[] = [
  {
    key: "clients_served",
    display: "500+",
    label: "Clients Served",
    sub: "Across India & MENA",
    methodology:
      "Unique paying accounts onboarded since founding in 2019. Includes one-time projects (logo, single-campaign) + retainer accounts. Internal CRM count; counted once per parent brand.",
    updatedAt: "2026-05-01",
  },
  {
    key: "average_roi",
    display: "3X",
    label: "Average ROI Delivered",
    sub: "Across all campaigns",
    methodology:
      "Median (revenue attributed via GA4/Ads conversion) ÷ (gross media spend + fees) across 47 client campaigns that completed a full 6-month engagement in FY24–25. Excludes brand-only mandates and clients without conversion tracking.",
    updatedAt: "2026-04-15",
  },
  {
    key: "ad_budget",
    display: "₹10Cr+",
    label: "Ad Budget Managed",
    sub: "Google + Meta Ads",
    methodology:
      "Cumulative gross spend across all client Google Ads + Meta Ads accounts managed by Digital Penta from Jan 2022 through Mar 2026, reconciled monthly with platform invoices.",
    updatedAt: "2026-03-31",
  },
  {
    key: "retention",
    display: "98%",
    label: "Client Retention Rate",
    sub: "Year over year",
    methodology:
      "Retention = (retainer clients active at end of FY25 who were also active at start of FY25) ÷ (retainer clients active at start of FY25). One-off project clients are excluded.",
    updatedAt: "2026-04-01",
  },
];

export const getMetric = (key: string) => SITE_METRICS.find((m) => m.key === key);
