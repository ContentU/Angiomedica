import "../globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { sanityFetch } from "@/sanity/client";
import { specialtiesQuery } from "@/sanity/queries";
import { getSettings } from "@/lib/settings";
import type { SpecRef } from "@/lib/types";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, specialties] = await Promise.all([
    getSettings(),
    sanityFetch<SpecRef[]>(specialtiesQuery),
  ]);
  return (
    <div className="am">
      <Header phone={settings.phone} />
      {children}
      <Footer s={settings} specialties={specialties ?? []} />
    </div>
  );
}
