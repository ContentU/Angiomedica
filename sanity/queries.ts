import { defineQuery } from "next-sanity";

const specRef = `specialty->{name, "slug": slug.current, layout, color}`;
const serviceCard = `_id, title, shortTitle, "slug": slug.current, order, home, inSsn, "specialty": ${specRef}`;
const proCard = `_id, name, shortName, "slug": slug.current, role, cardText, photo, "specialties": specialties[]->{name, "slug": slug.current, color}`;
const postCard = `_id, title, "slug": slug.current, category, color, dateLabel, readingTime, excerpt, image, authorLabel, "author": author->{name, role}`;

export const settingsQuery = defineQuery(`*[_id == "siteSettings"][0]`);

export const homeQuery = defineQuery(`{
  "home": *[_id == "homePage"][0]{..., "featuredServices": featuredServices[]->{${serviceCard}}, "pickerServices": pickerServices[]->{${serviceCard}}},
  "specialties": *[_type == "specialty"] | order(order asc){name, "slug": slug.current, layout, color, homeText},
  "services": *[_type == "service"] | order(order asc){${serviceCard}},
  "pros": *[_type == "professional"] | order(order asc)[0...3]{${proCard}},
  "posts": *[_type == "post"] | order(date desc)[0...3]{${postCard}}
}`);

export const pageQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]`);

export const servicesQuery = defineQuery(`*[_type == "service"] | order(order asc){${serviceCard}}`);
export const specialtiesQuery = defineQuery(`*[_type == "specialty"] | order(order asc){name, "slug": slug.current, layout, color}`);
export const prosQuery = defineQuery(`*[_type == "professional"] | order(order asc){${proCard}}`);
export const postsQuery = defineQuery(`*[_type == "post"] | order(date desc){${postCard}}`);

export const serviceQuery = defineQuery(`*[_type == "service" && slug.current == $slug][0]{
  ..., "slug": slug.current, "specialty": ${specRef},
  "professionals": professionals[]->{${proCard}},
  "others": *[_type == "service" && slug.current != $slug && specialty._ref == ^.specialty._ref] | order(order asc){${serviceCard}}
}`);

export const specialtyQuery = defineQuery(`*[_type == "specialty" && slug.current == $slug][0]{
  ..., "slug": slug.current,
  "services": *[_type == "service" && specialty._ref == ^._id] | order(order asc){${serviceCard}, facts},
  "pros": *[_type == "professional" && ^._id in specialties[]._ref] | order(order asc){${proCard}},
  "posts": *[_type == "post" && ^._id in specialties[]._ref] | order(date desc)[0...2]{${postCard}},
  "related": related[]->{name, "slug": slug.current, color}
}`);

export const professionalQuery = defineQuery(`*[_type == "professional" && slug.current == $slug][0]{
  ..., "slug": slug.current,
  "specialties": specialties[]->{name, "slug": slug.current, color},
  "services": services[]->{${serviceCard}},
  "posts": *[_type == "post" && author._ref == ^._id] | order(date desc)[0...3]{${postCard}},
  "others": *[_type == "professional" && slug.current != $slug] | order(order asc)[0...4]{${proCard}}
}`);

export const postQuery = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  ..., "slug": slug.current, "author": author->{name, role, "slug": slug.current},
  "relatedServices": relatedServices[]->{${serviceCard}},
  "others": *[_type == "post" && slug.current != $slug] | order(date desc)[0...3]{${postCard}}
}`);

export const slugsQuery = defineQuery(`*[_type == $type && defined(slug.current)].slug.current`);
