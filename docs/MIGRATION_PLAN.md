# Build 1 Next.js Migration Plan

## Objective

Migrate the official Build 1 visual foundation from standalone HTML, CSS and
JavaScript to a production Next.js App Router codebase without redesigning or
simplifying the experience.

## Audited product surface

- One onboarding entry route with nine UI states representing eight story steps
- Sixteen Malaysian state and federal-territory selections
- Seventeen integrated Pandi scenes: one default and sixteen personalised scenes
- One journey route containing nine learning worlds
- Nine world routes containing five zones each
- Three game routes containing five questions each
- Local profile, onboarding XP and game-score persistence
- Desktop, tablet, mobile and reduced-motion behavior

## Architecture mapping

| Build 1 concern | Production destination |
| --- | --- |
| Global `app.js` | Focused React client components |
| `data.js` globals | Typed modules in `data/` |
| HTML route wrappers | App Router pages |
| HTML string templates | Reusable React components |
| Direct localStorage calls | Guarded helpers in `lib/storage.ts` |
| Relative asset paths | Base-path-aware public asset helpers |
| Page-specific body classes | Route-level application shells |
| Static HTML deployment | Next.js static export |

## Route mapping

| Previous route | Production route |
| --- | --- |
| `index.html` | `/` |
| `journey.html` | `/journey` |
| `worlds/{id}.html` | `/world/{worldId}` |
| `games/{id}.html` | `/games/{gameId}` |

## Guardrails

- Preserve content, hierarchy, colors, typography, spacing and animation timing
- Preserve state selection, automatic transitions and Pandi crossfade
- Preserve locked zones, question banks, scoring and replay
- Keep all official visual assets unchanged
- Use strict TypeScript and eliminate duplicated rendering logic
- Generate every dynamic route at build time for GitHub Pages
- Verify lint, types, production build and responsive visual parity
