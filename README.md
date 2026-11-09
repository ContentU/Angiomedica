# Angiomedica — sito Next.js

Versione Next.js 15 + Tailwind CSS 4 + Sanity del layout approvato in `../Sito web/` (la demo HTML resta intatta, serve per il confronto).

## Avvio in locale

```bash
npm install
npm run dev            # http://localhost:3000 — Studio su http://localhost:3000/studio
```

Finché `NEXT_PUBLIC_SANITY_PROJECT_ID` non è impostato, il sito mostra i testi di `scripts/seed-data.ts` (anteprima locale, nessun Sanity necessario).

## Collegare Sanity (una volta)

1. `npx sanity@latest login` e poi `npx sanity@latest projects create` (oppure creare il progetto da sanity.io/manage).
2. Copiare `.env.example` in `.env.local` e inserire l'ID del progetto.
3. `npx sanity cors add http://localhost:3000 --credentials` (e poi lo stesso con l'URL Netlify).
4. Caricare i testi del Master editoriale V2: `npx sanity exec scripts/seed.ts --with-user-token`
   (rieseguibile: sostituisce i documenti con gli stessi ID; **attenzione**, sovrascrive anche le modifiche fatte nello Studio a quei documenti).

## Deploy su Netlify (via GitHub)

1. `git init`, commit, push su un nuovo repository GitHub.
2. Netlify → *Add new site* → *Import from Git* → scegliere il repository (build e cartella sono in `netlify.toml`).
3. Variabili d'ambiente in Netlify: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`.
4. Netlify → *Forms*: attivare il rilevamento e le notifiche email verso la segreteria (modulo `richiesta-visita`, dichiarato in `public/__forms.html`).

I contenuti modificati nello Studio compaiono sul sito entro 60 secondi.

## Come è fatto

- `app/styles/angiomedica.css` — CSS componenti della demo, copiato senza modifiche.
- `app/styles/pages.css` — gli stili delle singole pagine demo, scopati con `:where(.pg-<pagina>)` (stessa specificità dell'originale).
- `app/styles/site.css` — aggiunte: menu mobile, barra CTA mobile, adattamenti dai layout `mobile/*.html` dove la demo usa `!important`.
- Gli stili inline della demo sono diventati classi Tailwind con gli stessi valori; le varianti `max-[960px]:` riproducono i layout mobile.
- Nei testi, `[[così]]` (o il pulsante «Da confermare» nello Studio) produce la sottolineatura a puntini dei dati da confermare.
- Tipi Sanity: Homepage, Pagine, Specialità (hub o consulenza), Prestazioni, Professionisti, Blog, Impostazioni.
- Le visite delle specialità «consulenza» hanno come URL canonico la pagina della specialità; `/prestazioni/visita-…/` reindirizza (vedi `next.config.ts`).

## Da fare prima del lancio

- Tutto ciò che è sottolineato a puntini o con asterisco è da confermare con il centro (vedi anche il registro verifiche del Master).
- Logo vettoriale, foto reali, testi legali (privacy, cookie), informativa privacy collegata al modulo.
- Togliere `robots: noindex` in `app/layout.tsx` al lancio.
- Testi del Master che non hanno uno spazio nel layout della demo: `CONTENUTI-NON-INSERITI.md`.
