# Angiomedica — sito Next.js

Versione Next.js 15 + Tailwind CSS 4 + Sanity del layout approvato in `../Sito web/` (la demo HTML resta intatta e serve per il confronto).

---

# 🚦 Cosa manca per la messa online definitiva

> Ultima verifica: **9 novembre 2026**. Il sito è stato controllato con Playwright confrontandolo con la demo `../Sito web/` (desktop 1440px e mobile 390px, 18 pagine e 37 URL).

## In sintesi

| Area | Stato |
|---|---|
| Layout e grafica (fedeltà alla demo) | ✅ Fedele su desktop e mobile (3 difetti mobile corretti il 9/11) |
| Pagine e collegamenti interni | ✅ Tutti i 37 URL rispondono, nessun link rotto, nessun errore in console |
| CMS Sanity (Studio su `/studio`) | ✅ Collegato, testi del Master caricati |
| Hosting Netlify | ✅ Pubblicato da GitHub (`main`), ma con `noindex` e senza dominio definitivo |
| **Invio email dai moduli** | ❌ **Da rifare con un servizio esterno** (vedi punto 1) |
| Testi legali (privacy, cookie, ecc.) | ❌ Mancano: i link puntano a `#` |
| Dati del centro da confermare | ❌ Ci sono circa 60 segnaposto «da confermare» |
| Foto, logo vettoriale, articoli del blog | ❌ Da ricevere o scrivere |
| SEO tecnica (sitemap, robots, favicon, meta description) | ❌ Mancano |

## 1. Bloccanti: senza questi il sito non può andare online

### 1.1 Invio email dai moduli: servizio esterno da scegliere
Oggi i tre moduli (homepage, Contatti, Richiesta visita privata) usano **Netlify Forms**: il modulo `richiesta-visita` è dichiarato in `public/__forms.html` e viene inviato da `components/useRequestForm.ts`. È una soluzione **provvisoria, solo per i test**: Netlify permette di inviare le notifiche solo agli indirizzi del team (adesso arrivano a info@contentu.it), non alla segreteria del centro.

