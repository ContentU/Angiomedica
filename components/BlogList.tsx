"use client";
import { useState } from "react";

/** Filtro per categoria dell'archivio blog: nella demo le pillole sono statiche, qui filtrano davvero */
export function BlogList({ categories, note, panels }: { categories: string[]; note: React.ReactNode; panels: Record<string, React.ReactNode> }) {
  const [cat, setCat] = useState("Tutti");
  return (
    <>
      <section className="p-[20px_0] [border-bottom:1px_solid_#DCE3EB]">
        <div className="wrap">
          <div className="am-chips [flex-wrap:nowrap] [overflow-x:auto] [scrollbar-width:none]" role="group" aria-label="Filtra per categoria">
            {["Tutti", ...categories].map((c) => <button key={c} className="am-chip" type="button" aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>)}
          </div>
          <p className="muted m-[10px_0_0] text-[13px]">{note}</p>
        </div>
      </section>
      {panels[cat]}
    </>
  );
}
