import Link from "next/link";
import { CatalogFilter } from "@/components/CatalogFilter";
import { CtaBar } from "@/components/CtaBar";
import { Icon } from "@/components/Icon";
import { InlineText } from "@/components/RichText";
import { block, Ph, serviceHref, specialtyHref } from "@/lib/content";
import { getPage, pageMetadata } from "@/lib/page";
import type { ServiceCard, SpecRef } from "@/lib/types";
import { sanityFetch } from "@/sanity/client";
import { servicesQuery, specialtiesQuery } from "@/sanity/queries";

export const generateMetadata = () => pageMetadata("prestazioni");

export default async function Prestazioni() {
  const [p, services, specs] = await Promise.all([getPage("prestazioni"), sanityFetch<ServiceCard[]>(servicesQuery), sanityFetch<SpecRef[]>(specialtiesQuery)]);
  const b = (k: string) => block(p.blocks, k);
  const cons = b("consulenze"), ssn = b("ssn"), end = b("chiusura");
  const of = (slug: string) => services.filter((x) => x.specialty?.slug === slug);
  const hubs = specs.filter((x) => x.layout !== "consulenza");
  const consulenze = specs.filter((x) => x.layout === "consulenza");

  const hubGroup = (sp: SpecRef) => (
    <section className="grp max-[960px]:px-0">
      <div className="wrap">
        <div className="gh max-[960px]:items-baseline max-[960px]:gap-[12px] max-[960px]:mb-[14px] max-[960px]:flex-nowrap">
          <h2 className="gt max-[960px]:text-[24px]"><span className={`am-dot am-dot--${sp.color ?? "cardio"}`} />{sp.name}</h2>
          <Link className="text-[14px] font-[600] min-h-[44px] inline-flex items-center min-[961px]:hidden" href={specialtyHref(sp.slug)}>La specialità</Link>
        </div>
        <div className="g2 max-[960px]:gap-[10px]">
          {of(sp.slug).map((x) => (
            <Link key={x._id} className="am-tile min-h-[96px] max-[960px]:min-h-[68px] max-[960px]:p-[0_18px] max-[960px]:rounded-[16px]" href={serviceHref(x)}><span className="am-tile__name text-[24px] max-[960px]:text-[18px]">{x.shortTitle || x.title}</span><Icon name="diag" size={28} sw={1.6} className="am-tile__arrow max-[960px]:w-[22px] max-[960px]:h-[22px]" /></Link>
          ))}
          <Link className="am-tile min-h-[96px] bg-[#F2F6FA] shadow-none max-[960px]:hidden" href={specialtyHref(sp.slug)}><span className="am-tile__name text-[18px] font-[600] text-[#0070B8]">Scopri la specialità {sp.name}</span><Icon name="diag" size={28} sw={1.6} className="am-tile__arrow" /></Link>
        </div>
      </div>
    </section>
  );

  return (
    <div className="pg-prestazioni">
      <section className="p-[32px_0_0] [background:linear-gradient(180deg,#FFFFFF_0%,#F2F6FA_100%)] max-[960px]:pt-[16px]">
        <div className="wrap">
          <nav className="crumb max-[960px]:hidden" aria-label="Percorso"><Link href="/">Home</Link><span aria-hidden>›</span><span className="text-[#1A181B]" aria-current="page">Prestazioni</span></nav>
          <Link className="inline-flex items-center gap-[6px] min-h-[44px] text-[14px] text-[#55535A] no-underline min-[961px]:hidden" href="/"><Icon name="back" size={16} />Home</Link>
          <div className="cols grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-[64px] items-end p-[40px_0_56px] max-[960px]:gap-[12px] max-[960px]:p-[12px_0_28px]">
            <h1 className="m-0 font-[800] text-[64px] leading-[1.02] tracking-[-.035em] max-[960px]:text-[40px] max-[960px]:leading-[1.05] max-[960px]:tracking-[-.03em]">{p.title}</h1>
            <p className="m-0 text-[19px] leading-[1.6] text-[#55535A] max-[960px]:text-[16px] max-[960px]:leading-[1.55]"><InlineText value={p.lead} /></p>
          </div>
        </div>
        <span className="am-trace max-[960px]:gap-[3px]" aria-hidden><i className="rounded-[0] max-[960px]:h-[4px]" /><i className="rounded-[0] max-[960px]:h-[4px]" /></span>
      </section>
      <CatalogFilter
        total={services.length}
        showAllLabel={`Mostra tutte le ${services.length} prestazioni`}
        filters={specs.map((sp) => ({ key: sp.slug, label: sp.name, count: of(sp.slug).length }))}
        groups={[
          ...hubs.map((sp) => ({ keys: [sp.slug], node: hubGroup(sp) })),
          {
            keys: consulenze.map((x) => x.slug),
            node: (
              <section className="grp">
                <div className="wrap">
                  <div className="gh max-[960px]:block max-[960px]:mb-[14px]"><h2 className="gt max-[960px]:text-[24px] max-[960px]:mb-[6px]"><Ph text={cons.heading} /></h2><p className="m-0 text-[16px] text-[#55535A] max-w-[30em] max-[960px]:text-[15px]"><InlineText value={cons.body} /></p></div>
                  <div className="g3 max-[960px]:gap-[10px]">
                    {consulenze.map((sp) => of(sp.slug).map((x) => (
                      <Link key={x._id} className="am-tile min-h-[132px] items-end pb-[26px] max-[960px]:min-h-[76px] max-[960px]:items-center max-[960px]:p-[0_18px] max-[960px]:rounded-[16px]" href={specialtyHref(sp.slug)}>
                        <span className="am-tile__name text-[22px] flex-col items-start gap-[8px] max-[960px]:text-[18px] max-[960px]:gap-[2px]"><small className="lab"><span className={`am-dot am-dot--${sp.color ?? "cardio"} w-[9px] h-[9px]`} />{sp.name}</small>{x.shortTitle || x.title}</span>
                        <Icon name="diag" size={28} sw={1.6} className="am-tile__arrow max-[960px]:w-[22px] max-[960px]:h-[22px]" />
                      </Link>
                    )))}
                  </div>
                </div>
              </section>
            ),
          },
        ]}
      />
      <section className="p-[8px_0_96px] max-[960px]:p-[32px_0]">
        <div className="wrap">
          <div className="flex gap-[20px] items-center justify-between flex-wrap p-[26px_0] [border-top:1px_solid_#DCE3EB] [border-bottom:1px_solid_#DCE3EB] max-[960px]:block max-[960px]:p-[18px] max-[960px]:rounded-[16px] max-[960px]:bg-[#F2F6FA] max-[960px]:border-0">
            <div className="flex gap-[16px] items-start">
              <Icon name="info" size={24} sw={2} stroke="#55535A" className="flex-none mt-[2px] max-[960px]:hidden" />
              <div><h2 className="m-0 text-[22px] font-[500] max-[960px]:text-[17px] max-[960px]:font-[600]"><Ph text={ssn.heading} /></h2><p className="m-[4px_0_0] text-[#55535A] max-[960px]:text-[15px]"><InlineText value={ssn.body} /></p></div>
            </div>
            <Link className="am-btn am-btn--tertiary max-[960px]:text-[15px]" href="/prestazioni-ssn/"><Ph text={ssn.ctaLabel} /></Link>
          </div>
        </div>
      </section>
      <section className="p-[88px_0] bg-[#0B3D6B] text-[#FFFFFF] max-[960px]:p-[40px_0]">
        <div className="wrap cols grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-[56px] items-center max-[960px]:gap-0">
          <div>
            <h2 className="m-0 font-[600] text-[36px] leading-[1.15] tracking-[-.02em] max-[960px]:text-[24px] max-[960px]:leading-[1.2]"><Ph text={end.heading} /></h2>
            <p className="m-[14px_0_0] text-[17px] text-[#BFD7EC] max-w-[34em] max-[960px]:m-[10px_0_0] max-[960px]:text-[15px]"><InlineText value={end.body} /></p>
          </div>
          <div className="flex justify-end max-[960px]:hidden"><Link className="am-btn am-btn--on-deep" href="/richiesta-visita-privata/"><Ph text={end.ctaLabel} /></Link></div>
        </div>
      </section>
      <CtaBar />
    </div>
  );
}
