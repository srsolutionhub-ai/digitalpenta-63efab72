

## Multi-Feature Implementation Plan

### Overview
Four deliverables: (1) Cookie consent banner, (2) IndustryPage + LocationPage premium upgrade, (3) Free Website Audit lead-gen section, (4) Fix TestimonialsSection ref warning. Browser testing deferred to post-implementation.

---

### 1. Cookie Consent Banner (GDPR/DPDP)

**New file: `src/components/ui/cookie-consent.tsx`**
- Fixed bottom bar with glassmorphism styling matching existing LeadCaptureBar
- "Accept All" primary button, "Reject" outline button, "Privacy Policy" link to `/privacy`
- Persists choice in `localStorage` key `dp-cookie-consent`
- AnimatePresence slide-up entrance, dismissed on accept/reject
- Only shows if no prior consent stored

**Edit: `src/components/layout/Layout.tsx`**
- Import and add `<CookieConsent />` after `<LeadCaptureBar />`

---

### 2. IndustryPage + LocationPage Premium Upgrade

**Edit: `src/pages/IndustryPage.tsx`**
- Replace static sections with `motion.div` staggered reveals (same pattern as upgraded ServiceCategory)
- Wrap service cards in `MagneticCard` component
- Add ghosted watermark numbers on case study metric (text-foreground/[0.03] at 120px)
- Add gradient accent line on hero section
- Challenges cards: add numbered index badges (01, 02, 03...)
- Services cards: add shimmer-border on hover
- CTA section: add animated glow orbs (same as Footer CTA)

**Edit: `src/pages/LocationPage.tsx`**
- Same motion treatment: staggered section reveals
- Wrap office card and testimonial card in `MagneticCard`
- Add gradient top-border on testimonial card
- Services tags: animate in with stagger
- Add animated MapPin icon with pulse effect
- CTA section: glow orbs + gradient border

---

### 3. Free Website Audit Lead-Gen Section

**New file: `src/components/sections/WebsiteAuditSection.tsx`**

Multi-step smart lead capture flow:
1. **Step 1 — URL Input**: Large input field "Enter your website URL" + "Audit My Website Free" CTA button. Gradient-bordered card with magnetic hover.
2. **Step 2 — Scanning Animation**: After URL submit, show a simulated scanning UI with:
   - Rotating radar/scanner CSS animation (pure CSS, no Lottie dependency)
   - Progress bar filling over ~8 seconds with status text cycling: "Crawling pages...", "Analyzing SEO...", "Checking performance...", "Generating report..."
   - During this animation, a slide-in form appears: Name, Email, WhatsApp number fields with floating labels
   - "Send me the full report" button
3. **Step 3 — Mock Report Results**: After ~30 seconds (or when form is filled), display a mock audit card showing:
   - Overall Score (randomized 45-72 range to create urgency)
   - SEO Score, Performance, Accessibility, Best Practices gauges (circular progress rings)
   - 3-4 "Issues Found" items (generic but realistic: "Missing meta descriptions on 12 pages", "Images not optimized", etc.)
   - "Get Detailed Report + Action Plan" CTA linking to `/get-proposal`

**Data flow**: On form submit, insert into Supabase `contacts` table with source = "Website Audit Tool", including the URL in the message field.

**Edit: `src/pages/Index.tsx`**
- Import and add `<WebsiteAuditSection />` after `<CaseStudiesSection />` (before Testimonials)

---

### 4. Fix TestimonialsSection Ref Warning

**Edit: `src/components/sections/TestimonialsSection.tsx`**
- `TiltCard` is a function component receiving refs via `motion.div` parent — the console error is from passing ref to TiltCard itself
- Wrap `TiltCard` with `React.forwardRef` or remove the ref pass from the parent `motion.div`

---

### Files Summary

| Action | File |
|--------|------|
| Create | `src/components/ui/cookie-consent.tsx` |
| Create | `src/components/sections/WebsiteAuditSection.tsx` |
| Edit | `src/components/layout/Layout.tsx` |
| Edit | `src/pages/IndustryPage.tsx` |
| Edit | `src/pages/LocationPage.tsx` |
| Edit | `src/pages/Index.tsx` |
| Edit | `src/components/sections/TestimonialsSection.tsx` |

### Technical Notes
- Scanner animation uses CSS keyframes (`@keyframes scan-rotate`) — no external Lottie/animation library needed
- Circular score gauges use SVG `<circle>` with `stroke-dasharray` + `stroke-dashoffset` animated via CSS transitions
- Supabase insert uses existing `contacts` table with RLS allowing anonymous inserts
- All motion uses `framer-motion` (`motion/react`) consistent with existing codebase

