// Parti comuni a scheda prestazione (prestazione-ecocardiogramma.html) e specialità «consulenza» (specialita-cardiochirurgia.html)
import Link from "next/link";
import { Icon } from "./Icon";
import { InlineText, RichText } from "./RichText";
import { Ph, plain, proHref } from "@/lib/content";
import type { Color, Fact, Faq, PT, ProCard, Section, Settings } from "@/lib/types";

export type TocEntry = { anchor: string; label: string };

export function FactsDesktop({ facts, className = "mt-[36px]" }: { facts?: Fact[]; className?: string }) {
  if (!facts?.length) return null;
  return (
    <div className={`facts grid grid-cols-[repeat(3,minmax(0,1fr))] gap-[12px] ${className}`}>
      {facts.map((f) => <div key={f._key} className="fact"><small><Ph text={f.label} /></small><strong><Ph text={f.value} /></strong></div>)}
    </div>
  );
}

export function FactsMobile({ facts, className = "mt-[20px]" }: { facts?: Fact[]; className?: string }) {
  if (!facts?.length) return null;
  return (
    <div className={`${className} [border-bottom:1px_solid_#DCE3EB]`}>
      {facts.map((f) => <div key={f._key} className="fact-m"><span><Ph text={f.label} /></span><strong><Ph text={f.value} /></strong></div>)}
    </div>
  );
}

export function Toc({ entries }: { entries: TocEntry[] }) {
  return (
    <nav className="toc mb-[56px] max-w-[520px] max-[960px]:hidden" aria-label="In questa pagina">
      <p className="m-[0_0_8px] font-[600] text-[15px] text-[#55535A]">In questa pagina</p>
      {entries.map((e, i) => (
        <a key={e.anchor} href={`#${e.anchor}`} className={i === entries.length - 1 ? "[border-bottom:1px_solid_#DCE3EB]" : undefined}>
          <Ph text={e.label} /> <span aria-hidden>↓</span>
        </a>
      ))}
    </nav>
  );
}

export function TocMobile({ entries }: { entries: TocEntry[] }) {
  return (
    <nav className="toc-m px-[20px] pt-[24px] pb-[8px] min-[961px]:hidden" aria-label="In questa pagina">
      <details>
        <summary className="flex justify-between items-center min-h-[52px] p-[0_16px] rounded-[12px] bg-[#F2F6FA] font-[600] text-[16px]">In questa pagina <Icon name="chevron" size={18} sw={2} stroke="#1A181B" /></summary>
        <div className="flex flex-col p-[4px_16px_8px]">
          {entries.map((e) => <a key={e.anchor} className="min-h-[44px] flex items-center text-[#1A181B] no-underline" href={`#${e.anchor}`}><Ph text={e.label} /></a>)}
        </div>
      </details>
    </nav>
  );
}

export function FaqList({ faq }: { faq?: Faq[] }) {
  if (!faq?.length) return null;
  return (
    <div className="am-faq">
      {faq.map((f) => (
        <details key={f._key}>
          <summary><Ph text={f.question} /> <span className="am-faq__icon" aria-hidden><Icon name="plus" size={18} /></span></summary>
          <div className="am-faq__a"><RichText value={f.answer} /></div>
        </details>
      ))}
    </div>
  );
}

/** card professionista orizzontale («Chi la esegue») */
export function ProRow({ p, className = "" }: { p: ProCard; className?: string }) {
  return (
    <Link className={`am-pro flex-row items-center p-[12px] shadow-[inset_0_0_0_1.5px_#DCE3EB] max-[960px]:gap-[14px] max-[960px]:p-[10px] ${className}`} href={proHref(p.slug)}>
      <div className="am-photo w-[96px] h-[112px] flex-none text-[10px] p-[6px] max-[960px]:w-[72px] max-[960px]:h-[84px] max-[960px]:text-[9px] max-[960px]:p-[4px]">Ritratto</div>
      <span className="flex-1">
        <span className="am-pro__name text-[18px] max-[960px]:text-[17px]"><Ph text={p.name} /></span>
        <span className="am-pro__role max-[960px]:text-[14px]"><Ph text={p.role} /></span>
      </span>
      <span className="am-go w-[44px] h-[44px] max-[960px]:hidden"><Icon name="arrow" size={18} /></span>
    </Link>
  );
}

