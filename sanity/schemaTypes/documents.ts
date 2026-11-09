import { defineField, defineType } from "sanity";
import { groups, phString, seoFields, slugField } from "./objects";

const sections = (title = "Sezioni del testo", description?: string) =>
  defineField({ name: "sections", title, description, type: "array", of: [{ type: "section" }], group: "content" });
const blocks = defineField({
  name: "blocks", title: "Blocchi della pagina", type: "array", of: [{ type: "section" }], group: "content",
  description: "Ogni blocco ha una chiave che lo collega al layout: si possono cambiare i testi, non le chiavi.",
});
const faq = defineField({ name: "faq", title: "Domande frequenti", type: "array", of: [{ type: "faqItem" }], group: "content" });
const facts = defineField({ name: "facts", title: "Dati in evidenza", type: "array", of: [{ type: "fact" }], group: "content", validation: (r) => r.max(3) });
const color = defineField({
  name: "color", title: "Colore", type: "string", group: "content",
  options: { list: [{ title: "Blu (cardio)", value: "cardio" }, { title: "Rosso (angio)", value: "angio" }, { title: "Grigio", value: "altro" }], layout: "radio" },
  initialValue: "cardio",
});
const refs = (name: string, title: string, to: string) =>
  defineField({ name, title, type: "array", of: [{ type: "reference", to: [{ type: to }] }], group: "content" });
const caption = (name = "photoCaption", title = "Didascalia foto segnaposto") => phString(name, title, { group: "content" });

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Impostazioni del sito",
  type: "document",
  fields: [
    phString("address", "Indirizzo"),
    phString("hours", "Orari (esteso)"),
    phString("hoursShort", "Orari (breve)"),
    phString("phone", "Telefono (come appare)"),
    defineField({ name: "phoneHref", title: "Telefono (link)", type: "string", description: "Es. tel:+3991580301" }),
    phString("email", "Email (come appare)"),
    defineField({ name: "emailHref", title: "Email (link)", type: "string" }),
    phString("whatsapp", "WhatsApp (come appare)"),
    defineField({ name: "whatsappHref", title: "WhatsApp (link)", type: "string" }),
    defineField({ name: "mapsUrl", title: "Link alle indicazioni", type: "url" }),
    phString("footerHours", "Footer · orari"),
    phString("footerLegal", "Footer · dati societari"),
    phString("footerNote", "Footer · nota"),
  ],
  preview: { prepare: () => ({ title: "Impostazioni del sito" }) },
});

export const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  groups,
  fields: [
    blocks,
    refs("featuredServices", "Prestazioni in evidenza (griglia «Visite ed esami»)", "service"),
    refs("pickerServices", "Prestazioni nel selettore del modulo", "service"),
    ...seoFields,
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});

