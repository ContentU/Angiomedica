import Link from "next/link";
import { FaqList } from "@/components/Detail";
import { Icon } from "@/components/Icon";
import { InlineText, RichText } from "@/components/RichText";
import { block, Ph, serviceHref } from "@/lib/content";
import { getPage, pageMetadata } from "@/lib/page";
import type { ServiceCard } from "@/lib/types";
import { sanityFetch } from "@/sanity/client";
import { servicesQuery } from "@/sanity/queries";

export const generateMetadata = () => pageMetadata("prestazioni-ssn");

export default async function Ssn() {
  const [p, services] = await Promise.all([getPage("prestazioni-ssn"), sanityFetch<ServiceCard[]>(servicesQuery)]);
  const b = (k: string) => block(p.blocks, k);
  const elenco = b("elenco"), pren = b("prenotare"), doc = b("documenti"), faq = b("faq"), priv = b("privato");
  const [first, ...rest] = (p.lead ?? []) as unknown[];
  return (
    <div className="pg-prestazioni-ssn">
      <section className="head">
        <div className="wrap">
          <nav className="crumb desk-only" aria-label="Percorso"><Link href="/">Home</Link><span aria-hidden>›</span><Link href="/per-il-paziente/">Per il paziente</Link><span aria-hidden>›</span><span className="text-[#1A181B]" aria-current="page">Prestazioni S.S.N.</span></nav>
          <Link className="mob-only text-[14px] text-[#55535A] no-underline" href="/per-il-paziente/"><span className="inline-flex items-center gap-[6px] min-h-[44px]"><Icon name="back" size={16} />Per il paziente</span></Link>
          <div className="cols head-in">
            <h1 className="h1">{p.title}</h1>
            <div>
              <p className="lead"><InlineText value={first ? [first] : []} /></p>
              {rest.length > 0 && <p className="m-[14px_0_0] text-[15px] font-[600]"><InlineText value={rest} /></p>}
            </div>
          </div>
        </div>
        <span className="am-trace" aria-hidden><i className="rounded-[0]" /><i className="rounded-[0]" /></span>
      </section>
      <section className="sec">
        <div className="wrap">
          <div className="cols mb-[32px]"><div><span className="tbc"><Ph text={elenco.label} /></span><h2 className="h2 mt-[14px]"><Ph text={elenco.heading} /></h2></div><p className="lead text-[17px]"><InlineText value={elenco.body} /></p></div>
          <div className="g2">
            {services.filter((x) => x.inSsn).map((x) => (
              <Link key={x._id} className="am-tile min-h-[88px]" href={serviceHref(x)}><span className="am-tile__name text-[22px]"><span className={`am-dot am-dot--${x.specialty?.color ?? "cardio"}`} />{x.shortTitle || x.title}</span><Icon name="diag" size={26} sw={1.6} className="am-tile__arrow" /></Link>
            ))}
          </div>
        </div>
      </section>
      <section className="sec soft">
        <div className="wrap">
          <h2 className="h2 mb-[36px]"><Ph text={pren.heading} /></h2>
          <div className="g2 gap-[20px]">
            {pren.items?.map((i, n) => (
              <a key={i._key} className="ccard p-[36px]" href={i.href || "#"}><small><Ph text={i.label} /></small><strong className={n === 0 ? "text-[36px]" : "text-[30px]"}><Ph text={i.title} /></strong><span className="muted text-[15px]"><InlineText value={i.text} /></span></a>
            ))}
          </div>
          <div className="mt-[36px] max-w-[46em] ssn-doc">
            <h3 className="h3 font-[600] mb-[12px]"><Ph text={doc.heading} /></h3>
            <RichText value={doc.body} />
          </div>
        </div>
      </section>
      <section className="sec">
        <div className="wrap cols-r">
          <h2 className="h2"><Ph text={faq.heading} /></h2>
          <FaqList faq={p.faq} />
        </div>
      </section>
      <section className="sec-s pt-[0]">
        <div className="wrap">
          <div className="am-ssn bg-[#F2F6FA] items-center justify-between flex-wrap">
            <span className="flex gap-[16px] items-start"><Icon name="info" size={24} sw={2} stroke="#55535A" className="flex-none mt-[2px]" /><span><strong className="font-[600]"><Ph text={priv.heading} /></strong><span className="muted block text-[15px]"><InlineText value={priv.body} /></span></span></span>{" "}
            <Link className="am-btn am-btn--tertiary" href="/richiesta-visita-privata/"><Ph text={priv.ctaLabel} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
