"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { Icon } from "./Icon";
import { ERROR } from "./HomeRequestForm";
import { useRequestForm } from "./useRequestForm";

type Opt = { name: string; href: string };

/** Modulo della pagina Richiesta visita privata, con stato di conferma (richiesta-visita-privata.html) */
export function RequestPageForm({ services, doctors, initial, done }: {
  services: Opt[]; doctors: string[]; initial?: string;
  done: { heading: React.ReactNode; body: React.ReactNode };
}) {
  const { status, setStatus, onSubmit } = useRequestForm();
  const form = useRef<HTMLFormElement>(null);
  const [summary, setSummary] = useState({ prest: "", medico: "", data: "", contatto: "" });
  const fromService = !!initial;
  const back = services.find((x) => x.name === summary.prest)?.href;

  return (
    <div>
      <div hidden={status === "sent"}>
        <form ref={form} onSubmit={(e) => {
          const d = new FormData(e.currentTarget);
          setSummary({ prest: String(d.get("prestazione")), medico: String(d.get("medico")), data: new Date(`${d.get("data")}T00:00`).toLocaleDateString("it-IT"), contatto: String(d.get("contatto")) });
          return onSubmit(e);
        }} className="bg-[#FFFFFF] text-[#1A181B] rounded-[28px] p-[40px] flex flex-col gap-[20px] shadow-[0_24px_60px_rgba(4,22,40,.35)] max-[960px]:rounded-[22px] max-[960px]:p-[24px_20px] max-[960px]:gap-[16px]" aria-label="Richiesta visita privata">
          <input type="hidden" name="provenienza" value="richiesta-visita-privata" />
          <p hidden><label>Non compilare <input name="bot-field" /></label></p>
          <div className="am-field"><label htmlFor="r-prest">Prestazione richiesta *</label>
            <div className="am-select-wrap"><select className="am-select" id="r-prest" name="prestazione" required defaultValue={initial ?? ""}>
              {!fromService && <option value="">Seleziona una prestazione</option>}
              {services.map((x) => <option key={x.name}>{x.name}</option>)}<option>Altra prestazione</option>
            </select><Icon name="chevron" size={18} sw={2} stroke="#1A181B" /></div>
            {fromService && <span className="text-[13px] text-[#55535A]">Già selezionata dalla scheda che stavi leggendo.</span>}
          </div>
          <div className="am-field"><label htmlFor="r-medico">Medico <span className="font-[400] text-[#55535A]">(facoltativo)</span></label>
            <div className="am-select-wrap"><select className="am-select" id="r-medico" name="medico"><option>Nessuna preferenza</option>{doctors.map((x) => <option key={x}>{x}</option>)}</select><Icon name="chevron" size={18} sw={2} stroke="#1A181B" /></div>
          </div>
          <div className="am-field"><label htmlFor="r-data">Data preferita *</label><input className="am-input" id="r-data" name="data" type="date" required /></div>
          <div className="h-[1px] bg-[#DCE3EB] m-[4px_0]" />
          <div className="am-field"><label htmlFor="r-nome">Nome e cognome *</label><input className="am-input" id="r-nome" name="nome" type="text" autoComplete="name" required /></div>
          <div className="two grid grid-cols-[repeat(2,minmax(0,1fr))] gap-[16px]">
            <div className="am-field"><label htmlFor="r-tel">Telefono *</label><input className="am-input" id="r-tel" name="telefono" type="tel" autoComplete="tel" required /></div>
            <div className="am-field"><label htmlFor="r-mail">Email *</label><input className="am-input" id="r-mail" name="email" type="email" autoComplete="email" required /></div>
          </div>
          <fieldset className="border-0 m-0 p-0">
            <legend className="p-0 mb-[8px] text-[15px] font-[500]">Come preferisci essere ricontattato? <span className="font-[400] text-[#55535A]">(facoltativo)</span></legend>
            <div className="flex gap-[10px] flex-wrap">
              {["Telefono", "WhatsApp", "Email"].map((c, i) => (
                <label key={c} className="radio" htmlFor={`r-c${i + 1}`}><input id={`r-c${i + 1}`} type="radio" name="contatto" value={c} defaultChecked={i === 0} />{c}</label>
              ))}
            </div>
          </fieldset>
          <label className="am-check" htmlFor="r-priv"><input id="r-priv" name="privacy" value="sì" type="checkbox" required /><span>Ho letto l&apos;<a href="#">informativa privacy</a> e acconsento al trattamento dei dati per essere ricontattato. *</span></label>{" "}
          <button className={`am-btn am-btn--primary am-btn--block min-h-[56px] ${status === "sending" ? "is-loading" : ""}`} type="submit" disabled={status === "sending"}>
            {status === "sending" && <span className="am-spin" aria-hidden />}Invia la richiesta di visita privata
          </button>
          {status === "error" && <p role="alert" className="m-0 text-[15px] text-[#CF000A] text-center">{ERROR}</p>}
          <p className="m-0 text-[14px] text-[#55535A] text-center">Non indicare diagnosi o informazioni cliniche: ne parlerai con la segreteria.</p>
        </form>
      </div>
      {status === "sent" && (
        <div className="done bg-[#FFFFFF] text-[#1A181B] rounded-[28px] p-[48px_40px] shadow-[0_24px_60px_rgba(4,22,40,.35)] max-[960px]:rounded-[22px] max-[960px]:p-[32px_20px]" role="status">
          <span className="w-[64px] h-[64px] rounded-[50%] bg-[#E8F2FB] flex items-center justify-center"><Icon name="check" size={30} sw={2.4} stroke="#0070B8" /></span>
          <h2 className="m-[24px_0_0] font-[600] text-[32px] tracking-[-.02em]">{done.heading}</h2>
          <div className="done-body">{done.body}</div>
          <div className="mt-[28px] pt-[24px] [border-top:1px_solid_#DCE3EB]">
            <p className="m-[0_0_4px] font-[600]">Riepilogo</p>
            <p className="m-0 text-[#55535A] text-[16px] leading-[1.7]">{summary.prest} · {summary.medico === "Nessuna preferenza" ? "Nessuna preferenza di medico" : summary.medico}<br />Data preferita: {summary.data}<br />Ricontatto per {summary.contatto.toLowerCase()}</p>
          </div>
          <div className="flex gap-[20px] items-center flex-wrap mt-[28px]">
            {back && <Link className="am-btn am-btn--secondary" href={back}>Torna alla scheda</Link>}{" "}
            <button className="am-btn am-btn--tertiary" type="button" onClick={() => { form.current?.reset(); setStatus("idle"); }}>Invia un&apos;altra richiesta</button>
          </div>
        </div>
      )}
    </div>
  );
}
