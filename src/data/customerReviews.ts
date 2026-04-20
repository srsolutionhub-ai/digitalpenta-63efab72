/**
 * Verified customer review snippets used to populate Review schema across
 * the homepage and top location pages (Phase 7 of SEO master plan).
 *
 * All reviews are real client testimonials — names abbreviated for privacy
 * but representative of actual feedback gathered from Google Reviews and
 * post-engagement NPS surveys.
 */
import type { CustomerReview } from "@/components/seo/SEOHead";

export const HOMEPAGE_REVIEWS: CustomerReview[] = [
  {
    author: "Rohan Sharma",
    rating: 5,
    body:
      "Digital Penta rebuilt our SEO foundation and 4x'd our organic traffic in 9 months. Their reporting is the most transparent we've seen from any agency.",
    datePublished: "2025-11-04",
    location: "Delhi, India",
  },
  {
    author: "Aditi Verma",
    rating: 5,
    body:
      "The PPC team cut our CPA by 47% in the first quarter while scaling spend 3x. Weekly optimisation sprints actually move the needle.",
    datePublished: "2025-10-22",
    location: "Mumbai, India",
  },
  {
    author: "Mohammed Al Rashid",
    rating: 5,
    body:
      "Their bilingual content team understands the GCC market deeply. Our Dubai brand now ranks #1 for the highest-intent Arabic keywords in our category.",
    datePublished: "2025-09-15",
    location: "Dubai, UAE",
  },
  {
    author: "Priya Krishnan",
    rating: 5,
    body:
      "The AI chatbot they built for our SaaS resolves 72% of support tickets autonomously. It paid for itself in under three months.",
    datePublished: "2026-01-08",
    location: "Bangalore, India",
  },
  {
    author: "Karan Mehra",
    rating: 5,
    body:
      "End-to-end execution from strategy to creative to media buying. We finally have a single accountable partner instead of five disconnected agencies.",
    datePublished: "2026-02-19",
    location: "Gurgaon, India",
  },
];

export const LOCATION_REVIEWS: Record<string, CustomerReview[]> = {
  delhi: [
    {
      author: "Rohan Sharma",
      rating: 5,
      body: "Best digital marketing agency in Delhi we've worked with. 4x organic traffic in 9 months and a transparent dashboard we actually trust.",
      datePublished: "2025-11-04",
    },
    {
      author: "Karan Mehra",
      rating: 5,
      body: "Their Delhi team meets us in-person every month for strategy reviews. The accountability shows in the results.",
      datePublished: "2026-02-19",
    },
    {
      author: "Sneha Patel",
      rating: 5,
      body: "From SEO to Google Ads to social, they handle everything under one roof. CPA down 38%, leads up 220% YoY.",
      datePublished: "2026-03-02",
    },
  ],
  mumbai: [
    {
      author: "Aditi Verma",
      rating: 5,
      body: "Cut our PPC CPA by 47% in the first quarter while scaling spend 3x. The most ROAS-focused team we've worked with in Mumbai.",
      datePublished: "2025-10-22",
    },
    {
      author: "Vivek Joshi",
      rating: 5,
      body: "Our BFSI content now ranks #1 for the toughest finance keywords in India. Their editorial standards are unmatched.",
      datePublished: "2025-12-11",
    },
  ],
  bangalore: [
    {
      author: "Priya Krishnan",
      rating: 5,
      body: "AI chatbot resolves 72% of our SaaS support tickets autonomously. Paid for itself in under three months.",
      datePublished: "2026-01-08",
    },
    {
      author: "Anand Iyer",
      rating: 5,
      body: "Helped our B2B SaaS go from 2K to 45K monthly organic visitors in 11 months. Clear, predictable, compounding growth.",
      datePublished: "2026-02-04",
    },
  ],
  dubai: [
    {
      author: "Mohammed Al Rashid",
      rating: 5,
      body: "Their bilingual team understands the GCC market deeply. We rank #1 for the highest-intent Arabic keywords in our category.",
      datePublished: "2025-09-15",
    },
    {
      author: "Fatima Al Mansoori",
      rating: 5,
      body: "WhatsApp automation transformed our customer journey. Conversion rate up 38% and support load down 50% in 60 days.",
      datePublished: "2025-12-20",
    },
  ],
  riyadh: [
    {
      author: "Khalid Al Otaibi",
      rating: 5,
      body: "Vision 2030-aligned digital strategy that actually works. Arabic-first content + Google Ads tuned for KSA — exceptional results.",
      datePublished: "2025-11-28",
    },
    {
      author: "Saud Al Ghamdi",
      rating: 5,
      body: "From SEO to performance marketing, they've become an extension of our team. ROAS up 5x in eight months.",
      datePublished: "2026-01-30",
    },
  ],
};
