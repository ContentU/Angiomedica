"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ph } from "@/lib/content";
import type { Settings, SpecRef } from "@/lib/types";

export function Footer({ s, specialties }: { s: Settings; specialties: SpecRef[] }) {
  const path = usePathname();
  const cur = (href: string) => (path === href ? "page" : undefined);

  if (path === "/richiesta-visita-privata/") {
    // footer ridotto, voluto dall'handoff
    return (
      <footer className="am-footer am-footer--min">
        <div className="am-footer__in am-footer__row">
          <span className="flex items-center gap-[20px] flex-wrap">
            <img className="h-[36px] w-auto block" src="/img/logo-angiomedica.png" alt="Angiomedica" />
            <span><Ph text={s.address} /> · <Ph text={s.phone} /></span>
          </span>
          <nav aria-label="Informazioni legali" className="am-footer__links"><a href="#">Privacy policy</a><a href="#">Cookie policy</a><a href="#">Accessibilità</a></nav>
        </div>
      </footer>
    );
  }

  const paziente = [
    ["/prestazioni/", "Prestazioni"], ["/professionisti/", "Professionisti"], ["/visite-a-domicilio/", "Visite a domicilio"],
    ["/prestazioni-ssn/", "Prestazioni S.S.N."], ["/richiesta-visita-privata/", "Richiesta visita privata"],
  ];
  return (
    <footer className="am-footer">
      <div className="am-footer__in">
        <div className="am-footer__grid">
          <div>
            <img className="h-[44px] w-auto block max-[760px]:h-[34px]" src="/img/logo-angiomedica.png" alt="Angiomedica" />
            <p className="am-footer__addr"><Ph text={s.address} /><br /><Ph text={s.phone} /> · <Ph text={s.email} /><br /><Ph text={s.footerHours} /></p>
          </div>
          <nav aria-label="Specialità"><p className="am-footer__title">Specialità</p><div className="am-footer__links">
            {specialties.map((x) => <Link key={x.slug} href={`/specialita/${x.slug}/`} aria-current={cur(`/specialita/${x.slug}/`)}>{x.name}</Link>)}
          </div></nav>
          <nav aria-label="Per il paziente"><p className="am-footer__title">Per il paziente</p><div className="am-footer__links">
            {paziente.map(([h, l]) => <Link key={h} href={h} aria-current={cur(h)}>{l}</Link>)}
          </div></nav>
          <nav aria-label="Informazioni legali"><p className="am-footer__title">Informazioni legali</p><div className="am-footer__links"><a href="#">Privacy policy</a><a href="#">Cookie policy</a><a href="#">Accessibilità</a><a href="#">Dati societari <span className="ph">da confermare</span></a></div></nav>
        </div>
        <div className="am-footer__bottom"><span>© Angiomedica · <Ph text={s.footerLegal} /></span><span><Ph text={s.footerNote} /></span></div>
      </div>
    </footer>
  );
}
