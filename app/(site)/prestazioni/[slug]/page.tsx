import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CtaBar } from "@/components/CtaBar";
import { Aside, FactsDesktop, FactsMobile, FaqList, ProRow, ProseSections, RelatedTiles, Toc, TocMobile, tocOf, type TocEntry } from "@/components/Detail";
import { Icon } from "@/components/Icon";
import { InlineText, RichText } from "@/components/RichText";
import { Ph, plain, serviceHref, specialtyHref } from "@/lib/content";
import { getSettings } from "@/lib/settings";
import type { Fact, Faq, PT, ProCard, Section, ServiceCard, SpecRef } from "@/lib/types";
import { sanityFetch } from "@/sanity/client";
import { serviceQuery, slugsQuery } from "@/sanity/queries";

type Service = ServiceCard & {
  specialty: SpecRef; lead?: PT; facts?: Fact[]; photoCaption?: string; sections?: Section[]; faq?: Faq[];
  prosHeading?: string; professionals?: ProCard[]; ssn?: boolean; ssnText?: PT; asideTitle?: string; ctaLabel?: string;
  others?: ServiceCard[]; seoTitle?: string; seoDescription?: string;
};
type Props = { params: Promise<{ slug: string }> };
const get = (slug: string) => sanityFetch<Service | null>(serviceQuery, { slug });

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>(slugsQuery, { type: "service" });
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const x = await get((await params).slug);
  return x ? { title: x.seoTitle || `${x.title} | Angiomedica`, description: x.seoDescription } : {};
}

