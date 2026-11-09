import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CtaBar } from "@/components/CtaBar";
import { ProseSections, tocOf } from "@/components/Detail";
import { Icon } from "@/components/Icon";
import { PostTile } from "@/components/PostCards";
import { InlineText } from "@/components/RichText";
import { Ph, proHref, serviceHref } from "@/lib/content";
import type { PostCard, Section, ServiceCard } from "@/lib/types";
import { sanityFetch } from "@/sanity/client";
import { postQuery, slugsQuery } from "@/sanity/queries";

type Post = PostCard & { sections?: Section[]; relatedServices?: ServiceCard[]; reviewer?: string; author?: { name: string; role?: string; slug?: string }; others: PostCard[]; seoTitle?: string; seoDescription?: string };
type Props = { params: Promise<{ slug: string }> };
const get = (slug: string) => sanityFetch<Post | null>(postQuery, { slug });

export async function generateStaticParams() {
  return (await sanityFetch<string[]>(slugsQuery, { type: "post" })).map((slug) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const x = await get((await params).slug);
  return x ? { title: x.seoTitle || `${x.title} | Angiomedica`, description: x.seoDescription } : {};
}

export default async function Articolo({ params }: Props) {
  const x = await get((await params).slug);
  if (!x) notFound();
  const toc = tocOf(x.sections);
  const services = (x.relatedServices ?? []).filter(Boolean);
  const byline = (
    <>
      <span className="am-photo w-[44px] h-[44px] rounded-[50%] p-0 text-[0]" />
      <span><span className="block font-[600] text-[15px]"><Ph text={x.author?.name || x.authorLabel} /></span><span className="muted">Revisione clinica · <Ph text={x.category} /></span></span>
    </>
  );
  return (
    <div className="pg-articolo">
      <section className="head bg-[#FFFFFF]">
        <div className="wrap">
          <nav className="crumb desk-only" aria-label="Percorso"><Link href="/">Home</Link><span aria-hidden>›</span><Link href="/blog/">Blog</Link><span aria-hidden>›</span><span className="text-[#1A181B]" aria-current="page">{x.title}</span></nav>
          <Link className="mob-only text-[14px] text-[#55535A] no-underline" href="/blog/"><span className="inline-flex items-center gap-[6px] min-h-[44px]"><Icon name="back" size={16} />Blog</span></Link>
          <div className="max-w-[900px] p-[40px_0_40px]">
            <Link className="lab no-underline text-[#0070B8]" href="/blog/"><Ph text={x.category} /></Link>
            <h1 className="h1 mt-[14px] text-[56px]">{x.title}</h1>
            <p className="lead mt-[18px]"><InlineText value={x.excerpt} /></p>
            <div className="muted flex gap-[14px] items-center flex-wrap mt-[28px] text-[14px]">
              {x.author?.slug
                ? <Link className="inline-flex items-center gap-[12px] no-underline text-[#1A181B]" href={proHref(x.author.slug)}>{byline}</Link>
                : <span className="inline-flex items-center gap-[12px] text-[#1A181B]">{byline}</span>}{" "}
              <span className="desk-only" aria-hidden>·</span><span>Pubblicato il <Ph text={x.dateLabel} /></span><span aria-hidden>·</span><span><Ph text={x.readingTime} /></span>
            </div>
          </div>
        </div>
      </section>
      <div className="wrap"><div className="am-photo [aspect-ratio:21_/_9] h-auto rounded-[28px]">Immagine dell&apos;articolo</div></div>
      <section className="sec">
        <div className="wrap grid grid-cols-[minmax(0,3fr)_minmax(0,8fr)_minmax(0,1fr)] gap-[56px] items-start" id="art-grid">
          <nav className="toc sticky top-[112px]" aria-label="In questo articolo">
            <p className="m-[0_0_8px] font-[600] text-[15px] text-[#55535A]">In questo articolo</p>
            {toc.map((e, i) => <a key={e.anchor} className={i === toc.length - 1 ? "[border-bottom:1px_solid_#DCE3EB]" : undefined} href={`#${e.anchor}`}><Ph text={e.label} /></a>)}
          </nav>
          <article className="prose">
            <ProseSections sections={x.sections} dot={x.color ?? "cardio"} />
            {services.map((v) => (
              <Link key={v._id} className="am-tile min-h-[96px] m-[24px_0_0] max-w-[40em]" href={serviceHref(v)}><span className="am-tile__name text-[20px] flex-col items-start gap-[4px]"><small className="lab text-[13px]">Scheda della prestazione</small>{v.title}: come si svolge e come richiederlo</span><Icon name="diag" size={24} sw={1.6} className="am-tile__arrow" /></Link>
            ))}
            <div className="am-ssn bg-[#F2F6FA] mt-[28px] max-w-[40em]"><Icon name="info" size={24} sw={2} stroke="#55535A" className="flex-none mt-[2px]" /><p className="m-0 text-[15px] text-[#55535A]">Le informazioni di questo articolo non sostituiscono il parere del medico. Revisione clinica: <Ph text={x.reviewer} />.</p></div>
          </article>
          <span className="desk-only" />
        </div>
      </section>
      {x.others.length > 0 && (
        <section className="sec soft">
          <div className="wrap">
            <h2 className="h2 text-[30px] mb-[24px]">Potrebbe interessarti</h2>
            <div className="g3">{x.others.map((p) => <PostTile key={p._id} p={p} />)}</div>
          </div>
        </section>
      )}
      <CtaBar />
    </div>
  );
}
