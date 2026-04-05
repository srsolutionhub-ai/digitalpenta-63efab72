

## Fix Critical Bug + Page Transitions + AI-Generated Premium Images

### Testing Results

**Critical Bug Found**: All homepage sections between Hero and Footer (Partners, Stats, Services, WhyUs, Process, CaseStudies, Industries, Testimonials, BlogPreview) are collapsing to zero height on both desktop and mobile. 

**Root Cause**: The `.cv-auto` CSS class uses `content-visibility: auto` which skips rendering off-screen elements. Combined with Motion's `initial={{ opacity: 0 }}` on all children, the browser calculates zero intrinsic height for these sections, causing them to collapse despite `contain-intrinsic-size: auto 600px`. The `auto` keyword in `contain-intrinsic-size` means "use the last rendered size", but since these sections never render initially, they start at 0.

**Other observations**: Hero renders correctly with left-aligned oversized typography and geometric orbit illustration on desktop, hidden on mobile. Footer CTA banner and floating CTA both work. Mobile hero layout is clean at 375px.

---

### Plan

**1. Fix Section Collapse Bug (Critical)**
- Remove `cv-auto` class from ALL section components: `ServicesSection`, `WhyUsSection`, `ProcessSection`, `CaseStudiesSection`, `IndustriesSection`, `TestimonialsSection`, `BlogPreviewSection`, `StatsSection`, `Footer`
- Delete the `.cv-auto` CSS rule from `src/index.css`
- This restores all sections to their correct rendered height

**2. Add Page Transition Animations**
- Create `src/components/layout/PageTransition.tsx` component using Motion's `AnimatePresence` and `motion.div`
- Wrap route content with fade + subtle slide transition (opacity 0→1, y 12→0)
- Update `src/App.tsx` to use `AnimatePresence` with `useLocation()` key
- Transition duration: 300ms for snappy feel

**3. Generate Premium AI Images**
Using the AI image generation gateway, create the following images and save to `public/images/`:

- **Hero background**: Abstract dark geometric pattern with violet/cyan accents, circuit-board nodes
- **Service cards** (5 images): One per pillar — Digital Marketing chart visualization, PR megaphone/media waves, Development code/screen, AI neural network, Automation workflow gears
- **Case study cards** (4 images): Abstract data visualization backgrounds matching each case study's color theme
- **About page team**: Professional team workspace/office environment image
- **Blog card headers** (3 images): AI/tech themed, SEO analytics dashboard, marketing automation visuals

Total: ~15 images, all dark-themed to match the site's Deep Space Black aesthetic.

**4. Integrate Generated Images**
- Update `HeroSection.tsx` to use hero background image
- Update `ServicesSection.tsx` card backgrounds
- Update `CaseStudiesSection.tsx` image areas
- Update `BlogPreviewSection.tsx` card headers  
- Update `About.tsx` team section
- All images loaded with `loading="lazy"` except hero (eager)

### Files to Create
- `src/components/layout/PageTransition.tsx`
- `public/images/` — ~15 AI-generated images

### Files to Edit
- `src/index.css` — remove `.cv-auto` rule
- `src/components/sections/ServicesSection.tsx` — remove `cv-auto`, add images
- `src/components/sections/WhyUsSection.tsx` — remove `cv-auto`
- `src/components/sections/ProcessSection.tsx` — remove `cv-auto`
- `src/components/sections/CaseStudiesSection.tsx` — remove `cv-auto`, add images
- `src/components/sections/TestimonialsSection.tsx` — remove `cv-auto`
- `src/components/sections/BlogPreviewSection.tsx` — remove `cv-auto`, add images
- `src/components/sections/StatsSection.tsx` — remove `cv-auto`
- `src/components/sections/IndustriesSection.tsx` — remove `cv-auto`
- `src/components/layout/Footer.tsx` — remove `cv-auto`
- `src/components/sections/HeroSection.tsx` — add background image
- `src/App.tsx` — add AnimatePresence page transitions
- `src/pages/About.tsx` — add team image

### Execution Order
1. Fix the critical `cv-auto` collapse bug (all sections)
2. Add page transition animation component + integrate in App.tsx
3. Generate AI images (hero, services, case studies, blog, about)
4. Integrate images into components
5. Test end-to-end

