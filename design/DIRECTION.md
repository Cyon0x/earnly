# Earnly — direction

## Concept

**Earnly is a campus night market.** Stalls open after the last lecture; every
stall is a piece of paid work, every price tag is real, and you leave with
money and something to show for it. Source family: *places*. The object the
palette comes from is a market stall at dusk — a lamp, chalk prices, crates.

Refused category defaults (named, per slop.md): the **generic job board**
(blue links, "Find your dream job") and the **Dark Fintech** look (near-black
+ lime/teal + glass cards + Manrope) that every student-money product reaches
for. Also refused: the onboarding greeting, the 2x2 stat tiles, and the card
stack.

## Tokens

| Role | Dark (default) | Light |
|---|---|---|
| `ground` | `#0B1020` night ink | `#F2F0EA` chalk paper |
| `raised` | `#141B33` | `#FFFFFF` |
| `raised-2` | `#1B2440` | `#E7E4DA` |
| `ink` | `#F2EFE6` | `#16181C` |
| `ink-2` | `#9AA3BE` | `#5F636C` |
| `ink-3` | `#6B7591` | `#8A8E97` |
| `rule` | `rgba(242,239,230,.14)` | `rgba(22,24,28,.14)` |
| `accent` | `#FFB020` lamp amber | `#FFB020` |
| `on-accent` | `#17120A` | `#17120A` |
| `positive` | `#7CE0A6` | `#1B7F52` |
| `negative` | `#FF5A3C` | `#C8361C` |

- **Accent role:** the primary action and "available now". Nothing else. Amber
  on `on-accent` ink; when amber must be text on a light ground it drops to
  `#B26A00` (one hue, two values).
- Raw hex in the shipped app lives in `src/app/globals.css`, not in components.
- Dark is the **default** design; light is a second design (chalk paper with
  the same ink-blue and lamp), not an inversion.

## Type

- **Archivo** (variable, `wdth` axis) for everything: display at `wdth 122`,
  `wght 800–900`, tracking −3.5%; UI at default width, 400/500/700.
  It is not one of the default-reach faces and its width axis is the web
  stand-in for SF Pro Expanded, which the mockups were drawn in.
- **Geist Mono** for figures only: money, match %, dates, counts.
- Scale (7 steps, no more): 96 / 62 / 34 / 20 / 17 / 14 / 12.
- Weight contrast is always ≥ 2 steps (400 next to 800).

## Shape language

One signature: **the tag** — a rectangle with exactly one squared corner
(`border-radius: 3px 20px 20px 20px`), read as a market price tag. Cards, the
active nav item and the hero panels use it; lists, inputs and buttons do not.
Depth is a **hard offset** (`0 4px 0` ink), never a soft shadow and never a
glow. Two radii only: tag (3/20) and pill (999). Nothing else.

## Motion

One idea: **things get hung up and taken down.** Cards settle with a short
spring and a small rotation; the AI finder's stages tick over like a stall
opening. Durations 180–320 ms, `cubic-bezier(.2,.8,.2,1)`. Respects
`prefers-reduced-motion`.

## Richness source

- A real campus-at-dusk photograph in the landing hero, duotoned to ink and
  amber, with UI panels overlapping it (not a screenshot in a frame).
- Chalk rules and mono prices everywhere numbers live.
- The five-state work pipeline (`Applied → … → Paid`) drawn as a hung tag
  line, the product's one big custom graphic.

## Its own slop (watch for)

Amber everywhere. Amber is the lamp: one action per screen, nothing else.
