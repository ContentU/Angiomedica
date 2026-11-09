/**
 * Carica i contenuti iniziali in Sanity (rieseguibile: gli _id sono fissi, i documenti vengono sostituiti).
 * Uso: npx sanity exec scripts/seed.ts --with-user-token
 */
import { getCliClient } from "sanity/cli";
import { documents } from "./seed-data";

const client = getCliClient({ apiVersion: "2025-10-01" });

async function run() {
  const tx = client.transaction();
  for (const doc of documents) tx.createOrReplace(doc);
  const res = await tx.commit();
  console.log(`Caricati ${documents.length} documenti (transazione ${res.transactionId}).`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
