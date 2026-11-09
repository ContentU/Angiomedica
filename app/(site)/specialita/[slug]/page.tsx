import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PostRow, ProCardV } from "@/components/Cards";
import { CtaBar } from "@/components/CtaBar";
import { Aside, FactsDesktop, FactsMobile, ProRow, ProseSections, RelatedTiles, Toc, TocMobile, tocOf } from "@/components/Detail";
import { Icon } from "@/components/Icon";
import { InlineText } from "@/components/RichText";
import { block, Ph, plain, serviceHref, specialtyHref } from "@/lib/content";
import { getSettings } from "@/lib/settings";
import type { Fact, PT, PostCard, ProCard, Section, ServiceCard, Settings, SpecRef } from "@/lib/types";
import { sanityFetch } from "@/sanity/client";
import { slugsQuery, specialtyQuery } from "@/sanity/queries";

type Specialty = SpecRef & {
  visitName?: string; lead?: PT; note?: PT; facts?: Fact[]; ctaLabel?: string; sections?: Section[]; blocks?: Section[];
  services: ServiceCard[]; pros: ProCard[]; posts: PostCard[]; related?: SpecRef[]; seoTitle?: string; seoDescription?: string;
};
type Props = { params: Promise<{ slug: string }> };
const get = (slug: string) => sanityFetch<Specialty | null>(specialtyQuery, { slug });

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>(slugsQuery, { type: "specialty" });
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const x = await get((await params).slug);
  return x ? { title: x.seoTitle || `${x.name} a Palermo | Angiomedica`, description: x.seoDescription } : {};
}

export default async function SpecialtyPage({ params }: Props) {
  const [x, s] = await Promise.all([get((await params).slug), getSettings()]);
  if (!x) notFound();
  return x.layout === "consulenza" ? <Consulenza x={x} s={s} /> : <Hub x={x} />;
}

