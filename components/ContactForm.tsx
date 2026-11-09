"use client";
import { Icon } from "./Icon";
import { ERROR, SUCCESS } from "./HomeRequestForm";
import { useRequestForm } from "./useRequestForm";

/** Modulo nella pagina Contatti (contatti.html) */
export function ContactForm({ heading, intro, services, submitLabel, ssnNote }: { heading: React.ReactNode; intro: React.ReactNode; services: string[]; submitLabel: string; ssnNote: React.ReactNode }) {
  const { status, onSubmit } = useRequestForm();
  return (
    <form onSubmit={onSubmit} className="cform flex flex-col gap-[18px] p-[36px] rounded-[28px] shadow-[inset_0_0_0_1.5px_#DCE3EB] relative overflow-hidden" aria-label="Richiesta visita privata">
      <span className="am-trace am-trace--thin absolute left-[0] right-[0] top-[0]" aria-hidden><i className="rounded-[0]" /><i className="rounded-[0]" /></span>
      <input type="hidden" name="provenienza" value="contatti" />
      <p hidden><label>Non compilare <input name="bot-field" /></label></p>
      <h2 className="h3 font-[600] text-[26px]">{heading}</h2>
      <p className="muted m-[-8px_0_0] text-[15px]">{intro}</p>
      <div className="am-field"><label htmlFor="c-prest">Prestazione *</label><div className="am-select-wrap"><select className="am-select" id="c-prest" name="prestazione" required defaultValue=""><option value="">Seleziona una prestazione</option>{services.map((x) => <option key={x}>{x}</option>)}</select><Icon name="chevron" size={18} sw={2} stroke="#1A181B" /></div></div>
      <div className="am-field"><label htmlFor="c-nome">Nome e cognome *</label><input className="am-input" id="c-nome" name="nome" type="text" autoComplete="name" required /></div>
      <div className="g2 gap-[14px]"><div className="am-field"><label htmlFor="c-tel">Telefono *</label><input className="am-input" id="c-tel" name="telefono" type="tel" autoComplete="tel" required /></div><div className="am-field"><label htmlFor="c-mail">Email</label><input className="am-input" id="c-mail" name="email" type="email" autoComplete="email" /></div></div>
      <label className="am-check"><input type="checkbox" name="privacy" value="sì" required /> Ho letto l&apos;informativa privacy e acconsento al trattamento dei dati per essere ricontattato. *</label>{" "}
      <button className="am-btn am-btn--primary am-btn--block" type="submit" disabled={status === "sending"}>{submitLabel}</button>
      {(status === "sent" || status === "error") && <p role="status" className={`m-0 text-[15px] ${status === "error" ? "text-[#CF000A]" : ""}`}>{status === "sent" ? SUCCESS : ERROR}</p>}
      <div className="am-ssn bg-[#F2F6FA] p-[16px_18px]"><Icon name="info" size={24} sw={2} stroke="#55535A" className="flex-none mt-[2px]" /><p className="m-0 text-[14px] text-[#55535A]">{ssnNote}</p></div>
    </form>
  );
}
