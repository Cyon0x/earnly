# Earnly

**Verified student opportunity and earning platform.** Students confirm they are
students, find paid tasks, jobs and internships, get paid in USDC, collect
ratings from the people who paid them, and graduate with a record of real work
instead of an empty CV.

The core loop the product is built around:

> **Verify → Discover → Apply → Work → Get paid → Build reputation → Gain experience**

This is a hackathon/grant prototype. Everything below marked *demo* is
deliberately mocked and the interface says so on screen.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (webpack)
npm run lint
```

Node 20.9+ (Next.js 16 requirement). Fonts are self-hosted in `public/fonts`,
so the build does not need network access.

## Design

The visual system was produced with the **App Designer** skill in the
terminal, not chosen up front. Three directions for the dashboard were
rendered and compared (`design/app-designer/directions.html`, renders in
`design/app-designer/out/`), and the winner is written down in
`design/DIRECTION.md`:

> **Earnly is a campus night market.** Stalls open after the last lecture;
> every stall is a piece of paid work, every price tag is real.

- **Signature shape:** the tag — a rectangle with one squared corner.
- **Depth:** a hard offset shadow, never a soft one and never a glow.
- **Accent:** one lamp-amber, used only for the primary action and "now".
- **Type:** Archivo (variable width) for everything; Geist Mono for every
  number. Seven type sizes, nothing below 11px.
- **Two themes, both designed:** night ink (default) and chalk paper (light),
  not an inversion. Switch with the sidebar toggle.

The landing hero is a real campus photograph, art-directed with a duotone
treatment and overlapping product panels rather than a screenshot in a frame.

## What is real and what is mocked

| Area | Status |
|---|---|
| Landing page | Built |
| Auth (Google + email) | **Stubbed** — no provider is contacted, no credential stored |
| Student verification | Built UI, all four states; approval is a demo button |
| Onboarding | Built |
| Dashboard, Tasks, Jobs, Internships | Built on demo listings |
| Search, filters, sorting, saved | Built, in-memory + `localStorage` |
| Apply → Paid pipeline | Built; stage changes are demo buttons |
| Profile, ratings, reviews | Built on demo data |
| Payments (USDC balances, ledger) | Built; **no chain transaction exists** |
| AI Opportunity Finder | Built wizard, ranked and explained results; **no live web search ran** |
| Marketplace, Scholarships, Social, Off-ramp | Visually complete, labelled **COMING SOON** |

Demo money references are prefixed `demo-ref-` on purpose. Nothing in this
repository signs, broadcasts or stores anything on a blockchain.

## Architecture

```
src/
  app/                 routes (App Router)
    page.tsx           landing
    signin, verify, onboarding
    app/               authenticated shell + dashboard, tasks, jobs,
                       internships, work, payments, profile, ai,
                       marketplace, scholarships, social, offramp
  components/          AppShell, cards, Browse, OpportunityDetail,
                       ComingSoon, ui.tsx (buttons, tags, badges, modal, icons)
  lib/
    types.ts           the data contracts
    data.ts            demo listings, transactions, reviews, notifications
    store.tsx          session, verification, onboarding, applications, theme
    ai.ts              discovery pipeline + SourceAdapter interface
```

`src/lib/ai.ts` is where the real work goes. It defines `SourceAdapter` and
`RawListing` so permitted sources (public job boards, company career pages,
campus boards, approved partner APIs) can be added without touching the UI.
`runSearch()` today ranks the local demo set and returns the same
`AiResult` shape a live implementation would.

`src/lib/store.tsx` keeps session, verification, onboarding, applications and
theme in one place, persisted to `localStorage`, so a real auth provider and a
database can replace it without a redesign.

## Accessibility

Contrast is measured, not guessed. Every text node on every route was audited
in both themes after the build; the dark theme reports zero nodes below its
WCAG threshold and the light theme's only remaining flags are white type over
the art-directed photographs. Focus is visible (`:focus-visible`), targets are
at least 40px, and `prefers-reduced-motion` disables the motion.

## Deploying

Built for Vercel. No environment variables are required for the prototype; when
auth, verification, AI and chain integrations are added, their keys belong in
Vercel environment variables, never in the repository.
