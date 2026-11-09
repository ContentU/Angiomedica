"use client";
import { useState, type FormEvent } from "react";

export type FormStatus = "idle" | "sending" | "sent" | "error";

// Netlify Forms: il modulo è dichiarato in public/__forms.html, qui lo inviamo con fetch
export function useRequestForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    setStatus("sending");
    try {
      const data = new FormData(form);
      data.set("form-name", "richiesta-visita");
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }
  return { status, setStatus, onSubmit };
}
