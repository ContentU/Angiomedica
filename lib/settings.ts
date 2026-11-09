import { cache } from "react";
import { sanityFetch } from "@/sanity/client";
import { settingsQuery } from "@/sanity/queries";
import type { Settings } from "./types";

export const getSettings = cache(async () => (await sanityFetch<Settings | null>(settingsQuery)) ?? {});
