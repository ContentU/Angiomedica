import Link from "next/link";
import { CtaBar } from "@/components/CtaBar";
import { FaqList } from "@/components/Detail";
import { Icon } from "@/components/Icon";
import { InlineText } from "@/components/RichText";
import { block, Ph } from "@/lib/content";
import { getPage, pageMetadata } from "@/lib/page";
import { getSettings } from "@/lib/settings";

export const generateMetadata = () => pageMetadata("per-il-paziente");

export default async function PerIlPaziente() {
  const [p, s] = await Promise.all([getPage("per-il-paziente"), getSettings()]);
  const b = (k: string) => block(p.blocks, k);
  const pren = b("prenotare"), prat = b("pratiche"), dom = b("domicilio"), faq = b("faq"), aiuto = b("aiuto");
  const [priv, ssn] = pren.items ?? [];
  return (
    <div className="pg-per-il-paziente">
      <section className="head">
        <div className="wrap">
          <nav className="crumb desk-only" aria-label="Percorso"><Link href="/">Home</Link><span aria-hidden>›</span><span className="text-[#1A181B]" aria-current="page">Per il paziente</span></nav>
          <Link className="mob-only text-[14px] text-[#55535A] no-underline" href="/"><span className="inline-flex items-center gap-[6px] min-h-[44px]"><Icon name="back" size={16} />Home</span></Link>
          <div className="cols head-in">
            <h1 className="h1">{p.title}</h1>
            <div><p className="lead"><InlineText value={p.lead} /></p></div>
          </div>
        </div>
        <span className="am-trace" aria-hidden><i className="rounded-[0]" /><i className="rounded-[0]" /></span>
      </section>
      <section className="sec">
        <div className="wrap">
          <h2 className="h2 mb-[12px]"><Ph text={pren.heading} /></h2>
          <p className="lead mb-[36px] text-[17px]"><InlineText value={pren.body} /></p>
          <div className="g2 gap-[20px]">
            {priv && (
              <div className="ccard bg-[#035BDB] shadow-none text-[#FFFFFF] p-[36px]">
                <small className="text-[#BFD7EC] font-[600]"><Ph text={priv.label} /></small>{" "}
                <strong className="text-[30px]"><Ph text={priv.title} /></strong>
                <p className="m-[8px_0_0] text-[16px] leading-[1.6] text-[#FFFFFF]"><InlineText value={priv.text} /></p>
                <div className="flex gap-[12px] flex-wrap mt-[24px]"><Link className="am-btn am-btn--on-deep" href={priv.href || "/richiesta-visita-privata/"}><Ph text={priv.ctaLabel} /></Link><a className="wa" href={s.whatsappHref}>Scrivi su WhatsApp*</a></div>
              </div>
            )}
            {ssn && (
              <div className="ccard p-[36px]">
                <small className="font-[600]"><Ph text={ssn.label} /></small>{" "}
                <strong className="text-[30px]"><Ph text={ssn.title} /></strong>
                <p className="muted m-[8px_0_0] text-[16px] leading-[1.6]"><InlineText value={ssn.text} /></p>
                <div className="flex gap-[16px] flex-wrap items-center mt-[24px]"><Link className="am-btn am-btn--secondary" href={ssn.href || "/prestazioni-ssn/"}><Ph text={ssn.ctaLabel} /></Link><span className="font-[600]"><Ph text={s.phone} /></span></div>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="sec soft">
        <div className="wrap">
          <h2 className="h2 mb-[36px]"><Ph text={prat.heading} /></h2>
          <div className="g4 gap-[16px]">
            {prat.items?.map((i) => (
              <div key={i._key} className="ccard"><small><Ph text={i.label} /></small><strong className="text-[19px]"><Ph text={i.title} /></strong><p className="muted m-[4px_0_0] text-[15px] leading-[1.55]"><InlineText value={i.text} /></p></div>
            ))}
          </div>
        </div>
      </section>
      <section className="sec-s">
        <div className="wrap">
          <Link className="ccard bg-[#E8F2FB] shadow-none flex-row items-center justify-between gap-[24px] p-[32px_36px]" href="/visite-a-domicilio/">
            <span><small className="block font-[600]"><Ph text={dom.label} /></small><strong className="block mt-[6px]"><Ph text={dom.heading} /></strong></span><span className="am-go w-[44px] h-[44px]"><Icon name="arrow" size={18} /></span>
          </Link>
        </div>
      </section>
      <section className="sec pt-[24px]">
        <div className="wrap cols-r">
          <h2 className="h2"><Ph text={faq.heading} /></h2>
          <FaqList faq={p.faq} />
        </div>
      </section>
      <section className="sec-s bg-[#0B3D6B] text-[#FFFFFF]">
        <div className="wrap cols items-center">
          <div>
            <h2 className="h2 text-[36px]"><Ph text={aiuto.heading} /></h2>
            <p className="m-[14px_0_0] text-[17px] text-[#BFD7EC] max-w-[34em]"><InlineText value={aiuto.body} /></p>
          </div>
          <div className="flex justify-end"><Link className="am-btn am-btn--on-deep" href="/contatti/"><Ph text={aiuto.ctaLabel} /></Link></div>
        </div>
      </section>
      <CtaBar />
    </div>
  );
}
