import { Ph } from "@/lib/content";

/** Barra CTA fissa in basso, solo su mobile (come mobile/*.html) */
export function CtaBar({ label = "Prenota una visita privata", href = "/richiesta-visita-privata/" }: { label?: string; href?: string }) {
  return (
    <div className="am-ctabar fixed bottom-[0] left-[0] right-[0] z-[10] min-[961px]:hidden">
      <span className="am-trace" aria-hidden><i /><i /></span>
      <a className="am-btn am-btn--primary am-btn--block min-h-[56px]" href={href}><Ph text={label} /></a>
    </div>
  );
}
