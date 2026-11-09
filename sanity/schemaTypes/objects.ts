import { createElement } from "react";
import { defineArrayMember, defineField, defineType } from "sanity";

// Testo "da confermare": nel sito diventa la sottolineatura a puntini (.ph) della demo
const PhDecorator = (props: { children?: React.ReactNode }) =>
  createElement("span", { style: { textDecoration: "underline dotted", textDecorationColor: "#4F8CC4", textDecorationThickness: 2 } }, props.children);

export const richText = defineType({
  name: "richText",
  title: "Testo",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragrafo", value: "normal" },
        { title: "Sottotitolo", value: "h3" },
      ],
      lists: [
        { title: "Elenco puntato", value: "bullet" },
        { title: "Elenco con pallini colorati", value: "dots" },
      ],
      marks: {
        decorators: [
          { title: "Grassetto", value: "strong" },
          { title: "Corsivo", value: "em" },
          { title: "Da confermare", value: "ph", icon: () => "…", component: PhDecorator },
        ],
        annotations: [
          defineField({ name: "link", type: "object", title: "Link", fields: [defineField({ name: "href", type: "string", title: "URL o percorso (es. /contatti/)" })] }),
        ],
      },
    }),
  ],
});

const PH_HINT = "Il testo tra [[doppie quadre]] appare sottolineato a puntini (dato da confermare).";

/** stringa breve che accetta [[da confermare]] */
export const phString = (name: string, title: string, extra: Record<string, unknown> = {}) =>
  defineField({ name, title, type: "string", description: PH_HINT, ...extra });

export const item = defineType({
  name: "item",
  title: "Elemento",
  type: "object",
  fields: [phString("label", "Etichetta"), phString("title", "Titolo"), defineField({ name: "text", title: "Testo", type: "richText" }), phString("ctaLabel", "Testo pulsante (facoltativo)"), phString("href", "Link (facoltativo)")],
  preview: { select: { title: "title", subtitle: "label" } },
});

export const section = defineType({
  name: "section",
  title: "Sezione",
  type: "object",
  fields: [
    defineField({ name: "key", title: "Chiave", type: "string", description: "Identifica la sezione nel layout (non modificare)." }),
    phString("heading", "Titolo"),
    defineField({ name: "anchor", title: "Ancora (#)", type: "string", description: "Per l'indice «In questa pagina»." }),
    phString("tocLabel", "Voce nell'indice", { description: "Se vuoto usa il titolo." }),
    phString("label", "Sopratitolo / nota"),
    defineField({ name: "body", title: "Testo", type: "richText" }),
    defineField({ name: "items", title: "Elementi", type: "array", of: [{ type: "item" }] }),
    phString("ctaLabel", "Testo pulsante"),
    phString("ctaHref", "Link pulsante"),
    phString("photoCaption", "Didascalia foto segnaposto"),
  ],
  preview: { select: { title: "heading", subtitle: "key" } },
});

export const faqItem = defineType({
  name: "faqItem",
  title: "Domanda",
  type: "object",
  fields: [phString("question", "Domanda"), defineField({ name: "answer", title: "Risposta", type: "richText" })],
  preview: { select: { title: "question" } },
});

export const fact = defineType({
  name: "fact",
  title: "Dato",
  type: "object",
  fields: [phString("label", "Etichetta"), phString("value", "Valore")],
  preview: { select: { title: "label", subtitle: "value" } },
});

export const seoFields = [
  defineField({ name: "seoTitle", title: "SEO · titolo", type: "string", group: "seo" }),
  defineField({ name: "seoDescription", title: "SEO · descrizione", type: "text", rows: 3, group: "seo" }),
];
export const groups = [
  { name: "content", title: "Contenuti", default: true },
  { name: "seo", title: "SEO" },
];
export const slugField = (source = "title") =>
  defineField({ name: "slug", title: "Slug (URL)", type: "slug", options: { source }, validation: (r) => r.required() });
