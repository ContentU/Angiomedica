# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Italian-language medical-centre site (Angiomedica): Next.js 15 (App Router) + React 19 + Tailwind 4 + Sanity v4 (embedded Studio). Copy and UI text are in Italian. See `README.md` for Sanity/Netlify setup steps.

## Commands

- `npm run dev` — site on :3000, Sanity Studio on :3000/studio
- `npm run build` / `npm start` / `npm run lint`
- No test suite.
- Seed Sanity: `npx sanity exec scripts/seed.ts --with-user-token` (overwrites docs with the same IDs, including Studio edits).

## Architecture

- **Content source with local fallback**: `sanity/client.ts` `sanityFetch()` queries Sanity (ISR, `revalidate: 60`). If `NEXT_PUBLIC_SANITY_PROJECT_ID` is unset (`"progetto-da-configurare"`), it runs the *same GROQ query* with `groq-js` against `scripts/seed-data.ts`. So seed data is both the Sanity seed and the offline preview — keep queries in `sanity/queries.ts` valid for both, and update `seed-data.ts` when adding fields.
- **Routes** live in `app/(site)/` (shared Header/Footer layout); `app/studio/[[...tool]]` hosts the Studio. Dynamic routes: `blog/[slug]`, `prestazioni/[slug]`, `professionisti/[slug]`, `specialita/[slug]`. Specialties of type "consulenza" use the specialty page as the canonical URL; `/prestazioni/visita-…/` redirects (see `next.config.ts`).
- **Schemas** in `sanity/schemaTypes/` (singletons: homepage, settings; plus pages, specialties, services, professionals, blog). `sanity/structure.ts` defines the Studio desk.
- **Rich text**: `[[text]]` in strings (or the "Da confermare" button in Studio) renders as dotted underline marking unconfirmed data. Handled by `lib/content.tsx` and the `RichText`/`Ph` components.
- **Styling**: `app/styles/angiomedica.css` is copied verbatim from the approved HTML demo (`../Sito web/`) and must not be changed; page styles in `pages.css` are scoped with `:where(.pg-<page>)`; `site.css` holds additions (mobile menu, CTA bar). Component markup uses Tailwind classes reproducing the demo's inline styles, with `max-[960px]:` variants for mobile.
- **Contact form**: Netlify Forms (`richiesta-visita`), declared in `public/__forms.html`.

## Notes

- `app/layout.tsx` has `robots: noindex` — remove at launch.
- Editorial text with no slot in the layout is tracked in `CONTENUTI-NON-INSERITI.md`.
