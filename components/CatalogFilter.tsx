"use client";
import { useState } from "react";

export type Filter = { key: string; label: string; count: number };

/** Filtro del catalogo per specialità con conteggio (prestazioni.html:121-137) */
export function CatalogFilter({ filters, total, groups, showAllLabel }: {
  filters: Filter[]; total: number; showAllLabel: string;
  groups: { keys: string[]; node: React.ReactNode }[];
}) {
  const [f, setF] = useState("all");
  const cur = filters.find((x) => x.key === f);
  const count = f === "all" ? `${total} prestazioni` : cur!.count === 1 ? `1 prestazione di ${cur!.label}` : `${cur!.count} prestazioni di ${cur!.label}`;
  const chips = [{ key: "all", label: "Tutte", count: total }, ...filters];
  return (
    <>
      <div className="bar max-[960px]:!top-0 max-[960px]:!p-0 max-[960px]:!mb-0">
        <div className="wrap flex justify-between items-center gap-[24px] max-[960px]:flex-col max-[960px]:items-stretch max-[960px]:gap-0 max-[960px]:p-0">
          <div className="am-chips chips-m" role="group" aria-label="Filtra per specialità">
            {chips.map((c) => (
              <button key={c.key} className="am-chip" type="button" aria-pressed={f === c.key} onClick={() => setF(c.key)}>{c.label} <small>{c.count}</small></button>
            ))}
          </div>
          <p className="m-0 text-[15px] font-[500] text-[#55535A] whitespace-nowrap max-[960px]:m-[-4px_0_0] max-[960px]:p-[0_20px_10px] max-[960px]:text-[13px] max-[960px]:font-[400]" aria-live="polite">{count}</p>
        </div>
      </div>
      {groups.map((g, i) => <div key={i} hidden={f !== "all" && !g.keys.includes(f)} className="[display:contents]">{g.node}</div>)}
      {f !== "all" && (
        <div className="wrap pb-[48px]"><button className="am-btn am-btn--secondary" type="button" onClick={() => setF("all")}>{showAllLabel}</button></div>
      )}
    </>
  );
}
