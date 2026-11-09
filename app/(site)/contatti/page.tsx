import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { InlineText } from "@/components/RichText";
import { block, Ph, plain } from "@/lib/content";
import { getPage, pageMetadata } from "@/lib/page";
import type { ServiceCard } from "@/lib/types";
import { sanityFetch } from "@/sanity/client";
import { servicesQuery } from "@/sanity/queries";

export const generateMetadata = () => pageMetadata("contatti");
const SIZE = ["text-[26px]", "text-[22px]", "text-[26px]"];

export default async function Contatti() {
  const [p, services] = await Promise.all([getPage("contatti"), sanityFetch<ServiceCard[]>(servicesQuery)]);
  const b = (k: string) => block(p.blocks, k);
  const rec = b("recapiti"), mod = b("modulo"), dove = b("dove");
  const n = dove.items?.length ?? 0;
  return (
    <div className="pg-contatti">
      <section className="head">
        <div className="wrap">
          <nav className="crumb desk-only" aria-label="Percorso"><Link href="/">Home</Link><span aria-hidden>›</span><span className="text-[#1A181B]" aria-current="page">Contatti</span></nav>
          <Link className="mob-only text-[14px] text-[#55535A] no-underline" href="/"><span className="inline-flex items-center gap-[6px] min-h-[44px]"><Icon name="back" size={16} />Home</span></Link>
          <div className="cols head-in"><h1 className="h1">{p.title}</h1><p className="lead"><InlineText value={p.lead} /></p></div>
        </div>
        <span className="am-trace" aria-hidden><i className="rounded-[0]" /><i className="rounded-[0]" /></span>
      </section>
      <section className="sec-s">
        <div className="wrap g3">
          {rec.items?.map((i, k) => (
            <a key={i._key} className="ccard" href={i.href || "#"}><small><Ph text={i.label} /></small><strong className={SIZE[k] ?? "text-[22px]"}><Ph text={i.title} /></strong><span className="muted text-[15px]"><InlineText value={i.text} /></span></a>
          ))}
        </div>
      </section>
      <section className="sec pt-[24px]">
        <div className="wrap cols-r grid-cols-[minmax(0,6fr)_minmax(0,6fr)] max-[960px]:grid-cols-[minmax(0,1fr)]">
          <ContactForm heading={<Ph text={mod.heading} />} intro={<InlineText value={mod.body} />} services={services.map((x) => x.shortTitle || x.title)} submitLabel={plain(mod.ctaLabel) || "Invia la richiesta"} ssnNote={<Ph text={mod.label} />} />
          <div>
            <div className="am-photo [aspect-ratio:4_/_3] h-auto rounded-[24px]"><Ph text={p.photoCaption} /></div>
            <dl className="dl m-[24px_0_0]">
              {dove.items?.map((i, k) => (
                <div key={i._key} className={k === n - 1 ? "[border-bottom:1px_solid_#DCE3EB]" : undefined}><dt><Ph text={i.label} /></dt><dd><Ph text={i.title} /></dd></div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
