## Platform Alignment & Quality Upgrade Plan

Based on the master build document, the platform has all major features implemented but needs alignment with the exact brand specifications, content, and several functional gaps. This plan addresses every deviation.

---

### 1. Brand Color Alignment

Update CSS custom properties in `src/index.css` to match the document's exact brand colors:

- Primary purple: `#6C3BF5` (currently close but verify HSL values)
- Teal accent: `#00D4AA` (document says this, not `#00D4FF`)
- Dark BG: `#1A1A2E` (currently `225 60% 6%` which is `#0A0F1A` — needs correction)
- Mid Dark: `#2D2D5E`
- Warning Orange: `#FF6B35`
- Success Green: `#00C853`

### 2. Contact Info & Domain Corrections

Update across all files (`Footer.tsx`, `Contact.tsx`, `index.html`, WhatsApp float, schemas):

- Phone: `+91-88601-00039`
- Email: `support@digitalpenta.com`
- Address:  `Corporate Office -  Delhi, India`
- Facebook: `facebook.com/digitalpenta`
- Domain: Change all `digitalpenta.com` references to `digitalpenta.com`
- Organization schema telephone: update from `+91-XXXXXXXXXX`

### 3. Hero Section Content Update

In `HeroSection.tsx`:

- H1: "India's Most Results-Driven Digital Marketing Agency"
- Rotating subtext: "For Real Estate | For Healthcare | For Ecommerce | For SaaS"
- CTAs: "Get Free Audit" (primary) + "See Our Results" (ghost)
- Counters: "100+ Clients | ₹10Cr+ Revenue | 95% Retention | 5 Years"

### 4. Homepage Meta & Schema Updates

In `index.html`:

- Meta description: per document spec mentioning "Delhi's top digital marketing agency"
- Add `LocalBusiness` JSON-LD schema with actual address/phone
- Update canonical and OG URLs to `digitalpenta.com`

### 5. FAQ Section Content Alignment

Update `FAQSection.tsx` to use the document's 8 exact questions:

1. How much does digital marketing cost in India?
2. How long does SEO take to show results?
3. Do you work with clients in Dubai and UAE?
4. What makes Digital Penta different from other agencies?
5. Do you offer performance-based pricing?
6. Can I see a live demo of your client dashboard?
7. Which industries do you specialize in?
8. How do I get started with Digital Penta?

Update the FAQ schema in `index.html` to match.

### 6. Testimonials Auto-Carousel

Upgrade `TestimonialsSection.tsx`:

- Add Embla carousel (already installed) for auto-scrolling on mobile
- Video review placeholder card with play button overlay
- Staggered star rating animation on scroll-in

### 7. Forms → Supabase Integration

**Contact.tsx**: Ensure form data saves to `contacts` table with proper fields (name, email, phone, company, service, message, budget_range, source="Website Contact Form"). Add inline validation with shake animation on error, green checkmark on valid blur.

**GetProposal.tsx**: Save to `leads` table on submit. Add CSS confetti on success. Honeypot field on both forms.

### 8. WhatsApp Pre-filled Message

Update `whatsapp-float.tsx` to use:

- Phone: `918860100039`
- Pre-filled: "Hi Digital Penta, I'd like to discuss my project"

### 9. Service Page Title/Meta Format

Update `ServiceCategory.tsx` and `SubServicePage.tsx` document titles to follow:

- Format: `[Service] Agency in Delhi | Digital Penta | 2026`

### 10. Trust Strip Below Hero

Add a trust strip component below HeroSection showing:
"★★★★★ 4.9 Google Rating | 500+ Clients Served | ₹50Cr+ Revenue Generated | Google Partner | Delhi Based, Globally Trusted"

---

### Files to Edit


| File                                              | Changes                                        |
| ------------------------------------------------- | ---------------------------------------------- |
| `src/index.css`                                   | Brand color alignment                          |
| `index.html`                                      | Domain, meta, LocalBusiness schema, FAQ schema |
| `src/components/sections/HeroSection.tsx`         | H1, subtexts, CTAs, counters                   |
| `src/components/sections/FAQSection.tsx`          | 8 document-specified questions                 |
| `src/components/sections/TestimonialsSection.tsx` | Embla carousel, video card                     |
| `src/components/layout/Footer.tsx`                | Contact info, domain                           |
| `src/pages/Contact.tsx`                           | Supabase insert, validation, honeypot          |
| `src/pages/GetProposal.tsx`                       | Supabase insert, confetti, honeypot            |
| `src/components/ui/whatsapp-float.tsx`            | Phone number, pre-filled message               |
| `src/pages/ServiceCategory.tsx`                   | Title format                                   |
| `src/pages/SubServicePage.tsx`                    | Title format                                   |
| `src/pages/Index.tsx`                             | Add trust strip                                |
| `src/components/sections/PartnersSection.tsx`     | Trust strip content                            |


### Execution Order

1. Brand colors + domain corrections (global foundation)
2. Hero content + trust strip + FAQ alignment
3. Forms → Supabase integration with validation
4. Testimonials carousel upgrade
5. WhatsApp + contact info updates
6. Service page meta format
7. Build verification + QA