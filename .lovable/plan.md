

## Digital Penta — Premium "Living Website" Design Overhaul

### Problem
The current site looks like a typical AI-generated template: uniform card grids, no real imagery/graphics, no micro-interactions, no sense of life. It needs to feel like a breathing, premium, award-winning digital agency site.

### What Changes

**1. Add Motion library (formerly Framer Motion) — lightweight, performant animations**
- Install `motion` (~16KB gzipped, uses Web Animations API for GPU performance)
- Replace the custom `useScrollReveal` hook with Motion's `useInView` + `motion.div` for smoother, hardware-accelerated scroll animations
- Add page transition animations between routes

**2. Living Hero Section — "Breathing" Website Feel**
- Add animated floating particles/dots using pure CSS (no heavy library)
- Create a subtle "breathing" pulse animation on the gradient orbs (scale 1→1.05→1 loop)
- Add a typing/morphing text effect on the tagline using CSS only
- Animated gradient border that flows around the CTA button
- Staggered letter-by-letter reveal on the headline using Motion

**3. Premium SVG Graphics & Illustrations**
- Create custom inline SVG decorative elements: circuit-board patterns, connecting nodes, abstract geometric shapes
- Add animated SVG icons for each service pillar (subtle draw-on-scroll effect)
- Replace plain gradient image areas in Case Studies with abstract SVG art compositions
- Add a decorative "grid of dots" pattern as a section background element

**4. Premium Marquee Sections**
- Create a smooth infinite-scroll client logo marquee strip (CSS `animation: marquee`, no JS)
- Add a "tech stack" marquee showing tools/platforms (Tailwind already has the keyframe)
- Industries section becomes a horizontally scrolling marquee with gradient fade edges

**5. Stylish Card Upgrades**
- Services cards: Add animated gradient border on hover (CSS `background: conic-gradient` rotating)
- Case study cards: Add a "holographic" shimmer effect on hover
- Testimonial cards: Add subtle parallax tilt on mouse move (lightweight CSS `perspective` + JS)
- All cards get a subtle inner shadow/glow for depth
- WhyUs cards: Add animated number counters inside each card

**6. Premium Section Layouts**
- Stats section: Redesign as a full-width "ticker tape" with large numbers and a subtle horizontal scroll animation
- Add a "Partners & Certifications" horizontal logo bar between Hero and Stats
- Case Studies: Add horizontal scroll carousel on desktop (not just grid)
- New "Process" section with a connected timeline/steps visualization using SVG lines
- Blog cards get image placeholder areas with abstract gradient art

**7. Performance Optimization (Speed Focus)**
- Lazy load all below-fold sections using `React.lazy` + `Suspense`
- Add `loading="lazy"` to any future images
- Use CSS `content-visibility: auto` on heavy sections for rendering optimization
- Minimize JS: Replace heavy Radix components only used on specific pages with dynamic imports
- Add `will-change: transform` only during animations, remove after
- Optimize CSS: consolidate redundant utility classes
- Use `requestIdleCallback` for non-critical animations

**8. Mobile Responsive Polish**
- Hero: Stack layout, reduce font sizes with better `clamp()` values
- Cards: Single column with swipeable horizontal scroll on mobile
- Navbar mobile menu: Full-screen with staggered fade-in animation using Motion
- Stats: 2x2 grid on mobile with smaller text
- Touch-friendly: Increase tap targets to 44px minimum
- Remove hover-only effects on mobile, replace with tap states

**9. New Visual Components**
- `ParticleField` — CSS-only floating dots background (no canvas, no JS overhead)
- `GradientOrb` — Reusable animated gradient blob component
- `AnimatedCounter` — Upgrade existing with easing and scale effect
- `LogoMarquee` — Infinite scroll logo strip
- `ShimmerCard` — Card with holographic hover effect
- `FloatingCTA` — Sticky bottom CTA bar that appears on scroll

### Files to Create
- `src/components/ui/logo-marquee.tsx`
- `src/components/ui/particle-field.tsx`
- `src/components/ui/shimmer-card.tsx`
- `src/components/ui/floating-cta.tsx`
- `src/components/sections/PartnersSection.tsx`

### Files to Edit
- `package.json` — add `motion` dependency
- `src/index.css` — new premium animation keyframes, shimmer effects, breathing animations
- `tailwind.config.ts` — new keyframes for breathing, shimmer, rotate-gradient
- `src/components/sections/HeroSection.tsx` — particles, breathing orbs, letter reveal, animated CTA
- `src/components/sections/ServicesSection.tsx` — rotating gradient border cards, SVG icons
- `src/components/sections/StatsSection.tsx` — ticker tape redesign
- `src/components/sections/CaseStudiesSection.tsx` — shimmer cards, SVG art, horizontal scroll
- `src/components/sections/TestimonialsSection.tsx` — tilt effect, depth styling
- `src/components/sections/WhyUsSection.tsx` — animated icons, premium card design
- `src/components/sections/IndustriesSection.tsx` — marquee strip with fade edges
- `src/components/sections/BlogPreviewSection.tsx` — image areas, premium card borders
- `src/components/layout/Navbar.tsx` — Motion-powered mobile menu
- `src/components/layout/Layout.tsx` — add FloatingCTA, lazy loading
- `src/pages/Index.tsx` — add PartnersSection
- `src/hooks/useScrollReveal.ts` — upgrade with Motion's useInView

### Performance Budget
- Target: < 200KB JS gzipped total
- Motion library: ~16KB gzipped (uses WAAPI, off-main-thread)
- All new animations: CSS-only where possible (particles, marquee, breathing, shimmer)
- No Three.js, no Canvas, no heavy particle libraries
- Lazy load routes for Portfolio, Blog, Industry, Location pages

### Execution Order
1. Install Motion + update CSS/Tailwind with new premium keyframes
2. Create reusable premium components (ParticleField, LogoMarquee, ShimmerCard, FloatingCTA)
3. Redesign Hero with living animations + particles
4. Upgrade all homepage sections with premium cards, marquees, SVG graphics
5. Add PartnersSection + page lazy loading
6. Mobile responsive polish pass
7. Performance audit

