import Link from "next/link";
import { CtaBar } from "@/components/CtaBar";
import { FaqList } from "@/components/Detail";
import { Icon } from "@/components/Icon";
import { InlineText } from "@/components/RichText";
import { block, Ph, plain, serviceHref } from "@/lib/content";
import { getPage, pageMetadata } from "@/lib/page";
import { getSettings } from "@/lib/settings";
import type { ServiceCard } from "@/lib/types";
import { sanityFetch } from "@/sanity/client";
import { servicesQuery } from "@/sanity/queries";

export const generateMetadata = () => pageMetadata("visite-a-domicilio");
const H2M = "max-[960px]:text-[26px] max-[960px]:leading-[1.2]";

export default async function Domicilio() {
  const [p, s, services] = await Promise.all([getPage("visite-a-domicilio"), getSettings(), sanityFetch<ServiceCard[]>(servicesQuery)]);
  const b = (k: string) => block(p.blocks, k);
  const hero = b("hero"), come = b("come-funziona"), cosa = b("cosa"), dove = b("dove"), faq = b("faq"), end = b("chiusura");
  const home = services.filter((x) => x.home);
  return (
    <div className="pg-visite-a-domicilio">
      <section className="p-[32px_0_0] bg-[#E8F2FB] max-[960px]:pt-[16px]">
        <div className="wrap">
          <nav className="crumb max-[960px]:hidden" aria-label="Percorso"><Link href="/">Home</Link><span aria-hidden>›</span><Link href="/per-il-paziente/">Per il paziente</Link><span aria-hidden>›</span><span className="text-[#1A181B]" aria-current="page">Visite a domicilio</span></nav>
          <Link className="inline-flex items-center gap-[6px] min-h-[44px] text-[14px] text-[#3F4A55] no-underline min-[961px]:hidden" href="/per-il-paziente/"><Icon name="back" size={16} />Per il paziente</Link>
          <div className="cols grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-[64px] items-center p-[48px_0_72px] max-[960px]:p-[12px_0_32px] max-[960px]:gap-0">
            <div>
              <h1 className="m-0 font-[800] text-[64px] leading-[1.02] tracking-[-.035em] [text-wrap:balance] max-[960px]:text-[38px] max-[960px]:leading-[1.05] max-[960px]:tracking-[-.03em]">{p.title}</h1>
              <p className="m-[22px_0_0] text-[19px] leading-[1.6] text-[#3F4A55] max-w-[32em] max-[960px]:m-[14px_0_0] max-[960px]:text-[16px] max-[960px]:leading-[1.55]"><InlineText value={p.lead} /></p>
              <div className="flex gap-[24px] items-center flex-wrap mt-[32px] max-[960px]:hidden">
                <Link className="am-btn am-btn--primary" href="/richiesta-visita-privata/"><Ph text={hero.ctaLabel} /></Link>{" "}
                <span className="text-[15px] text-[#3F4A55]">Oppure chiama: <strong className="font-[600] text-[#1A181B]"><Ph text={s.phone} /></strong></span>
              </div>
              <p className="m-[18px_0_0] text-[14px] text-[#3F4A55] max-[960px]:m-[12px_0_0] max-[960px]:font-[600] max-[960px]:text-[#1A181B]"><Ph text={hero.label} /></p>
            </div>
            <div className="am-photo h-[400px] rounded-[28px] bg-[#FFFFFF] max-[960px]:hidden"><Ph text={p.photoCaption} /></div>
          </div>
        </div>
        <div className="am-photo h-[200px] rounded-[0] bg-[#FFFFFF] min-[961px]:hidden"><Ph text={p.photoCaption} /></div>
        <span className="am-trace max-[960px]:gap-[3px]" aria-hidden><i className="rounded-[0] max-[960px]:h-[4px]" /><i className="rounded-[0] max-[960px]:h-[4px]" /></span>
      </section>
      <section className="p-[104px_0] max-[960px]:p-[44px_0_40px]">
        <div className="wrap">
          <h2 className={`h2 mb-[40px] max-[960px]:mb-[18px] ${H2M}`}><Ph text={come.heading} /></h2>
          <ol className="g3 steps list-none m-0 p-0 grid grid-cols-[repeat(3,minmax(0,1fr))] gap-[20px]">
            {come.items?.map((i, n) => (
              <li key={i._key} className="step">
                <span className="am-trace am-trace--thin absolute left-[0] right-[0] top-[0]" aria-hidden><i className="rounded-[0]" /><i className="rounded-[0]" /></span>
                <b>{n + 1}</b><div><h3><Ph text={i.title} /></h3><p><InlineText value={i.text} /></p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="p-[104px_0] bg-[#F2F6FA] max-[960px]:p-[40px_0]">
        <div className="wrap">
          <div className="cols grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[64px] items-end mb-[36px] max-[960px]:gap-[12px] max-[960px]:mb-[18px]">
            <div><span className="tbc"><Ph text={cosa.label} /></span><h2 className={`h2 mt-[16px] max-[960px]:mt-[12px] ${H2M}`}><Ph text={cosa.heading} /></h2></div>
            <p className="m-0 text-[17px] leading-[1.6] text-[#55535A] max-[960px]:text-[15px]"><InlineText value={cosa.body} /></p>
          </div>
          <div className="g2 grid grid-cols-[repeat(2,minmax(0,1fr))] gap-[16px] max-[960px]:gap-[10px]">
            {home.map((x) => (
              <Link key={x._id} className="am-tile min-h-[88px] max-[960px]:min-h-[68px] max-[960px]:p-[0_18px] max-[960px]:rounded-[16px]" href={serviceHref(x)}>
                <span className="am-tile__name text-[22px] max-[960px]:text-[18px] max-[960px]:gap-[12px]"><span className={`am-dot am-dot--${x.specialty?.color ?? "cardio"}`} />{x.shortTitle || x.title}</span>
                <Icon name="diag" size={26} sw={1.6} className="am-tile__arrow max-[960px]:w-[22px] max-[960px]:h-[22px]" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="p-[104px_0] max-[960px]:p-[40px_0_32px]">
        <div className="wrap cols grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-[72px] items-start">
          <div>
            <h2 className={`h2 ${H2M}`}><Ph text={dove.heading} /></h2>
            <dl className="m-[32px_0_0] max-[960px]:m-[16px_0_0]">
              {dove.items?.map((i, n) => (
                <div key={i._key} className={`p-[18px_0] [border-top:1px_solid_#DCE3EB] max-[960px]:p-[14px_0] ${n === (dove.items?.length ?? 0) - 1 ? "[border-bottom:1px_solid_#DCE3EB]" : ""}`}>
                  <dt className="text-[14px] text-[#55535A] max-[960px]:text-[13px]"><Ph text={i.label} /></dt>
                  <dd className="m-[4px_0_0] text-[18px] font-[500] max-[960px]:m-[2px_0_0] max-[960px]:text-[17px]"><Ph text={i.title} /></dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="am-photo h-[380px] rounded-[28px] max-[960px]:hidden"><Ph text={dove.photoCaption} /></div>
        </div>
      </section>
      <section className="p-[0_0_104px] max-[960px]:p-[24px_0_48px]">
        <div className="wrap cols grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-[72px] items-start max-[960px]:gap-[12px]">
          <h2 className={`h2 ${H2M}`}><Ph text={faq.heading} /></h2>
          <FaqList faq={p.faq} />
        </div>
      </section>
      <section className="p-[88px_0] bg-[#0B3D6B] text-[#FFFFFF] max-[960px]:hidden">
        <div className="wrap cols grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-[56px] items-center">
          <div>
            <h2 className="m-0 font-[600] text-[36px] leading-[1.15] tracking-[-.02em]"><Ph text={end.heading} /></h2>
            <p className="m-[14px_0_0] text-[17px] text-[#BFD7EC]"><InlineText value={end.body} /></p>
          </div>
          <div className="flex justify-end"><Link className="am-btn am-btn--on-deep" href="/richiesta-visita-privata/"><Ph text={end.ctaLabel} /></Link></div>
        </div>
      </section>
      <CtaBar label={plain(end.heading) || undefined} />
    </div>
  );
}