**Da fare:** passare a un servizio email esterno, **da decidere in seguito** (ad esempio **Brevo**, **Mailchimp Transactional/Mandrill** o simili). In pratica:
- [ ] scegliere il servizio e creare l'account intestato al cliente o a ContentU;
- [ ] verificare il dominio mittente (record DNS SPF/DKIM), così le email non finiscono nello spam;
- [ ] sostituire l'invio in `components/useRequestForm.ts` con una chiamata a una route server (es. `app/api/richiesta/route.ts`) che usa l'API del servizio; la chiave API va **solo** nelle variabili d'ambiente di Netlify, mai nel codice;
- [ ] email alla segreteria del centro con tutti i campi (prestazione, medico, nome, telefono, email, preferenza di contatto, pagina di provenienza);
- [ ] (facoltativo) email di conferma automatica al paziente;
- [ ] mantenere la protezione antispam (oggi c'è il campo nascosto `bot-field`) e valutare un captcha;
- [ ] aggiornare l'informativa privacy: il fornitore del servizio diventa responsabile del trattamento dei dati;
- [ ] provare un invio reale da tutti e tre i moduli, poi rimuovere `public/__forms.html` e disattivare Netlify Forms.

### 1.2 Testi legali e conformità
- [ ] **Privacy policy**, **Cookie policy**, **Dichiarazione di accessibilità**, **Dati societari** (ragione sociale, P.IVA): vanno create le pagine. Oggi i link puntano a `#` in `components/Footer.tsx` e nella checkbox privacy di `components/HomeRequestForm.tsx` e `components/RequestPageForm.tsx`.
- [ ] Nel modulo della pagina **Contatti** (`components/ContactForm.tsx`) la frase «Ho letto l'informativa privacy» non ha nemmeno il link: va aggiunto.
- [ ] Banner cookie / gestione del consenso, se si aggiungono analytics, Google Maps o altri servizi di terze parti.

### 1.3 Dati da confermare con il centro
Sul sito sono **sottolineati a puntini** (in Sanity sono scritti `[[così]]`) o hanno un **asterisco**. Senza conferma non si possono pubblicare. Elenco per pagina:

| Pagina | Da confermare |
|---|---|
| Tutto il sito (header, footer, contatti) | Telefono 091 580301\*, email angiomedica@libero.it\* (valutare un indirizzo professionale), WhatsApp 335 719 7730\*, orari Lun–Ven 9–13 / 15–19\*, ragione sociale e P.IVA |
| Il Centro | Anno di apertura (1996/97), tappe della storia (arrivo dell'angiologia, sede in via Ruggero Settimo), numero dei professionisti, i 3 principi di «Come lavoriamo», qualifica del fondatore |
| Per il paziente | Orari della segreteria e degli ambulatori, indicazioni per arrivare, procedura di prenotazione |
| Prestazioni | Elenco completo delle prestazioni, durata e preparazione di ogni esame (per tutte le schede è «da confermare»), modalità dell'EcocolorDoppler TSA (a riposo / prove dinamiche) |
| Specialità di consulenza (cardiochirurgia, chirurgia vascolare, dietologia) | Testi da validare; per la dietologia, terminologia «visita dietologica» o «dietistica» e figura professionale |
| Prestazioni S.S.N. | Prestazioni in convenzione, importi ed esenzioni, requisiti, indirizzo ufficiale per le richieste |
| Visite a domicilio | Comuni serviti, criteri di accesso, modalità, tariffe, indicazioni pratiche |
| Contatti | CAP, piano, accessibilità (ascensore, accesso per carrozzine) |
| Richiesta visita privata | Tempo di risposta della segreteria |
| Professionisti | Ruolo del Prof. Michele Ballo (direttore sanitario nel 2026), specializzazione e visite del Dott. Emerico Ballo, collegamento medici ↔ prestazioni |

La fonte di riferimento è anche il registro verifiche del Master editoriale V2. I testi si correggono direttamente nello Studio Sanity.

### 1.4 Blog
- [ ] Ci sono solo **articoli segnaposto** (titoli della demo, testi finti, autore «Nome Cognome», data «data»). Le opzioni sono due: scrivere articoli veri (su fonti valide, con revisione clinica) oppure **nascondere il blog** al lancio (menu, sezione in homepage, «Approfondimenti» nelle schede).

### 1.5 Pubblicazione tecnica
- [ ] Togliere `robots: { index: false, follow: false }` da `app/layout.tsx` (oggi il sito chiede a Google di non indicizzarlo).
- [ ] Collegare il **dominio definitivo** su Netlify e configurare i DNS (HTTPS automatico).
- [ ] Aggiungere il dominio definitivo ai CORS di Sanity: `npx sanity cors add https://<dominio> --credentials`.
- [ ] Redirect 301 dagli URL del vecchio sito, se esiste, verso le nuove pagine (in `next.config.ts`).

## 2. Da correggere: difetti trovati nella verifica

Su desktop le pagine corrispondono alla demo. Questi sono i problemi emersi, quasi tutti su mobile:

- [x] ~~**Homepage, modulo su mobile**: testi delle opzioni fuori dal riquadro, pulsante di invio a capo male.~~ Corretto: su mobile le opzioni sono su una colonna e il testo del pulsante va a capo normalmente.
- [x] ~~**Contatti, modulo su mobile**: modulo e mappa affiancati su colonne strette (difetto presente anche nella demo).~~ Corretto: su mobile le colonne sono una sotto l'altra.
- [x] ~~**Il Centro, titolo su mobile**: «cardiovascolare» tagliato sul bordo destro.~~ Corretto: su mobile il titolo è a 38px.
- [ ] **Richiesta visita privata, mobile**: la pagina mantiene lo sfondo blu scuro della versione desktop, mentre la demo mobile ha il modulo su sfondo chiaro. È una differenza solo estetica.
- [ ] **Blog**: le categorie sono più numerose di quelle della demo e la riga dei filtri scorre in orizzontale (l'ultima categoria si vede tagliata).

Differenze **volute** rispetto alla demo (non sono errori): i professionisti sono 3 reali e non 10 segnaposto. Nel profilo del medico mancano le sezioni «Competenze», «Prestazioni che segue» e «Approfondimenti di…», e nelle schede prestazione manca «Chi la esegue»: compariranno quando i medici verranno collegati alle prestazioni nello Studio. I testi sono quelli del Master e non quelli della demo, quindi alcune pagine sono più lunghe o più corte.

## 3. Materiali da ricevere dal cliente
- [ ] **Logo vettoriale** (SVG). Oggi c'è solo `public/img/logo-angiomedica.png`.
- [ ] **Foto reali**: sede (facciata, sala d'attesa), medico e paziente con liberatoria, ambulatori ed esami, ritratti dei 3 professionisti, immagini degli articoli. Oggi in tutte queste posizioni c'è un riquadro grigio a righe.
- [ ] **Mappa**: decidere tra immagine statica con link alle indicazioni e mappa Google incorporata (in quel caso serve il consenso cookie).
- [ ] **Favicon** e **immagine per la condivisione social** (og:image): oggi mancano entrambe.

## 4. SEO
- [ ] **Meta description**: c'è solo per Il Centro, le altre pagine non ce l'hanno. Vanno scritte e inserite in Sanity (i titoli SEO ci sono tutti).
- [ ] `sitemap.xml` e `robots.txt`: oggi rispondono 404. Si generano con `app/sitemap.ts` e `app/robots.ts`.
- [ ] Dati strutturati (schema.org `MedicalClinic`: indirizzo, orari, telefono) e scheda Google Business aggiornata.
- [ ] Analytics (es. GA4 o Plausible), se richiesti dal cliente. Vanno insieme al banner cookie.

## 5. Contenuti del Master editoriale senza spazio nel layout
Il sito riproduce esattamente il layout della demo. I testi del Master sono stati inseriti in Sanity dove la demo ha uno spazio corrispondente. Quelli elencati qui sotto **non hanno un posto nel layout** e non sono stati aggiunti, per non inventare nuovi blocchi grafici. **Da decidere con il responsabile**: aggiungere un blocco al layout oppure rinunciare al testo.

| Pagina | Testo del Master | Nota |
|---|---|---|
| Homepage · hero | Eyebrow «Angiomedica · Palermo» | La hero della demo non ha sopratitolo |
| Homepage · visite ed esami | Descrizione breve di ogni prestazione in evidenza | Le tile della demo mostrano solo il nome |
| Homepage · contatti | «Ci trovi in Via Ruggero Settimo 55. Per informazioni e appuntamenti puoi contattare la segreteria.» | La demo mostra solo indirizzo, orari, telefono |
| Hub `/specialita/` | H1, testo introduttivo, CTA card | La demo non ha questa pagina: il menu «Specialità» porta a `/#specialita` |
| Il Centro | Sezione «Le nostre specialità» (5 card) | Non presente nella pagina della demo |
| Il Centro | CTA finale «Scopri le prestazioni» | La chiusura della demo ha un solo pulsante |
| Cardiologia / Angiologia | CTA «Scopri tutte le prestazioni» nella chiusura | Come sopra |
| Visite a domicilio | «La possibilità di ricevere assistenza fuori dal centro» (testo) | Nessun paragrafo libero nella demo |
| Visite a domicilio | Testo di «Disponibilità e informazioni pratiche» | Usato solo in parte nella chiusura; la sezione della demo è un elenco |
| Contatti | Altri recapiti 091 331731 e 091 320229 | Le card della demo sono tre (telefono, email, WhatsApp) |
| Contatti | «Informazioni per il S.S.N.» (testo e CTA) | Resta la nota S.S.N. dentro il modulo |
| Professionisti | Filtro per specialità | La demo non ha filtro |
| Profilo professionista | Sezioni «Competenze e attività» e «Prestazioni» del template | Il Master non fornisce i testi per i tre medici; le prestazioni si collegano solo dopo la verifica |
| Footer | «Angiomedica — Diagnostica e terapia cardiologica e vascolare», link S.S.N., «Altre informazioni obbligatorie» | Il footer della demo ha una struttura diversa |
| SEO | Meta description | Il Master le fornisce solo per Il Centro; i SEO title sono stati inseriti tutti |

### Scelte fatte durante lo sviluppo (da confermare)
- **Professionisti ↔ prestazioni**: il Master chiede di collegarli solo dopo la verifica, quindi le sezioni «Chi la esegue» delle schede e «Prestazioni che segue» dei profili restano nascoste finché non si collegano nello Studio.
- **Specialità «consulenza»** (cardiochirurgia, chirurgia vascolare, dietologia): URL canonico `/specialita/<nome>/`; le schede `/prestazioni/visita-…/` reindirizzano lì (verificato). Il testo della pagina unisce le sezioni del Master della specialità («La consulenza…», «Ambiti di consulenza») e della visita («Come si svolge», «Prima della visita»).
- **Blog**: il Master non fornisce articoli; sono caricati i titoli segnaposto della demo, tutti marcati «da confermare». Da non pubblicare finché il blog non è confermato.
- **Mobile**: nel modulo della homepage il selettore della visita resta a pulsanti anche su mobile (il riferimento mobile usa un menu a tendina; vedi il difetto al punto 2); la paginazione del blog della demo è omessa (pochi articoli).
- **Header/menu mobile**: implementato (nella demo non lo era). Verificato, funziona.

## 6. Già fatto
- Tutte le pagine della demo riprodotte in Next.js, fedeli su desktop: homepage, Il Centro, Per il paziente, Prestazioni (13 schede), Prestazioni S.S.N., Professionisti (3 profili), 5 specialità, Visite a domicilio, Contatti, Richiesta visita privata, Blog (9 articoli segnaposto), pagina 404.
- Testi del Master editoriale V2 caricati in Sanity e modificabili dallo Studio (`/studio`).
- Menu mobile funzionante, redirect delle visite di consulenza, validazione dei campi obbligatori nei moduli.
- Deploy automatico su Netlify da GitHub (`main`).
- TypeScript senza errori; lint con 4 avvisi non bloccanti (uso di `<img>` per il logo).

---

# Documentazione tecnica

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
4. Netlify → *Forms*: attivare il rilevamento e le notifiche email (modulo `richiesta-visita`, dichiarato in `public/__forms.html`). È provvisorio: vedi il punto 1.1.

I contenuti modificati nello Studio compaiono sul sito entro 60 secondi.

## Come è fatto

- `app/styles/angiomedica.css` — CSS componenti della demo, copiato senza modifiche.
- `app/styles/pages.css` — gli stili delle singole pagine demo, scopati con `:where(.pg-<pagina>)` (stessa specificità dell'originale).
- `app/styles/site.css` — aggiunte: menu mobile, barra CTA mobile, adattamenti dai layout `mobile/*.html` dove la demo usa `!important`.
- Gli stili inline della demo sono diventati classi Tailwind con gli stessi valori; le varianti `max-[960px]:` riproducono i layout mobile.
- Nei testi, `[[così]]` (o il pulsante «Da confermare» nello Studio) produce la sottolineatura a puntini dei dati da confermare.
- Tipi Sanity: Homepage, Pagine, Specialità (hub o consulenza), Prestazioni, Professionisti, Blog, Impostazioni.
- Le visite delle specialità «consulenza» hanno come URL canonico la pagina della specialità; `/prestazioni/visita-…/` reindirizza (vedi `next.config.ts`).
