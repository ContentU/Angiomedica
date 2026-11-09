import Link from "next/link";
import { BlogList } from "@/components/BlogList";
import { CtaBar } from "@/components/CtaBar";
import { Icon } from "@/components/Icon";
import { PostFeatured, PostMini, PostTile } from "@/components/PostCards";
import { InlineText } from "@/components/RichText";
import { block, Ph, plain } from "@/lib/content";
import { getPage, pageMetadata } from "@/lib/page";
import type { PostCard } from "@/lib/types";
import { sanityFetch } from "@/sanity/client";
import { postsQuery } from "@/sanity/queries";

export const generateMetadata = () => pageMetadata("blog");

export default async function Blog() {
  const [p, posts] = await Promise.all([getPage("blog"), sanityFetch<PostCard[]>(postsQuery)]);
  const cats = block(p.blocks, "categorie");
  const categories = [...new Set(posts.map((x) => plain(x.category)).filter(Boolean))];
  const [feat, ...rest] = posts;
  const panel = (cat: string) => {
    const list = cat === "Tutti" ? rest : posts.filter((x) => plain(x.category) === cat);
    return (
      <section className="sec-s">
        <div className="wrap">
          {cat === "Tutti" && feat && (
            <div className="cols items-stretch mb-[48px]">
              <PostFeatured p={feat} />
              <div className="flex flex-col gap-[16px] justify-between">
                <p className="lab m-0">I più letti</p>
                {rest.slice(0, 3).map((x) => <PostMini key={x._id} p={x} />)}
              </div>
            </div>
          )}
          <h2 className="h2 text-[30px] mb-[24px]"><Ph text={cats.heading} /></h2>
          <div className="g3">{list.map((x) => <PostTile key={x._id} p={x} />)}</div>
        </div>
      </section>
    );
  };
  return (
    <div className="pg-blog">
      <section className="head">
        <div className="wrap">
          <nav className="crumb desk-only" aria-label="Percorso"><Link href="/">Home</Link><span aria-hidden>›</span><span className="text-[#1A181B]" aria-current="page">Blog</span></nav>
          <Link className="mob-only text-[14px] text-[#55535A] no-underline" href="/"><span className="inline-flex items-center gap-[6px] min-h-[44px]"><Icon name="back" size={16} />Home</span></Link>
          <div className="cols head-in">
            <h1 className="h1">{p.title}</h1>
            <div><p className="lead"><InlineText value={p.lead} /></p></div>
          </div>
        </div>
        <span className="am-trace" aria-hidden><i className="rounded-[0]" /><i className="rounded-[0]" /></span>
      </section>
      <BlogList categories={categories} note={<Ph text={cats.label} />} panels={Object.fromEntries(["Tutti", ...categories].map((c) => [c, panel(c)]))} />
      <CtaBar />
    </div>
  );
}
