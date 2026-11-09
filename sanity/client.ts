import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({ projectId, dataset, apiVersion, useCdn: true });
const configured = projectId !== "progetto-da-configurare";

// shortcut: contenuti aggiornati ogni 60s; passare a webhook + revalidateTag se serve la pubblicazione immediata
export async function sanityFetch<T>(query: string, params: QueryParams = {}): Promise<T> {
  if (!configured) return localFetch<T>(query, params);
  return client.fetch<T>(query, params, { next: { revalidate: 60 } });
}

// Anteprima senza progetto Sanity: esegue la stessa query GROQ sui contenuti del seed (scripts/seed-data.ts)
async function localFetch<T>(query: string, params: QueryParams): Promise<T> {
  const [{ parse, evaluate }, { documents }] = await Promise.all([import("groq-js"), import("../scripts/seed-data")]);
  const result = await evaluate(parse(query, { params }), { dataset: documents, params });
  return (await result.get()) as T;
}
