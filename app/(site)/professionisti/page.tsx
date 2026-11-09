import Link from "next/link";
import { CtaBar } from "@/components/CtaBar";
import { Icon } from "@/components/Icon";
import { InlineText } from "@/components/RichText";
import { block, Ph, proHref } from "@/lib/content";
import { getPage, pageMetadata } from "@/lib/page";
import type { ProCard } from "@/lib/types";
import { sanityFetch } from "@/sanity/client";
import { prosQuery } from "@/sanity/queries";

export const generateMetadata = () => pageMetadata("professionisti");

export default async function Professionisti() {
  const [p, pros] = await Promise.all([getPage("professionisti"), sanityFetch<ProCard[]>(prosQuery)]);
  const end = block(p.blocks, "chiusura");
  return (
    <div className="pg-professionisti">
      <section className="p-[32px_0_0] [background:linear-gradient(180deg,#FFFFFF_0%,#F2F6FA_100%)] max-[960px]:pt-[16px]">
        <div className="wrap">
          <nav className="crumb max-[960px]:hidden" aria-label="Percorso"><Link href="/">Home</Link><span aria-hidden>›</span><span className="text-[#1A181B]" aria-current="page">Professionisti</span></nav>
          <Link className="inline-flex items-center gap-[6px] min-h-[44px] text-[14px] text-[#55535A] no-underline min-[961px]:hidden" href="/"><Icon name="back" size={16} />Home</Link>
          <div className="cols grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-[64px] items-end p-[40px_0_56px] max-[960px]:gap-[12px] max-[960px]:p-[12px_0_28px]">
            <h1 className="m-0 font-[800] text-[64px] leading-[1.02] tracking-[-.035em] max-[960px]:text-[40px] max-[960px]:leading-[1.05] max-[960px]:tracking-[-.03em]">{p.title}</h1>
            <p className="m-0 text-[19px] leading-[1.6] text-[#55535A] max-[960px]:text-[16px] max-[960px]:leading-[1.55]"><InlineText value={p.lead} /></p>
          </div>
        </div>
        <span className="am-trace max-[960px]:gap-[3px]" aria-hidden><i className="rounded-[0] max-[960px]:h-[4px]" /><i className="rounded-[0] max-[960px]:h-[4px]" /></span>
      </section>
      <section className="p-[72px_0_104px] max-[960px]:p-[32px_0_8px]">
        <div className="wrap">
          <div className="g3 max-[960px]:gap-[12px]">
            {pros.map((x) => (
              <Link key={x._id} className="am-pro shadow-[inset_0_0_0_1.5px_#DCE3EB] max-[960px]:p-[8px_8px_14px] max-[960px]:gap-[10px]" href={proHref(x.slug)}>
                <div className="am-photo h-[280px] max-[960px]:h-[190px] max-[960px]:text-[9px]">Ritratto professionista</div>
                <div className="am-pro__row max-[960px]:p-[0_4px]">
                  <span>
                    <span className="am-pro__name text-[18px] max-[960px]:text-[16px] max-[960px]:leading-[1.3]"><Ph text={x.name} /></span>
                    <span className="am-pro__role block max-[960px]:text-[13px] max-[960px]:leading-[1.4]"><Ph text={x.role} /></span>
                    {x.specialties?.[0] && <span className="lab mt-[8px] max-[960px]:mt-[6px]"><span className={`am-dot am-dot--${x.specialties[0].color ?? "cardio"} w-[9px] h-[9px] max-[960px]:w-[8px] max-[960px]:h-[8px]`} />{x.specialties[0].name}</span>}
                  </span>
                  <span className="am-go w-[44px] h-[44px] max-[960px]:hidden"><Icon name="arrow" size={18} /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="p-[88px_0] bg-[#0B3D6B] text-[#FFFFFF] max-[960px]:mt-[32px] max-[960px]:p-[40px_0]">
        <div className="wrap cols grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-[56px] items-center max-[960px]:gap-[10px]">
          <div>
            <h2 className="m-0 font-[600] text-[36px] leading-[1.15] tracking-[-.02em] max-[960px]:text-[24px] max-[960px]:leading-[1.2]"><Ph text={end.heading} /></h2>
            <p className="m-[14px_0_0] text-[17px] text-[#BFD7EC] max-[960px]:m-[10px_0_0] max-[960px]:text-[15px]"><InlineText value={end.body} /></p>
          </div>
          <div className="flex justify-end max-[960px]:hidden"><Link className="am-btn am-btn--on-deep" href="/richiesta-visita-privata/"><Ph text={end.ctaLabel} /></Link></div>
        </div>
      </section>
      <CtaBar />
    </div>
  );
}
