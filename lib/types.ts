// Tipi minimi dei dati letti da Sanity (solo i campi usati dai componenti)
export type PT = unknown[] | undefined;
export type Color = "cardio" | "angio" | "altro";
export type SpecRef = { name: string; slug: string; layout?: "hub" | "consulenza"; color?: Color; homeText?: string };
export type Item = { _key: string; label?: string; title?: string; text?: PT; ctaLabel?: string; href?: string };
export type Section = {
  _key: string; key?: string; heading?: string; anchor?: string; tocLabel?: string; label?: string;
  body?: PT; items?: Item[]; ctaLabel?: string; ctaHref?: string; photoCaption?: string;
};
export type Fact = { _key: string; label?: string; value?: string };
export type Faq = { _key: string; question?: string; answer?: PT };
export type ServiceCard = { _id: string; title: string; shortTitle?: string; slug: string; order?: number; home?: boolean; inSsn?: boolean; specialty?: SpecRef };
export type ProCard = { _id: string; name: string; shortName?: string; slug: string; role?: string; cardText?: string; specialties?: SpecRef[] };
export type PostCard = { _id: string; title: string; slug: string; category?: string; color?: Color; dateLabel?: string; readingTime?: string; excerpt?: PT; authorLabel?: string; author?: { name: string; role?: string } };
export type Settings = {
  address?: string; hours?: string; hoursShort?: string; phone?: string; phoneHref?: string; email?: string; emailHref?: string;
  whatsapp?: string; whatsappHref?: string; mapsUrl?: string; footerHours?: string; footerLegal?: string; footerNote?: string;
};
export type PageDoc = { title: string; lead?: PT; photoCaption?: string; blocks?: Section[]; faq?: Faq[]; seoTitle?: string; seoDescription?: string };
