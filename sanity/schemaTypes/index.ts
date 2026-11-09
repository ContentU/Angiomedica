import { fact, faqItem, item, richText, section } from "./objects";
import { homePage, page, post, professional, service, siteSettings, specialty } from "./documents";

export const schemaTypes = [richText, item, section, faqItem, fact, siteSettings, homePage, page, specialty, service, professional, post];
export const singletons = ["siteSettings", "homePage"];