export default async function ServicePage({ params }: Props) {
  const [x, s] = await Promise.all([get((await params).slug), getSettings()]);
  if (!x) notFound();
  const sp = x.specialty;
  const dot = sp.color ?? "cardio";
  const pros = (x.professionals ?? []).filter(Boolean);
  const req = `/richiesta-visita-privata/?prestazione=${x.slug}`;
  const toc: TocEntry[] = [
    ...tocOf(x.sections),
    ...(x.faq?.length ? [{ anchor: "faq", label: "Domande frequenti" }] : []),
    ...(pros.length ? [{ anchor: "chi", label: x.prosHeading || "Chi la esegue" }] : []),
    ...(x.ssn ? [{ anchor: "ssn", label: "Privato e S.S.N." }] : []),
  ];

  return (
    <div className="pg-prestazione-ecocardiogramma detail">
      {/* TESTATA DELLA SCHEDA — desktop */}
      <section className="p-[32px_0_72px] [background:linear-gradient(180deg,#FFFFFF_0%,#F2F6FA_100%)] max-[960px]:hidden">
        <div className="wrap">
          <nav className="crumb" aria-label="Percorso"><Link href="/">Home</Link><span aria-hidden>›</span><Link href="/prestazioni/">Prestazioni</Link><span aria-hidden>›</span><Link href={specialtyHref(sp.slug)}>{sp.name}</Link><span aria-hidden>›</span><span className="text-[#1A181B]" aria-current="page">{x.title}</span></nav>
          <div className="hero-grid grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-[64px] items-center mt-[40px]">
            <div>
              <Link className="inline-flex items-center gap-[10px] font-[600] text-[15px] text-[#0070B8] no-underline" href={specialtyHref(sp.slug)}><span className={`am-dot am-dot--${dot}`} />{sp.name}</Link>
              <h1 className="h1 m-[16px_0_0] font-[800] text-[60px] leading-[1.04] tracking-[-.035em] [text-wrap:balance]">{x.title}</h1>
              <p className="m-[22px_0_0] text-[19px] leading-[1.6] text-[#55535A] max-w-[34em]"><InlineText value={x.lead} /></p>
              <FactsDesktop facts={x.facts} />
            </div>
            <div className="relative">
              <div className="am-photo h-[380px] rounded-[28px]"><Ph text={x.photoCaption} /></div>
              <span className="am-trace am-trace--draw absolute left-[-40px] bottom-[48px] w-[200px]" aria-hidden><i /><i /></span>
            </div>
          </div>
        </div>
      </section>
      {/* TESTATA — mobile */}
      <section className="px-[20px] pt-[20px] pb-[32px] [background:linear-gradient(180deg,#FFFFFF_0%,#F2F6FA_100%)] min-[961px]:hidden">
        <Link className="inline-flex items-center gap-[6px] min-h-[44px] text-[14px] text-[#55535A] no-underline" href={`${specialtyHref(sp.slug)}#prestazioni`}><Icon name="back" size={16} />Prestazioni di {sp.name}</Link>
        <h1 className="m-[8px_0_0] font-[800] text-[36px] leading-[1.06] tracking-[-.03em]">{x.title}</h1>
        <p className="m-[14px_0_0] text-[#55535A]"><InlineText value={x.lead} /></p>
        <FactsMobile facts={x.facts} />
        <Link className="am-btn am-btn--primary am-btn--block mt-[24px] min-h-[56px]" href={req}>Richiedi una visita privata</Link>
        {x.ssn && <p className="m-[10px_0_0] text-[14px] text-[#55535A] text-center">Per il S.S.N. chiama il <Ph text={s.phone} /></p>}
      </section>
      <div className="am-photo h-[220px] rounded-[0] min-[961px]:hidden"><Ph text={x.photoCaption} /></div>
      <TocMobile entries={toc} />

      {/* CORPO: TESTO + COLONNA DI RICHIESTA */}
      <section className="p-[72px_0_96px] max-[960px]:p-[0_0_8px]">
        <div className="wrap layout grid grid-cols-[minmax(0,8fr)_minmax(0,4fr)] gap-[72px] items-start">
          <article className="prose">
            <Toc entries={toc} />
            <ProseSections sections={x.sections} dot={dot} />
            {!!x.faq?.length && (
              <section id="faq"><h2>Domande frequenti</h2><FaqList faq={x.faq} /></section>
            )}
            {pros.length > 0 && (
              <section id="chi">
                <h2><Ph text={x.prosHeading || "Chi la esegue"} /></h2>
                <div className="pros2 grid grid-cols-[repeat(2,minmax(0,1fr))] gap-[16px] mt-[8px] max-[960px]:gap-[10px]">
                  {pros.map((p) => <ProRow key={p._id} p={p} />)}
                </div>
              </section>
            )}
            {x.ssn && (
              <section id="ssn">
                <h2>Privato e S.S.N.</h2>
                <RichText value={x.ssnText} />
                <div className="am-ssn bg-[#F2F6FA] max-w-[40em]">
                  <Icon name="info" size={24} sw={2} stroke="#0070B8" className="flex-none mt-[2px]" />
                  <div><strong className="font-[600]">In convenzione S.S.N.</strong><p className="m-[4px_0_0] text-[16px] text-[#55535A]">Per sapere se l&apos;esame è disponibile in convenzione e come prenotarlo, chiama la segreteria al <Ph text={s.phone} />. Il modulo online vale solo per le visite private.</p></div>
                </div>
              </section>
            )}
          </article>
          <Aside title={x.asideTitle} s={s} label="Richiedi questa prestazione" href={req} />
        </div>
      </section>

      {/* ALTRE PRESTAZIONI */}
      <RelatedTiles
        title={`Altre prestazioni di ${sp.name}`}
        tiles={[
          ...(x.others ?? []).map((o) => ({ key: o._id, href: serviceHref(o), name: o.shortTitle || o.title, dot })),
          { key: "spec", href: specialtyHref(sp.slug), name: `Specialità ${sp.name}` },
          { key: "all", href: "/prestazioni/", name: "Tutte le 13 prestazioni", all: true },
        ]}
      />
      <CtaBar label={plain(x.ctaLabel) || undefined} href={req} />
    </div>
  );
}

