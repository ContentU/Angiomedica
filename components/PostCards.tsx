import Link from "next/link";
import { InlineText } from "./RichText";
import { Ph, postHref } from "@/lib/content";
import type { PostCard } from "@/lib/types";

export const tag = (p: PostCard) => (p.color === "angio" ? "am-tag-angio" : "am-tag-cardio");

/** card articolo verticale (blog, articolo, professionista) */
export function PostTile({ p }: { p: PostCard }) {
  return (
    <Link className="am-post shadow-[inset_0_0_0_1.5px_#DCE3EB]" href={postHref(p.slug)}>
      <div className="am-photo [aspect-ratio:4_/_3] h-auto">Immagine</div>
      <div className="p-[16px_8px_8px]"><p className="am-post__meta"><span className={tag(p)}><Ph text={p.category} /></span> · <Ph text={p.dateLabel} /></p><h3 className="am-post__title text-[19px]">{p.title}</h3></div>
    </Link>
  );
}

export function PostFeatured({ p }: { p: PostCard }) {
  return (
    <Link className="am-post shadow-[inset_0_0_0_1.5px_#DCE3EB]" href={postHref(p.slug)}>
      <div className="am-photo [aspect-ratio:16_/_9] h-auto">Immagine</div>
      <div className="p-[20px_12px_12px]">
        <p className="am-post__meta"><span className={tag(p)}><Ph text={p.category} /></span> · <Ph text={p.dateLabel} /></p>
        <h3 className="am-post__title text-[28px] tracking-[-.01em]">{p.title}</h3>
        <p className="muted m-[12px_0_0] text-[16px] leading-[1.6]"><InlineText value={p.excerpt} /></p>
      </div>
    </Link>
  );
}

export function PostMini({ p }: { p: PostCard }) {
  return (
    <Link className="am-post am-post--row shadow-[inset_0_0_0_1.5px_#DCE3EB] flex-row" href={postHref(p.slug)}>
      <div className="am-photo w-[112px] h-[96px] flex-none text-[9px]">Img</div>
      <div className="p-[6px_4px]"><p className="am-post__meta text-[13px]"><span className={tag(p)}><Ph text={p.category} /></span></p><h3 className="am-post__title text-[16px] mt-[4px]">{p.title}</h3></div>
    </Link>
  );
}
