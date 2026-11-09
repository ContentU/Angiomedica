import { Fragment } from "react";
import type { Section, ServiceCard } from "./types";

/** Converte "[[testo]]" nella sottolineatura a puntini .ph della demo */
export function Ph({ text }: { text?: string | null }) {
  if (!text) return null;
  // [[…]] -> .ph ; a capo -> <br>
  const parts = text.split(/\[\[(.+?)\]\]/g);
  const br = (t: string, k: number) => t.split("\n").map((l, j) => <Fragment key={`${k}-${j}`}>{j > 0 && <br />}{l}</Fragment>);
  return <>{parts.map((p, i) => (i % 2 ? <span key={i} className="ph">{p}</span> : <Fragment key={i}>{br(p, i)}</Fragment>))}</>;
}

/** testo semplice senza i marcatori [[ ]] (per attributi, metadati, label) */
export const plain = (text?: string | null) => (text || "").replace(/\[\[(.+?)\]\]/g, "$1");

/** blocco per chiave; restituisce un oggetto vuoto se manca, così il layout non si rompe */
export const block = (blocks: Section[] | undefined, key: string): Section =>
  blocks?.find((b) => b.key === key) ?? ({ _key: key } as Section);

export const serviceHref = (s: Pick<ServiceCard, "slug" | "specialty">) =>
  s.specialty?.layout === "consulenza" ? `/specialita/${s.specialty.slug}/` : `/prestazioni/${s.slug}/`;
export const specialtyHref = (slug: string) => `/specialita/${slug}/`;
export const proHref = (slug: string) => `/professionisti/${slug}/`;
export const postHref = (slug: string) => `/blog/${slug}/`;
