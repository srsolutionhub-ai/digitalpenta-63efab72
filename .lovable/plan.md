# Homepage Premium Refinement & Overlay Orchestration

Audit findings from the uploaded screenshot and code review:

1. **Overlay collision (the visible mess)** — at the same scroll position, four floating widgets stack and overlap: `LiveActivityFeed` (bottom-left card), `CookieConsent` (bottom centre), `LeadCaptureBar` (bottom full-width), and `SmartCTA` / hero CTAs. They each ship with their own timer (2s, 5s, 12s, 30s) and z-index, so they compete instead of cooperating.
2. **Custom cursor lag** — `CustomCursor` runs a permanent `requestAnimationFrame` loop, mounts a global `cursor: none` stylesheet that re-paints every node, and uses `mix-blend-mode: difference` (very expensive on dark mesh + orbs). On mid-range devices this feels "hung".
3. **Hero is already strong** but lacks the premium micro-detail polish the user is asking for: floating geometric objects, subtle dividers between sections, finer grain, and consistent micro-animations.
4. **Performance budget** — current homepage is heavy with framer-motion, lazy chunks, and hero images. Any new visuals must be CSS-only or SVG, no new JS libraries, no extra image weight.

## What I will change (frontend / presentation only)

### A. Overlay orchestration (fix the popup chaos)

Create `src/lib/overlayOrchestrator.ts` — a tiny pub/sub queue with a single rule: **only one bottom-anchored overlay visible at a time**, in priority order:

```
CookieConsent  >  ExitIntentPopup  >  LeadCaptureBar  >  LiveActivityFeed  >  SmartCTA
```

Each existing widget registers itself, asks "can I show?", and gets a slot or waits. Implementation details:
- New hook `useOverlaySlot(id, priority)` returns `canShow: boolean`.
- Cookie consent shifts up to take centre-bottom; everything else is suppressed until cookie choice is made or auto-dismissed.
- `LeadCaptureBar` delay increased from 30s → 45s and only fires after cookie resolved.
- `LiveActivityFeed` only shows after cookie resolved AND no other bottom overlay active; cap to 3 cards per session.
- `SmartCTA` becomes a small right-rail pill that hides when any bottom-bar overlay is open.
- `MobileStickyBar` (mobile-only nav) keeps its slot; other overlays lift their `bottom` offset by `safe-area + 64px` on mobile so they never sit under it.

No changes to the lead-capture/CRM logic — only timing and visibility coordination.

### B. Replace the laggy cursor

Remove `CustomCursor` and swap in `PremiumCursor`:
- One element, CSS-only follower using a single `pointer` listener with `transform: translate3d()` (GPU).
- No `requestAnimationFrame` loop, no `mix-blend-mode`, no global `cursor: none` override (system cursor stays — the follower is an accent ring, not a replacement).
- Disabled automatically on touch, coarse-pointer, and `prefers-reduced-motion`.
- Adds a subtle scale + colour shift over interactive elements via `:has()` query, no React state churn.

### C. Premium visual layer (homepage only, zero JS cost)

All additions live in `src/index.css` + small presentational components used inside `Index.tsx`:

1. **Floating geometric objects** — new `<FloatingShapes />` component (pure SVG, 3-4 shapes, CSS `@keyframes` translate/rotate). Mounted once between hero and the next section, `pointer-events-none`, `will-change: transform`.
2. **Section dividers** — `<SectionDivider variant="aurora|seam|spark" />` slim CSS-gradient lines + tiny SVG accents between major sections (after Hero, after Stats, before Pricing, before Footer CTA).
3. **Grain refinement** — replace the current grain with a single 256×256 inline SVG noise data-URI at 4% opacity, fixed-position layer (no extra HTTP request, no asset).
4. **Micro-animations** — extend `tailwind.config.ts` with `float-slow`, `drift`, `shimmer-slow`, `gradient-pan`. Apply selectively to badges, KPI ticker, and divider sparks. All use `transform`/`opacity` only.
5. **Premium typography polish** — refine `index.css` `.type-display`, `.type-label`, add optical sizing + tabular numerals on KPI ticker, tighter tracking on H2s, softer measure on body. No new font files.
6. **Premium UI accents** — small `Picture`-style upgrades: glass-card border gets a 1px gradient stroke via `mask-composite`; KPI cards get a hover sheen using `background-position` animation (no JS).

### D. Loading-budget guardrails

- Zero new dependencies.
- No new images (SVG/CSS only).
- Orchestrator + cursor combined < 4 KB gzipped.
- All decorative layers are `pointer-events-none` and `aria-hidden`.
- Decorative animations gated behind `@media (prefers-reduced-motion: no-preference)`.
- Verify: after changes, run `bun run build` (auto by harness) and check the home chunk size diff in the build output.

## Files I will touch

Created:
- `src/lib/overlayOrchestrator.ts`
- `src/hooks/useOverlaySlot.ts`
- `src/components/ui/premium-cursor.tsx`
- `src/components/ui/floating-shapes.tsx`
- `src/components/ui/section-divider.tsx`

Edited:
- `src/App.tsx` (swap cursor)
- `src/components/layout/Layout.tsx` (wire orchestrator provider)
- `src/components/ui/cookie-consent.tsx`, `lead-capture-bar.tsx`, `live-activity-feed.tsx`, `smart-cta.tsx`, `exit-intent-popup.tsx` (use `useOverlaySlot`, adjust timings, mobile offset)
- `src/pages/Index.tsx` (insert dividers + floating shapes)
- `src/index.css` (grain refresh, typography polish, sheen utility)
- `tailwind.config.ts` (new keyframes)

Deleted:
- `src/components/ui/custom-cursor.tsx`

## What I will NOT change in this pass

- No backend/API/Supabase work.
- No copy / SEO / schema changes.
- No layout restructuring of existing sections beyond inserting dividers/floating shapes.
- No changes to dashboard, billing, or admin areas.

## Verification

- Visual QA via browser screenshot at desktop (1366) and mobile (390) — confirm only one bottom overlay visible at a time, cursor follows smoothly, dividers and floating shapes render, FCP/LCP unchanged.
- Confirm `prefers-reduced-motion` disables all decorative animation.
- Build size delta noted in the closing message.
