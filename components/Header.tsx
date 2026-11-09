"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { Ph } from "@/lib/content";

const NAV = [
  { href: "/il-centro/", label: "Il Centro" },
  { href: "/#specialita", label: "Specialità" },
  { href: "/prestazioni/", label: "Prestazioni" },
  { href: "/professionisti/", label: "Professionisti" },
  { href: "/per-il-paziente/", label: "Per il paziente" },
  { href: "/contatti/", label: "Contatti" },
];

export function Header({ phone }: { phone?: string }) {
  const path = usePathname();
  const isHome = path === "/";
  // pagina Richiesta: header non fisso e niente pulsante (richiesta-visita-privata.html)
  const isRequest = path === "/richiesta-visita-privata/";
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const cta = isHome ? "#richiesta" : "/richiesta-visita-privata/";
  const current = (href: string) => (href !== "/#specialita" && path.startsWith(href)) || (href === "/#specialita" && path.startsWith("/specialita"));

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("nav a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); btn.current?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.documentElement.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <header className={`am-header p-0 h-auto max-[960px]:static max-[960px]:bg-[#FFFFFF] ${isRequest ? "" : "sticky top-[0] z-[20]"}`}>
      <div className="am-wrap w-full flex items-center justify-between gap-[32px] h-[88px] max-[960px]:h-[68px] max-[960px]:p-[0_12px_0_20px]">
        <Link className="flex" href="/" aria-label="Angiomedica, homepage">
          <img className="h-[46px] w-auto block max-[960px]:h-[34px]" src="/img/logo-angiomedica.png" alt="Angiomedica" />
        </Link>
        <nav className="am-nav max-[960px]:hidden" aria-label="Menu principale">
          {NAV.map((n) => (
            <Link key={n.href} href={isHome && n.href === "/#specialita" ? "#specialita" : n.href} aria-current={current(n.href) ? "page" : undefined}>{n.label}</Link>
          ))}
        </nav>
        {isRequest
          ? <span className="text-[15px] font-[600] whitespace-nowrap max-[960px]:hidden">Segreteria <Ph text={phone} /></span>
          : <a className="am-btn am-btn--primary min-h-[48px] p-[0_22px] text-[16px] max-[960px]:hidden" href={cta}>Prenota una visita privata</a>}
        <button ref={btn} type="button" className="mm-btn min-[961px]:hidden" aria-label="Apri il menu" aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen(true)}>
          <Icon name="menu" size={26} sw={2} stroke="#1A181B" />
        </button>
      </div>
      <div ref={panel} id="menu-mobile" className="mm-panel min-[961px]:hidden" hidden={!open} role="dialog" aria-modal="true" aria-label="Menu">
        <div className="mm-top">
          <img className="h-[34px] w-auto block" src="/img/logo-angiomedica.png" alt="" />
          <button type="button" className="mm-btn" aria-label="Chiudi il menu" onClick={() => { setOpen(false); btn.current?.focus(); }}>
            <Icon name="close" size={26} sw={2} stroke="#1A181B" />
          </button>
        </div>
        <nav aria-label="Menu principale">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={current(n.href) ? "page" : undefined} onClick={() => setOpen(false)}>
              {n.label}
              <Icon name="arrow" size={20} />
            </Link>
          ))}
        </nav>
        <a className="am-btn am-btn--primary am-btn--block min-h-[56px]" href={cta} onClick={() => setOpen(false)}>Prenota una visita privata</a>
      </div>
    </header>
  );
}
