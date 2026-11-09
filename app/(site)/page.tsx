import Link from "next/link";
import type { Metadata } from "next";
import { HomeRequestForm } from "@/components/HomeRequestForm";
import { Icon } from "@/components/Icon";
import { InlineText } from "@/components/RichText";
import { block, Ph, plain, postHref, proHref, serviceHref, specialtyHref } from "@/lib/content";
import { getSettings } from "@/lib/settings";
import type { PostCard, ProCard, Section, ServiceCard, SpecRef } from "@/lib/types";
import { sanityFetch } from "@/sanity/client";
import { homeQuery } from "@/sanity/queries";

type Home = {
  home: { blocks?: Section[]; featuredServices?: ServiceCard[]; pickerServices?: ServiceCard[]; seoTitle?: string; seoDescription?: string } | null;
  specialties: SpecRef[]; services: ServiceCard[]; pros: ProCard[]; posts: PostCard[];
};
const getHome = () => sanityFetch<Home>(homeQuery);

export async function generateMetadata(): Promise<Metadata> {
  const { home } = await getHome();
  return { title: home?.seoTitle || "Centro di cardiologia e angiologia a Palermo — Angiomedica", description: home?.seoDescription };
}

const DOT = { cardio: "#0187DC", angio: "#CF000A", altro: "#8A97A5" };
const TAG = { cardio: "#0070B8", angio: "#A8000A", altro: "#55535A" };

// Card «parola» delle specialità: taglie e colori come in index.html (desktop) e mobile/index.html
const WORD = [
  { cls: "wc wc-azure col-[span_7] min-h-[420px] p-[40px] bg-[#035BDB] text-[#FFFFFF] max-[960px]:p-[24px] wc-m-big", size: "text-[104px]", dot: "#BFD7EC" },
  { cls: "wc col-[span_5] min-h-[420px] p-[40px] bg-[#F2F6FA] text-[#1A181B] max-[960px]:p-[24px] wc-m-big wc-m-200", size: "text-[80px]", dot: "#CF000A" },
];
const WORD_SMALL = { cls: "wc col-[span_4] min-h-[200px] p-[28px_30px] shadow-[inset_0_0_0_1.5px_#DCE3EB] text-[#1A181B] max-[960px]:p-[20px_20px_22px] wc-m-small", size: "text-[40px]", dot: "#CF000A" };

