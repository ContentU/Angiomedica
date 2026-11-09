/**
 * Contenuti iniziali per Sanity.
 * Fonte: «ANGIOMEDICA - Testi sito web - Master editoriale V2» (5/11/2026); dove il Master non dà testo per uno spazio
 * del layout resta il testo della demo approvata. [[testo]] = dato da confermare (sottolineato a puntini sul sito).
 * Testi del Master senza uno spazio nel layout: vedi README.md, sezione 5.
 */

type Doc = { _id: string; _type: string; [k: string]: unknown };

let n = 0;
const key = () => `k${(n++).toString(36)}`;

/** testo con [[da confermare]] e **grassetto** -> span Portable Text */
function spans(text: string) {
  const out: object[] = [];
  const re = /\[\[(.+?)\]\]|\*\*(.+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  const span = (t: string, marks: string[] = []) => out.push({ _type: "span", _key: key(), text: t, marks });
  while ((m = re.exec(text))) {
    if (m.index > last) span(text.slice(last, m.index));
    span(m[1] ?? m[2], [m[1] != null ? "ph" : "strong"]);
    last = re.lastIndex;
  }
  if (last < text.length) span(text.slice(last));
  return out;
}

/** paragrafi separati da riga vuota; righe "- " = elenco puntato, "• " = elenco con pallini, "### " = sottotitolo */
export function pt(src: string) {
  return src.trim().split(/\n\s*\n/).flatMap((par) => {
    const lines = par.trim().split("\n").map((l) => l.trim());
    if (lines.every((l) => /^[-•] /.test(l)))
      return lines.map((l) => ({ _type: "block", _key: key(), style: "normal", listItem: l[0] === "-" ? "bullet" : "dots", level: 1, markDefs: [], children: spans(l.slice(2)) }));
    const h3 = lines[0].startsWith("### ");
    return [{ _type: "block", _key: key(), style: h3 ? "h3" : "normal", markDefs: [], children: spans(lines.join(" ").replace(/^### /, "")) }];
  });
}

const ref = (id: string) => ({ _type: "reference", _ref: id });
const refs = (...ids: string[]) => ids.map((id) => ({ ...ref(id), _key: id }));
const slug = (s: string) => ({ _type: "slug", current: s });
type Sec = { heading?: string; anchor?: string; tocLabel?: string; label?: string; body?: string; items?: Itm[]; ctaLabel?: string; ctaHref?: string; photoCaption?: string };
type Itm = { label?: string; title?: string; text?: string; ctaLabel?: string; href?: string };
const items = (list: Itm[]) => list.map((i) => ({ _type: "item", _key: key(), ...i, text: i.text ? pt(i.text) : undefined }));
const sec = (k: string, s: Sec) => ({ _type: "section", _key: k, key: k, ...s, body: s.body ? pt(s.body) : undefined, items: s.items ? items(s.items) : undefined });
const prose = (anchor: string, heading: string, body: string, tocLabel?: string) => ({ _type: "section", _key: anchor, anchor, heading, tocLabel, body: pt(body) });
const faq = (list: [string, string][]) => list.map(([q, a]) => ({ _type: "faqItem", _key: key(), question: q, answer: pt(a) }));
const facts = (list: [string, string][]) => list.map(([label, value]) => ({ _type: "fact", _key: key(), label, value }));

const PHONE = "091 580301*";

// ---------------------------------------------------------------- impostazioni
const settings: Doc = {
  _id: "siteSettings", _type: "siteSettings",
  address: "Via Ruggero Settimo 55, Palermo",
  hours: "Lun–Ven · 9:00–13:00 / 15:00–19:00*",
  hoursShort: "Lun–Ven 9–13 / 15–19*",
  phone: PHONE, phoneHref: "tel:+3991580301",
  email: "angiomedica@libero.it*", emailHref: "mailto:angiomedica@libero.it",
  whatsapp: "335 719 7730*", whatsappHref: "https://wa.me/393357197730",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Via+Ruggero+Settimo+55+Palermo",
  footerHours: "Lun–Ven 9–13 / 15–19*",
  footerLegal: "[[ragione sociale e P.IVA da confermare]]",
  footerNote: "* Dato da confermare prima della pubblicazione",
};

// ---------------------------------------------------------------- specialità
const specialties: Doc[] = [
  {
    _id: "specialty-cardiologia", _type: "specialty", name: "Cardiologia", slug: slug("cardiologia"), order: 1, layout: "hub", color: "cardio",
    homeText: "Visite specialistiche ed esami per valutare la salute del cuore.",
    lead: pt("Visite specialistiche ed esami diagnostici dedicati alla valutazione della salute del cuore."),
    ctaLabel: "Richiedi una visita cardiologica",
    blocks: [
      sec("quando", {
        heading: "L'attività cardiologica di Angiomedica",
        body: "La cardiologia si occupa della valutazione delle condizioni del cuore e del sistema cardiovascolare. Presso Angiomedica l'attività cardiologica comprende visite specialistiche ed esami strumentali che possono contribuire alla prevenzione, all'inquadramento diagnostico e al monitoraggio dei pazienti, secondo le indicazioni del medico.",
        items: [
          { title: "Per un controllo di prevenzione, soprattutto con familiarità per malattie del cuore." },
          { title: "Se hai la pressione alta o valori da tenere sotto controllo." },
          { title: "Se avverti palpitazioni o battiti irregolari." },
          { title: "Se ti manca il fiato o ti stanchi più del solito durante sforzi lievi." },
          { title: "Prima di iniziare un'attività sportiva o dopo un intervento cardiaco." },
        ],
      }),
      sec("alert", { heading: "Dolore al petto improvviso?", body: "Non aspettare una visita: chiama subito il **112**." }),
      sec("prestazioni", { heading: "Visite ed esami di cardiologia", body: "Ogni prestazione ha la sua scheda: come si svolge, come prepararsi, chi la esegue.", ctaLabel: "Tutte le 13 prestazioni" }),
      sec("professionisti", { heading: "I professionisti della cardiologia", ctaLabel: "Tutti i professionisti" }),
      sec("approfondimenti", { heading: "Approfondimenti sul cuore" }),
      sec("chiusura", { heading: "Richiedi una visita cardiologica privata", body: `La richiesta non costituisce una prenotazione confermata. Per la convenzione S.S.N. chiama la segreteria al ${PHONE}.`, ctaLabel: "Richiedi una visita privata" }),
    ],
    seoTitle: "Cardiologia a Palermo | Angiomedica",
  },
  {
    _id: "specialty-angiologia", _type: "specialty", name: "Angiologia", slug: slug("angiologia"), order: 2, layout: "hub", color: "angio",
    homeText: "Visite e indagini diagnostiche dedicate alla circolazione arteriosa e venosa.",
    lead: pt("Valutazioni specialistiche ed esami per lo studio della circolazione arteriosa e venosa."),
    ctaLabel: "Richiedi una visita angiologica",
    blocks: [
      sec("quando", {
        heading: "La salute dei vasi sanguigni",
        body: "L'angiologia si occupa delle condizioni che interessano i vasi sanguigni e la circolazione. L'attività di Angiomedica comprende la visita specialistica e indagini Doppler ed ecografiche che permettono al medico di approfondire il quadro vascolare e valutare eventuali necessità di controllo o ulteriori accertamenti.",
        items: [
          { title: "Per un controllo di prevenzione di carotidi e aorta, soprattutto con fattori di rischio." },
          { title: "Se hai gambe gonfie, pesanti o con vene varicose." },
          { title: "Se senti dolore al polpaccio quando cammini, che passa da fermo." },
          { title: "Dopo una trombosi venosa, per i controlli nel tempo." },
          { title: "Su indicazione del cardiologo o del medico di famiglia." },
        ],
      }),
      sec("prestazioni", { heading: "Prestazioni di angiologia", body: "Ogni prestazione ha la sua scheda: come si svolge, come prepararsi, chi la esegue.", ctaLabel: "Tutte le 13 prestazioni" }),
      sec("professionisti", { heading: "I professionisti dell'angiologia", ctaLabel: "Tutti i professionisti" }),
      sec("approfondimenti", { heading: "Approfondimenti sulla circolazione" }),
      sec("chiusura", { heading: "Richiedi una visita angiologica privata", body: `Per la convenzione S.S.N. chiama la segreteria al ${PHONE}.`, ctaLabel: "Richiedi una visita privata" }),
    ],
    seoTitle: "Angiologia a Palermo | Angiomedica",
  },
  {
    _id: "specialty-cardiochirurgia", _type: "specialty", name: "Cardiochirurgia", slug: slug("cardiochirurgia"), order: 3, layout: "consulenza", color: "cardio",
    homeText: "Consulenze per le patologie cardiache di interesse cardiochirurgico.",
    visitName: "Visita cardiochirurgica",
    lead: pt("Consulenze specialistiche per la valutazione di patologie cardiache di interesse cardiochirurgico."),
    note: pt("In Angiomedica si svolgono solo visite di consulenza: gli interventi chirurgici non si eseguono in sede. [[testo da validare con il centro]]"),
    facts: facts([["Durata indicativa", "[[da confermare]]"], ["Da portare", "Esami e referti"], ["Regime", "Solo privato"]]),
    ctaLabel: "Richiedi la visita cardiochirurgica",
    sections: [
      prose("consulenza", "La consulenza cardiochirurgica", "La visita cardiochirurgica è un momento di approfondimento specialistico nel percorso di valutazione delle patologie del cuore che possono richiedere competenze cardiochirurgiche. Il confronto con lo specialista consente di esaminare la situazione clinica, la documentazione disponibile e gli eventuali passi successivi indicati per il singolo paziente."),
      prose("ambiti", "Ambiti di consulenza", "Tra gli ambiti indicati dal centro figurano patologie delle arterie coronarie, delle valvole cardiache e dell'aorta toracica."),
      prose("svolge", "Come si svolge", "Il professionista esamina la documentazione disponibile e discute con il paziente il quadro clinico e le possibili indicazioni."),
      prose("portare", "Prima della visita", "Porta referti, esami strumentali e la documentazione pertinente. La consulenza non implica l'esecuzione di interventi chirurgici presso Angiomedica."),
    ],
    blocks: [
      sec("chi", { heading: "Professionisti", anchor: "chi" }),
      sec("aside", { heading: "Richiedi la visita cardiochirurgica in privato", body: "Compila la richiesta: la segreteria ti ricontatterà per concordare data e ora.", ctaLabel: "Richiedi una consulenza privata" }),
      sec("approfondimenti", { heading: "Approfondimenti" }),
      sec("collegate", { heading: "Specialità collegate", ctaLabel: "Tutte le 13 prestazioni" }),
    ],
    related: refs("specialty-cardiologia", "specialty-chirurgia-vascolare", "specialty-angiologia"),
    seoTitle: "Visite cardiochirurgiche a Palermo | Angiomedica",
  },
  {
    _id: "specialty-chirurgia-vascolare", _type: "specialty", name: "Chirurgia vascolare", slug: slug("chirurgia-vascolare"), order: 4, layout: "consulenza", color: "angio",
    homeText: "Valutazioni specialistiche per le patologie dei vasi sanguigni.",
    visitName: "Visita di chirurgia vascolare",
    lead: pt("Consulenze specialistiche per la valutazione delle patologie vascolari."),
    note: pt("In Angiomedica si svolgono solo visite di consulenza: gli interventi chirurgici non si eseguono in sede. [[testo da validare con il centro]]"),
    facts: facts([["Durata indicativa", "[[da confermare]]"], ["Da portare", "Esami e referti"], ["Regime", "Solo privato"]]),
    ctaLabel: "Richiedi la visita di chirurgia vascolare",
    sections: [
      prose("valutazione", "La valutazione specialistica", "La consulenza di chirurgia vascolare consente di approfondire condizioni che interessano le arterie e gli altri vasi sanguigni, attraverso la valutazione medica e la documentazione diagnostica disponibile. Lo specialista può indicare l'eventuale necessità di ulteriori approfondimenti o di un percorso terapeutico appropriato."),
      prose("ambiti", "Ambiti di consulenza", "Il briefing del centro indica in particolare patologie dell'aorta addominale e dei tronchi sovraortici."),
      prose("svolge", "Come si svolge", "Lo specialista esamina la situazione clinica e, quando necessario, indica approfondimenti ulteriori o un percorso terapeutico appropriato."),
      prose("portare", "Prima della visita", "Porta i referti vascolari, le ecografie già eseguite e la documentazione utile. La consulenza non comporta automaticamente l'effettuazione di procedure chirurgiche nella struttura."),
    ],
    blocks: [
      sec("chi", { heading: "Professionisti", anchor: "chi" }),
      sec("aside", { heading: "Richiedi la visita di chirurgia vascolare in privato", body: "Compila la richiesta: la segreteria ti ricontatterà per concordare data e ora.", ctaLabel: "Richiedi una consulenza privata" }),
      sec("approfondimenti", { heading: "Approfondimenti" }),
      sec("collegate", { heading: "Specialità collegate", ctaLabel: "Tutte le 13 prestazioni" }),
    ],
    related: refs("specialty-angiologia", "specialty-cardiochirurgia", "specialty-cardiologia"),
    seoTitle: "Chirurgia vascolare a Palermo | Angiomedica",
  },
  {
    _id: "specialty-dietologia", _type: "specialty", name: "Dietologia", slug: slug("dietologia"), order: 5, layout: "consulenza", color: "altro",
    homeText: "Valutazione specialistica delle esigenze alimentari e percorsi personalizzati.",
    visitName: "Visita dietologica",
    lead: pt("Consulenze dedicate all'alimentazione e a percorsi nutrizionali personalizzati. [[Titolo professionale, natura dell'attività e terminologia da validare]]"),
    facts: facts([["Durata indicativa", "[[da confermare]]"], ["Da portare", "Esami e referti"], ["Regime", "Solo privato"]]),
    ctaLabel: "Richiedi la visita dietologica",
    sections: [
      prose("alimentazione", "Alimentazione e salute", "L'alimentazione è parte delle abitudini quotidiane che incidono sul benessere generale. Le consulenze di dietologia permettono di valutare esigenze e obiettivi della persona e di impostare indicazioni alimentari coerenti con la situazione individuale e con le valutazioni cliniche disponibili."),
      prose("percorsi", "Percorsi personalizzati", "Il centro indica percorsi alimentari finalizzati alla gestione del peso e all'alimentazione in presenza di specifiche patologie. [[Il nuovo elenco denomina il servizio «visita dietistica»: terminologia e figura professionale da verificare prima della pubblicazione.]]"),
      prose("svolge", "Come si svolge", "Il professionista raccoglie le informazioni necessarie, valuta la documentazione disponibile e definisce le indicazioni appropriate alla situazione individuale."),
      prose("portare", "Prima della visita", "Porta gli eventuali esami recenti e la documentazione clinica richiesta dalla segreteria."),
    ],
    blocks: [
      sec("chi", { heading: "Professionisti", anchor: "chi" }),
      sec("aside", { heading: "Richiedi la visita dietologica in privato", body: "Compila la richiesta: la segreteria ti ricontatterà per concordare data e ora.", ctaLabel: "Richiedi una visita privata" }),
      sec("approfondimenti", { heading: "Approfondimenti" }),
      sec("collegate", { heading: "Specialità collegate", ctaLabel: "Tutte le 13 prestazioni" }),
    ],
    related: refs("specialty-cardiologia", "specialty-angiologia", "specialty-cardiochirurgia"),
    seoTitle: "Dietologia a Palermo | Angiomedica",
  },
];

// ---------------------------------------------------------------- prestazioni (13 schede)
type S = { slug: string; title: string; short?: string; spec: string; art: string; order: number; lead: string; secs: [string, string][]; seo?: string; home?: boolean; ssn?: boolean; check: string };
const SSN_FAQ = faq([["Serve la richiesta del medico?", `Per sapere se è disponibile in convenzione e come prenotarlo chiama la segreteria al ${PHONE}. Il modulo online vale solo per il privato.`]]);
const ANCHORS = ["cos-e", "serve", "svolge", "prepararsi"];

const SERVICES: S[] = [
  { order: 1, slug: "visita-cardiologica", title: "Visita cardiologica", spec: "cardiologia", art: "la visita cardiologica", home: true, ssn: true,
    lead: "Una valutazione specialistica dedicata alla salute del cuore.", seo: "Visita cardiologica a Palermo | Angiomedica",
    secs: [
      ["In cosa consiste", "La visita cardiologica è un incontro con lo specialista per valutare le condizioni del cuore e del sistema cardiovascolare. Il medico raccoglie informazioni sulla storia clinica, esamina i referti disponibili e svolge una valutazione in relazione alle esigenze del paziente. Nel catalogo di Angiomedica, la prestazione è indicata come «visita cardiologica con elettrocardiogramma»."],
      ["Quando può essere utile", "Può essere richiesta per approfondire disturbi o fattori di rischio cardiovascolare e per valutare condizioni cardiache già note, secondo le indicazioni del medico."],
      ["Come si svolge", "Lo specialista raccoglie le informazioni utili e valuta il paziente. Quando previsto, viene registrato l'elettrocardiogramma, esame dell'attività elettrica del cuore."],
      ["Preparazione", "Porta gli esami precedenti, l'elenco delle terapie in corso e la documentazione sanitaria utile. Per istruzioni particolari rivolgiti alla segreteria."],
    ], check: "Modalità, regime e testo clinico." },
  { order: 2, slug: "ecocardiogramma-colordoppler", title: "Ecocardiogramma ColorDoppler", spec: "cardiologia", art: "l'ecocardiogramma", home: true, ssn: true,
    lead: "Un esame ecografico per osservare la struttura e il funzionamento del cuore.", seo: "Ecocardiogramma ColorDoppler a Palermo | Angiomedica",
    secs: [
      ["In cosa consiste", "L'ecocardiogramma ColorDoppler è un'indagine che utilizza gli ultrasuoni per visualizzare le strutture cardiache e raccogliere informazioni sul loro funzionamento. La metodica Doppler permette anche di valutare i flussi del sangue all'interno del cuore."],
      ["A cosa serve", "L'esame aiuta il medico ad approfondire aspetti relativi alle camere cardiache, alle valvole e alla funzione del cuore, secondo il quesito clinico."],
      ["Come si svolge", "Il professionista appoggia una sonda ecografica sul torace e acquisisce immagini e segnali che vengono interpretati durante l'indagine."],
      ["Preparazione", "Eventuali indicazioni pratiche prima dell'esame vengono comunicate dalla segreteria."],
    ], check: "Regime, preparazione e testo clinico." },
  { order: 3, slug: "prova-da-sforzo", title: "Prova da sforzo", spec: "cardiologia", art: "la prova da sforzo", home: false,
    lead: "Valutazione dell'attività cardiaca durante uno sforzo fisico controllato.", seo: "Prova da sforzo a Palermo | Angiomedica",
    secs: [
      ["In cosa consiste", "La prova da sforzo, chiamata anche test ergometrico, permette di osservare la risposta cardiovascolare durante un'attività fisica progressiva e controllata, con monitoraggio elettrocardiografico. Il nuovo elenco specifica l'impiego di una pedana mobile."],
      ["A cosa serve", "L'esame contribuisce a fornire allo specialista informazioni sulla risposta del cuore allo sforzo, quando è indicato in relazione alla situazione clinica."],
      ["Come si svolge", "L'attività fisica viene effettuata con controllo sanitario e secondo un protocollo stabilito dal medico. Il personale monitora i parametri previsti durante l'esame."],
      ["Preparazione", "Segui le indicazioni del centro su abbigliamento, terapie e documentazione. Non modificare autonomamente i farmaci prima dell'esame."],
    ], check: "Utilizzo attuale della pedana mobile, protocollo e condizioni di esecuzione." },
  { order: 4, slug: "holter-cardiaco", title: "Holter cardiaco", spec: "cardiologia", art: "l'Holter cardiaco", home: true,
    lead: "Registrazione dell'attività elettrica del cuore durante le attività quotidiane.", seo: "Holter cardiaco a Palermo | Angiomedica",
    secs: [
      ["In cosa consiste", "L'Holter cardiaco è un monitoraggio elettrocardiografico prolungato eseguito mediante un dispositivo portatile. L'elenco prestazioni di Angiomedica indica registrazioni di 24 o 48 ore, secondo il monitoraggio richiesto."],
      ["A cosa serve", "Può aiutare il medico a valutare il ritmo cardiaco e a rilevare alterazioni non sempre presenti durante un elettrocardiogramma effettuato in ambulatorio."],
      ["Come si svolge", "Il personale applica il dispositivo e fornisce le istruzioni necessarie. Terminato il monitoraggio, i dati registrati vengono analizzati secondo le procedure del centro."],
      ["Preparazione", "Al momento dell'appuntamento riceverai le indicazioni sull'uso e sulla restituzione del dispositivo."],
    ], check: "Scelta tra 24 e 48 ore, modalità operative, refertazione e regime." },
  { order: 5, slug: "holter-pressorio", title: "Holter pressorio", spec: "cardiologia", art: "l'Holter pressorio", home: true,
    lead: "Monitoraggio della pressione arteriosa durante la giornata.", seo: "Holter pressorio a Palermo | Angiomedica",
    secs: [
      ["In cosa consiste", "L'Holter pressorio, indicato nel nuovo elenco anche come monitoraggio dinamico della pressione arteriosa h24 (ABPM), utilizza un apparecchio portatile che misura la pressione a intervalli programmati durante 24 ore."],
      ["A cosa serve", "Permette al medico di osservare come varia la pressione in momenti diversi della giornata, offrendo dati utili alla valutazione clinica."],
      ["Come si svolge", "Viene applicato un bracciale collegato a un dispositivo registratore. Il paziente riceve le istruzioni per il monitoraggio e la riconsegna."],
      ["Preparazione", "Segui le indicazioni fornite dalla segreteria e non sospendere eventuali terapie senza indicazione medica."],
    ], check: "Durata h24 (ABPM), consegna referto e regime." },
  { order: 6, slug: "visita-angiologica", title: "Visita angiologica", spec: "angiologia", art: "la visita angiologica", home: true, ssn: true,
    lead: "Una valutazione specialistica dedicata alla circolazione arteriosa e venosa.",
    secs: [
      ["In cosa consiste", "La visita angiologica permette di valutare le condizioni del sistema vascolare. Lo specialista raccoglie la storia clinica, prende in esame eventuali disturbi e approfondisce la documentazione diagnostica disponibile. Il nuovo elenco del centro denomina la prestazione «visita angiologica con EcocolorDoppler degli arti»."],
      ["Quando può essere utile", "La visita può contribuire a chiarire problematiche della circolazione o monitorare condizioni vascolari già note, sulla base delle indicazioni mediche."],
      ["Come si svolge", "Il medico esegue la valutazione clinica e l'indagine EcocolorDoppler degli arti prevista nell'elenco del centro, secondo l'indicazione e il distretto da esaminare."],
      ["Prima della visita", "Porta, se disponibili, i referti vascolari precedenti e le informazioni sulle terapie in corso."],
    ], check: "Distretti compresi, modalità e regime." },
  { order: 7, slug: "ecocolordoppler-tsa", title: "EcocolorDoppler dei tronchi sovraortici (TSA)", short: "EcocolorDoppler TSA", spec: "angiologia", art: "l'EcocolorDoppler TSA", home: true, ssn: true,
    lead: "Esame ecografico dedicato allo studio dei principali vasi sanguigni del collo.",
    secs: [
      ["In cosa consiste", "L'EcocolorDoppler TSA utilizza gli ultrasuoni per osservare i tronchi sovraortici e valutare le caratteristiche del flusso sanguigno al loro interno."],
      ["A cosa serve", "L'indagine può essere indicata quando il medico ritiene necessario approfondire le condizioni dei vasi che contribuiscono alla circolazione verso il cervello. [[Il documento delle prestazioni cita l'esecuzione a riposo e con prove dinamiche; la modalità effettiva va confermata.]]"],
      ["Come si svolge", "Una sonda ecografica viene appoggiata nella zona del collo. Le immagini e i segnali Doppler vengono esaminati dal professionista."],
      ["Prima dell'esame", "Porta eventuali ecografie e referti vascolari precedenti. Per indicazioni specifiche contatta la segreteria."],
    ], check: "Nomenclatura, modalità e regime." },
  { order: 8, slug: "ecocolordoppler-transcranico", title: "EcocolorDoppler transcranico", spec: "angiologia", art: "l'EcocolorDoppler transcranico", home: true,
    lead: "Indagine ecografica per la valutazione di specifici flussi della circolazione intracranica.",
    secs: [
      ["In cosa consiste", "L'EcocolorDoppler transcranico è un'indagine che utilizza segnali ultrasonori per studiare il flusso sanguigno in alcuni vasi intracranici, attraverso determinate finestre di esplorazione."],
      ["A cosa serve", "Viene impiegato quando lo specialista ha bisogno di informazioni aggiuntive sulla circolazione intracranica, nell'ambito di una valutazione medica."],
      ["Come si svolge", "Il professionista posiziona la sonda in specifiche regioni del capo e interpreta i segnali registrati. La possibilità di esplorazione può variare tra i pazienti."],
      ["Prima dell'esame", "La segreteria comunica eventuali indicazioni preliminari e le informazioni pratiche necessarie."],
    ], check: "Protocollo e contenuto clinico con lo specialista." },
  { order: 9, slug: "ecocolordoppler-aorta-addominale", title: "EcocolorDoppler dell'aorta addominale", short: "EcocolorDoppler aorta addominale", spec: "angiologia", art: "l'EcocolorDoppler dell'aorta addominale", home: true,
    lead: "Studio ecografico dell'aorta addominale e, secondo indicazione, dei vasi viscerali.",
    secs: [
      ["In cosa consiste", "L'EcocolorDoppler dell'aorta addominale permette di visualizzare il tratto addominale dell'aorta attraverso gli ultrasuoni. Il briefing di Angiomedica comprende anche lo studio dei vasi viscerali."],
      ["A cosa serve", "L'esame può contribuire alla valutazione di condizioni che interessano i grandi vasi dell'addome, quando previsto dall'indicazione medica."],
      ["Come si svolge", "La sonda ecografica viene appoggiata sull'addome. Il professionista acquisisce le immagini e le informazioni Doppler necessarie alla valutazione."],
      ["Preparazione", "Per alcune indagini addominali possono essere necessarie specifiche istruzioni preliminari. Verifica la preparazione con la segreteria prima dell'appuntamento."],
    ], check: "Indicazioni di preparazione e distretti inclusi." },
  { order: 10, slug: "ecocolordoppler-arti", title: "EcocolorDoppler degli arti", short: "EcocolorDoppler arti", spec: "angiologia", art: "l'EcocolorDoppler degli arti", home: true,
    lead: "Esame ecografico per lo studio della circolazione arteriosa e venosa di braccia e gambe.",
    secs: [
      ["In cosa consiste", "L'EcocolorDoppler degli arti consente di osservare i vasi sanguigni di braccia e gambe e valutarne i flussi mediante ultrasuoni. Il centro indica esami arteriosi e venosi sia degli arti superiori sia degli arti inferiori, a riposo e con possibili prove dinamiche. Tutte queste varianti restano raccolte in un'unica scheda."],
      ["A cosa serve", "Lo specialista può utilizzarlo per approfondire condizioni del circolo arterioso o venoso, in base alla zona interessata e al quesito clinico."],
      ["Come si svolge", "La sonda viene posizionata sul distretto da esaminare. Il professionista acquisisce immagini e segnali Doppler dei vasi interessati."],
      ["Prima dell'esame", "Al momento della richiesta indica se l'esame riguarda gli arti superiori o inferiori e il sistema arterioso o venoso, come specificato dal medico."],
    ], check: "Prove dinamiche e denominazioni delle varianti." },
  { order: 11, slug: "visita-dietologica", title: "Visita dietologica", spec: "dietologia", art: "la visita dietologica",
    lead: "Una consulenza dedicata alla valutazione delle esigenze alimentari individuali.",
    secs: [
      ["In cosa consiste", "La prestazione è denominata «visita dietistica» nel nuovo elenco del centro. La visita prevede una valutazione delle abitudini alimentari, delle condizioni e degli obiettivi della persona. Può rappresentare il punto di partenza per indicazioni e percorsi alimentari personalizzati."],
      ["A cosa serve", "Il briefing di Angiomedica indica percorsi per la gestione del peso e l'alimentazione in presenza di specifiche patologie."],
      ["Come si svolge", "Il professionista raccoglie le informazioni necessarie, valuta la documentazione disponibile e definisce le indicazioni appropriate alla situazione individuale."],
      ["Prima della visita", "Porta gli eventuali esami recenti e la documentazione clinica richiesta dalla segreteria."],
    ], check: "Titolo «visita dietologica» o «visita dietistica», figura professionale, modalità." },
  { order: 12, slug: "visita-cardiochirurgica", title: "Visita cardiochirurgica", spec: "cardiochirurgia", art: "la visita cardiochirurgica",
    lead: "Consulenza specialistica per condizioni cardiache che richiedono una valutazione cardiochirurgica.",
    secs: [
      ["In cosa consiste", "La visita cardiochirurgica permette di approfondire una situazione cardiaca attraverso il confronto con uno specialista. La valutazione considera la storia clinica e gli esami già effettuati."],
      ["A cosa serve", "Tra gli ambiti di consulenza indicati da Angiomedica figurano patologie delle arterie coronarie, delle valvole cardiache e dell'aorta toracica. La visita contribuisce a definire gli approfondimenti o i passi successivi appropriati, sulla base del giudizio medico."],
      ["Come si svolge", "Il professionista esamina la documentazione disponibile e discute con il paziente il quadro clinico e le possibili indicazioni."],
      ["Prima della visita", "Porta referti, esami strumentali e la documentazione pertinente. La consulenza non implica l'esecuzione di interventi chirurgici presso Angiomedica."],
    ], check: "Denominazioni cliniche e contenuti con il professionista." },
  { order: 13, slug: "visita-chirurgia-vascolare", title: "Visita di chirurgia vascolare", spec: "chirurgia-vascolare", art: "la visita di chirurgia vascolare",
    lead: "Consulenza specialistica per la valutazione di patologie che interessano i vasi sanguigni.",
    secs: [
      ["In cosa consiste", "La visita di chirurgia vascolare consente di approfondire condizioni del sistema vascolare che richiedono un parere specialistico. Il medico valuta la storia clinica e la documentazione diagnostica disponibile."],
      ["A cosa serve", "Tra gli ambiti indicati nel briefing figurano patologie dell'aorta addominale e dei tronchi sovraortici."],
      ["Come si svolge", "Lo specialista esamina la situazione clinica e, quando necessario, indica approfondimenti ulteriori o un percorso terapeutico appropriato."],
      ["Prima della visita", "Porta i referti vascolari, le ecografie già eseguite e la documentazione utile. La consulenza non comporta automaticamente l'effettuazione di procedure chirurgiche nella struttura."],
    ], check: "Erogazione attuale, professionisti, regime e contenuto clinico." },
];

const services: Doc[] = SERVICES.map((s) => {
  const cardioAngio = s.spec === "cardiologia" || s.spec === "angiologia";
  return {
    _id: `service-${s.slug}`, _type: "service", title: s.title, shortTitle: s.short ?? s.title, slug: slug(s.slug), order: s.order,
    specialty: ref(`specialty-${s.spec}`),
    lead: pt(s.lead),
    facts: facts([["Durata indicativa", "[[da confermare]]"], ["Preparazione", "[[da confermare]]"], ["Regime", cardioAngio ? "Privato · S.S.N. [[da confermare]]" : "Solo privato"]]),
    photoCaption: "Foto reale · esame in ambulatorio",
    sections: s.secs.map(([h, body], i) => prose(ANCHORS[i], h, body + (i === 3 ? ` [[Da verificare: ${s.check}]]` : ""))),
    faq: cardioAngio ? SSN_FAQ : [],
    prosHeading: "Professionisti",
    ssn: cardioAngio,
    ssnText: pt("Puoi richiedere la prestazione in regime privato con il modulo online: la segreteria ti ricontatterà per fissare l'appuntamento."),
    asideTitle: `Richiedi ${s.art} in privato`,
    ctaLabel: `Richiedi ${s.art}`,
    home: !!s.home, inSsn: !!s.ssn,
    seoTitle: s.seo ?? `${s.short ?? s.title} a Palermo | Angiomedica`,
  };
});

// ---------------------------------------------------------------- professionisti (testi V2 dai CV, da validare)
const professionals: Doc[] = [
  {
    _id: "professional-michele-ballo", _type: "professional", name: "Prof. Michele Ballo", shortName: "Michele Ballo", slug: slug("michele-ballo"), order: 1,
    role: "Cardiologo e angiologo", subtitle: "Cardiologia e Angiologia",
    cardText: "Esperienza clinica e accademica nelle malattie cardiovascolari, con attività di insegnamento e ricerca.",
    specialties: refs("specialty-cardiologia", "specialty-angiologia"),
    intro: pt("Esperienza clinica e accademica nelle malattie cardiovascolari, con attività di insegnamento e ricerca."),
    sections: [
      prose("biografia", "Biografia", "Il professor Michele Ballo è medico specializzato in cardiologia e angiologia, con un lungo percorso di attività clinica, universitaria e scientifica. Laureato in Medicina e Chirurgia all'Università degli Studi di Palermo, ha conseguito la specializzazione in Cardiologia all'Università di Torino, in Angiologia all'Università di Milano e in Anestesiologia e Rianimazione all'Università di Catania. Il suo curriculum documenta attività di docenza e ricerca all'Università degli Studi di Palermo e una produzione scientifica dedicata alle metodiche diagnostiche e alle patologie cardiovascolari."),
      prose("formazione", "Formazione e attività scientifica", "Nel corso della carriera ha affiancato alla pratica clinica l'insegnamento universitario e la partecipazione a società e iniziative scientifiche del settore cardiovascolare. Ha contribuito a pubblicazioni su flebologia e diagnostica vascolare."),
      prose("attivita", "Attività presso Angiomedica", "Il documento delle prestazioni lo indica come direttore sanitario di Angiomedica. [[Ruolo in carica al 2026 da validare.]] L'associazione alle singole prestazioni e la disponibilità per le visite devono essere confermate dal centro."),
    ],
  },
  {
    _id: "professional-manfredi-ballo", _type: "professional", name: "Dott. Manfredi Ballo", shortName: "Manfredi Ballo", slug: slug("manfredi-ballo"), order: 2,
    role: "Cardiologo", subtitle: "Cardiologia e diagnostica cardiologica",
    cardText: "Specialista in cardiologia con esperienza nella diagnostica ecocardiografica, nell'ergometria e nel monitoraggio Holter.",
    specialties: refs("specialty-cardiologia"),
    intro: pt("Specialista in cardiologia con esperienza nella diagnostica ecocardiografica, nell'ergometria e nel monitoraggio Holter."),
    sections: [
      prose("biografia", "Biografia", "Il dottor Manfredi Ballo è medico specializzato in Cardiologia all'Università degli Studi di Palermo. Ha conseguito un dottorato di ricerca in fisiopatologia cardiovascolare, renale e dello sport e svolto attività di ricerca e collaborazione nel laboratorio di ecocardiografia della Mayo Clinic di Rochester, negli Stati Uniti. Nel curriculum sono documentate attività cliniche presso Angiomedica, in particolare nell'ambito dell'ecocardiografia, dell'ergometria e dei monitoraggi Holter."),
      prose("formazione", "Formazione e ricerca", "La sua attività scientifica comprende pubblicazioni e partecipazioni a congressi nazionali e internazionali, con approfondimenti nell'ambito dell'ecocardiografia e della diagnostica cardiovascolare."),
    ],
  },
  {
    _id: "professional-emerico-ballo", _type: "professional", name: "Dott. Emerico Ballo", shortName: "Emerico Ballo", slug: slug("emerico-ballo"), order: 3,
    role: "Cardiochirurgo", subtitle: "Cardiochirurgia",
    cardText: "Specialista in cardiochirurgia con esperienza clinica, attività scientifica e formazione internazionale.",
    specialties: refs("specialty-cardiochirurgia"),
    intro: pt("Specialista in cardiochirurgia con esperienza clinica, attività scientifica e formazione internazionale."),
    sections: [
      prose("biografia", "Biografia", "Il dottor Emerico Ballo è medico specializzato in Cardiochirurgia presso l'Università degli Studi di Roma La Sapienza. Ha conseguito un dottorato di ricerca in fisiopatologia chirurgica all'Università degli Studi di Palermo. Il curriculum documenta attività cliniche e di responsabilità nel settore cardiochirurgico, tra cui un'esperienza al Maria Eleonora Hospital, oltre a periodi di formazione internazionale e partecipazioni a congressi e pubblicazioni scientifiche."),
      prose("esperienza", "Esperienza e formazione", "Il percorso professionale comprende attività nell'ambito della chirurgia del cuore e dei grandi vasi e periodi formativi presso strutture estere. Sono riportate esperienze di ricerca e collaborazione universitaria."),
      prose("attivita", "Prestazioni presso Angiomedica", "[[Visita cardiochirurgica, da confermare.]] La consulenza specialistica svolta nel centro non implica che gli interventi chirurgici vengano eseguiti nella struttura."),
    ],
  },
];

// ---------------------------------------------------------------- blog: segnaposto della demo (il Master non fornisce articoli)
const POSTS: [string, string, string, "cardio" | "angio" | "altro", string[]][] = [
  ["ecocolordoppler-tronchi-sovraortici", "EcocolorDoppler dei tronchi sovraortici: a cosa serve e come si svolge", "Angiologia", "angio", ["angiologia", "chirurgia-vascolare"]],
  ["holter-cardiaco-come-prepararsi", "Holter cardiaco: come prepararsi e cosa aspettarsi", "Cardiologia", "cardio", ["cardiologia"]],
  ["pressione-alta-monitoraggio-24-ore", "Pressione alta: quando è utile un monitoraggio di 24 ore", "Prevenzione", "cardio", ["cardiologia", "dietologia"]],
  ["gambe-pesanti-ecocolordoppler", "Gambe pesanti: quando fare un EcocolorDoppler", "Circolazione", "angio", ["angiologia"]],
  ["colesterolo-e-alimentazione", "Colesterolo e alimentazione: da dove cominciare", "Alimentazione", "altro", ["dietologia"]],
  ["prima-di-un-intervento-al-cuore", "Prima di un intervento al cuore: le domande da fare al chirurgo", "Cardiochirurgia", "cardio", ["cardiochirurgia"]],
  ["controlli-dopo-intervento-cardiaco", "I controlli nei mesi dopo un intervento cardiaco", "Dopo l'intervento", "cardio", ["cardiochirurgia"]],
  ["aneurisma-aorta-addominale", "Aneurisma dell'aorta addominale: quando si interviene", "Chirurgia vascolare", "angio", ["chirurgia-vascolare"]],
  ["ecocardiogramma-cosa-mostra", "Ecocardiogramma: cosa mostra e quando viene richiesto", "Cuore", "cardio", []],
];
const posts: Doc[] = POSTS.map(([s, title, category, color, specs], i) => ({
  _id: `post-${s}`, _type: "post", title, slug: slug(s), category, color,
  specialties: refs(...specs.map((x) => `specialty-${x}`)),
  dateLabel: "[[data]]", date: `2026-10-${String(30 - i).padStart(2, "0")}`, readingTime: "[[5 min di lettura]]",
  excerpt: pt("[[Estratto dell'articolo, due righe al massimo.]]"),
  authorLabel: "[[Nome Cognome]], [[specializzazione]]",
  reviewer: "[[Nome Cognome]], [[data]]",
  sections: [
    prose("a1", "[[Primo titolo]]", "[[Segnaposto: il Master editoriale non fornisce articoli. Contenuti da scrivere su fonti valide e con revisione clinica prima della pubblicazione.]]"),
    prose("fonti", "Fonti", "- [[Fonte bibliografica 1]]\n- [[Fonte bibliografica 2]]"),
  ],
}));

// ---------------------------------------------------------------- homepage
const homePage: Doc = {
  _id: "homePage", _type: "homePage",
  seoTitle: "Centro di cardiologia e angiologia a Palermo — Angiomedica",
  featuredServices: refs("service-visita-cardiologica", "service-visita-angiologica", "service-ecocardiogramma-colordoppler", "service-ecocolordoppler-tsa", "service-holter-cardiaco", "service-ecocolordoppler-arti", "service-holter-pressorio"),
  pickerServices: refs("service-visita-cardiologica", "service-ecocardiogramma-colordoppler", "service-holter-cardiaco", "service-holter-pressorio", "service-ecocolordoppler-tsa", "service-visita-angiologica"),
  blocks: [
    sec("hero", {
      heading: "La salute del cuore e della circolazione, da oltre 30 anni.",
      body: "Da oltre trent'anni Angiomedica si occupa di prevenzione, diagnosi e cura delle patologie cardiache e vascolari. A Palermo, professionisti specializzati e personale dedicato accompagnano ogni paziente con competenza e attenzione.",
      ctaLabel: "Prenota una visita privata", label: "Scopri le prestazioni",
      photoCaption: "Fotografia autentica\nmedico e paziente · con liberatoria",
    }),
    sec("info", { items: [{ label: "Dove siamo" }, { label: "Orari" }, { label: "Contattaci" }], ctaLabel: "Chiama" }),
    sec("specialita", { heading: "Le nostre specialità", body: "Competenze dedicate alla salute cardiovascolare, con attività di cardiologia, angiologia, cardiochirurgia, chirurgia vascolare e dietologia." }),
    sec("centro", {
      heading: "Esperienza e attenzione alle persone.",
      body: "Angiomedica nasce a Palermo dall'esperienza del professor Michele Ballo. Nel tempo il centro ha sviluppato un'attività dedicata alla diagnosi e alla valutazione delle patologie cardiovascolari, affiancando competenze specialistiche, aggiornamento e attenzione al rapporto con i pazienti.",
      ctaLabel: "Conosci Angiomedica", photoCaption: "Fotografia reale del centro · a tutta larghezza",
    }),
    sec("prestazioni", { heading: "Visite ed esami", body: "Consulta le informazioni sulle prestazioni e trova quella di tuo interesse.", ctaLabel: "Vedi tutte le 13 prestazioni" }),
    sec("professionisti", { heading: "Le persone di Angiomedica", body: "Conosci i professionisti che operano nel centro, le loro specializzazioni e le prestazioni di cui si occupano.", ctaLabel: "Scopri tutti i professionisti" }),
    sec("domicilio", {
      heading: "La nostra assistenza, anche a domicilio.",
      body: "Secondo il nuovo elenco del centro, le visite specialistiche e gli esami strumentali possono essere richiesti anche a domicilio, ad eccezione del test da sforzo. Contatta la segreteria per verificare condizioni e disponibilità della prestazione.",
      ctaLabel: "Scopri i servizi a domicilio",
    }),
    sec("ssn", {
      heading: "Prestazioni con il Servizio Sanitario Nazionale",
      body: "Per conoscere le prestazioni disponibili attraverso il S.S.N. e le modalità di accesso, consulta la pagina dedicata oppure contatta la segreteria telefonicamente o via email.",
      ctaLabel: "Informazioni sul S.S.N.",
    }),
    sec("richiesta", {
      heading: "Richiedi il tuo appuntamento privato.",
      body: "Hai individuato la visita o l'esame di tuo interesse? Compila il modulo. La segreteria ti ricontatterà per verificare le disponibilità e concordare l'appuntamento.",
      ctaLabel: "Invia la richiesta",
      items: [
        { title: "Prenoti in convenzione S.S.N.?", text: `Questo modulo vale solo per le visite private. Per il S.S.N. chiama la segreteria al ${PHONE} o scrivi una email.` },
        { title: "Preferisci parlarne?", label: "WhatsApp (solo visite private)" },
      ],
    }),
    sec("contatti", { heading: "Angiomedica, nel centro di Palermo.", ctaLabel: "Come raggiungerci", label: "Tutti i contatti", photoCaption: "Mappa statica · link alle indicazioni" }),
    sec("blog", { heading: "Informarsi per prevenire", body: "Approfondimenti dei nostri specialisti su salute del cuore, circolazione ed esami diagnostici.", ctaLabel: "Tutti gli articoli" }),
  ],
};

// ---------------------------------------------------------------- pagine
const page = (s: string, d: Record<string, unknown>): Doc => ({ _id: `page-${s}`, _type: "page", slug: slug(s), ...d });

const pages: Doc[] = [
  page("il-centro", {
    title: "Angiomedica: esperienza e attenzione alla salute cardiovascolare",
    lead: pt("Angiomedica è una struttura specialistica a Palermo che da oltre trent'anni si occupa di prevenzione, diagnosi e cura delle patologie cardiache e vascolari. Un'attività costruita sull'esperienza dei professionisti, sull'aggiornamento delle metodiche diagnostiche e sull'attenzione alla persona."),
    photoCaption: "Foto reale della sede · facciata o sala d'attesa",
    seoTitle: "Angiomedica Palermo | Il Centro",
    seoDescription: "Scopri Angiomedica, centro specialistico a Palermo dedicato alla salute del cuore e della circolazione, ai professionisti e ai servizi diagnostici.",
    blocks: [
      sec("chi-siamo", { heading: "Competenze che lavorano insieme", body: "La valutazione della salute cardiovascolare può richiedere competenze diverse. Angiomedica riunisce professionisti che operano nelle aree della cardiologia, dell'angiologia, della cardiochirurgia e della chirurgia vascolare, affiancati da personale sanitario e di segreteria." }),
      sec("storia", {
        heading: "Una storia che parte da Palermo",
        body: "Il percorso di Angiomedica inizia nel [[1996/97]] per iniziativa del professor Michele Ballo. Nella sede di Via Ruggero Settimo il centro ha sviluppato nel tempo la propria attività, ampliando le consulenze specialistiche dedicate alle patologie cardiovascolari. [[Anno esatto, tappe e qualifica del fondatore da verificare.]]",
        items: [
          { title: "[[1996/97]]", text: "Apertura del centro per iniziativa del professor Michele Ballo" },
          { title: "[[anno]]", text: "[[Arrivo dell'angiologia]]" },
          { title: "[[anno]]", text: "[[Sede in via Ruggero Settimo]]" },
          { title: "[[oggi]]", text: "Cinque specialità, [[n]] professionisti" },
        ],
      }),
      sec("principi", {
        heading: "Il rapporto con il paziente",
        items: [
          { title: "[[Principio 1]]", text: "Professionalità, accoglienza e chiarezza delle informazioni sono elementi centrali nel lavoro quotidiano di Angiomedica." },
          { title: "[[Principio 2]]", text: "La segreteria accompagna il paziente nella scelta del corretto canale di accesso alle prestazioni e nella gestione degli appuntamenti." },
          { title: "[[Principio 3]]", text: "[[Es. Esami e visita nella stessa sede.]]" },
        ],
      }),
      sec("sede", {
        heading: "Diagnostica e aggiornamento",
        body: "Le attività del centro comprendono indagini ecografiche e Doppler, elettrocardiografia, monitoraggi cardiaci e pressori e test da sforzo. La scelta degli esami dipende dalle necessità cliniche del paziente e dalle indicazioni del medico.",
        items: [{ title: "Foto reale · ambulatorio" }, { title: "Foto · strumentazione" }, { title: "Foto · sala d'attesa" }],
      }),
      sec("professionisti", { heading: "Conosci i professionisti", ctaLabel: "Tutti i professionisti" }),
      sec("chiusura", { heading: "Prenota una visita privata", body: "Scegli la prestazione e invia la richiesta: la segreteria ti ricontatta per confermare data e ora.", ctaLabel: "Richiedi una visita privata" }),
    ],
  }),
  page("per-il-paziente", {
    title: "Informazioni per il paziente",
    lead: pt("Tutto quello che serve per organizzare la tua visita, conoscere le modalità di accesso e raggiungere il centro."),
    seoTitle: "Informazioni per il paziente | Angiomedica Palermo",
    blocks: [
      sec("prenotare", {
        heading: "Due modi per prenotare",
        body: "Privato e S.S.N. seguono strade diverse: il modulo online vale solo per il privato.",
        items: [
          { label: "In privato", title: "Visite ed esami privati", text: "Puoi inviare una richiesta di appuntamento per le prestazioni private attraverso il modulo online. La segreteria ti ricontatterà per verificare la disponibilità e concordare giorno e orario. In alternativa puoi contattare il centro telefonicamente o, per le sole visite private, tramite WhatsApp.", ctaLabel: "Richiedi un appuntamento privato", href: "/richiesta-visita-privata/" },
          { label: "In convenzione S.S.N.", title: "Prestazioni attraverso il S.S.N.", text: "Per informazioni e richieste relative alle prestazioni effettuabili tramite Servizio Sanitario Nazionale, i canali indicati dal centro sono il telefono e l'email. Le disponibilità e la documentazione necessaria devono essere verificate con la segreteria.", ctaLabel: "Informazioni sul S.S.N.", href: "/prestazioni-ssn/" },
        ],
      }),
      sec("pratiche", {
        heading: "Informazioni pratiche",
        items: [
          { label: "Orari", title: "Lun–Ven 9–13 / 15–19*", text: "[[Orari della segreteria e degli ambulatori da confermare]]" },
          { label: "Dove siamo", title: "Via Ruggero Settimo 55", text: "Palermo · [[indicazioni per arrivare]]" },
          { label: "Prima dell'appuntamento", title: "Esami e documenti", text: "Ti consigliamo di portare con te gli esami e i referti precedenti pertinenti e la documentazione sanitaria utile alla valutazione. Per gli accessi tramite S.S.N., il centro richiede la documentazione prescrittiva prevista; verifica in anticipo con la segreteria cosa è necessario presentare." },
          { label: "Il giorno della visita", title: "Arriva 15 minuti prima", text: "Il briefing consiglia di presentarsi circa 15 minuti prima dell'orario concordato. All'arrivo è prevista una procedura di accettazione; l'ordine delle visite segue gli appuntamenti e non il numero di accesso all'accettazione. [[Procedura da validare]]" },
        ],
      }),
      sec("domicilio", { label: "Non puoi venire in sede?", heading: "Visite ed esami a domicilio" }),
      sec("faq", { heading: "Domande frequenti" }),
      sec("aiuto", { heading: "Hai bisogno di aiuto?", body: `Chiama la segreteria al ${PHONE} o scrivi a angiomedica@libero.it*.`, ctaLabel: "Vai ai contatti" }),
    ],
    faq: faq([
      ["Devo avere una prescrizione?", "Per l'accesso tramite S.S.N. può essere richiesta la prescrizione prevista. Prima dell'appuntamento verifica la documentazione con la segreteria."],
      ["Come posso richiedere una visita privata?", "Attraverso il modulo online, telefonicamente oppure tramite il canale WhatsApp riservato alle richieste private."],
      ["La compilazione del modulo conferma la visita?", "No. La segreteria ti ricontatterà per verificare le disponibilità e concordare l'appuntamento."],
      ["Come posso modificare un appuntamento?", "Contatta la segreteria telefonicamente o tramite email."],
      ["Posso fare un esame a domicilio?", "Alcune prestazioni sono indicate come disponibili a domicilio. La segreteria può verificare disponibilità e condizioni per la tua richiesta."],
    ]),
  }),
  page("visite-a-domicilio", {
    title: "Visite ed esami a domicilio",
    lead: pt("Angiomedica indica la possibilità di eseguire a domicilio visite specialistiche ed esami strumentali, escluso il test ergometrico da sforzo. La segreteria verifica le condizioni di disponibilità per ogni richiesta."),
    photoCaption: "Foto reale · visita a domicilio",
    seoTitle: "Visite ed esami a domicilio a Palermo | Angiomedica",
    blocks: [
      sec("hero", { ctaLabel: "Chiedi informazioni sui servizi a domicilio", label: "Servizio solo privato. Disponibilità da verificare con la segreteria." }),
      sec("come-funziona", {
        heading: "Come richiedere il servizio",
        items: [
          { title: "Invii la richiesta", text: "Contatta la segreteria indicando quale prestazione desideri richiedere e il luogo in cui dovrebbe essere svolta." },
          { title: "Verifichiamo la disponibilità", text: "Il personale verificherà le condizioni del servizio e ti fornirà le indicazioni necessarie." },
          { title: "Il medico viene a casa", text: "Nel giorno concordato, con l'attrezzatura necessaria. Il referto ti viene consegnato [[modalità da confermare]]." },
        ],
      }),
      sec("cosa", {
        label: "Elenco da confermare con il centro",
        heading: "Quali prestazioni possono essere richieste",
        body: "Il nuovo documento del centro precisa che le visite specialistiche e gli esami strumentali elencati possono essere effettuati anche a domicilio, con esclusione del test ergometrico da sforzo. La disponibilità della singola prestazione va comunque verificata con la segreteria.",
      }),
      sec("dove", {
        heading: "Disponibilità e informazioni pratiche",
        items: [{ label: "Zone servite", title: "Palermo e [[comuni da confermare]]" }, { label: "Giorni e orari", title: "[[da confermare]]" }, { label: "Regime", title: "Solo privato" }],
        photoCaption: "Mappa dell'area servita · da confermare",
      }),
      sec("faq", { heading: "Domande frequenti" }),
      sec("chiusura", { heading: "Richiedi una visita a domicilio", body: "La segreteria è il riferimento per conoscere condizioni, costi e modalità.", ctaLabel: "Invia la richiesta" }),
    ],
    faq: faq([
      ["Chi può richiedere la visita a domicilio?", "[[Criteri da confermare con il centro: per esempio persone anziane, allettate o con difficoltà a spostarsi.]]"],
      ["Quanto costa?", "[[Tariffe da confermare.]] La segreteria ti comunica il costo prima di fissare l'appuntamento."],
      ["È possibile in convenzione S.S.N.?", "No: il servizio a domicilio è solo privato. [[da confermare]]"],
      ["Serve preparare qualcosa a casa?", "Tieni pronti gli esami precedenti e l'elenco dei farmaci. [[Indicazioni pratiche da confermare]]"],
    ]),
  }),
  page("prestazioni-ssn", {
    title: "Prestazioni attraverso il Servizio Sanitario Nazionale",
    lead: pt(`Informazioni sui servizi disponibili e sulle modalità di accesso alle prestazioni S.S.N. di Angiomedica.

Per verificare le prestazioni disponibili attraverso il S.S.N. e le relative condizioni, contatta la segreteria telefonicamente o via email.`),
    seoTitle: "Prestazioni S.S.N. a Palermo | Angiomedica",
    blocks: [
      sec("elenco", { label: "Elenco da confermare con il centro", heading: "Prestazioni disponibili", body: "Ogni prestazione ha la sua scheda, con le informazioni su come si svolge." }),
      sec("prenotare", {
        heading: "Prenotazioni e variazioni",
        body: "Le richieste di prenotazione e le eventuali modifiche dell'appuntamento vengono gestite attraverso telefono o email, secondo le indicazioni del centro.",
        items: [
          { label: "Telefono · Lun–Ven 9–13 / 15–19*", title: PHONE, text: "Tieni a portata di mano l'impegnativa.", href: "tel:+3991580301" },
          { label: "Email", title: "[[indirizzo ufficiale per richieste S.S.N.]]", text: "Allega l'impegnativa: la segreteria ti risponde con data e ora.", href: "#" },
        ],
      }),
      sec("documenti", {
        heading: "Documentazione necessaria",
        body: `Per gli esami in convenzione il briefing indica la necessità di una richiesta medica. Contatta la segreteria per verificare prescrizione, eventuali requisiti e documentazione da presentare il giorno dell'appuntamento.

- impegnativa del medico [[requisiti da verificare]];
- tessera sanitaria;
- eventuale certificato di esenzione dal ticket.`,
      }),
      sec("faq", { heading: "Domande frequenti" }),
      sec("privato", { heading: "Preferisci una visita privata?", body: "Per il privato puoi inviare la richiesta online.", ctaLabel: "Richiesta visita privata" }),
    ],
    faq: faq([
      ["Serve l'impegnativa?", "Sì, serve la prescrizione del medico di famiglia o dello specialista. [[da verificare]]"],
      ["Quanto si paga?", "Il ticket previsto, salvo esenzioni. [[Importi ed esenzioni da verificare]]"],
      ["Posso usare il modulo online?", "No: il modulo online vale solo per le visite private. Per il S.S.N. chiama o scrivi."],
      ["Quali sono i tempi di attesa?", "[[Da comunicare solo se confermati.]]"],
    ]),
  }),
  page("contatti", {
    title: "Contatta Angiomedica",
    lead: pt("Per informazioni sulle prestazioni, sulle modalità di accesso e sugli appuntamenti, la segreteria è a tua disposizione."),
    photoCaption: "Mappa · Via Ruggero Settimo 55",
    seoTitle: "Contatti, sede e orari | Angiomedica Palermo",
    blocks: [
      sec("recapiti", {
        items: [
          { label: "Telefono", title: PHONE, text: "Privato e S.S.N.", href: "tel:+3991580301" },
          { label: "Email", title: "angiomedica@libero.it*", text: "Privato e S.S.N.", href: "mailto:angiomedica@libero.it" },
          { label: "WhatsApp", title: "335 719 7730*", text: "Solo per richieste private", href: "https://wa.me/393357197730" },
        ],
      }),
      sec("modulo", {
        heading: "Richieste per visite private",
        body: "Per richiedere un appuntamento privato puoi compilare il modulo online. La segreteria ti ricontatterà per verificarne la disponibilità.",
        ctaLabel: "Invia la richiesta",
        label: `Per il S.S.N. il modulo non vale: chiama il ${PHONE}.`,
      }),
      sec("dove", {
        items: [
          { label: "Indirizzo", title: "Via Ruggero Settimo 55, 90139 Palermo [[CAP, piano e accessibilità da verificare]]" },
          { label: "Orari della segreteria", title: "Dal lunedì al venerdì: 9:00–13:00 e 15:00–19:00*" },
          { label: "Accessibilità", title: "[[Ascensore, accesso per carrozzine: da confermare]]" },
        ],
      }),
    ],
  }),
  page("richiesta-visita-privata", {
    title: "Richiedi un appuntamento privato",
    lead: pt("Invia la tua richiesta per una visita o un esame in regime privato presso Angiomedica. La segreteria ti ricontatterà per verificare disponibilità e orari."),
    seoTitle: "Richiedi una visita privata | Angiomedica Palermo",
    blocks: [
      sec("come-funziona", {
        heading: "Come funziona",
        items: [
          { title: "Invii la richiesta", text: "Indica i tuoi recapiti e la prestazione di interesse." },
          { title: "La segreteria ti contatta", text: "Dopo l'invio della richiesta, la segreteria ti contatterà per definire i dettagli dell'appuntamento. Di solito entro [[tempo di risposta da definire]]*, negli orari di apertura." },
          { title: "Fissate l'appuntamento", text: "Il modulo non assegna automaticamente una data: solo a quel punto la visita è confermata." },
        ],
      }),
      sec("ssn", { heading: "Prenoti in convenzione S.S.N.?", body: "Per gli appuntamenti S.S.N. consulta la pagina dedicata: le richieste vengono gestite telefonicamente o via email." }),
      sec("parlarne", { heading: "Preferisci parlare con la segreteria?", body: `Telefono ${PHONE} · Lun–Ven 9–13 / 15–19*\n\nWhatsApp 335 719 7730* · solo visite private` }),
      sec("conferma", {
        heading: "Richiesta inviata",
        body: "Ti ricontatteremo per verificare la disponibilità e concordare un appuntamento.\n\n**L'invio non costituisce conferma della visita.**",
        ctaLabel: "Invia la richiesta",
      }),
    ],
  }),
  page("prestazioni", {
    title: "Prestazioni",
    lead: pt("Scopri le visite specialistiche e gli esami disponibili presso Angiomedica. Consulta le schede per conoscere le finalità delle prestazioni e le informazioni utili prima di richiedere un appuntamento."),
    seoTitle: "Prestazioni | Angiomedica Palermo",
    blocks: [
      sec("consulenze", { heading: "Consulenze specialistiche", body: "Per queste specialità il centro offre una visita di consulenza: la scheda della visita è anche la pagina della specialità." }),
      sec("ssn", { heading: "Prestazioni in convenzione S.S.N.", body: "Alcune prestazioni di Cardiologia e Angiologia sono disponibili anche in convenzione [[elenco da confermare]]. Si prenotano solo per telefono o email.", ctaLabel: "Informazioni per il S.S.N." }),
      sec("chiusura", { heading: "Non sai quale prestazione ti serve?", body: `Chiama la segreteria al ${PHONE}: ti aiuta a capire da quale visita partire. Oppure invia una richiesta privata: la segreteria ti ricontatta.`, ctaLabel: "Richiedi una visita privata" }),
    ],
  }),
  page("professionisti", {
    title: "I nostri professionisti",
    lead: pt("Conosci i medici e i professionisti che operano in Angiomedica. Le competenze delle diverse aree specialistiche contribuiscono a offrire percorsi di valutazione e assistenza dedicati alle esigenze del paziente."),
    seoTitle: "Professionisti | Angiomedica Palermo",
    blocks: [sec("chiusura", { heading: "Vuoi essere visitato da un medico in particolare?", body: "Indicalo nella richiesta di visita privata: la segreteria verifica la sua disponibilità.", ctaLabel: "Richiedi una visita privata" })],
  }),
  page("blog", {
    title: "Approfondimenti",
    lead: pt("Articoli e informazioni dedicati alla salute cardiovascolare, agli esami diagnostici e ai temi di prevenzione affrontati dai professionisti del centro."),
    seoTitle: "Approfondimenti sulla salute cardiovascolare | Angiomedica",
    blocks: [sec("categorie", { label: "Categorie tematiche indipendenti dalle specialità [[da definire con il centro]]", heading: "Tutti gli articoli" })],
  }),
  page("404", {
    title: "Questa pagina non c'è",
    lead: pt("Forse l'indirizzo è cambiato con il nuovo sito. Da qui puoi ritrovare quello che cercavi."),
    blocks: [sec("link", {
      label: "Errore 404", ctaLabel: "Torna alla homepage",
      items: [{ title: "Visite ed esami", href: "/prestazioni/" }, { title: "Professionisti", href: "/professionisti/" }, { title: "Contatti", href: "/contatti/" }],
    })],
  }),
];

export const documents: Doc[] = [settings, homePage, ...specialties, ...services, ...professionals, ...posts, ...pages];