/** sezioni di testo con ancora; l'indice si genera da qui */
export function ProseSections({ sections, dot }: { sections?: Section[]; dot: Color }) {
  return (
    <>
      {sections?.map((s) => (
        <section key={s._key} id={s.anchor}>
          <h2><Ph text={s.heading} /></h2>
          <RichText value={s.body} dot={dot} />
        </section>
      ))}
    </>
  );
}

export const tocOf = (sections?: Section[]): TocEntry[] =>
  (sections ?? []).filter((s) => s.anchor).map((s) => ({ anchor: s.anchor!, label: s.tocLabel || s.heading || "" }));

export function Aside({ title, text, ctaLabel = "Richiedi una visita privata", s, label, href = "/richiesta-visita-privata/" }: { title?: string; text?: PT; ctaLabel?: string; s: Settings; label: string; href?: string }) {
  return (
    <aside className="aside sticky top-[112px] max-[960px]:hidden" aria-label={label}>
      <div className="relative overflow-hidden rounded-[28px] p-[32px_28px_28px] bg-[#FFFFFF] shadow-[inset_0_0_0_1.5px_#DCE3EB]">
        <span className="am-trace am-trace--thin absolute left-[0] right-[0] top-[0]" aria-hidden><i className="rounded-[0]" /><i className="rounded-[0]" /></span>
        <h2 className="m-0 font-[600] text-[24px] leading-[1.25]"><Ph text={title} /></h2>
        <p className="m-[10px_0_0] text-[16px] leading-[1.55] text-[#55535A]">{text ? <InlineText value={text} /> : "Compila la richiesta: la segreteria ti ricontatterà per concordare data e ora."}</p>
        <Link className="am-btn am-btn--primary am-btn--block mt-[22px]" href={href}><Ph text={ctaLabel} /></Link>
        <div className="flex flex-col gap-[4px] mt-[22px] pt-[18px] [border-top:1px_solid_#DCE3EB] text-[15px]">
          <span className="text-[#55535A]">Preferisci parlarne?</span>
          <span className="font-[600]">Segreteria <Ph text={s.phone} /></span>
          <span className="text-[#55535A]">{plain(s.hoursShort).replace(/^Lun–Ven /, "Lun–Ven · ")}</span>
        </div>
      </div>
    </aside>
  );
}

export type TileLink = { key: string; href: string; name: string; dot?: Color; all?: boolean };

/** griglia di tile in fondo pagina («Altre prestazioni», «Specialità collegate») */
export function RelatedTiles({ title, tiles }: { title?: string; tiles: TileLink[] }) {
  return (
    <section className="p-[96px_0] bg-[#F2F6FA] max-[960px]:p-[40px_0_48px]">
      <div className="wrap">
        <h2 className="m-[0_0_32px] font-[600] text-[34px] tracking-[-.02em] max-[960px]:m-[0_0_18px] max-[960px]:text-[24px]"><Ph text={title} /></h2>
        <div className="rel g2 grid grid-cols-[repeat(2,minmax(0,1fr))] gap-[16px] max-[960px]:gap-[10px]">
          {tiles.map((t) => (
            <Link key={t.key} className={`am-tile min-h-[96px] max-[960px]:min-h-[68px] max-[960px]:p-[0_18px] max-[960px]:rounded-[16px] ${t.all ? "am-tile--all" : ""}`} href={t.href}>
              <span className="am-tile__name text-[24px] max-[960px]:text-[18px] max-[960px]:gap-[12px]">
                {t.dot && <span className={`am-dot am-dot--${t.dot} max-[960px]:w-[10px] max-[960px]:h-[10px]`} />}
                <Ph text={t.name} />
              </span>
              <Icon name="diag" size={28} sw={t.all ? 1.8 : 1.6} className="am-tile__arrow max-[960px]:w-[22px] max-[960px]:h-[22px]" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