// ---------------------------------------------------------------- hub (specialita-cardiologia.html / -angiologia.html)
function Hub({ x }: { x: Specialty }) {
  const b = (k: string) => block(x.blocks, k);
  const quando = b("quando"), alert = b("alert"), prest = b("prestazioni"), team = b("professionisti"), posts = b("approfondimenti"), end = b("chiusura");
  const blue = x.color === "cardio";
  const dot = x.color ?? "cardio";
  return (
    <div className={blue ? "pg-specialita-cardiologia" : "pg-specialita-angiologia"}>
      {/* TESTATA: la card della homepage che diventa pagina */}
      <section className={`relative overflow-hidden p-[32px_0_0] max-[960px]:pt-[16px] ${blue ? "bg-[#035BDB] text-[#FFFFFF]" : "bg-[#F2F6FA] text-[#1A181B]"}`}>
        <div className="wrap">
          <nav className="crumb max-[960px]:hidden" aria-label="Percorso"><Link href="/">Home</Link><span aria-hidden>›</span><Link href="/#specialita">Specialità</Link><span aria-hidden>›</span><span className={blue ? undefined : "text-[#1A181B]"} aria-current="page">{x.name}</span></nav>
          <Link className={`inline-flex items-center gap-[6px] min-h-[44px] text-[14px] no-underline min-[961px]:hidden ${blue ? "text-[#FFFFFF]" : "text-[#55535A]"}`} href="/#specialita"><Icon name="back" size={16} />Tutte le specialità</Link>
          <h1 className="hero-word m-[64px_0_0] font-[600] text-[clamp(56px,10vw,152px)] leading-[.9] tracking-[-.05em] [text-transform:lowercase] [text-wrap:balance] max-[960px]:m-[28px_0_0] max-[960px]:text-[50px] max-[960px]:leading-[.92]">
            {x.name}<span className={blue ? "text-[#BFD7EC]" : "text-[#CF000A]"} aria-hidden>.</span>
          </h1>
          <div className="cols grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-[64px] items-end p-[40px_0_64px] max-[960px]:gap-[24px] max-[960px]:p-[22px_0_36px]">
            <p className="m-0 text-[21px] leading-[1.55] font-[500] max-w-[32em] max-[960px]:text-[17px]"><InlineText value={x.lead} /></p>
            <div className="flex gap-[28px] items-center flex-wrap justify-end">
              <a className={`font-[600] [text-decoration:underline] [text-underline-offset:6px] [text-decoration-thickness:2px] max-[960px]:hidden ${blue ? "text-[#FFFFFF]" : "text-[#0070B8]"}`} href="#prestazioni">Le {x.services.length} prestazioni</a>
              <Link className={`am-btn ${blue ? "am-btn--on-deep" : "am-btn--primary"} max-[960px]:w-full max-[960px]:min-h-[56px]`} href="/richiesta-visita-privata/"><Ph text={x.ctaLabel} /></Link>
            </div>
          </div>
        </div>
        <span className="am-trace am-trace--draw w-full max-[960px]:gap-[3px]" aria-hidden><i className="rounded-[0] max-[960px]:h-[4px]" /><i className={`rounded-[0] max-[960px]:h-[4px] ${blue ? "bg-[#FFFFFF]" : ""}`} /></span>
      </section>

      {/* QUANDO RIVOLGERSI ALLO SPECIALISTA */}
      <section className="p-[104px_0] bg-[#F2F6FA] max-[960px]:p-[48px_0]">
        <div className="wrap cols grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-[72px] items-start max-[960px]:gap-[20px]">
          <div>
            <h2 className="m-0 font-[600] text-[40px] leading-[1.12] tracking-[-.02em] max-[960px]:text-[26px] max-[960px]:leading-[1.2]"><Ph text={quando.heading} /></h2>
            <p className="m-[18px_0_0] text-[17px] leading-[1.6] text-[#55535A] max-[960px]:text-[16px]"><InlineText value={quando.body} /></p>
            {alert.heading && (
              <div className="mt-[28px] p-[20px_22px] rounded-[16px] bg-[#FFFFFF] shadow-[inset_0_0_0_2px_#CF000A] max-[960px]:mt-[20px] max-[960px]:p-[16px_18px] max-[960px]:rounded-[14px]" role="note">
                <strong className="flex items-center gap-[10px] font-[600] text-[#CF000A] max-[960px]:gap-[8px] max-[960px]:text-[16px]"><Icon name="alert" size={22} /><Ph text={alert.heading} /></strong>
                <p className="m-[6px_0_0] text-[16px] leading-[1.55] max-[960px]:m-[4px_0_0] max-[960px]:text-[15px]"><InlineText value={alert.body} /></p>
              </div>
            )}
          </div>
          <ul className="when list-none m-0 p-0">
            {quando.items?.map((i) => (
              <li key={i._key}><span className={`am-dot am-dot--${dot} mt-[8px] max-[960px]:w-[10px] max-[960px]:h-[10px] max-[960px]:mt-[7px]`} /><span><Ph text={i.title} /></span></li>
            ))}
          </ul>
        </div>
      </section>

      {/* PRESTAZIONI DELLA SPECIALITÀ */}
      <section id="prestazioni" className="p-[104px_0] max-[960px]:p-[48px_0]">
        <div className="wrap">
          <div className="cols grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[64px] items-end mb-[40px] max-[960px]:mb-[22px]">
            <h2 className="m-0 font-[600] text-[40px] leading-[1.12] tracking-[-.02em] max-[960px]:text-[26px] max-[960px]:leading-[1.2]"><Ph text={prest.heading} /></h2>
            <p className="m-0 text-[17px] leading-[1.6] text-[#55535A] max-[960px]:hidden"><InlineText value={prest.body} /></p>
          </div>
          <div className="g2 grid grid-cols-[repeat(2,minmax(0,1fr))] gap-[16px] max-[960px]:gap-[10px]">
            {x.services.map((v) => (
              <Link key={v._id} className="am-tile max-[960px]:min-h-[68px] max-[960px]:p-[0_18px] max-[960px]:rounded-[16px]" href={serviceHref(v)}>
                <span className="am-tile__name max-[960px]:text-[18px] max-[960px]:gap-[12px]"><span className={`am-dot am-dot--${dot}`} />{v.shortTitle || v.title}</span>
                <Icon name="diag" size={32} sw={1.6} className="am-tile__arrow max-[960px]:w-[22px] max-[960px]:h-[22px]" />
              </Link>
            ))}
            <Link className="am-tile am-tile--all max-[960px]:min-h-[68px] max-[960px]:p-[0_18px] max-[960px]:rounded-[16px]" href="/prestazioni/">
              <span className="am-tile__name max-[960px]:text-[18px]"><Ph text={prest.ctaLabel} /></span>
              <Icon name="diag" size={32} sw={1.8} className="am-tile__arrow max-[960px]:w-[22px] max-[960px]:h-[22px]" />
            </Link>
          </div>
        </div>
      </section>

      {/* I PROFESSIONISTI DELLA SPECIALITÀ */}
      {x.pros.length > 0 && (
        <section className="p-[104px_0] bg-[#F2F6FA] max-[960px]:p-[48px_0]">
          <div className="wrap">
            <div className="flex justify-between items-end gap-[32px] flex-wrap mb-[40px] max-[960px]:mb-0">
              <h2 className="m-0 font-[600] text-[40px] leading-[1.12] tracking-[-.02em] max-[960px]:text-[26px] max-[960px]:leading-[1.2]"><Ph text={team.heading} /></h2>
              <Link className="am-btn am-btn--secondary max-[960px]:hidden" href="/professionisti/"><Ph text={team.ctaLabel} /></Link>
            </div>
            <div className="g3 grid grid-cols-[repeat(3,minmax(0,1fr))] gap-[24px] pros-scroll max-[960px]:flex">
              {x.pros.map((p) => <ProCardV key={p._id} p={p} className="max-[960px]:flex-none max-[960px]:w-[230px] max-[960px]:[scroll-snap-align:start] max-[960px]:pb-[18px]" />)}
            </div>
            <div className="mt-[16px] min-[961px]:hidden"><Link className="am-btn am-btn--tertiary" href="/professionisti/"><Ph text={team.ctaLabel} /></Link></div>
          </div>
        </section>
      )}

      {/* APPROFONDIMENTI */}
      {x.posts.length > 0 && (
        <section className="p-[104px_0] max-[960px]:p-[48px_0]">
          <div className="wrap">
            <h2 className="m-[0_0_28px] font-[600] text-[28px] tracking-[-.01em] max-[960px]:m-[0_0_18px] max-[960px]:text-[22px]"><Ph text={posts.heading} /></h2>
            <div className="g2 grid grid-cols-[repeat(2,minmax(0,1fr))] gap-[20px] max-[960px]:gap-[10px]">
              {x.posts.map((p) => <PostRow key={p._id} p={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* CHIUSURA */}
      <section className="p-[88px_0] bg-[#0B3D6B] text-[#FFFFFF] max-[960px]:p-[40px_0]">
        <div className="wrap cols grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-[56px] items-center max-[960px]:gap-[20px]">
          <div>
            <h2 className="m-0 font-[600] text-[36px] leading-[1.15] tracking-[-.02em] max-[960px]:text-[26px] max-[960px]:leading-[1.2]"><Ph text={end.heading} /></h2>
            <p className="m-[14px_0_0] text-[17px] text-[#BFD7EC] max-[960px]:m-[10px_0_0] max-[960px]:text-[15px]"><InlineText value={end.body} /></p>
          </div>
          <div className="flex gap-[24px] items-center flex-wrap justify-end">
            <Link className="am-btn am-btn--on-deep max-[960px]:w-full max-[960px]:min-h-[56px]" href="/richiesta-visita-privata/"><Ph text={end.ctaLabel} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------- consulenza (specialita-cardiochirurgia.html: pagina unica specialità + visita)
const WORD_SIZE: Record<string, string> = {
  dietologia: "text-[clamp(48px,8.4vw,132px)] max-[960px]:text-[46px]",
  "chirurgia-vascolare": "text-[clamp(48px,8.4vw,124px)] max-[960px]:text-[38px]",
};

function Consulenza({ x, s }: { x: Specialty; s: Settings }) {
  const b = (k: string) => block(x.blocks, k);
  const chi = b("chi"), aside = b("aside"), posts = b("approfondimenti"), rel = b("collegate");
  const dot = x.color ?? "cardio";
  const toc = [...tocOf(x.sections), ...(x.pros.length ? [{ anchor: "chi", label: chi.tocLabel || chi.heading || "" }] : [])];
  return (
    <div className="pg-specialita-cardiochirurgia detail">
      <section className="relative overflow-hidden bg-[#FFFFFF] p-[32px_0_0] [border-bottom:1px_solid_#DCE3EB] max-[960px]:pt-[16px]">
        <div className="wrap">
          <nav className="crumb max-[960px]:hidden" aria-label="Percorso"><Link href="/">Home</Link><span aria-hidden>›</span><Link href="/#specialita">Specialità</Link><span aria-hidden>›</span><span className="text-[#1A181B]" aria-current="page">{x.name}</span></nav>
          <Link className="inline-flex items-center gap-[6px] min-h-[44px] text-[14px] text-[#55535A] no-underline min-[961px]:hidden" href="/#specialita"><Icon name="back" size={16} />Tutte le specialità</Link>
          <h1 className="m-[56px_0_0] font-[600] max-[960px]:m-[24px_0_0]">
            <span className={`hero-word block leading-[.92] tracking-[-.05em] [text-transform:lowercase] max-[960px]:leading-[.95] ${WORD_SIZE[x.slug] ?? "text-[clamp(48px,8.4vw,124px)] max-[960px]:text-[42px]"}`}>
              {x.name}<span className="text-[#CF000A]" aria-hidden>.</span>
            </span>{" "}
            <span className="block mt-[20px] text-[30px] leading-[1.2] tracking-[-.015em] font-[500] text-[#1A181B] max-[960px]:mt-[14px] max-[960px]:text-[21px] max-[960px]:leading-[1.25]"><Ph text={x.visitName} /></span>
          </h1>
          <div className="cols grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-[64px] items-end p-[28px_0_64px] max-[960px]:p-[14px_0_32px] max-[960px]:gap-0">
            <div>
              <p className="m-0 text-[19px] leading-[1.6] text-[#55535A] max-w-[34em] max-[960px]:text-[17px]"><InlineText value={x.lead} /></p>
              {!!x.note?.length && (
                <p className="m-[14px_0_0] text-[15px] leading-[1.55] text-[#1A181B] flex gap-[10px] items-start max-w-[36em]"><Icon name="info" size={20} sw={2} stroke="#0070B8" className="flex-none mt-[2px]" /><span><InlineText value={x.note} /></span></p>
              )}
              <div className="max-[960px]:hidden"><FactsDesktop facts={x.facts} className="mt-[32px]" /></div>
              <div className="min-[961px]:hidden"><FactsMobile facts={x.facts} className="mt-[18px]" /></div>
            </div>
            <div className="flex flex-col gap-[14px] items-start max-[960px]:hidden">
              <Link className="am-btn am-btn--primary" href="/richiesta-visita-privata/"><Ph text={x.ctaLabel} /></Link>
              <span className="text-[15px] text-[#55535A]">Oppure chiama la segreteria: <strong className="font-[600] text-[#1A181B]"><Ph text={s.phone} /></strong></span>
            </div>
          </div>
        </div>
        <span className="am-trace am-trace--draw w-full max-[960px]:gap-[3px]" aria-hidden><i className="rounded-[0] max-[960px]:h-[4px]" /><i className="rounded-[0] max-[960px]:h-[4px]" /></span>
      </section>
      <TocMobile entries={toc} />

      {/* CORPO: hub e scheda nella stessa colonna */}
      <section className="p-[72px_0_96px] max-[960px]:p-[0_0_8px]">
        <div className="wrap layout grid grid-cols-[minmax(0,8fr)_minmax(0,4fr)] gap-[72px] items-start">
          <article className="prose">
            <Toc entries={toc} />
            <ProseSections sections={x.sections} dot={dot} />
            {x.pros.length > 0 && (
              <section id="chi">
                <h2><Ph text={chi.heading} /></h2>
                <div className="flex flex-col gap-[10px]">
                  {x.pros.map((p) => <ProRow key={p._id} p={p} className="max-w-[520px] mt-[8px]" />)}
                </div>
              </section>
            )}
          </article>
          <Aside title={aside.heading} text={aside.body} ctaLabel={aside.ctaLabel} s={s} label="Richiedi la visita" />
        </div>
      </section>

      {x.posts.length > 0 && (
        <section className="p-[0_0_96px] max-[960px]:p-[40px_0]">
          <div className="wrap">
            <h2 className="m-[0_0_28px] font-[600] text-[28px] tracking-[-.01em] max-[960px]:m-[0_0_18px] max-[960px]:text-[22px]"><Ph text={posts.heading} /></h2>
            <div className="g2 grid grid-cols-[repeat(2,minmax(0,1fr))] gap-[20px] max-[960px]:gap-[10px]">
              {x.posts.map((p) => <PostRow key={p._id} p={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* SPECIALITÀ VICINE */}
      <RelatedTiles
        title={rel.heading}
        tiles={[
          ...(x.related ?? []).filter(Boolean).map((r) => ({ key: r.slug, href: specialtyHref(r.slug), name: r.name, dot: r.color })),
          { key: "all", href: "/prestazioni/", name: plain(rel.ctaLabel) || "Tutte le 13 prestazioni", all: true },
        ]}
      />
      <CtaBar label={plain(x.ctaLabel) || undefined} />
    </div>
  );
}

