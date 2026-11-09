import Link from "next/link";
import { CtaBar } from "@/components/CtaBar";
import { Icon } from "@/components/Icon";
import { InlineText, RichText } from "@/components/RichText";
import { block, Ph, proHref } from "@/lib/content";
import { getPage, pageMetadata } from "@/lib/page";
import type { ProCard } from "@/lib/types";
import { sanityFetch } from "@/sanity/client";
import { prosQuery } from "@/sanity/queries";

export const generateMetadata = () => pageMetadata("il-centro");

export default async function IlCentro() {
  const [p, pros] = await Promise.all([getPage("il-centro"), sanityFetch<ProCard[]>(prosQuery)]);
  const b = (k: string) => block(p.blocks, k);
  const chi = b("chi-siamo"), storia = b("storia"), principi = b("principi"), sede = b("sede"), team = b("professionisti"), end = b("chiusura");
  return (
    <div className="pg-il-centro">
      <section className="p-[32px_0_0] bg-[#FFFFFF]">
        <div className="wrap">
          <nav className="crumb desk-only" aria-label="Percorso"><Link href="/">Home</Link><span aria-hidden>›</span><span className="text-[#1A181B]" aria-current="page">Il Centro</span></nav>
          <Link className="mob-only text-[14px] text-[#55535A] no-underline" href="/"><span className="inline-flex items-center gap-[6px] min-h-[44px]"><Icon name="back" size={16} />Home</span></Link>
          <div className="cols head-in items-end">
            <h1 className="h1 text-[72px]">{p.title}</h1>
            <p className="lead"><InlineText value={p.lead} /></p>
          </div>
        </div>
        <div className="wrap"><div className="am-photo [aspect-ratio:21_/_8] h-auto rounded-[28px]"><Ph text={p.photoCaption} /></div></div>
      </section>
      <section className="sec">
        <div className="wrap cols-r">
          <h2 className="h2"><Ph text={chi.heading} /></h2>
          <div className="prose"><RichText value={chi.body} /></div>
        </div>
      </section>
      <section className="sec soft">
        <div className="wrap">
          <h2 className="h2 mb-[40px]"><Ph text={storia.heading} /></h2>
          <ol className="g4 list-none m-0 p-0">
            {storia.items?.map((i) => (
              <li key={i._key} className="relative pt-[28px]">
                <span className="am-trace am-trace--thin absolute left-[0] right-[0] top-[0]" aria-hidden><i className="rounded-[0]" /><i className="rounded-[0]" /></span>
                <b className="block text-[40px] font-[600] tracking-[-.03em] text-[#0070B8]"><Ph text={i.title} /></b>
                <p className="m-[8px_0_0] text-[16px] leading-[1.55]"><InlineText value={i.text} /></p>
              </li>
            ))}
          </ol>
          <p className="muted m-[28px_0_0] text-[14px]"><InlineText value={storia.body} /></p>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <h2 className="h2 mb-[40px]"><Ph text={principi.heading} /></h2>
          <div className="g3">
            {principi.items?.map((i) => (
              <div key={i._key} className="ccard"><strong><Ph text={i.title} /></strong><p className="muted m-[6px_0_0] text-[16px] leading-[1.6]"><InlineText value={i.text} /></p></div>
            ))}
          </div>
        </div>
      </section>
      <section className="sec soft">
        <div className="wrap">
          <div className="cols mb-[36px]"><h2 className="h2"><Ph text={sede.heading} /></h2><p className="lead text-[17px]"><InlineText value={sede.body} /></p></div>
          <div className="g-photo grid grid-cols-[2fr_1fr] gap-[16px]">
            <div className="am-photo [aspect-ratio:16_/_10] h-auto rounded-[24px]"><Ph text={sede.items?.[0]?.title} /></div>
            <div className="grid gap-[16px]"><div className="am-photo rounded-[24px]"><Ph text={sede.items?.[1]?.title} /></div><div className="am-photo rounded-[24px]"><Ph text={sede.items?.[2]?.title} /></div></div>
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="wrap">
          <div className="flex justify-between items-end gap-[24px] flex-wrap mb-[28px]"><h2 className="h2"><Ph text={team.heading} /></h2><Link className="am-btn am-btn--secondary" href="/professionisti/"><Ph text={team.ctaLabel} /></Link></div>
          <div className="g4">
            {pros.map((x) => (
              <Link key={x._id} className="am-pro shadow-[inset_0_0_0_1.5px_#DCE3EB]" href={proHref(x.slug)}>
                <div className="am-photo [aspect-ratio:4_/_5] h-auto">Ritratto</div>
                <div className="am-pro__row">
                  <span>
                    <span className="am-pro__name text-[17px]"><Ph text={x.name} /></span>
                    <span className="am-pro__role block text-[14px]"><Ph text={x.role} /></span>
                    {x.specialties?.[0] && <span className="lab mt-[6px] text-[13px]"><span className={`am-dot am-dot--${x.specialties[0].color ?? "cardio"} w-[8px] h-[8px]`} />{x.specialties[0].name}</span>}
                  </span>
                  <span className="hide-m"><span className="am-go w-[44px] h-[44px]"><Icon name="arrow" size={18} /></span></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="sec-s bg-[#0B3D6B] text-[#FFFFFF]">
        <div className="wrap cols items-center">
          <div>
            <h2 className="h2 text-[36px]"><Ph text={end.heading} /></h2>
            <p className="m-[14px_0_0] text-[17px] text-[#BFD7EC] max-w-[34em]"><InlineText value={end.body} /></p>
          </div>
          <div className="flex justify-end"><Link className="am-btn am-btn--on-deep" href="/richiesta-visita-privata/"><Ph text={end.ctaLabel} /></Link></div>
        </div>
      </section>
      <CtaBar />
    </div>
  );
}
