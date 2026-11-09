"use client";
import { useState } from "react";
import { Icon } from "./Icon";
import { useRequestForm } from "./useRequestForm";

export type PickerOption = { name: string; group: string; color: "cardio" | "angio" | "altro" };

const GROUP_COLOR = { cardio: "#0070B8", angio: "#A8000A", altro: "#55535A" };
export const SUCCESS = "Grazie, abbiamo ricevuto la tua richiesta. La segreteria ti ricontatterà per verificare la disponibilità. L'appuntamento non è ancora confermato.";
export const ERROR = "Non è stato possibile inviare la richiesta. Riprova oppure contatta la segreteria telefonicamente.";

/** Modulo della homepage: replica il selettore della demo (index.html:500-515) e invia a Netlify Forms */
export function HomeRequestForm({ options, others, submitLabel = "Invia la richiesta" }: { options: PickerOption[]; others: string[]; submitLabel?: string }) {
  const all = [...options, { name: "Altra prestazione", group: "Elenco completo", color: "altro" as const, other: true }];
  const [sel, setSel] = useState(0);
  const [other, setOther] = useState("");
  const { status, onSubmit } = useRequestForm();
  const isOther = sel === all.length - 1;
  const prestazione = isOther ? other : all[sel].name;
  const label = isOther ? "visita privata" : all[sel].name.toLowerCase();

  return (
    <form onSubmit={onSubmit} aria-label="Richiesta visita privata" className="relative bg-[#FFFFFF] text-[#1A181B] rounded-[28px] p-[40px] flex flex-col gap-[20px] shadow-[0_24px_60px_rgba(4,22,40,.35)] max-[960px]:rounded-[22px] max-[960px]:p-[24px_20px] max-[960px]:gap-[16px]">
      <input type="hidden" name="provenienza" value="homepage" />
      <input type="hidden" name="prestazione" value={prestazione} />
      <p hidden><label>Non compilare <input name="bot-field" /></label></p>
      <fieldset className="border-0 m-0 p-0">
        <legend className="p-0 font-[600] text-[20px] max-[960px]:text-[18px]">1. Che visita ti serve?</legend>
        <div role="radiogroup" aria-label="Visita da richiedere" className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-[10px] mt-[16px] max-[960px]:grid-cols-[minmax(0,1fr)]">
          {all.map((o, i) => {
            const on = i === sel;
            return (
              <button key={o.name} type="button" role="radio" aria-checked={on} className={`opt ${on ? "opt-on" : "opt-off"}`} onClick={() => setSel(i)}>
                <span className="dot" style={on ? { background: "#0187DC" } : { boxShadow: "inset 0 0 0 2px #B3C2D1", background: "#FFFFFF" }}>
                  <span className="chk" hidden={!on}><Icon name="check" size={12} sw={3.5} stroke="#FFFFFF" /></span>
                </span>
                <span>
                  <span className="block text-[12px] font-[600]" style={{ color: GROUP_COLOR[o.color] }}>{o.group}</span>
                  <span className="block text-[15px] font-[500] leading-[1.3]">{o.name}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div hidden={!isOther}>
          <div className="field mt-[14px]">
            <label htmlFor="f-prest">Scegli dall&apos;elenco completo *</label>
            <div className="relative">
              <select id="f-prest" className="w-full text-[#55535A]" value={other} required={isOther} onChange={(e) => setOther(e.target.value)}>
                <option value="">Seleziona una prestazione privata</option>
                {others.map((o) => <option key={o}>{o}</option>)}
              </select>
              <Icon name="chevron" size={18} sw={2} stroke="#1A181B" className="absolute right-[16px] top-[18px] pointer-events-none" />
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset className="border-0 m-[8px_0_0] p-[20px_0_0] [border-top:1px_solid_#DCE3EB] flex flex-col gap-[16px]">
        <legend className="p-0 font-[600] text-[20px] float-left w-full max-[960px]:text-[18px]">2. I tuoi recapiti</legend>
        <div className="field"><label htmlFor="f-nome">Nome e cognome *</label><input id="f-nome" name="nome" type="text" autoComplete="name" required /></div>
        <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] gap-[14px] max-[960px]:grid-cols-[minmax(0,1fr)]">
          <div className="field"><label htmlFor="f-tel">Telefono *</label><input id="f-tel" name="telefono" type="tel" autoComplete="tel" required /></div>
          <div className="field"><label htmlFor="f-mail">Email *</label><input id="f-mail" name="email" type="email" autoComplete="email" required /></div>
        </div>
      </fieldset>
      <div className="flex gap-[12px] items-start">
        <input id="f-privacy" name="privacy" value="sì" type="checkbox" required className="w-[22px] h-[22px] m-[2px_0_0] [accent-color:#0187DC] flex-none" />
        <label htmlFor="f-privacy" className="text-[14px] leading-[1.5] text-[#55535A] max-[960px]:text-[13px]">Ho letto l&apos;<a href="#">informativa privacy</a> e acconsento al trattamento dei dati per essere ricontattato. *</label>
      </div>
      <button className="btn btn-primary w-full" type="submit" disabled={status === "sending"}><span>{submitLabel}: {label}</span></button>
      {status === "sent" || status === "error" ? (
        <p role="status" className={`m-0 text-[15px] text-center ${status === "error" ? "text-[#CF000A]" : "text-[#1A181B]"}`}>{status === "sent" ? SUCCESS : ERROR}</p>
      ) : (
        <p className="m-0 text-[14px] text-[#55535A] text-center max-[960px]:text-[13px]">L&apos;appuntamento sarà confermato dalla segreteria.</p>
      )}
    </form>
  );
}
