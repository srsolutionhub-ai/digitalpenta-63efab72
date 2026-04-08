

## Premium Website Upgrade — Full Page Redesign + Google Calendar Integration

### Testing Results Summary
- **Homepage**: All sections render correctly (Hero, Partners, Stats, Services, Process, WhyUs bento, Case Studies, Testimonials, Pricing, FAQ, Blog Preview, Footer CTA). Announce bar marquee scrolls. Text switcher animates. Floating badges visible. WhatsApp float appears. Lead capture bar shows after delay.
- **Mobile (375px)**: Hero stacks properly, mobile sticky bar visible, hamburger menu works. All sections responsive.
- **Page transitions**: AnimatePresence working between routes. Lazy loading with Suspense fallback operational.
- **About page**: Basic — has mission/vision, team grid with initials, timeline, offices. Missing: core values, agency story narrative, awards, stats counter, CTA sections, premium visuals.
- **Contact page**: Basic form (Name, Email, Phone, Company, Service dropdown, Message). Missing: Budget Range dropdown, Google Maps placeholder, Google Calendar booking, better visual design.
- **Portfolio/Blog**: Functional but plain — gradient-only card headers, no images, no hover animations beyond basic scale.

### What This Plan Delivers

**1. About Page — Complete Premium Redesign**
- Hero with animated stats counter (500+ clients, 3X ROI, 50+ team, 8+ countries)
- "Our Story" narrative section with large ghosted year watermarks
- Core Values section (5 values = Penta theme) in staggered bento grid
- Enhanced team section with hover flip cards showing role details
- Awards & certifications strip (Google Partner, Meta Partner, HubSpot, etc.)
- Full-width CTA banner matching homepage style
- SEO meta: H1 "About Digital Penta — India's Leading Digital Marketing Agency"

**2. Contact Page — Full Upgrade + Google Calendar**
- Expanded form: Name, Email, Phone, Company, Service Interest dropdown, Budget Range dropdown (₹50K-1L, ₹1L-3L, ₹3L-5L, ₹5L+), Message
- Google Calendar embed: iframe placeholder for Calendly-style booking (uses Google Calendar appointment scheduling URL pattern)
- Google Maps embed placeholder (iframe with Delhi HQ coordinates)
- Office cards with click-to-call, click-to-email
- WhatsApp direct chat card with QR code SVG
- Trust signals below form (response time, no spam guarantee)
- SEO meta: H1 "Contact Digital Penta — Book a Free Strategy Call"

**3. Portfolio Page — Premium Upgrade**
- Add hover overlay with project description + metrics
- Add motion staggered entrance for cards
- Add "View Case Study" CTA overlay on hover
- Upgrade gradient headers with abstract SVG data-viz patterns

**4. Blog Page — Premium Upgrade**
- Add SVG pattern headers per category (different pattern for AI vs SEO vs Marketing)
- Add reading time badges and author avatars
- Featured article card with larger hero image area

**5. Service Category Pages — Premium Upgrade**
- Add animated process timeline (reuse ProcessSection style)
- Add results stats counter per service category
- Upgrade sub-service cards with icon + hover effects
- Add "Related Case Studies" section at bottom

**6. Homepage Minor Polish**
- Fix text switcher alignment (currently text shifts around "Paid Ads" in paragraph)
- Add subtle hover glow effect to case study cards
- Ensure all section transitions feel smooth

### Technical Details

**Google Calendar Integration**
- Use Google Calendar's appointment scheduling feature via iframe embed
- URL pattern: `https://calendar.google.com/calendar/appointments/schedules/...`
- For now, implement as a styled placeholder with a "Book via Google Calendar" button linking to a configurable URL
- No backend/API key needed — purely client-side link/embed

**Files to Create**
- None — all files exist, just need substantial rewrites

**Files to Edit**
- `src/pages/About.tsx` — complete rewrite with premium sections
- `src/pages/Contact.tsx` — full form upgrade + calendar + maps
- `src/pages/Portfolio.tsx` — motion animations + hover overlays
- `src/pages/Blog.tsx` — SVG headers + polish
- `src/pages/ServiceCategory.tsx` — process timeline + results section
- `src/components/sections/HeroSection.tsx` — fix text switcher alignment
- `index.html` — add page-specific meta tag support preparation

### Execution Order
1. About page complete rewrite (core values, story, awards, team upgrade)
2. Contact page full upgrade (budget dropdown, maps, calendar, WhatsApp QR)
3. Portfolio page premium polish (motion, overlays, SVG art)
4. Blog page visual upgrade (headers, avatars)
5. Service category pages upgrade (timeline, stats, related work)
6. Homepage minor fixes (text switcher, hover effects)
7. Build verification

