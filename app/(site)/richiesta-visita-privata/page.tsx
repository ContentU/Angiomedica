import { Icon } from "@/components/Icon";
import { InlineText, RichText } from "@/components/RichText";
import { RequestPageForm } from "@/components/RequestPageForm";
import { block, Ph, plain, serviceHref } from "@/lib/content";
import { getPage, pageMetadata } from "@/lib/page";
import type { ProCard, ServiceCard } from "@/lib/types";
import { sanityFetch } from "@/sanity/client";
import { prosQuery, servicesQuery } from "@/sanity/queries";

export const generateMetadata = () => pageMetadata("richiesta-visita-privata");

export default async function Richiesta({ searchParams }: { searchParams: Promise<{ prestazione?: string }> }) {
  const [p, services, pros, sp] = await Promise.all([getPage("richiesta-visita-privata"), sanityFetch<ServiceCard[]>(servicesQuery), sanityFetch<ProCard[]>(prosQuery), searchParams]);
  const b = (k: string) => block(p.blocks, k);
  const come = b("come-funziona"), ssn = b("ssn"), talk = b("parlarne"), done = b("conferma");
  const initial = services.find((x) => x.slug === sp.prestazione);
  return (
    <div className="pg-richiesta-visita-privata">
      <section className="relative overflow-hidden p-[72px_0_120px] text-[#FFFFFF] max-[960px]:p-[40px_0_56px]">
        <div className="wrap cols grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-[72px] items-start max-[960px]:gap-[32px]">
          {/* su mobile il modulo sta subito dopo il titolo (mobile/richiesta-visita-privata.html) */}
          <div className="max-[960px]:contents">
            <div className="max-[960px]:order-1">
              <span className="am-trace w-[120px] mb-[28px]" aria-hidden><i /><i className="bg-[#FFFFFF]" /></span>
              <h1 className="m-0 font-[800] text-[52px] leading-[1.06] tracking-[-.03em] [text-wrap:balance] max-[960px]:text-[36px]">{p.title}</h1>
              <p className="m-[20px_0_0] text-[19px] leading-[1.6] text-[#BFD7EC] max-[960px]:text-[17px]"><InlineText value={p.lead} /></p>
            </div>
            <div className="max-[960px]:order-3">
            <h2 className="m-[48px_0_20px] font-[600] text-[20px] max-[960px]:m-[32px_0_16px]"><Ph text={come.heading} /></h2>
            <div className="flex flex-col gap-[20px]">
              {come.items?.map((i, n) => (
                <div key={i._key} className="step"><b>{n + 1}</b><div><strong className="font-[600]"><Ph text={i.title} /></strong><p className="m-[2px_0_0] text-[#BFD7EC] text-[16px]"><InlineText value={i.text} /></p></div></div>
              ))}
            </div>
            <div className="am-ssn am-ssn--on-deep mt-[40px]">
              <Icon name="info" size={24} sw={2} stroke="#BFD7EC" className="flex-none mt-[2px]" />
              <div><strong className="font-[600]"><Ph text={ssn.heading} /></strong><p className="m-[4px_0_0] text-[15px]"><InlineText value={ssn.body} /></p></div>
            </div>
            <p className="m-[32px_0_6px] font-[600]"><Ph text={talk.heading} /></p>
            <div className="talk text-[#BFD7EC] text-[16px] leading-[1.8]"><RichText value={talk.body} /></div>
            </div>
          </div>
          <div className="max-[960px]:order-2">
          <RequestPageForm
            services={services.map((x) => ({ name: x.shortTitle || x.title, href: serviceHref(x) }))}
            doctors={pros.map((x) => `${plain(x.name)}, ${plain(x.role)}`)}
            initial={initial ? initial.shortTitle || initial.title : undefined}
            done={{ heading: <Ph text={done.heading} />, body: <RichText value={done.body} /> }}
          />
          </div>
        </div>
      </section>
    </div>
  );
}
