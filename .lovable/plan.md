

## Digital Penta — Premium Design Overhaul + Missing Pages + Animations

This plan covers four workstreams in priority order: premium design audit, scroll animations, new pages, and sub-service verification.

---

### Current Design Issues (Audit Findings)

After inspecting every page and researching 2026 award-winning agency sites, here are the problems:

1. **Hero is flat** — centered text with no visual anchor, no asymmetry, no visual hierarchy beyond gradient text. Looks AI-generated.
2. **All sections are structurally identical** — same padding, same centered layout, same card grid pattern. No visual rhythm or surprise.
3. **Cards lack depth** — glassmorphism is applied uniformly without layering or visual weight variation. No shadows, no gradient borders, no inner glow.
4. **No scroll animations** — everything appears instantly, creating a static feel.
5. **Typography is monotonous** — same sizes, same weights throughout. No oversized display type, no contrast between hero and body.
6. **No visual assets** — no illustrations, icons beyond Lucide, no decorative elements. Pure text + rectangles.
7. **Color usage is timid** — accents barely visible. Gradient text is the only color moment.
8. **Missing pages** — Portfolio, Blog, Industry pages, Location pages all route to 404.

---

### Design Upgrades (Inspired by 2026 Trends)

Based on web research of award-winning dark agency sites (Bento grids, kinetic typography, glassmorphism 2.0, archival index aesthetic):

**1. Reusable Animation Hook — `useScrollReveal`**
- Custom hook using IntersectionObserver
- Applies staggered fade-up + scale animations to children
- Used across ALL sections site-wide
- Configurable threshold, delay, and direction

**2. Homepage Redesign**
- **Hero**: Left-aligned layout with oversized display text (clamp 4rem-7rem), animated gradient orb behind headline, staggered text reveal on load, trust logos as real brand marks instead of numbered circles
- **Stats**: Horizontal divider-style with larger numbers, subtle count-up animation already exists — add a slight scale effect
- **Services**: Bento grid layout (2 large + 3 small) instead of uniform 3-col grid, each card gets a unique icon glow color, hover reveals a micro-preview
- **Why Us**: Alternating layout — 3 cards left, 3 cards right with a center divider line
- **Case Studies**: Full-width cards with image placeholder area (gradient fill), metric overlay with large display numbers, horizontal scroll on mobile
- **Testimonials**: Large quote card featured + smaller supporting quotes, not uniform masonry
- **Blog Preview**: Card with gradient top border accent, reading time badge
- **Industries**: Larger pills with subtle icon, remove duplicate entries

**3. Navbar Upgrade**
- Add subtle bottom border glow line on scroll
- Mega menu gets category icons and a featured CTA card in the right column
- Mobile menu: full-screen with staggered entrance animation

**4. Footer Upgrade**  
- Add newsletter signup input
- Social media icon links
- Subtle gradient line separator

---

### New Pages

**5. Portfolio Page** (`/portfolio`)
- Filterable grid by service category (Marketing, PR, Dev, AI, Automation)
- Project cards with gradient overlay, client name, metrics badge
- Hover reveals project summary
- 8-10 placeholder case studies with realistic data

**6. Blog Listing Page** (`/blog`)
- Featured post hero card at top
- Grid of article cards with category tags, reading time, date
- Category filter tabs
- 6-8 placeholder articles

**7. Blog Article Template** (`/blog/:slug`)
- Full-width hero with title, author, date, reading time
- Prose-styled article body with proper typography
- Related articles sidebar or bottom section
- Share buttons, table of contents

**8. Industry Pages** (`/industries/:industry`) — 7 pages
- Real Estate, Healthcare, Education, E-commerce, Finance, Hospitality, SaaS
- Each with: hero, industry challenges, services we offer for this industry, case study highlight, CTA
- Templated component with data-driven content

**9. Location Pages** (`/locations/:location`) — 5 pages
- Delhi, Dubai, Abu Dhabi, Riyadh, Doha
- Each with: city hero, services available, local office info, region-specific testimonial, CTA
- Templated component with data-driven content

**10. Privacy Policy & Terms pages**
- Clean prose-styled legal content

**11. Custom 404 Page**
- Large "404" display text with gradient
- Search bar + popular links + back to home

---

### Technical Approach

**Files to create:**
- `src/hooks/useScrollReveal.ts` — reusable Intersection Observer hook
- `src/pages/Portfolio.tsx`
- `src/pages/Blog.tsx`
- `src/pages/BlogArticle.tsx`
- `src/pages/IndustryPage.tsx` + `src/data/industryData.ts`
- `src/pages/LocationPage.tsx` + `src/data/locationData.ts`
- `src/pages/Privacy.tsx`
- `src/pages/Terms.tsx`

**Files to heavily edit:**
- `src/components/sections/HeroSection.tsx` — left-aligned, oversized type, animated orbs, staggered reveal
- `src/components/sections/ServicesSection.tsx` — bento grid layout
- `src/components/sections/CaseStudiesSection.tsx` — full-width cards with image areas
- `src/components/sections/TestimonialsSection.tsx` — featured quote layout
- `src/components/sections/WhyUsSection.tsx` — alternating layout
- `src/components/sections/BlogPreviewSection.tsx` — gradient border cards
- `src/components/sections/IndustriesSection.tsx` — fix duplicates, add icons
- `src/components/sections/StatsSection.tsx` — larger display numbers
- `src/components/layout/Navbar.tsx` — glow border, enhanced mega menu
- `src/components/layout/Footer.tsx` — newsletter, socials
- `src/pages/NotFound.tsx` — custom 404 design
- `src/pages/SubServicePage.tsx` — add scroll animations
- `src/pages/ServiceCategory.tsx` — add scroll animations
- `src/pages/About.tsx` — add scroll animations, visual polish
- `src/pages/Contact.tsx` — add scroll animations
- `src/pages/GetProposal.tsx` — add scroll animations
- `src/App.tsx` — add new routes
- `src/index.css` — enhanced utility classes
- `tailwind.config.ts` — new animation keyframes

**No new dependencies needed** — all animations via CSS + IntersectionObserver. The existing stack (React, Tailwind, Lucide, shadcn/ui) is sufficient.

---

### Execution Order

1. Create `useScrollReveal` hook + update CSS/Tailwind config with new animation utilities
2. Redesign Homepage sections (Hero, Services bento, Case Studies, Testimonials, Why Us, Blog Preview, Industries, Stats)
3. Upgrade Navbar + Footer
4. Add scroll animations to all existing pages (About, Contact, GetProposal, ServiceCategory, SubServicePage)
5. Build Portfolio page
6. Build Blog listing + article template
7. Build Industry pages (7) with data file
8. Build Location pages (5) with data file
9. Build Privacy, Terms, custom 404
10. Update App.tsx routes

