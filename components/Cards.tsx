import Link from "next/link";
import { Icon } from "./Icon";
import { Ph, postHref, proHref } from "@/lib/content";
import type { PostCard, ProCard } from "@/lib/types";

const TAG = { cardio: "am-tag-cardio", angio: "am-tag-angio", altro: "am-tag-cardio" };

/** articolo in riga (am-post--row) con varianti mobile */
export function PostRow({ p, className = "" }: { p: PostCard; className?: string }) {
  return (
    <Link className={`am-post am-post--row shadow-[inset_0_0_0_1.5px_#DCE3EB] max-[960px]:p-[10px] max-[960px]:gap-[14px] ${className}`} href={postHref(p.slug)}>
      <div className="am-photo w-[150px] flex-none text-[10px] max-[960px]:w-[88px] max-[960px]:h-[88px] max-[960px]:text-[9px] max-[960px]:p-[4px]">Immagine</div>
      <div className="p-[8px_4px] max-[960px]:p-0">
        <p className="am-post__meta max-[960px]:text-[13px]"><span className={TAG[p.color ?? "cardio"]}><Ph text={p.category} /></span> · <Ph text={p.dateLabel} /></p>
        <h3 className="am-post__title text-[19px] max-[960px]:text-[16px]">{p.title}</h3>
      </div>
    </Link>
  );
}

/** professionista in griglia (am-pro verticale) */
export function ProCardV({ p, photoH = "h-[320px]", className = "", role }: { p: ProCard; photoH?: string; className?: string; role?: string }) {
  return (
    <Link className={`am-pro ${className}`} href={proHref(p.slug)}>
      <div className={`am-photo ${photoH}`}>Ritratto professionista</div>
      <div className="am-pro__row">
        <span><span className="am-pro__name"><Ph text={p.name} /></span><span className="am-pro__role"><Ph text={role ?? p.role} /></span></span>
        <span className="am-go max-[960px]:hidden"><Icon name="arrow" size={18} /></span>
      </div>
    </Link>
  );
}
