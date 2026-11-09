import Link from "next/link";
import { CtaBar } from "./CtaBar";
import { Icon } from "./Icon";
import { InlineText } from "./RichText";
import { block, Ph } from "@/lib/content";
import type { PageDoc } from "@/lib/types";
import { sanityFetch } from "@/sanity/client";
import { pageQuery } from "@/sanity/queries";

/** Corpo della pagina 404 (404.html) */
export async function NotFoundBody() {
  const p = await sanityFetch<PageDoc | null>(pageQuery, { slug: "404" });
  const l = block(p?.blocks, "link");
  return (
    <div className="pg-404">
      <section className="p-[96px_0_120px] overflow-hidden">
        <div className="wrap">
          <div className="flex items-center gap-[0] mb-[48px]" aria-hidden>
            <span className="am-trace w-[38%]"><i className="rounded-[0]" /><i className="rounded-[0]" /></span>{" "}
            <span className="flex-1 [border-top:3px_dashed_#DCE3EB] m-[0_4px]" />{" "}
            <span className="am-trace w-[22%]"><i className="rounded-[0]" /><i className="rounded-[0]" /></span>
          </div>
          <p className="lab m-0"><Ph text={l.label || "Errore 404"} /></p>
          <h1 className="h1 mt-[12px]">{p?.title || "Questa pagina non c'è"}</h1>
          <p className="lead mt-[16px] max-w-[34em]"><InlineText value={p?.lead} /></p>
          <div className="g3 mt-[40px]">
            {l.items?.map((i) => (
              <Link key={i._key} className="am-tile min-h-[88px]" href={i.href || "/"}><span className="am-tile__name text-[22px]"><Ph text={i.title} /></span><Icon name="diag" size={26} sw={1.6} className="am-tile__arrow" /></Link>
            ))}
          </div>
          <Link className="am-btn am-btn--tertiary mt-[24px]" href="/"><Ph text={l.ctaLabel || "Torna alla homepage"} /></Link>
        </div>
      </section>
      <CtaBar />
    </div>
  );
}
