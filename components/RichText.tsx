import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Link from "next/link";
import type { Color, PT } from "@/lib/types";

const marks: PortableTextComponents["marks"] = {
  ph: ({ children }) => <span className="ph">{children}</span>,
  link: ({ children, value }) => {
    const href: string = value?.href || "#";
    return href.startsWith("/") ? <Link href={href}>{children}</Link> : <a href={href}>{children}</a>;
  },
};

function components(dot: Color, pClass?: string): PortableTextComponents {
  return {
    marks,
    block: { normal: ({ children }) => <p className={pClass}>{children}</p>, h3: ({ children }) => <h3>{children}</h3> },
    list: { bullet: ({ children }) => <ul>{children}</ul>, dots: ({ children }) => <ul className="when">{children}</ul> },
    listItem: {
      bullet: ({ children }) => <li>{children}</li>,
      dots: ({ children }) => (
        <li>
          <span className={`am-dot am-dot--${dot} mt-[8px]`} />
          <span>{children}</span>
        </li>
      ),
    },
  };
}

/** Testo a blocchi (paragrafi, elenchi) */
export function RichText({ value, dot = "cardio", pClass }: { value: PT; dot?: Color; pClass?: string }) {
  if (!value?.length) return null;
  return <PortableText value={value as never} components={components(dot, pClass)} />;
}

const inline: PortableTextComponents = { marks, block: { normal: ({ children }) => <>{children}</> } };

/** Solo il contenuto in linea, senza <p>: per inserire il testo dentro un elemento già stilizzato della demo */
export function InlineText({ value }: { value: PT }) {
  if (!value?.length) return null;
  return <PortableText value={value as never} components={inline} />;
}
