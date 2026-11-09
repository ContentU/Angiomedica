import type { StructureResolver } from "sanity/structure";

const single = (S: Parameters<StructureResolver>[0], id: string, title: string) =>
  S.listItem().title(title).id(id).child(S.document().schemaType(id).documentId(id));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenuti")
    .items([
      single(S, "homePage", "Homepage"),
      S.documentTypeListItem("page").title("Pagine"),
      S.divider(),
      S.documentTypeListItem("specialty").title("Specialità"),
      S.documentTypeListItem("service").title("Prestazioni"),
      S.documentTypeListItem("professional").title("Professionisti"),
      S.documentTypeListItem("post").title("Blog"),
      S.divider(),
      single(S, "siteSettings", "Impostazioni del sito"),
    ]);