export default async function HomePage() {
  const [{ home, specialties, services, pros, posts }, s] = await Promise.all([getHome(), getSettings()]);
  const b = (k: string) => block(home?.blocks, k);
  const hero = b("hero"), info = b("info"), spec = b("specialita"), centro = b("centro"), prest = b("prestazioni");
  const team = b("professionisti"), dom = b("domicilio"), ssn = b("ssn"), req = b("richiesta"), sede = b("contatti"), blog = b("blog");
  const picker = (home?.pickerServices ?? []).filter(Boolean);
  const pickerIds = new Set(picker.map((x) => x._id));
  const [feat, ...side] = posts;

  return (
    <div className="pg-index">
      {/* HERO A — IL TRACCIATO */}
      <section id="top" className="relative overflow-hidden bg-[#FFFFFF] p-[88px_0_0] max-[960px]:pt-[40px]">
        <div className="wrap hero-grid grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-[64px] items-end max-[960px]:gap-[0]">
          <div className="hero-copy pb-[112px] max-[960px]:pb-[0]">
            <h1 className="h1"><Ph text={hero.heading} /></h1>
            <p className="lead mt-[28px] max-[960px]:mt-[18px] max-[960px]:text-[17px]"><InlineText value={hero.body} /></p>
            <div className="mt-[44px] max-[960px]:mt-[28px]">
              <div className="flex justify-end mr-[-20px] mb-[16px] min-[961px]:hidden">
                <span className="trace hero-trace-m w-[74%]" aria-hidden><i /><i /></span>
              </div>
              <div className="relative inline-flex max-[960px]:flex">
                <a className="btn btn-primary min-h-[60px] p-[0_32px] text-[18px] max-[960px]:w-full max-[960px]:min-h-[56px] max-[960px]:text-[17px]" href="#richiesta">
                  <Ph text={hero.ctaLabel} /> <Icon name="arrow" size={20} />
                </a>
                <span className="trace hero-trace max-[960px]:hidden" aria-hidden><i /><i /></span>
              </div>
              <div className="mt-[22px] max-[960px]:mt-[16px] max-[960px]:text-center">
                <Link className="link max-[960px]:text-[16px]" href="/prestazioni/"><Ph text={hero.label} /> <Icon name="arrow" size={18} className="max-[960px]:hidden" /></Link>
              </div>
            </div>
          </div>
          <div className="relative z-[2] self-stretch flex pb-[0] max-[960px]:mt-[32px]">
            <div className="photo hero-photo w-full min-h-[600px] rounded-[32px_32px_0_0] max-[960px]:min-h-[260px] max-[960px]:h-[260px] max-[960px]:rounded-[24px_24px_0_0]"><Ph text={hero.photoCaption} /></div>
          </div>
        </div>
        {/* informazioni rapide, ancorate al fondo della hero */}
        <div className="relative z-[3] bg-[#F2F6FA] [border-top:1px_solid_#E6EBF0] max-[960px]:[border-top:0]">
          <div className="wrap quick grid grid-cols-[repeat(3,minmax(0,1fr))] gap-[0] max-[960px]:p-0">
            <Link href="/contatti/" className="flex gap-[16px] items-center p-[26px_24px_26px_0] no-underline text-[#1A181B] max-[960px]:gap-[14px] max-[960px]:p-[16px_20px] max-[960px]:[border-bottom:1px_solid_#DCE3EB]">
              <Icon name="pin" size={24} sw={2} stroke="#0070B8" className="flex-none" />
              <span><span className="block text-[14px] text-[#55535A] max-[960px]:hidden"><Ph text={info.items?.[0]?.label} /></span><span className="font-[500]"><Ph text={s.address} /></span></span>
            </Link>
            <div className="flex gap-[16px] items-center p-[26px_24px] [border-left:1px_solid_#DCE3EB] max-[960px]:gap-[14px] max-[960px]:p-[16px_20px] max-[960px]:[border-left:0] max-[960px]:[border-bottom:1px_solid_#DCE3EB]">
              <Icon name="clock" size={24} sw={2} stroke="#0070B8" className="flex-none" />
              <span><span className="block text-[14px] text-[#55535A] max-[960px]:hidden"><Ph text={info.items?.[1]?.label} /></span><span className="font-[500]"><Ph text={s.hours} /></span></span>
            </div>
            <a href={s.phoneHref} className="flex gap-[16px] items-center p-[26px_24px] [border-left:1px_solid_#DCE3EB] no-underline text-[#1A181B] max-[960px]:gap-[14px] max-[960px]:p-[16px_20px] max-[960px]:[border-left:0]">
              <Icon name="phone" size={24} sw={2} stroke="#0070B8" className="flex-none" />
              <span><span className="block text-[14px] text-[#55535A] max-[960px]:hidden"><Ph text={info.items?.[2]?.label} /></span><span className="font-[500]"><Ph text={s.phone} /> · <span className="text-[#0070B8] [text-decoration:underline] [text-underline-offset:4px]"><Ph text={info.ctaLabel} /></span></span></span>
            </a>
          </div>
        </div>
      </section>

      {/* SPECIALITÀ — PAROLE */}
      <section id="specialita" className="p-[128px_0_120px] max-[960px]:p-[64px_0]">
        <div className="wrap">
          <div className="head-row grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[64px] items-end mb-[56px] max-[960px]:gap-[12px] max-[960px]:mb-[28px]">
            <h2 className="h2"><Ph text={spec.heading} /></h2>
            <div><p className="lead max-[960px]:text-[17px]"><InlineText value={spec.body} /></p></div>
          </div>
          <div className="wgrid grid grid-cols-[repeat(12,minmax(0,1fr))] gap-[20px] max-[960px]:gap-[12px]">
            {specialties.map((x, i) => {
              const w = WORD[i] ?? WORD_SMALL;
              const big = i < 2;
              return (
                <Link key={x.slug} href={specialtyHref(x.slug)} className={w.cls}>
                  <div className={`flex justify-between items-start ${big ? "gap-[24px] max-[960px]:gap-[12px]" : "gap-[16px] max-[960px]:gap-[12px]"}`}>
                    {big ? (
                      <p className={`m-0 text-[18px] leading-[1.55] font-[500] max-[960px]:text-[15px] max-[960px]:leading-[1.5] ${i === 0 ? "max-w-[22em]" : "text-[#3F4A55]"}`}><Ph text={x.homeText} /></p>
                    ) : (
                      <p className="m-0 text-[15px] text-[#55535A] max-[960px]:text-[14px]"><Ph text={x.homeText} /></p>
                    )}
                    <span className={big ? "wc-go bg-[#FFFFFF] " + (i === 0 ? "text-[#0B3D6B]" : "text-[#0070B8] shadow-[inset_0_0_0_2px_#4F8CC4]") + " max-[960px]:w-[44px] max-[960px]:h-[44px]" : "wc-go w-[44px] h-[44px] text-[#0070B8] shadow-[inset_0_0_0_2px_#4F8CC4]"}>
                      <Icon name="arrow" size={big ? 22 : 18} />
                    </span>
                  </div>
                  <h3 className={`wc-word ${w.size}`}>{x.name.toLowerCase()}<span style={{ color: w.dot }}>.</span></h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* IL CENTRO — FOTO AL VIVO */}
      <section id="centro" className="p-[0_0_120px] max-[960px]:pb-[64px]">
        <div className="photo h-[620px] max-[960px]:h-[300px]"><Ph text={centro.photoCaption} /></div>
        <div className="wrap max-[960px]:p-0">
          <div className="relative z-[2] mt-[-200px] bg-[#FFFFFF] rounded-[28px_28px_28px_0] p-[56px_56px_48px] max-w-[700px] max-[960px]:m-[-64px_20px_0_0] max-[960px]:rounded-[0_24px_0_0] max-[960px]:p-[32px_20px_0]">
            <span className="trace w-[120px] mb-[28px] max-[960px]:w-[88px] max-[960px]:mb-[20px]" aria-hidden><i /><i /></span>
            <h2 className="h2"><Ph text={centro.heading} /></h2>
            <p className="lead mt-[20px] max-[960px]:mt-[14px] max-[960px]:text-[17px]"><InlineText value={centro.body} /></p>
            <div className="mt-[32px] max-[960px]:mt-[20px]"><Link className="link" href="/il-centro/"><Ph text={centro.ctaLabel} /> <Icon name="arrow" size={18} className="max-[960px]:hidden" /></Link></div>
          </div>
        </div>
      </section>

      {/* VISITE ED ESAMI — GRIGLIA */}
      <section id="prestazioni" className="p-[8px_0_120px] max-[960px]:pb-[64px]">
        <div className="wrap">
          <div className="head-row grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[64px] items-end mb-[40px] max-[960px]:gap-[10px] max-[960px]:mb-[24px]">
            <h2 className="h2 text-[40px] max-[960px]:text-[30px]"><Ph text={prest.heading} /></h2>
            <p className="lead text-[17px]"><InlineText value={prest.body} /></p>
          </div>
          <div className="g2x grid grid-cols-[repeat(2,minmax(0,1fr))] gap-[16px] max-[960px]:gap-[10px]">
            {(home?.featuredServices ?? []).filter(Boolean).map((x) => (
              <Link key={x._id} className="gt" href={serviceHref(x)}>
                <span className="gn"><i style={{ background: DOT[x.specialty?.color ?? "cardio"] }} />{x.shortTitle || x.title}</span>
                <Icon name="diag" size={32} sw={1.6} className="ga" />
              </Link>
            ))}
            <Link className="gt gall" href="/prestazioni/"><span className="gn font-[600]"><Ph text={prest.ctaLabel} /></span><Icon name="diag" size={32} sw={1.8} className="ga" /></Link>
          </div>
          <div className="flex gap-[28px] flex-wrap mt-[24px] text-[14px] text-[#55535A] max-[960px]:hidden">
            <span className="inline-flex items-center gap-[8px]"><i className="w-[10px] h-[10px] rounded-[50%] bg-[#0187DC] inline-block" />Cardiologia</span>
            <span className="inline-flex items-center gap-[8px]"><i className="w-[10px] h-[10px] rounded-[50%] bg-[#CF000A] inline-block" />Angiologia</span>
          </div>
        </div>
      </section>

      {/* PROFESSIONISTI — GRIGLIA PIANA */}
      <section id="professionisti" className="bg-[#F2F6FA] p-[128px_0_120px] max-[960px]:p-[64px_0]">
        <div className="wrap">
          <div className="flex justify-between items-end gap-[32px] flex-wrap mb-[56px] max-[960px]:mb-[0]">
            <div className="max-w-[640px]">
              <h2 className="h2"><Ph text={team.heading} /></h2>
              <p className="lead mt-[18px] max-[960px]:mt-[12px] max-[960px]:text-[17px]"><InlineText value={team.body} /></p>
            </div>
            <Link className="btn btn-ghost max-[960px]:hidden" href="/professionisti/"><Ph text={team.ctaLabel} /> <Icon name="arrow" size={20} /></Link>
          </div>
          <div className="g3x grid grid-cols-[repeat(3,minmax(0,1fr))] gap-[24px] pros-m max-[960px]:flex">
            {pros.map((p) => (
              <Link key={p._id} className="sc bg-[#FFFFFF] p-[12px_12px_24px] gap-[18px] max-[960px]:bg-transparent max-[960px]:p-0 max-[960px]:gap-[12px] max-[960px]:rounded-none" href={proHref(p.slug)}>
                <div className="photo h-[360px] rounded-[16px] max-[960px]:h-[260px] max-[960px]:rounded-[18px]">Ritratto professionista</div>
                <div className="p-[0_12px] flex justify-between items-center gap-[12px] max-[960px]:p-0">
                  <span>
                    <span className="sc-name block font-[500] text-[20px] max-[960px]:text-[17px]"><Ph text={p.name} /></span>
                    <span className="text-[#55535A] text-[15px] max-[960px]:text-[14px]"><Ph text={p.role} /></span>
                  </span>
                  <span className="spec-go w-[44px] h-[44px] flex-none max-[960px]:hidden"><Icon name="arrow" size={18} /></span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-[20px] min-[961px]:hidden"><Link className="link text-[16px]" href="/professionisti/"><Ph text={team.ctaLabel} /></Link></div>
        </div>
      </section>

      {/* DOMICILIO */}
      <section id="paziente" className="p-[120px_0_0] max-[960px]:pt-[48px]">
        <div className="wrap">
          <div className="split grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[56px] items-center bg-[#E8F2FB] rounded-[32px] p-[64px] max-[960px]:gap-[0] max-[960px]:rounded-[24px] max-[960px]:p-[28px_24px]">
            <div className="flex gap-[28px] items-start max-[960px]:flex-col max-[960px]:gap-[16px]">
              <Icon name="home" size={64} sw={1.4} stroke="#0070B8" className="flex-none max-[960px]:w-[48px] max-[960px]:h-[48px]" />
              <h2 className="h2 text-[38px] max-[960px]:text-[26px]"><Ph text={dom.heading} /></h2>
            </div>
            <div>
              <p className="m-0 text-[18px] text-[#3F4A55] max-[960px]:mt-[10px] max-[960px]:text-[15px]"><InlineText value={dom.body} /></p>
              <Link className="btn btn-primary mt-[28px] max-[960px]:mt-[20px] max-[960px]:w-full" href="/visite-a-domicilio/"><Ph text={dom.ctaLabel} /> <Icon name="arrow" size={20} className="max-[960px]:hidden" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* S.S.N. */}
      <section aria-labelledby="ssn-title" className="p-[56px_0_120px] max-[960px]:p-[32px_0_48px]">
        <div className="wrap">
          <div className="flex gap-[28px] items-center justify-between flex-wrap [border-top:1px_solid_#DCE3EB] [border-bottom:1px_solid_#DCE3EB] p-[32px_0] max-[960px]:p-[22px_0] max-[960px]:gap-[12px]">
            <div className="flex gap-[20px] items-start max-w-[780px]">
              <Icon name="info" size={28} sw={2} stroke="#55535A" className="flex-none mt-[3px] max-[960px]:hidden" />
              <div>
                <h2 id="ssn-title" className="m-0 font-[600] text-[24px] max-[960px]:text-[20px]"><Ph text={ssn.heading} /></h2>
                <p className="m-[6px_0_0] text-[#55535A] text-[16px] max-[960px]:text-[15px]"><InlineText value={ssn.body} /></p>
              </div>
            </div>
            <Link className="link max-[960px]:text-[15px]" href="/prestazioni-ssn/"><Ph text={ssn.ctaLabel} /> <Icon name="arrow" size={18} className="max-[960px]:hidden" /></Link>
          </div>
        </div>
      </section>

      {/* RICHIESTA PRIVATA — DESTINAZIONE DEL TRACCIATO */}
      <section id="richiesta" className="relative overflow-hidden bg-[#0B3D6B] text-[#FFFFFF] p-[120px_0] max-[960px]:p-[56px_0]">
        <span className="trace w-[72%] mb-[28px] min-[961px]:hidden" aria-hidden><i /><i /></span>
        <div className="wrap split grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[72px] items-start max-[960px]:gap-[24px]">
          <div className="pt-[72px] max-[960px]:pt-[0]">
            <h2 className="h2 text-[#FFFFFF]"><Ph text={req.heading} /></h2>
            <p className="m-[20px_0_0] text-[19px] text-[#BFD7EC] max-[960px]:mt-[12px] max-[960px]:text-[17px]"><InlineText value={req.body} /></p>
            <div className="mt-[36px] rounded-[18px] p-[22px_24px] bg-[rgba(255,255,255,.07)] shadow-[inset_0_0_0_1px_rgba(191,215,236,.25)] max-[960px]:mt-[20px] max-[960px]:rounded-[14px] max-[960px]:p-[16px_18px]">
              <p className="m-0 font-[600] text-[16px] max-[960px]:text-[15px]"><Ph text={req.items?.[0]?.title} /></p>
              <p className="m-[4px_0_0] text-[15px] text-[#BFD7EC] max-[960px]:text-[14px]"><InlineText value={req.items?.[0]?.text} /></p>
            </div>
            <div className="max-[960px]:hidden">
              <p className="m-[36px_0_8px] font-[600] text-[16px]"><Ph text={req.items?.[1]?.title} /></p>
              <div className="flex gap-[28px] flex-wrap">
                <a href={s.phoneHref} className="text-[#FFFFFF] font-[600] [text-decoration:underline] [text-underline-offset:6px]">Chiama <Ph text={s.phone} /></a>
                <a href={s.whatsappHref} className="text-[#FFFFFF] font-[600] [text-decoration:underline] [text-underline-offset:6px]"><Ph text={req.items?.[1]?.label} /></a>
              </div>
            </div>
          </div>
          <div className="relative">
            <span className="trace form-trace max-[960px]:hidden" aria-hidden><i /><i /></span>
            <HomeRequestForm
              options={picker.map((x) => ({ name: x.shortTitle || x.title, group: x.specialty?.name ?? "", color: x.specialty?.color ?? "cardio" }))}
              others={services.filter((x) => !pickerIds.has(x._id)).map((x) => x.shortTitle || x.title)}
              submitLabel={plain(req.ctaLabel) || undefined}
            />
          </div>
          <div className="min-[961px]:hidden">
            <p className="m-[0_0_4px] font-[600] text-[15px]"><Ph text={req.items?.[1]?.title} /></p>
            <div className="flex gap-[20px] flex-wrap">
              <a href={s.phoneHref} className="text-[#FFFFFF] font-[600] [text-decoration:underline] [text-underline-offset:5px]">Chiama</a>
              <a href={s.whatsappHref} className="text-[#FFFFFF] font-[600] [text-decoration:underline] [text-underline-offset:5px]"><Ph text={req.items?.[1]?.label} /></a>
            </div>
          </div>
        </div>
      </section>

      {/* SEDE */}
      <section id="contatti" className="p-[120px_0] max-[960px]:p-[64px_0_48px]">
        <div className="wrap split grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-[72px] items-center max-[960px]:gap-[24px]">
          <div>
            <h2 className="h2"><Ph text={sede.heading} /></h2>
            <p className="m-[18px_0_0] leading-[1.8] min-[961px]:hidden"><Ph text={s.address} /><br /><Ph text={s.hours} /><br /><Ph text={s.phone} /></p>
            <dl className="grid grid-cols-[auto_1fr] gap-[14px_28px] m-[36px_0_0] text-[17px] max-[960px]:hidden">
              <dt className="font-[600]">Indirizzo</dt><dd className="m-0"><Ph text={s.address} /></dd>
              <dt className="font-[600]">Orari</dt><dd className="m-0"><Ph text={s.hours} /></dd>
              <dt className="font-[600]">Segreteria</dt><dd className="m-0"><Ph text={s.phone} /></dd>
            </dl>
            <div className="flex gap-[28px] flex-wrap mt-[36px] max-[960px]:gap-[20px] max-[960px]:mt-[16px]">
              <Link className="link max-[960px]:text-[15px]" href="/contatti/"><Ph text={sede.ctaLabel} /> <Icon name="arrow" size={18} className="max-[960px]:hidden" /></Link>
              <Link className="link max-[960px]:text-[15px]" href="/contatti/"><Ph text={sede.label} /> <Icon name="arrow" size={18} className="max-[960px]:hidden" /></Link>
            </div>
          </div>
          <div className="photo h-[440px] rounded-[28px] max-[960px]:h-[200px] max-[960px]:rounded-[20px]"><Ph text={sede.photoCaption} /></div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" className="p-[120px_0_128px] bg-[#F2F6FA] max-[960px]:p-[64px_0]">
        <div className="wrap">
          <div className="flex justify-between items-end gap-[32px] flex-wrap mb-[56px] max-[960px]:mb-[28px]">
            <div className="max-w-[640px]">
              <h2 className="h2"><Ph text={blog.heading} /></h2>
              <p className="lead mt-[18px] max-[960px]:mt-[12px] max-[960px]:text-[17px]"><InlineText value={blog.body} /></p>
            </div>
            <Link className="btn btn-ghost max-[960px]:hidden" href="/blog/"><Ph text={blog.ctaLabel} /> <Icon name="arrow" size={20} /></Link>
          </div>
          <div className="bgrid grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-[24px] max-[960px]:gap-[10px]">
            {feat && (
              <Link className="bl row-[span_2] max-[960px]:rounded-[22px] max-[960px]:p-[10px]" href={postHref(feat.slug)}>
                <div className="photo h-[340px] rounded-[18px] max-[960px]:h-[190px] max-[960px]:rounded-[16px]">Immagine articolo</div>
                <div className="p-[24px_12px_8px] max-[960px]:p-[16px_8px_10px]">
                  <p className="m-0 text-[14px] text-[#55535A] max-[960px]:text-[13px]">
                    <span className="font-[600]" style={{ color: TAG[feat.color ?? "cardio"] }}><Ph text={feat.category} /></span> · <Ph text={feat.dateLabel} />
                    {feat.readingTime && <span className="max-[960px]:hidden"> · <Ph text={feat.readingTime} /></span>}
                  </p>
                  <h3 className="bl-title m-[10px_0_0] font-[600] text-[30px] leading-[1.2] tracking-[-.01em] max-[960px]:m-[6px_0_0] max-[960px]:text-[21px] max-[960px]:leading-[1.25]">{feat.title}</h3>
                  <p className="m-[12px_0_0] text-[#55535A] text-[16px] max-[960px]:hidden"><InlineText value={feat.excerpt} /></p>
                  <p className="m-[16px_0_0] text-[14px] text-[#55535A] max-[960px]:hidden">A cura di <Ph text={feat.author?.name || feat.authorLabel} /></p>
                </div>
              </Link>
            )}
            {side.map((p) => (
              <Link key={p._id} className="bl bl-row max-[960px]:items-center max-[960px]:gap-[14px] max-[960px]:rounded-[18px] max-[960px]:p-[10px]" href={postHref(p.slug)}>
                <div className="photo w-[168px] flex-none rounded-[16px] text-[11px] p-[10px] max-[960px]:w-[96px] max-[960px]:h-[96px] max-[960px]:rounded-[12px] max-[960px]:text-[10px] max-[960px]:p-[6px]">Immagine</div>
                <div className="p-[6px_4px] max-[960px]:p-0">
                  <p className="m-0 text-[14px] text-[#55535A] max-[960px]:text-[13px]"><span className="font-[600]" style={{ color: TAG[p.color ?? "cardio"] }}><Ph text={p.category} /></span> · <Ph text={p.dateLabel} /></p>
                  <h3 className="bl-title m-[8px_0_0] font-[600] text-[20px] leading-[1.3] max-[960px]:m-[4px_0_0] max-[960px]:text-[16px]">{p.title}</h3>
                  <p className="m-[10px_0_0] text-[14px] text-[#55535A] max-[960px]:hidden">A cura di <Ph text={p.author?.name || p.authorLabel} /></p>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-[24px] min-[961px]:hidden"><Link className="link text-[16px]" href="/blog/"><Ph text={blog.ctaLabel} /></Link></div>
        </div>
      </section>
    </div>
  );
}
