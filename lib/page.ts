import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/client";
import { pageQuery } from "@/sanity/queries";
import { plain } from "./content";
import type { PageDoc } from "./types";

export async function getPage(slug: string) {
  const p = await sanityFetch<PageDoc | null>(pageQuery, { slug });
  if (!p) notFound();
  return p;
}

export async function pageMetadata(slug: string): Promise<Metadata> {
  const p = await sanityFetch<PageDoc | null>(pageQuery, { slug });
  return p ? { title: p.seoTitle || `${plain(p.title)} | Angiomedica`, description: p.seoDescription } : {};
}