export const page = defineType({
  name: "page",
  title: "Pagina",
  type: "document",
  groups,
  fields: [
    defineField({ name: "title", title: "Titolo (H1)", type: "string", group: "content", validation: (r) => r.required() }),
    slugField(),
    defineField({ name: "lead", title: "Introduzione", type: "richText", group: "content" }),
    caption(),
    blocks,
    faq,
    ...seoFields,
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});

export const specialty = defineType({
  name: "specialty",
  title: "Specialità",
  type: "document",
  groups,
  orderings: [{ title: "Ordine", name: "order", by: [{ field: "order", direction: "asc" }] }],
  fields: [
    defineField({ name: "name", title: "Nome", type: "string", group: "content", validation: (r) => r.required() }),
    slugField("name"),
    defineField({ name: "order", title: "Ordine", type: "number", group: "content" }),
    defineField({
      name: "layout", title: "Tipo di pagina", type: "string", group: "content",
      options: { list: [{ title: "Hub (più prestazioni)", value: "hub" }, { title: "Consulenza (pagina unica specialità + visita)", value: "consulenza" }], layout: "radio" },
    }),
    color,
    phString("homeText", "Homepage · testo della card", { group: "content" }),
    phString("visitName", "Nome della visita (solo consulenza)", { group: "content" }),
    defineField({ name: "lead", title: "Introduzione", type: "richText", group: "content" }),
    defineField({ name: "note", title: "Nota in evidenza (es. solo consulenze)", type: "richText", group: "content" }),
    facts,
    phString("ctaLabel", "Pulsante di richiesta", { group: "content" }),
    sections("Sezioni del testo (consulenza)", "Compaiono nell'indice «In questa pagina»."),
    blocks,
    refs("related", "Specialità collegate", "specialty"),
    ...seoFields,
  ],
  preview: { select: { title: "name", subtitle: "layout" } },
});

export const service = defineType({
  name: "service",
  title: "Prestazione",
  type: "document",
  groups,
  orderings: [{ title: "Ordine", name: "order", by: [{ field: "order", direction: "asc" }] }],
  fields: [
    defineField({ name: "title", title: "Titolo (H1)", type: "string", group: "content", validation: (r) => r.required() }),
    defineField({ name: "shortTitle", title: "Nome breve (elenchi e modulo)", type: "string", group: "content" }),
    slugField(),
    defineField({ name: "order", title: "Ordine nel catalogo", type: "number", group: "content" }),
    defineField({ name: "specialty", title: "Specialità", type: "reference", to: [{ type: "specialty" }], group: "content", validation: (r) => r.required() }),
    defineField({ name: "lead", title: "Introduzione", type: "richText", group: "content" }),
    facts,
    caption(),
    sections("Sezioni del testo", "Compaiono nell'indice «In questa pagina»."),
    faq,
    phString("prosHeading", "Titolo sezione professionisti", { group: "content" }),
    refs("professionals", "Professionisti", "professional"),
    defineField({ name: "ssn", title: "Mostra la sezione Privato e S.S.N.", type: "boolean", group: "content", initialValue: false }),
    defineField({ name: "ssnText", title: "Testo sezione Privato e S.S.N.", type: "richText", group: "content" }),
    phString("asideTitle", "Riquadro laterale · titolo", { group: "content" }),
    phString("ctaLabel", "Barra mobile · testo pulsante", { group: "content" }),
    defineField({ name: "home", title: "Disponibile a domicilio", type: "boolean", group: "content", initialValue: false }),
    defineField({ name: "inSsn", title: "In convenzione S.S.N.", type: "boolean", group: "content", initialValue: false }),
    ...seoFields,
  ],
  preview: { select: { title: "title", subtitle: "specialty.name" } },
});

export const professional = defineType({
  name: "professional",
  title: "Professionista",
  type: "document",
  groups,
  orderings: [{ title: "Ordine", name: "order", by: [{ field: "order", direction: "asc" }] }],
  fields: [
    defineField({ name: "name", title: "Nome e titolo", type: "string", group: "content", validation: (r) => r.required() }),
    phString("shortName", "Nome breve (es. «Michele Ballo»)", { group: "content" }),
    slugField("name"),
    defineField({ name: "order", title: "Ordine", type: "number", group: "content" }),
    phString("role", "Qualifica (card)", { group: "content" }),
    phString("cardText", "Testo breve (card)", { group: "content" }),
    phString("subtitle", "Sottotitolo (profilo)", { group: "content" }),
    defineField({ name: "photo", title: "Ritratto", type: "image", options: { hotspot: true }, group: "content" }),
    refs("specialties", "Specialità", "specialty"),
    defineField({ name: "intro", title: "Presentazione", type: "richText", group: "content" }),
    sections("Sezioni del profilo"),
    refs("services", "Prestazioni che segue", "service"),
    ...seoFields,
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});

export const post = defineType({
  name: "post",
  title: "Articolo",
  type: "document",
  groups,
  orderings: [{ title: "Data", name: "date", by: [{ field: "date", direction: "desc" }] }],
  fields: [
    defineField({ name: "title", title: "Titolo", type: "string", group: "content", validation: (r) => r.required() }),
    slugField(),
    phString("category", "Categoria", { group: "content" }),
    color,
    refs("specialties", "Specialità collegate (approfondimenti nelle pagine specialità)", "specialty"),
    phString("dateLabel", "Data (come appare)", { group: "content" }),
    defineField({ name: "date", title: "Data (ordinamento)", type: "date", group: "content" }),
    phString("readingTime", "Tempo di lettura", { group: "content" }),
    defineField({ name: "excerpt", title: "Estratto", type: "richText", group: "content" }),
    defineField({ name: "author", title: "Autore", type: "reference", to: [{ type: "professional" }], group: "content" }),
    phString("authorLabel", "Autore (testo, se non c'è il riferimento)", { group: "content" }),
    defineField({ name: "image", title: "Immagine", type: "image", options: { hotspot: true }, group: "content" }),
    sections("Sezioni dell'articolo", "Compaiono nell'indice «In questo articolo»."),
    refs("relatedServices", "Schede prestazione collegate", "service"),
    phString("reviewer", "Revisione clinica (nome, data)", { group: "content" }),
    ...seoFields,
  ],
  preview: { select: { title: "title", subtitle: "category" } },
});
