import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CtaBar } from "@/components/CtaBar";
import { Icon } from "@/components/Icon";
import { InlineText, RichText } from "@/components/RichText";
import { Ph, plain, postHref, proHref, serviceHref, specialtyHref } from "@/lib/content";
import { getSettings } from "@/lib/settings";
import type { PostCard, ProCard, PT, Section, ServiceCard } from "@/lib/types";
import { sanityFetch } from "@/sanity/client";
import { professionalQuery, slugsQuery } from "@/sanity/queries";

type Pro = ProCard & { subtitle?: string; intro?: PT; sections?: Section[]; services?: ServiceCard[]; posts: PostCard[]; others: ProCard[]; seoTitle?: string; seoDescription?: string };
type Props = { params: Promise<{ slug: string }> };
const get = (slug: string) => sanityFetch<Pro | null>(professionalQuery, { slug });

export async function generateStaticParams() {
  return (await sanityFetch<string[]>(slugsQuery, { type: "professional" })).map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const x = await get((await params).slug);
  return x ? { title: x.seoTitle || `${plain(x.name)} | Angiomedica`, description: x.seoDescription } : {};
}

export default async function Professionista({ params }: Props) {
  const [x, s] = await Promise.all([get((await params).slug), getSettings()]);
  if (!x) notFound();
  const sp = x.specialties?.[0];
  const services = (x.services ?? []).filter(Boolean);
  return (
    <div className="pg-professionista">
      <section className="head pb-[0]">
        <div className="wrap">
          <nav className="crumb desk-only" aria-label="Percorso"><Link href="/">Home</Link><span aria-hidden>›</span><Link href="/professionisti/">Professionisti</Link><span aria-hidden>›</span><span className="text-[#1A181B]" aria-current="page"><Ph text={x.name} /></span></nav>
          <Link className="mob-only text-[14px] text-[#55535A] no-underline" href="/professionisti/"><span className="inline-flex items-center gap-[6px] min-h-[44px]"><Icon name="back" size={16} />Professionisti</span></Link>
          <div className="cols-r p-[40px_0_64px] items-center">
            <div className="am-photo [aspect-ratio:4_/_5] h-auto rounded-[28px] max-w-[440px]">Ritratto professionale · foto reale</div>
            <div>
              {sp && <Link className="lab no-underline text-[#0070B8]" href={specialtyHref(sp.slug)}><span className={`am-dot am-dot--${sp.color ?? "cardio"}`} />{x.specialties!.map((z) => z.name).join(" · ")}</Link>}
              <h1 className="h1 mt-[14px]"><Ph text={x.name} /></h1>
              <p className="lead mt-[12px] text-[#1A181B] font-[500]"><Ph text={x.subtitle} /></p>
              <p className="lead mt-[16px] max-w-[32em]"><InlineText value={x.intro} /></p>
              <div className="flex gap-[20px] items-center flex-wrap mt-[28px]">
                <Link className="am-btn am-btn--primary" href="/richiesta-visita-privata/">Richiedi una visita con <Ph text={x.shortName || x.name} /></Link>{" "}
                <span className="muted text-[15px]">Oppure chiama: <strong className="font-[600] text-[#1A181B]"><Ph text={s.phone} /></strong></span>
              </div>
            </div>
          </div>
        </div>
        <span className="am-trace" aria-hidden><i className="rounded-[0]" /><i className="rounded-[0]" /></span>
      </section>
      <section className="sec">
        <div className="wrap read">
          <article className="prose">
            {x.sections?.map((z) => (
              <section key={z._key}>
                <h2><Ph text={z.heading} /></h2>
                <RichText value={z.body} />
                {!!z.items?.length && (
                  <dl className="dl m-0 max-w-[40em]">
                    {z.items.map((i, n) => <div key={i._key} className={n === z.items!.length - 1 ? "[border-bottom:1px_solid_#DCE3EB]" : undefined}><dt><Ph text={i.label} /></dt><dd><Ph text={i.title} /></dd></div>)}
                  </dl>
                )}
              </section>
            ))}
          </article>
          {(services.length > 0 || sp) && (
            <aside className="sticky top-[112px]">
              {services.length > 0 && (
                <>
                  <h2 className="h3 font-[600] mb-[16px]">Prestazioni che segue</h2>
                  <div className="flex flex-col gap-[10px]">
                    {services.map((v) => (
                      <Link key={v._id} className="am-tile am-tile--compact" href={serviceHref(v)}><span className="am-tile__name"><span className={`am-dot am-dot--${v.specialty?.color ?? "cardio"} w-[10px] h-[10px]`} />{v.shortTitle || v.title}</span><Icon name="diag" size={22} sw={1.8} className="am-tile__arrow" /></Link>
                    ))}
                  </div>
                </>
              )}
              {sp && <Link className="am-btn am-btn--tertiary mt-[10px]" href={specialtyHref(sp.slug)}>La specialità {sp.name}</Link>}
            </aside>
          )}
        </div>
      </section>
      {x.posts.length > 0 && (
        <section className="sec soft">
          <div className="wrap">
            <h2 className="h2 text-[32px] mb-[28px]">Approfondimenti di <Ph text={x.shortName || x.name} /></h2>
            <div className="g3">
              {x.posts.map((p, i) => {
                const card = (
                  <Link key={p._id} className="am-post shadow-[inset_0_0_0_1.5px_#DCE3EB]" href={postHref(p.slug)}>
                    <div className="am-photo [aspect-ratio:4_/_3] h-auto">Immagine</div>
                    <div className="p-[16px_8px_8px]"><p className="am-post__meta"><span className={p.color === "angio" ? "am-tag-angio" : "am-tag-cardio"}><Ph text={p.category} /></span> · <Ph text={p.dateLabel} /></p><h3 className="am-post__title text-[19px]">{p.title}</h3></div>
                  </Link>
                );
                return i === 2 ? <div key={p._id} className="desk-only">{card}</div> : card;
              })}
            </div>
          </div>
        </section>
      )}
      <section className="sec">
        <div className="wrap">
          <div className="flex justify-between items-end gap-[24px] flex-wrap mb-[28px]"><h2 className="h2 text-[32px]">Altri professionisti</h2><Link className="am-btn am-btn--secondary" href="/professionisti/">Tutti i professionisti</Link></div>
          <div className="g4">
            {x.others.map((o) => (
              <Link key={o._id} className="am-pro shadow-[inset_0_0_0_1.5px_#DCE3EB]" href={proHref(o.slug)}>
                <div className="am-photo [aspect-ratio:4_/_5] h-auto">Ritratto</div>
                <div className="am-pro__row">
                  <span>
                    <span className="am-pro__name text-[17px]"><Ph text={o.name} /></span>
                    <span className="am-pro__role block text-[14px]"><Ph text={o.role} /></span>
                    {o.specialties?.[0] && <span className="lab mt-[6px] text-[13px]"><span className={`am-dot am-dot--${o.specialties[0].color ?? "cardio"} w-[8px] h-[8px]`} />{o.specialties[0].name}</span>}
                  </span>
                  <span className="hide-m"><span className="am-go w-[44px] h-[44px]"><Icon name="arrow" size={18} /></span></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBar label={`Richiedi una visita con ${plain(x.shortName || x.name)}`} />
    </div>
  );
}
